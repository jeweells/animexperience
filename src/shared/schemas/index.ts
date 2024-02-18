import { z } from 'zod'

export const watchedAnime = z.object({
  duration: z.number(),
  currentTime: z.number(),
  at: z.number()
})
