export type Site = 'animeid'

export class AnimeLinkToEpisode {
    episodeLink: string
    episodeReplace: string
    constructor(public readonly link: string, public readonly site: Site) {
        switch (site) {
            case 'animeid':
            default: {
                const episodeReplace = '<episode>'
                const episodeLink = `${link.replace(
                    'animeid.tv/',
                    'animeid.tv/v/',
                )}-${episodeReplace}`
                this.episodeLink = episodeLink
                this.episodeReplace = episodeReplace
            }
        }
    }

    withEpisode(episode: number) {
        return this.episodeLink.replace(this.episodeReplace, String(episode))
    }

    raw() {
        return {
            episodeLink: this.episodeLink,
            episodeReplace: this.episodeReplace,
        }
    }
}
