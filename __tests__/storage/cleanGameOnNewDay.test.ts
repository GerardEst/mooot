import { describe, it, expect, beforeEach, vi } from 'vitest'
import { runStorageCheck, cleanGameboard } from '../../src/local-storage'
import fs from 'fs'
import path from 'path'

// Load the actual HTML structure
const html = fs.readFileSync(path.resolve('./index.html'), 'utf8')

function setInitialGameBoardState() {}

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

            expect(cell1?.textContent).toBe('')
            expect(cell2?.textContent).toBe('')
            expect(cell3?.textContent).toBe('')
            expect(cell4?.textContent).toBe('')
            expect(cell5?.textContent).toBe('')
            expect(cell1?.classList.contains('correct')).toBe(false)
            expect(cell1?.classList.contains('present')).toBe(false)
            expect(cell1?.classList.contains('absent')).toBe(false)
            expect(cell3?.classList.contains('absent')).toBe(false)
            expect(cell4?.classList.contains('present')).toBe(false)
            expect(cell5?.classList.contains('absent')).toBe(false)

            expect(keyA?.classList.contains('correct')).toBe(false)
            expect(keyB?.classList.contains('present')).toBe(false)
            expect(keyC?.classList.contains('absent')).toBe(false)
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

            expect(cell1?.textContent).toBe('A')
            expect(cell1?.classList.contains('correct')).toBe(true)
            expect(keyA?.classList.contains('correct')).toBe(true)
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
                const cell = document.querySelector(id) as HTMLElement
                expect(cell?.textContent).toBe('')
                expect(cell?.classList.contains(className)).toBe(false)
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
                    const cell = document.querySelector(
                        `#l${row}_${col}`
                    ) as HTMLElement
                    expect(cell?.textContent).toBe('')
                    expect(cell?.classList.contains('correct')).toBe(false)
                    expect(cell?.classList.contains('present')).toBe(false)
                    expect(cell?.classList.contains('absent')).toBe(false)
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
                expect(key.classList.contains('correct')).toBe(false)
                expect(key.classList.contains('present')).toBe(false)
                expect(key.classList.contains('absent')).toBe(false)
            })
        })
    })
})
