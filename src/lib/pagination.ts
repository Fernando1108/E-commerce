import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
})

export function getPagination(searchParams: URLSearchParams) {
  const parsed = paginationSchema.safeParse({
    page: searchParams.get('page') || 1,
    limit: searchParams.get('limit') || 20,
    search: searchParams.get('search') || undefined,
  })

  const { page, limit, search } = parsed.success ? parsed.data : { page: 1, limit: 20, search: undefined }
  const offset = (page - 1) * limit

  return { page, limit, offset, search }
}

export function paginatedResponse(data: any[], total: number, page: number, limit: number) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}
