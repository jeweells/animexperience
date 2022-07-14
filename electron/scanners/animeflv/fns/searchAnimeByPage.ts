import { searchAnime } from './searchAnime'

export const searchAnimeByPage = `
const matches = (() => {
${searchAnime}
})()

const pages = [...document.querySelectorAll('ul.pagination > li > a')]
const _maxPage = +(pages.slice(-2)[0]?.innerText)
const maxPage = isNaN(_maxPage) ? undefined : _maxPage
const hasNext =maxPage !== undefined && !document.querySelector('ul.pagination > li.active + li.disabled')
const _nextPage = +(document.querySelector('ul.pagination > li.active + li')?.innerText)
const nextPage = isNaN(_nextPage) ? undefined : _nextPage

return {
    matches,
    nextPage,
    hasNext,
    maxPage,
}
`
