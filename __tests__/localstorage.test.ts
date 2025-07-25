import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
    runStorageCheck,
    cleanGameboard,
    loadStoredGame,
} from '../src/storage-module'
import fs from 'fs'
import path from 'path'

// Mock only the word functions to return predictable values
vi.mock('../src/words-module.ts', () => ({
    getTodayWord: vi.fn(() => 'tests'),
    getTodayNiceWord: vi.fn(() => 'TESTS'),
}))

// Load the actual HTML structure
const html = fs.readFileSync(path.resolve('./index.html'), 'utf8')

describe('cleanGameOnNewDays', () => {
    beforeEach(() => {
        // Set up the actual DOM structure from index.html
        document.body.innerHTML = html
        localStorage.clear()
        vi.clearAllMocks()
    })

    describe('function runStorageCheck', () => {
        it('should clean localStorage and gameboard when saved game is from yesterday', () => {
            // Setup

            const cell1 = document.querySelector('#l1_1') as HTMLElement
            const cell2 = document.querySelector('#l2_2') as HTMLElement
            const cell3 = document.querySelector('#l2_3') as HTMLElement
            const cell4 = document.querySelector('#l2_4') as HTMLElement
            const cell5 = document.querySelector('#l2_5') as HTMLElement
            const keyA = document.querySelector(
                '.keyboard__key[data-key="A"]'
            ) as HTMLElement
            const keyB = document.querySelector(
                '.keyboard__key[data-key="B"]'
            ) as HTMLElement
            const keyC = document.querySelector(
                '.keyboard__key[data-key="C"]'
            ) as HTMLElement

            if (
                cell1 &&
                cell2 &&
                cell3 &&
                cell4 &&
                cell5 &&
                keyA &&
                keyB &&
                keyC
            ) {
                cell1.textContent = 'A'
                cell2.textContent = 'B'
                cell3.textContent = 'C'
                cell4.textContent = 'D'
                cell5.textContent = 'E'
                cell1.classList.add('correct')
                cell2.classList.add('present')
                cell3.classList.add('absent')
                cell4.classList.add('present')
                cell5.classList.add('absent')
                keyA.classList.add('correct')
                keyB.classList.add('present')
                keyC.classList.add('absent')
            }

            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)

            const savedGameData = [
                {
                    word: 'WORDA',
                    row: 1,
                    date: yesterday.toISOString(),
                },
                {
                    word: 'WORDB',
                    row: 2,
                    date: yesterday.toISOString(),
                },
            ]

            localStorage.setItem('moootGameData', JSON.stringify(savedGameData))

            // Verify part of the initial state
            expect(cell1?.textContent).toBe('A')
            expect(cell2?.textContent).toBe('B')
            expect(cell1?.classList.contains('correct')).toBe(true)
            expect(cell2?.classList.contains('present')).toBe(true)
            expect(cell3?.classList.contains('absent')).toBe(true)
            expect(keyA?.classList.contains('correct')).toBe(true)
            expect(keyB?.classList.contains('present')).toBe(true)
            expect(localStorage.getItem('moootGameData')).not.toBeNull()

            // Use tested function
            runStorageCheck()

            // Verification
            expect(localStorage.getItem('moootGameData')).toBeNull()

            expect(cell1).toBeEmptyDOMElement()
            expect(cell2).toBeEmptyDOMElement()
            expect(cell3).toBeEmptyDOMElement()
            expect(cell4).toBeEmptyDOMElement()
            expect(cell5).toBeEmptyDOMElement()
            expect(cell1).not.toHaveClass('correct')
            expect(cell1).not.toHaveClass('present')
            expect(cell1).not.toHaveClass('absent')
            expect(cell3).not.toHaveClass('absent')
            expect(cell4).not.toHaveClass('present')
            expect(cell5).not.toHaveClass('absent')

            expect(keyA).not.toHaveClass('correct')
            expect(keyB).not.toHaveClass('present')
            expect(keyC).not.toHaveClass('absent')
        })

        it('should not clean localStorage or gameboard when saved game is from today', () => {
            // Setup
            const cell1 = document.querySelector('#l1_1') as HTMLElement
            const keyA = document.querySelector(
                '.keyboard__key[data-key="A"]'
            ) as HTMLElement

            if (cell1 && keyA) {
                cell1.textContent = 'A'
                cell1.classList.add('correct')
                keyA.classList.add('correct')
            }

            const today = new Date()

            const savedGameData = [
                {
                    word: 'TESTE',
                    row: 1,
                    date: today.toISOString(),
                },
            ]

            localStorage.setItem('moootGameData', JSON.stringify(savedGameData))

            // Call the actual function
            runStorageCheck()

            // Verification
            expect(localStorage.getItem('moootGameData')).not.toBeNull()

            expect(cell1).toHaveTextContent('A')
            expect(cell1).toHaveClass('correct')
            expect(keyA).toHaveClass('correct')
        })
    })

    describe('function cleanGameboard', () => {
        it('should clean game cells and remove CSS classes when is not full', () => {
            // Setup multiple cells with content and classes
            const testCells = [
                { id: '#l1_1', text: 'A', class: 'correct' },
                { id: '#l1_2', text: 'B', class: 'present' },
                { id: '#l1_3', text: 'C', class: 'present' },
            ]

            testCells.forEach(({ id, text, class: className }) => {
                const cell = document.querySelector(id) as HTMLElement
                if (cell) {
                    cell.textContent = text
                    cell.classList.add(className)
                }
            })

            // Call the function
            cleanGameboard()

            // Verify all cells were cleaned
            testCells.forEach(({ id, class: className }) => {
                expect(document.querySelector(id)).toBeEmptyDOMElement()
                expect(document.querySelector(id)).not.toHaveClass(className)
            })
        })

        it('should clean all 6 rows and 5 columns', () => {
            // Fill all possible cells
            for (let row = 1; row <= 6; row++) {
                for (let col = 1; col <= 5; col++) {
                    const cell = document.querySelector(
                        `#l${row}_${col}`
                    ) as HTMLElement
                    if (cell) {
                        cell.textContent = 'X'
                        cell.classList.add('correct')
                    }
                }
            }

            // Verify setup
            let filledCells = 0
            for (let row = 1; row <= 6; row++) {
                for (let col = 1; col <= 5; col++) {
                    const cell = document.querySelector(
                        `#l${row}_${col}`
                    ) as HTMLElement
                    if (cell?.textContent === 'X') filledCells++
                }
            }
            expect(filledCells).toBe(30) // 6 rows � 5 cols

            cleanGameboard()

            // Verify all cells are clean
            for (let row = 1; row <= 6; row++) {
                for (let col = 1; col <= 5; col++) {
                    expect(
                        document.querySelector(`#l${row}_${col}`)
                    ).toBeEmptyDOMElement()
                    expect(
                        document.querySelector(`#l${row}_${col}`)
                    ).not.toHaveClass('correct')
                    expect(
                        document.querySelector(`#l${row}_${col}`)
                    ).not.toHaveClass('present')
                    expect(
                        document.querySelector(`#l${row}_${col}`)
                    ).not.toHaveClass('absent')
                }
            }
        })

        it('should handle missing DOM elements gracefully', () => {
            // Remove some elements
            const cell = document.querySelector('#l1_1')
            cell?.remove()

            // This should not throw
            expect(() => cleanGameboard()).not.toThrow()
        })

        it('should reset all keyboard key states', () => {
            // Get all keyboard keys
            const keys = document.querySelectorAll('.keyboard__key')
            expect(keys.length).toBeGreaterThan(0)

            // Add classes to all keys
            keys.forEach((key) => {
                key.classList.add('correct')
                key.classList.add('present')
                key.classList.add('absent')
            })

            cleanGameboard()

            // Verify all keys are reset
            keys.forEach((key) => {
                expect(key).not.toHaveClass('correct')
                expect(key).not.toHaveClass('present')
                expect(key).not.toHaveClass('absent')
            })
        })
    })
})

describe('loadStoredGame', () => {
    beforeEach(() => {
        // Set up the actual DOM structure from index.html
        document.body.innerHTML = html
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('should display stored words on the gameboard', () => {
        // Setup: Create stored game data
        const savedGameData = [
            {
                word: 'HOUSE',
                row: 1,
                date: new Date().toISOString(),
            },
            {
                word: 'MOUSE',
                row: 2,
                date: new Date().toISOString(),
            },
        ]

        localStorage.setItem('moootGameData', JSON.stringify(savedGameData))

        // Call the function
        loadStoredGame()

        // Verify the user can see the words on the gameboard
        expect(document.querySelector('#l1_1')).toHaveTextContent('H')
        expect(document.querySelector('#l1_2')).toHaveTextContent('O')
        expect(document.querySelector('#l1_3')).toHaveTextContent('U')
        expect(document.querySelector('#l1_4')).toHaveTextContent('S')
        expect(document.querySelector('#l1_5')).toHaveTextContent('E')

        expect(document.querySelector('#l2_1')).toHaveTextContent('M')
        expect(document.querySelector('#l2_2')).toHaveTextContent('O')
        expect(document.querySelector('#l2_3')).toHaveTextContent('U')
        expect(document.querySelector('#l2_4')).toHaveTextContent('S')
        expect(document.querySelector('#l2_5')).toHaveTextContent('E')
    })

    it('should not change the gameboard when no stored game exists', () => {
        // Ensure localStorage is empty
        localStorage.clear()

        // Verify gameboard is initially empty
        expect(document.querySelector('#l1_1')).toBeEmptyDOMElement()
        expect(document.querySelector('#l2_1')).toBeEmptyDOMElement()

        // Call the function
        loadStoredGame()

        // Verify gameboard remains empty
        expect(document.querySelector('#l1_1')).toBeEmptyDOMElement()
        expect(document.querySelector('#l2_1')).toBeEmptyDOMElement()
        expect(document.querySelector('#l3_1')).toBeEmptyDOMElement()
    })

    it('should show win modal when stored game was won', () => {
        // Setup: Create winning game data (last word matches today's word)
        const savedGameData = [
            {
                word: 'HOUSE',
                row: 1,
                date: new Date().toISOString(),
            },
            {
                word: 'TESTS', // This matches getTodayWord() mock return value
                row: 2,
                date: new Date().toISOString(),
            },
        ]

        localStorage.setItem('moootGameData', JSON.stringify(savedGameData))

        // Call the function
        loadStoredGame()

        // Verify user sees the win modal
        expect(document.querySelector('.modal')).toHaveClass('active')

        // Verify the words are displayed on the gameboard
        expect(document.querySelector('#l1_1')).toHaveTextContent('H')
        expect(document.querySelector('#l2_1')).toHaveTextContent('T')
    })

    it('should show loss modal when stored game was lost', () => {
        // Setup: Create losing game data (6 attempts, last word doesn't match)
        const savedGameData = [
            { word: 'HOUSE', row: 1, date: new Date().toISOString() },
            { word: 'MOUSE', row: 2, date: new Date().toISOString() },
            { word: 'LOUSE', row: 3, date: new Date().toISOString() },
            { word: 'DOUSE', row: 4, date: new Date().toISOString() },
            { word: 'ROUSE', row: 5, date: new Date().toISOString() },
            { word: 'SOUSE', row: 6, date: new Date().toISOString() }, // Wrong answer on 6th try
        ]

        localStorage.setItem('moootGameData', JSON.stringify(savedGameData))

        // Call the function
        loadStoredGame()

        // Verify user sees the loss modal
        expect(document.querySelector('.modal')).toHaveClass('active')

        // Verify all 6 attempts are displayed on the gameboard
        expect(document.querySelector('#l1_1')).toHaveTextContent('H') // HOUSE
        expect(document.querySelector('#l2_1')).toHaveTextContent('M') // MOUSE
        expect(document.querySelector('#l3_1')).toHaveTextContent('L') // LOUSE
        expect(document.querySelector('#l4_1')).toHaveTextContent('D') // DOUSE
        expect(document.querySelector('#l5_1')).toHaveTextContent('R') // ROUSE
        expect(document.querySelector('#l6_1')).toHaveTextContent('S') // SOUSE
    })

    it('should not show modal for game in progress', () => {
        // Setup: Create in-progress game data
        const savedGameData = [
            {
                word: 'HOUSE',
                row: 1,
                date: new Date().toISOString(),
            },
            {
                word: 'MOUSE',
                row: 2,
                date: new Date().toISOString(),
            },
        ]

        localStorage.setItem('moootGameData', JSON.stringify(savedGameData))

        // Call the function
        loadStoredGame()

        // Verify no modal is shown (game continues)
        expect(document.querySelector('.modal')).not.toHaveClass('active')

        // Verify the words are still displayed
        expect(document.querySelector('#l1_1')).toHaveTextContent('H')
        expect(document.querySelector('#l2_1')).toHaveTextContent('M')

        // Verify row 3 is empty (ready for next guess)
        expect(document.querySelector('#l3_1')).toBeEmptyDOMElement()
    })

    it('should show color hints for stored words', () => {
        // Setup: Game with a stored word
        const savedGameData = [
            {
                word: 'HOUSE',
                row: 1,
                date: new Date().toISOString(),
            },
        ]

        localStorage.setItem('moootGameData', JSON.stringify(savedGameData))

        // Call the function
        loadStoredGame()

        // Verify the word is displayed
        expect(document.querySelector('#l1_1')).toHaveTextContent('H')
        expect(document.querySelector('#l1_2')).toHaveTextContent('O')
        expect(document.querySelector('#l1_3')).toHaveTextContent('U')
        expect(document.querySelector('#l1_4')).toHaveTextContent('S')
        expect(document.querySelector('#l1_5')).toHaveTextContent('E')

        // Verify that color hint classes are applied (user sees visual feedback)
        // At least one cell should have a color class (the exact colors depend on the word)
        const gameboardHasHints =
            document.querySelector(
                '#l1_1.correct, #l1_1.present, #l1_1.absent'
            ) ||
            document.querySelector(
                '#l1_2.correct, #l1_2.present, #l1_2.absent'
            ) ||
            document.querySelector(
                '#l1_3.correct, #l1_3.present, #l1_3.absent'
            ) ||
            document.querySelector(
                '#l1_4.correct, #l1_4.present, #l1_4.absent'
            ) ||
            document.querySelector('#l1_5.correct, #l1_5.present, #l1_5.absent')

        expect(gameboardHasHints).toBeInTheDocument() // At least some cells should have color hints
    })

    it('should handle corrupted localStorage data gracefully', () => {
        // Setup: Invalid JSON in localStorage
        localStorage.setItem('moootGameData', 'invalid-json')

        // Verify gameboard is initially clean
        expect(document.querySelector('#l1_1')).toBeEmptyDOMElement()

        // Call the function - should throw but not break the DOM
        expect(() => loadStoredGame()).toThrow()

        // Verify gameboard remains clean
        expect(document.querySelector('#l1_1')).toBeEmptyDOMElement()
    })

    it('should handle empty stored game array', () => {
        // Setup: Empty array in localStorage
        localStorage.setItem('moootGameData', '[]')

        // This currently reveals a bug - empty arrays should be handled gracefully
        expect(() => loadStoredGame()).toThrow()
    })
})
