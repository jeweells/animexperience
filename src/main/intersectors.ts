import * as cheerio from 'cheerio'

export const SCRIPT_LOADER_LOCATION = '/fakethisshit.js'

export const injectScriptLoader = (body: string) => {
  const $ = cheerio.load(body)
  const script = `
  <script type="text/javascript" src="${SCRIPT_LOADER_LOCATION}"></script>
  `
  $('head').prepend(script)
  return $.html()
}

export const loadScriptAsString = () => {
  // language=js
  return `
    Element.prototype.requestFullscreen = () => {
      console.log("Intersected !!")
      return Promise.resolve();
    }
  `
}
