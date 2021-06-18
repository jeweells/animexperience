import cheerio from 'cheerio'
import fetch from 'node-fetch'

export const getRecentAnimes = async () => {
    console.debug('Getting recent animes...')
    const animeIdHome = await fetch(new URL('https://www.animeid.tv')).then((x) =>
        x.text(),
    )
    console.debug('Getting episode html...')
    const $ = cheerio.load(animeIdHome)
    console.debug('Parsing html...')
    const episodeRegex = /[0-9]+$/m
    return $('section.main > section.lastcap > div.dia')
        .map((_, b) => {
            const node = $(b)
            const dateStr = node.before().find('span.right').text()
            return node
                .find('article')
                .map((_, article) => {
                    const node = $(article)
                    const img = node.find('img')
                    const title = node.find('header').text()
                    const episode = episodeRegex.exec(title)?.[0] ?? null
                    const relLink = node.find('a').attr('href')
                    return {
                        date: dateStr,
                        name: img.attr('alt'),
                        episode: episode !== null ? parseInt(episode) : null,
                        link:
                            relLink ?? false ? 'https://www.animeid.tv' + relLink : null,
                        img: img.attr('src'),
                    }
                })
                .toArray()
        })
        .toArray()
}
