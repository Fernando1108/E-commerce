import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(200),
  description: z.string().nullable().optional(),
  price: z.number().positive('Precio debe ser positivo'),
  original_price: z.number().positive().nullable().optional(),
  badge: z.string().max(50).nullable().optional(),
  category_id: z.string().uuid('Categoría inválida').nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  slug: z.string().nullable().optional(),
  stock: z.number().int().min(0).optional().default(0),
  featured: z.boolean().optional().default(false),
  specs: z.record(z.string(), z.string()).optional().default({}),
  highlights: z.array(z.string()).optional().default([]),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  accent_color: z.string().max(20).optional().default('#6C63FF'),
  display_size: z.string().max(20).optional().default('normal'),
})

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
})

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
})

export const newsletterSchema = z.object({
  email: z.string().email(),
})
