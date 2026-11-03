import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const businessSearchSchema = z.object({
  q: z.string().optional(),
  emirate: z.string().optional(),
  category: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().positive().max(100).default(10),
  locale: z.enum(['en', 'ar']).default('en'),
  ...paginationSchema.shape,
});

export const createBusinessSchema = z.object({
  nameEn: z.string().min(2).max(200),
  nameAr: z.string().min(2).max(200).optional(),
  descriptionEn: z.string().max(5000).optional(),
  descriptionAr: z.string().max(5000).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  emirate: z.string().optional(),
  city: z.string().optional(),
  categoryId: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  titleEn: z.string().max(200).optional(),
  bodyEn: z.string().max(2000).optional(),
  bodyAr: z.string().max(2000).optional(),
});

export type BusinessSearchInput = z.infer<typeof businessSearchSchema>;
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
