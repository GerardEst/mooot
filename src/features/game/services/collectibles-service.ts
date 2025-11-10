import { saveUserCollectible } from "@src/core/api/collectibles";

type Rarity = 0 | 1 | 2 | 3;
type Row = [Rarity, Rarity, Rarity, Rarity, Rarity];
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
// OK - Generar premis a latzar
// TODO - Valorar si tothom igual o no
// OK - Guardar a la db. Pensar estructura
// TODO - Afegir al menú? - cambiar apartat lligues? O potser posar directament a la principal, amb un 7/20 veure més
// OK edge cases: quan tanques i tornes a entrar, no ha de tornar a donarte els aconseguits
// OK edge cases: la paraula final ha de donar tambe coleccionables
// TODO - Animació suau, magica, quan hi ha una lletra sobre casella amb coleccionable i estem acabant demplenar paraula
// TODO - Modal explicativa primera vegada

export function loadCollectibles() {
    let collectibles = []
    const amountOfCollectiblesToday = Math.ceil(Math.random() * 3)
    for (let i = 0; i < amountOfCollectiblesToday; i++) {
        const baseRand = Math.random()
        const collectibleRarity = baseRand <= 0.5 ? 1 : baseRand <= 0.85 ? 2 : 3 as Rarity

        const getCollectiblePosition = () => {
            const position = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 5)]
            if (collectibles.find(collectible => collectible.position === position)) {
                getCollectiblePosition()
            }
            return position
        }

        collectibles.push({ rarity: collectibleRarity, position: getCollectiblePosition() })
    }

    for (let collectible of collectibles) {
        collectiblesMatrix[collectible.position[0]][collectible.position[1]] = collectible.rarity
    }
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