import { z } from 'zod'

export const watchedAnimeSchema = z.object({
  duration: z.number(),
  currentTime: z.number(),
  at: z.number()
})

export const playerOptionSchema = z.array(z.string())

export const followedAnimeSchema = z.object({
  name: z.string(),
  image: z.string(),
  link: z.string(),
  nextEpisodeToWatch: z.number(),
  lastEpisodeWatched: z.number(),
  lastCheckAt: z.number(),
  nextCheckAt: z.number(),
  lastSuccessAt: z.number()
})
