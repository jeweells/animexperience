export const listRecentAnimes = `
const liEpisodes = document.querySelectorAll('ul.ListEpisodios > li')

const episodes = [];
for(const liEpisode of liEpisodes) {
    episodes.push({
        link: liEpisode.querySelector('a').href,
        img: liEpisode.querySelector('img').src,
        name: liEpisode.querySelector('.Title').innerText,
        episode: +liEpisode.querySelector('.Capi').innerText.replace('Episodio ', ''),
    })
}
return episodes;
`
