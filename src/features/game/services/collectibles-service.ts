import { saveUserCollectible } from "@src/core/api/collectibles";

type Cell = 0 | 1 | 2 | 3;
type Row = [Cell, Cell, Cell, Cell, Cell];
type CollectiblesMatrix = [Row, Row, Row, Row, Row, Row];

export let collectiblesMatrix: CollectiblesMatrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]


// TODO - Activar animació o avís de coleccionable, si s'escau
// OK TODO - Guardar a la db. Pensar estructura
// TODO - Afegir al menú? - cambiar apartat lligues? O potser posar directament a la principal, amb un 7/20 veure més
// OK edge cases: quan tanques i tornes a entrar, no ha de tornar a donarte els aconseguits
// OK edge cases: la paraula final ha de donar tambe coleccionables
// TODO - Animació suau, magica, quan hi ha una lletra sobre casella amb coleccionable i estem acabant demplenar paraula
// TODO - Modal explicativa primera vegada

export function loadCollectibles() {
    // Crea matriu aleatoria
    // De moment 0, 1 comuns, 2 raro, 3 mitic
    collectiblesMatrix = [
        [0, 0, 1, 0, 0],
        [0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
}

export function checkCollectiblesOnRow(row: number, statuses: any) {
    const collectiblesInTheRow = []
    for (let i = 0; i < 5; i++) {
        if (statuses[i] !== 'correct') continue
        if (collectiblesMatrix[row - 1][i] === 0) continue

        collectiblesInTheRow.push(collectiblesMatrix[row - 1][i])
        saveUserCollectible(collectiblesMatrix[row - 1][i])
    }

    console.log('Has aconseguit ', collectiblesInTheRow)

    return collectiblesInTheRow
}