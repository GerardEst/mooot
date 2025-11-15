type Rarity = 0 | 1 | 2 | 3;
type Row = [Rarity, Rarity, Rarity, Rarity, Rarity];
type CollectiblesMatrix = [Row, Row, Row, Row, Row, Row];

// PRNG matemàtic (LCG)
function lcg(seed: number) {
    let x = seed >>> 0;
    return function () {
        x = (x * 1664525 + 1013904223) % 2 ** 32;
        return x;
    };
}

// Converteix una data en un seed numèric (hash polinòmic simple)
function numericSeed(date: string): number {
    let h = 0;
    const B = 131;
    for (let i = 0; i < date.length; i++) {
        h = (h * B + date.charCodeAt(i)) >>> 0;
    }
    return h;
}

// Genera la matriu 6x5 amb 3 valors "aleatoris"
export function matrixFromDate(date: string): CollectiblesMatrix {

    const seed = numericSeed(date);
    const rand = lcg(seed);

    // Matriu de 30 zeros
    const arr = new Array(30).fill(0);

    // Triem 3 posicions ÚNIQUES
    const positions = new Set<number>();
    while (positions.size < 3) {
        positions.add(rand() % 30);
    }

    // Assignem 1, 2 o 3
    for (const pos of positions) {
        arr[pos] = (rand() % 3) + 1;
    }

    // Convertim a 6x5
    const matrix = [];
    for (let i = 0; i < 6; i++) {
        matrix.push(arr.slice(i * 5, i * 5 + 5));
    }

    return matrix as CollectiblesMatrix;
}