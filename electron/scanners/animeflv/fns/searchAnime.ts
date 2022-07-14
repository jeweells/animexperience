export const searchAnime = `
    return [...document.querySelectorAll('ul.ListAnimes > li > article > a')].map((anime) => {
        return {
            name: anime.querySelector('.Title').innerText,
            link: anime.href,
            image: anime.querySelector('img').src,
        }
    })
`
