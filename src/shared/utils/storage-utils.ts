import { formatTime } from './time-utils'

export interface storedRow {
    row: number
    word: string
    date: string
}

export function saveToLocalStorage(word: string, row: number) {
    const dataToSave: storedRow = {
        word: word,
        row: row,
        date: new Date().toISOString(),
    }

    const currentStored = localStorage.getItem('moootGameData')

    if (currentStored) {
        const savedData = JSON.parse(currentStored)
        savedData.push(dataToSave)
        localStorage.setItem('moootGameData', JSON.stringify(savedData))
    } else {
        localStorage.setItem('moootGameData', JSON.stringify([dataToSave]))
    }
}

export function runStorageCheck() {
    const storedGame = localStorage.getItem('moootGameData')
    if (storedGame) {
        const storedGameData = JSON.parse(storedGame)
        const storedGameDate = storedGameData[0]?.date
        const cleanedLocalStorage = checkCleanLocalStorage(storedGameDate)
        if (cleanedLocalStorage) cleanGameboard()
    }
}

export function checkCleanLocalStorage(localDate: string) {
    const date = new Date(localDate)
    const today = new Date()

    if (date.toDateString() !== today.toDateString()) {
        console.warn('Saved data is not from today, clearing')
        localStorage.removeItem('moootGameData')
        localStorage.removeItem('mooot:game:crono')

        return true
    }

    console.log('Saved data is from today, will use it')
    return false
}

export function cleanGameboard() {
    // Clean game cells
    const game = document.querySelector('mooot-joc-game') as HTMLElement & {
        shadowRoot?: ShadowRoot
    }
    const root: ParentNode = (game?.shadowRoot as ShadowRoot) || document

    for (let row = 1; row <= 6; row++) {
        for (let col = 1; col <= 5; col++) {
            const cell = root.querySelector?.(
                `#l${row}_${col}`
            ) as HTMLElement | null
            if (cell) {
                cell.textContent = ''
                cell.classList.remove('correct', 'present', 'absent')
            }
        }
    }

    // Clean keyboard
    root.querySelectorAll?.('.keyboard__key').forEach((key) => {
        ; (key as HTMLElement).classList.remove('correct', 'present', 'absent')
    })
}

export function getTodayTime() {
    try {
        const cronoRaw = localStorage.getItem('mooot:game:crono')
        if (!cronoRaw) return '00:00:00'

        const payload = JSON.parse(cronoRaw) as {
            elapsed?: unknown
        }

        if (typeof payload.elapsed !== 'number' || payload.elapsed <= 0) {
            return '00:00:00'
        }

        return formatTime(payload.elapsed)
    } catch {
        return '00:00:00'
    }
}
