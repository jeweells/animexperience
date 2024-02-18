import { z } from 'zod'

export const watchedAnimeSchema = z.object({
  duration: z.number(),
  currentTime: z.number(),
  at: z.number()
})

export const playerOptionsSchema = z.array(z.string())
