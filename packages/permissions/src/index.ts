export type Permission =
  | 'business:read'
  | 'business:write'
  | 'business:delete'
  | 'business:verify'
  | 'listing:read'
  | 'listing:write'
  | 'listing:delete'
  | 'review:read'
  | 'review:write'
  | 'review:moderate'
  | 'user:read'
  | 'user:write'
  | 'user:delete'
  | 'user:suspend'
  | 'analytics:read'
  | 'finance:read'
  | 'advertising:write'
  | 'content:write'
  | 'seo:write';

export type UserRole =
  | 'CUSTOMER'
  | 'BUSINESS_OWNER'
  | 'BUSINESS_ADMIN'
  | 'BRANCH_MANAGER'
  | 'BUSINESS_STAFF'
  | 'SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'BUSINESS_MODERATOR'
  | 'VERIFICATION_OFFICER'
  | 'CONTENT_MANAGER'
  | 'SEO_MANAGER'
  | 'FINANCE_ADMIN'
  | 'SUPPORT_AGENT'
  | 'ADVERTISING_MANAGER'
  | 'ANALYST';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: ['business:read', 'listing:read', 'review:read', 'review:write'],
  BUSINESS_OWNER: ['business:read', 'business:write', 'listing:read', 'listing:write', 'review:read', 'review:write'],
  BUSINESS_ADMIN: ['business:read', 'business:write', 'listing:read', 'listing:write', 'listing:delete', 'review:read'],
  BRANCH_MANAGER: ['business:read', 'listing:read', 'listing:write'],
  BUSINESS_STAFF: ['business:read', 'listing:read'],
  SUPER_ADMIN: ['business:read', 'business:write', 'business:delete', 'business:verify', 'listing:read', 'listing:write', 'listing:delete', 'review:read', 'review:write', 'review:moderate', 'user:read', 'user:write', 'user:delete', 'user:suspend', 'analytics:read', 'finance:read', 'advertising:write', 'content:write', 'seo:write'],
  PLATFORM_ADMIN: ['business:read', 'business:write', 'business:verify', 'listing:read', 'listing:write', 'review:read', 'review:moderate', 'user:read', 'user:write', 'user:suspend', 'analytics:read'],
  BUSINESS_MODERATOR: ['business:read', 'business:write', 'listing:read', 'listing:write', 'review:read', 'review:moderate'],
  VERIFICATION_OFFICER: ['business:read', 'business:verify'],
  CONTENT_MANAGER: ['business:read', 'listing:read', 'content:write'],
  SEO_MANAGER: ['business:read', 'seo:write'],
  FINANCE_ADMIN: ['finance:read'],
  SUPPORT_AGENT: ['business:read', 'user:read', 'review:read'],
  ADVERTISING_MANAGER: ['advertising:write', 'analytics:read'],
  ANALYST: ['analytics:read', 'business:read'],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
