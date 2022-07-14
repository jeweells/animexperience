export const getInfo = ` 
const otherTitles = [...document.querySelectorAll('.Container span.TxtAlt')].map((txtAlt) => {
    return txtAlt.innerText;
})

const tags = [...document.querySelectorAll('nav.Nvgnrs > a')].map((tag) => {
    return tag.innerText;
})

const type = document.querySelector('span.Type').innerText
const status = document.querySelector('.AnmStts > .fa-tv').innerText
return {
    episodesRange: {
        min: window.episodes.slice(-1)[0][0],
        max: window.episodes[0][0]
    },
    title: document.querySelector('.Container > h1.Title').innerText,
    otherTitles,
    description: document.querySelector('.Description > p').innerText,
    image: document.querySelector('.Image > figure > img').src,
    tags,
    type: {
        ANIME: 'Serie',
        OVA: 'Ova',
    }[type.toUpperCase()] ?? type,
    status: {
        FINALIZADO: 'Finalizada',
        "EN EMISION": 'En emisión',
    }[status.toUpperCase()] ?? status,
    emitted: {},
    related: [],
}
`
