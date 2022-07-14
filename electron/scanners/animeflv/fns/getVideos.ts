export const getVideos = `
const videos = window?.videos?.SUB
if(Array.isArray(videos)) {
    return videos.map(video => {
        const html = '<iframe frameborder="0" src="' + video.code + '" scrolling="no" allowfullscreen></iframe>'.replace('s1.animeflv.net', 's3.animeflv.com');
        return {
            html,
            name: video.title,
        }
    })
}
return []
`
