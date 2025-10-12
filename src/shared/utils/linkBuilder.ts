export type Site = 'animeflv'

export class AnimeLinkToEpisode {
  episodeLink: string
  episodeReplace: string

  constructor(
    public readonly link: string,
    public readonly site: Site
  ) {
    switch (site) {
      case 'animeflv':
      default:
        {
          const episodeReplace = '<episode>'
          const episodeLink = `${link.replace(
            'animeflv.net/anime/',
            'animeflv.net/ver/'
          )}-${episodeReplace}`
          this.episodeLink = episodeLink
          this.episodeReplace = episodeReplace
        }
        break
    }
  }

  withEpisode(episode: number) {
    return this.episodeLink.replace(this.episodeReplace, String(episode))
  }

  raw() {
    return {
      episodeLink: this.episodeLink,
      episodeReplace: this.episodeReplace
    }
  }
}
