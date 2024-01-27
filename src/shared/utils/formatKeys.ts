export const formatKeys = (keys: any[]): string => {
  return keys
    .map((x) => String(x).replace(/\./g, ''))
    .join('.')
    .toLowerCase()
}
