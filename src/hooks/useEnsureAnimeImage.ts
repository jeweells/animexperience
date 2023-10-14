import React from 'react'
import brokenImageUrl from '../images/broken-image-url.png'

export const useEnsureAnimeImage = (src: string | undefined) => {
    const [imgError, setImgError] = React.useState<boolean>(false)
    const altImgSrc = React.useMemo(() => {
        if (!src) return null
        // Images are stored in both /thumbs/ and /covers/, but in some cases they might be only in one of them
        if (src.includes('/thumbs/')) return src.replace('/thumbs/', '/covers/')
        if (src.includes('/covers/')) return src.replace('/covers/', '/thumbs/')
        return src
    }, [src])

    React.useLayoutEffect(() => {
        setImgError(false)
    }, [src])

    const onError: React.ComponentProps<'img'>['onError'] = (e) => {
        e.currentTarget.src =
            (e.currentTarget.src === src ? altImgSrc : brokenImageUrl) ?? brokenImageUrl
        setImgError(true)
    }

    return {
        src: (imgError ? altImgSrc : src) ?? brokenImageUrl,
        onError,
    }
}
