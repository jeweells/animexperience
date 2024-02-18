import { z } from 'zod'

export const onlyValidItems = <T>(
  items: unknown[] | undefined | null,
  schema: z.Schema<T>
): T[] => {
  if (!Array.isArray(items)) return []
  return items.reduce<T[]>((acc, curr) => {
    const parsed = schema.safeParse(curr)
    if (parsed.success) acc.push(parsed.data)
    return acc
  }, [])
}
