export const range = (length: number): number[] => {
    return Array(length).fill(0).map((_, x) => x);
};
