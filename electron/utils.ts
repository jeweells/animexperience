export const cleanName = (s: string) => {
    return s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\s0-9a-zA-Z]/g, '')
        .toLowerCase()
}
