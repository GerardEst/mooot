import { showFeedback, showModal, updateCell, updateKey } from './dom-utils'
import * as words from './words-module'
import { saveToLocalStorage } from './storage-module'
import type { storedRow } from './storage-module'
import {
    editLinkToDictionary,
    fillModalStats,
    updateMenuData,
    updateStoredStats,
} from './stats-module'

export let currentRow = 1
export let currentColumn = 1
export let currentWord = ''

export function setCurrentRow(to: number) {
    currentRow = to
}

export function setCurrentColumn(to: number) {
    currentColumn = to
}

export function setCurrentWord(to: string) {
    currentWord = to
}

export function moveToNextRow() {
    currentRow++
}

export function checkWord(word: string) {
    const cleanWord = word.toUpperCase().trim()

    if (cleanWord === words.getTodayWord().toUpperCase()) {
        return 'correct'
    }

    if (words.wordExists(cleanWord)) return 'next'

    return 'invalid'
}

export function letterClick(letter: string) {
    if (currentColumn > 5) return
    if (currentColumn === 3) words.loadDiccData()

    updateCell(currentRow, currentColumn, letter)

    currentWord += letter
    currentColumn++
}

export function deleteLastLetter() {
    if (currentColumn <= 1) return

    currentColumn--
    updateCell(currentRow, currentColumn, ' ')
    currentWord = currentWord.slice(0, -1)
}

export function validateLastRow() {
    if (currentWord.length !== 5) return

    const rowStatus = checkWord(currentWord)
    if (rowStatus === 'correct') {
        showHints(currentWord, words.getTodayWord(), currentRow)
        saveToLocalStorage(currentWord, currentRow)

        const points = 7 - currentRow
        updateStoredStats(points)
        fillModalStats(points)
        updateMenuData()
        currentRow = 0

        setTimeout(() => {
            showModal()
            editLinkToDictionary(words.getTodayNiceWord())
        }, 1000)
    } else if (rowStatus === 'invalid') {
        showFeedback('No és una paraula vàlida')
        currentColumn = 1
        cleanRow(currentRow)
    } else {
        showHints(currentWord, words.getTodayWord(), currentRow)
        saveToLocalStorage(currentWord, currentRow)
        updateStoredStats(0)
        fillModalStats(0)
        updateMenuData()
        if (currentRow >= 6) {
            setTimeout(() => {
                showModal()
                editLinkToDictionary(words.getTodayNiceWord())
            }, 1000)
        }
        currentColumn = 1
        currentRow++
    }
    currentWord = ''
}

export function fillRow(row: storedRow) {
    for (let i = 1; i <= 5; i++) {
        updateCell(row.row, i, row.word[i - 1])
    }
    showHints(row.word, words.getTodayWord(), row.row)

    setCurrentRow(row.row)
    setCurrentColumn(1)
    setCurrentWord('')
}

export function cleanRow(row: number) {
    for (let i = 1; i <= 5; i++) updateCell(row, i, '')
}

export function showHints(guess: string, target: string, row: number) {
    const guessLetters = guess.toUpperCase().split('')
    const targetLetters = target.toUpperCase().split('')

    for (let i = 0; i < 5; i++) {
        const letter = guessLetters[i]

        if (letter === targetLetters[i]) {
            updateCell(row, i + 1, undefined, 'correct')
            updateKey(letter, 'correct')
        } else if (!targetLetters.includes(letter)) {
            updateCell(row, i + 1, undefined, 'absent')
            updateKey(letter, 'absent')
        } else {
            updateCell(row, i + 1, undefined, 'present')
            updateKey(letter, 'present')
        }
    }

    // Second pass: fix incorrect "present" markings for duplicate letters
    for (let i = 0; i < 5; i++) {
        const cell = document.querySelector(`#l${row}_${i + 1}`)

        if (!cell) return

        const guessLetter = guessLetters[i]

        // Skip if this cell is already correct or absent
        if (
            cell.classList.contains('correct') ||
            cell.classList.contains('absent')
        ) {
            continue
        }

        // Count how many times this letter appears in the target word
        const targetCount = targetLetters.filter(
            (letter) => letter === guessLetter
        ).length

        // Count how many of this letter are already marked as correct
        const correctCount = guessLetters.filter(
            (letter, index) =>
                letter === guessLetter &&
                guessLetters[index] === targetLetters[index]
        ).length

        // Count how many of this letter should be marked as present (before this position)
        let presentCount = 0
        for (let j = 0; j < i; j++) {
            if (
                guessLetters[j] === guessLetter &&
                guessLetters[j] !== targetLetters[j] &&
                targetLetters.includes(guessLetters[j])
            ) {
                presentCount++
            }
        }

        // If we've already accounted for all instances of this letter in the target,
        // this one should be marked as absent
        if (correctCount + presentCount >= targetCount) {
            cell.classList.remove('present')
            cell.classList.add('absent')

            // Update keyboard key if no other instances are correct or present
            const keyboardKey = document.querySelector(
                `.keyboard__key[data-key="${guessLetter}"]`
            )

            if (!keyboardKey?.classList.contains('correct')) {
                const hasOtherPresent = guessLetters.some((letter, index) => {
                    if (letter !== guessLetter || index >= i) return false
                    const otherCell = document.querySelector(
                        `#l${row}_${index + 1}`
                    )

                    return otherCell?.classList.contains('present')
                })

                if (!hasOtherPresent) {
                    keyboardKey?.classList.remove('present')
                    keyboardKey?.classList.add('absent')
                }
            }
        }
    }
}
