#!/bin/bash
# UEVIO — One-time VPS setup for srv988590
# Run as root: bash /tmp/setup-uevio.sh
set -e

echo "=== UEVIO VPS Setup ==="

# 1. Create directories
echo "[1/8] Creating directories..."
mkdir -p /opt/uevio/backups

# 2. Clone repo
echo "[2/8] Cloning repo..."
cd /opt/uevio
git init
git remote add origin https://github.com/ddotsmedia/uevio 2>/dev/null || git remote set-url origin https://github.com/ddotsmedia/uevio
git fetch origin main
git checkout -f origin/main

# 3. Nginx config
echo "[3/8] Installing Nginx config..."
cp /opt/uevio/infrastructure/nginx/uevio.conf /etc/nginx/sites-available/uevio
ln -sf /etc/nginx/sites-available/uevio /etc/nginx/sites-enabled/uevio

# 4. Test Nginx config
echo "[4/8] Testing Nginx config..."
nginx -t

# 5. Reload Nginx
echo "[5/8] Reloading Nginx..."
systemctl reload nginx

# 6. SSL certs
echo "[6/8] Issuing SSL certificates..."
certbot --nginx -d uevio.com -d www.uevio.com --non-interactive --agree-tos -m admin@uevio.com
certbot --nginx -d api.uevio.com --non-interactive --agree-tos -m admin@uevio.com
certbot --nginx -d business.uevio.com --non-interactive --agree-tos -m admin@uevio.com
certbot --nginx -d admin.uevio.com --non-interactive --agree-tos -m admin@uevio.com

# 7. Final reload
echo "[7/8] Final Nginx reload..."
nginx -t && systemctl reload nginx

# 8. Verify
echo "[8/8] Verifying..."
curl -sI https://uevio.com | head -3

echo ""
echo "=== Setup complete ==="
echo "Next: Add GitHub Secrets and push to main branch to deploy"
