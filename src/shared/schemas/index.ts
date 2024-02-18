import { z } from 'zod'

export const watchedAnimeSchema = z.object({
  duration: z.number(),
  currentTime: z.number(),
  at: z.number()
})

export const recentAnimeSchema = z.object({
  name: z.string(),
  lastEpisode: z.number(),
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

export const recentAnimeDataSchema = z
  .object({
    name: z.string(),
    episode: z.number(),
    img: z.string(),
    link: z.string(),
    date: z.string()
  })
  .partial()

export const watchedHistoryItemSchema = z.object({
  at: z.number(),
  info: recentAnimeDataSchema
})
