import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed categories
  const categories = [
    { slug: 'restaurants', nameEn: 'Restaurants & Cafes', nameAr: 'مطاعم وكافيهات' },
    { slug: 'retail', nameEn: 'Retail & Shopping', nameAr: 'البيع بالتجزئة والتسوق' },
    { slug: 'healthcare', nameEn: 'Healthcare', nameAr: 'الرعاية الصحية' },
    { slug: 'education', nameEn: 'Education', nameAr: 'التعليم' },
    { slug: 'real-estate', nameEn: 'Real Estate', nameAr: 'العقارات' },
    { slug: 'automotive', nameEn: 'Automotive', nameAr: 'السيارات' },
    { slug: 'beauty', nameEn: 'Beauty & Wellness', nameAr: 'الجمال والعافية' },
    { slug: 'technology', nameEn: 'Technology', nameAr: 'التكنولوجيا' },
    { slug: 'finance', nameEn: 'Finance & Banking', nameAr: 'المالية والمصرفية' },
    { slug: 'hospitality', nameEn: 'Hotels & Hospitality', nameAr: 'الفنادق والضيافة' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
