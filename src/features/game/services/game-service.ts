// export let currentRow = 1
// export let currentColumn = 1
// export let currentTry = 1
// export let currentWord = ''

import { storedRow } from '@src/shared/utils/storage-utils'

export let gameState = {
    currentRow: 1,
    currentColumn: 1,
    currentTry: 1,
    currentWord: '',
}

export function setCurrentRow(to: number) {
    gameState.currentRow = to
}

export function setCurrentColumn(to: number) {
    gameState.currentColumn = to
}

export function setCurrentWord(to: string) {
    gameState.currentWord = to
}

export function setCurrentTry(to: number) {
    gameState.currentTry = to
}

export function moveToNextRow() {
    gameState.currentRow++
    gameState.currentTry++
}

export function letterClick(letter: string) {
    if (
        gameState.currentColumn === 1 &&
        gameState.currentRow === 1 &&
        !localStorage.getItem('timetrial-start')
    ) {
        localStorage.setItem('timetrial-start', new Date().toISOString())
    }
    if (gameState.currentColumn > 5) return
    if (gameState.currentColumn === 3) {
        words.loadDiccData()
        words.loadWordsData()
    }

    updateCellProxy(gameState.currentRow, gameState.currentColumn, letter)

    gameState.currentWord += letter
    gameState.currentColumn++
}

export function deleteLastLetter() {
    if (gameState.currentColumn <= 1) return

    gameState.currentColumn--
    updateCellProxy(gameState.currentRow, gameState.currentColumn, ' ')
    gameState.currentWord = gameState.currentWord.slice(0, -1)
}

export function validateLastRow() {
    if (gameState.currentWord.length !== 5) return

    const rowStatus = checkWord(gameState.currentWord)
    if (rowStatus === 'correct') {
        showHints(
            gameState.currentWord,
            words.getTodayWord(),
            gameState.currentRow
        )
        saveToLocalStorage(gameState.currentWord, gameState.currentRow)

        const time = calculateTime()
        localStorage.removeItem('timetrial-start')
        localStorage.setItem('todayTime', time)

        updateStoredStats(7 - gameState.currentTry, time)
        if (gameInstance)
            gameInstance.fillModalStats(7 - gameState.currentTry, time)
        updateMenuData()

        gameState.currentRow = 0
        setTimeout(() => {
            if (gameInstance) gameInstance.showModal()
            else document.querySelector('.modal')?.classList.add('active')
        }, 1000)
    } else if (rowStatus === 'invalid') {
        showFeedbackToast('No és una paraula vàlida')
        gameState.currentColumn = 1
        cleanRow(gameState.currentRow)
    } else {
        showHints(
            gameState.currentWord,
            words.getTodayWord(),
            gameState.currentRow
        )
        saveToLocalStorage(gameState.currentWord, gameState.currentRow)

        if (gameState.currentRow >= 6) {
            const time = calculateTime()
            localStorage.removeItem('timetrial-start')
            localStorage.setItem('todayTime', time)

            updateStoredStats(0, time)
            if (gameInstance) gameInstance.fillModalStats(0, time)
            updateMenuData()

            setTimeout(() => {
                if (gameInstance) gameInstance.showModal()
                else document.querySelector('.modal')?.classList.add('active')
            }, 1000)
        }
        gameState.currentColumn = 1
        gameState.currentRow++
        gameState.currentTry++
    }
    gameState.currentWord = ''
}

export function fillRow(row: storedRow) {
    for (let i = 1; i <= 5; i++) {
        updateCellProxy(row.row, i, row.word[i - 1])
    }
    showHints(row.word, words.getTodayWord(), row.row, false)

    setCurrentRow(row.row)
    setCurrentTry(row.row)
    setCurrentColumn(1)
    setCurrentWord('')
}

export function cleanRow(row: number) {
    for (let i = 1; i <= 5; i++) updateCellProxy(row, i, '')
}

export function showHints(
    guess: string,
    target: string,
    row: number,
    animate: boolean = true
) {
    const guessLetters = guess.toUpperCase().split('')
    const targetLetters = target.toUpperCase().split('')

    const statuses: Array<'correct' | 'present' | 'absent'> = new Array(5)

    const remaining: Record<string, number> = {}
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            statuses[i] = 'correct'
        } else {
            const t = targetLetters[i]
            remaining[t] = (remaining[t] || 0) + 1
        }
    }

    for (let i = 0; i < 5; i++) {
        if (statuses[i] === 'correct') continue
        const g = guessLetters[i]
        if (remaining[g] > 0) {
            statuses[i] = 'present'
            remaining[g] -= 1
        } else {
            statuses[i] = 'absent'
        }
    }

    const baseDelay = 40

    if (!animate) {
        for (let i = 0; i < 5; i++) {
            updateCellProxy(row, i + 1, undefined, statuses[i])
            if (gameInstance)
                gameInstance.setKeyStatus(guessLetters[i], statuses[i])
            else {
                const keys = document.getElementsByClassName('keyboard__key')
                for (let k = 0; k < keys.length; k++) {
                    const el = keys[k] as HTMLElement
                    if (el.getAttribute('data-key') === guessLetters[i]) {
                        el.classList.add(statuses[i])
                        break
                    }
                }
            }
        }
        return
    }

    for (let i = 0; i < 5; i++) {
        const delay = i * baseDelay
        const cell =
            ((gameInstance?.renderRoot as ShadowRoot)?.getElementById?.(
                `l${row}_${i + 1}`
            ) as HTMLElement | null) ||
            (document.getElementById(`l${row}_${i + 1}`) as HTMLElement | null)
        const status = statuses[i]
        const letter = guessLetters[i]
        if (!cell) continue

        setTimeout(() => {
            updateCellProxy(row, i + 1, undefined, status)
            if (gameInstance) gameInstance.setKeyStatus(letter, status)
            else {
                const keys = document.getElementsByClassName('keyboard__key')
                for (let k = 0; k < keys.length; k++) {
                    const el = keys[k] as HTMLElement
                    if (el.getAttribute('data-key') === letter) {
                        el.classList.add(status)
                        break
                    }
                }
            }

            if (status === 'correct') {
                cell.classList.add('hard-reveal')
            } else {
                cell.classList.add('soft-reveal')
            }
        }, delay)
    }
}
