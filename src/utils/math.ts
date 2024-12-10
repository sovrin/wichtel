export const xorShift = (seed: number) => {
    let x: number = seed;

    return function () {
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;

        return Math.abs(x) / 0x7FFFFFFF;
    };
};
