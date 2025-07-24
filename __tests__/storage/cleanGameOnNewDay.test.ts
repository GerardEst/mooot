import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkCleanLocalStorage, cleanGameboard } from '../../main-functions.js'
import fs from 'fs'
import path from 'path'

// Load the actual HTML structure
const html = fs.readFileSync(path.resolve('./index.html'), 'utf8')

describe('cleanGameOnNewDays', () => {
  beforeEach(() => {
    // Set up the actual DOM structure from index.html
    document.body.innerHTML = html
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('checkCleanLocalStorage', () => {
    it('should clean localStorage and gameboard when saved game is from yesterday', () => {
      // Setup: Add some game state to the DOM
      const cell1 = document.querySelector('#l1_1') as HTMLElement
      const cell2 = document.querySelector('#l2_3') as HTMLElement
      const keyA = document.querySelector('.keyboard__key[data-key="A"]') as HTMLElement
      const keyB = document.querySelector('.keyboard__key[data-key="B"]') as HTMLElement
      
      if (cell1 && cell2 && keyA && keyB) {
        cell1.textContent = 'A'
        cell2.textContent = 'B'
        cell1.classList.add('correct')
        cell2.classList.add('present')
        keyA.classList.add('correct')
        keyB.classList.add('present')
      }

      // Create a saved game from yesterday
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const savedGameData = [
        {
          word: 'TESTE',
          row: 1,
          date: yesterday.toISOString()
        }
      ]
      
      localStorage.setItem('moootGameData', JSON.stringify(savedGameData))
      
      // Verify initial state
      expect(cell1?.textContent).toBe('A')
      expect(cell2?.textContent).toBe('B')
      expect(cell1?.classList.contains('correct')).toBe(true)
      expect(keyA?.classList.contains('correct')).toBe(true)
      expect(localStorage.getItem('moootGameData')).not.toBeNull()
      
      // Call the actual function
      const wasCleared = checkCleanLocalStorage(yesterday.toISOString())
      
      // Verify localStorage was cleared
      expect(localStorage.getItem('moootGameData')).toBeNull()
      expect(wasCleared).toBe(true)
      
      // Verify gameboard was cleaned
      expect(cell1?.textContent).toBe('')
      expect(cell2?.textContent).toBe('')
      expect(cell1?.classList.contains('correct')).toBe(false)
      expect(cell1?.classList.contains('present')).toBe(false)
      expect(cell1?.classList.contains('absent')).toBe(false)
      
      // Verify keyboard was reset
      expect(keyA?.classList.contains('correct')).toBe(false)
      expect(keyB?.classList.contains('present')).toBe(false)
    })

    it('should not clean localStorage or gameboard when saved game is from today', () => {
      // Setup: Add some game state to the DOM
      const cell1 = document.querySelector('#l1_1') as HTMLElement
      const keyA = document.querySelector('.keyboard__key[data-key="A"]') as HTMLElement
      
      if (cell1 && keyA) {
        cell1.textContent = 'A'
        cell1.classList.add('correct')
        keyA.classList.add('correct')
      }

      // Create a saved game from today
      const today = new Date()
      
      const savedGameData = [
        {
          word: 'TESTE',
          row: 1,
          date: today.toISOString()
        }
      ]
      
      localStorage.setItem('moootGameData', JSON.stringify(savedGameData))
      
      // Call the actual function
      const wasCleared = checkCleanLocalStorage(today.toISOString())
      
      // Verify localStorage was NOT cleared
      expect(localStorage.getItem('moootGameData')).not.toBeNull()
      expect(wasCleared).toBe(false)
      
      // Verify gameboard was NOT cleaned
      expect(cell1?.textContent).toBe('A')
      expect(cell1?.classList.contains('correct')).toBe(true)
      expect(keyA?.classList.contains('correct')).toBe(true)
    })

    it('should handle edge cases gracefully', () => {
      // Test with empty string
      expect(() => checkCleanLocalStorage('')).not.toThrow()
      
      // Test with invalid date
      expect(() => checkCleanLocalStorage('invalid-date')).not.toThrow()
      
      // Test with undefined (should be handled by the caller, but shouldn't crash)
      expect(() => checkCleanLocalStorage(undefined as any)).not.toThrow()
    })
  })

  describe('cleanGameboard', () => {
    it('should clean all game cells and remove CSS classes', () => {
      // Setup multiple cells with content and classes
      const testCells = [
        { id: '#l1_1', text: 'A', class: 'correct' },
        { id: '#l2_2', text: 'B', class: 'present' },
        { id: '#l3_3', text: 'C', class: 'absent' },
        { id: '#l4_4', text: 'D', class: 'correct' },
        { id: '#l5_5', text: 'E', class: 'present' },
        { id: '#l6_1', text: 'F', class: 'absent' }
      ]
      
      testCells.forEach(({ id, text, class: className }) => {
        const cell = document.querySelector(id) as HTMLElement
        if (cell) {
          cell.textContent = text
          cell.classList.add(className)
        }
      })

      // Setup keyboard keys
      const keyA = document.querySelector('.keyboard__key[data-key="A"]') as HTMLElement
      const keyB = document.querySelector('.keyboard__key[data-key="B"]') as HTMLElement
      if (keyA && keyB) {
        keyA.classList.add('correct')
        keyB.classList.add('present')
      }
      
      // Verify initial state
      testCells.forEach(({ id, text, class: className }) => {
        const cell = document.querySelector(id) as HTMLElement
        expect(cell?.textContent).toBe(text)
        expect(cell?.classList.contains(className)).toBe(true)
      })
      
      // Call the function
      cleanGameboard()
      
      // Verify all cells were cleaned
      testCells.forEach(({ id, class: className }) => {
        const cell = document.querySelector(id) as HTMLElement
        expect(cell?.textContent).toBe('')
        expect(cell?.classList.contains(className)).toBe(false)
      })
      
      // Verify keyboard was reset
      expect(keyA?.classList.contains('correct')).toBe(false)
      expect(keyB?.classList.contains('present')).toBe(false)
    })

    it('should clean all 6 rows and 5 columns', () => {
      // Fill all possible cells
      for (let row = 1; row <= 6; row++) {
        for (let col = 1; col <= 5; col++) {
          const cell = document.querySelector(`#l${row}_${col}`) as HTMLElement
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
          const cell = document.querySelector(`#l${row}_${col}`) as HTMLElement
          if (cell?.textContent === 'X') filledCells++
        }
      }
      expect(filledCells).toBe(30) // 6 rows � 5 cols
      
      cleanGameboard()
      
      // Verify all cells are clean
      for (let row = 1; row <= 6; row++) {
        for (let col = 1; col <= 5; col++) {
          const cell = document.querySelector(`#l${row}_${col}`) as HTMLElement
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
      keys.forEach(key => {
        key.classList.add('correct')
        key.classList.add('present')
        key.classList.add('absent')
      })
      
      cleanGameboard()
      
      // Verify all keys are reset
      keys.forEach(key => {
        expect(key.classList.contains('correct')).toBe(false)
        expect(key.classList.contains('present')).toBe(false)
        expect(key.classList.contains('absent')).toBe(false)
      })
    })
  })

  describe('integration test', () => {
    it('should properly integrate localStorage cleaning with gameboard cleaning', () => {
      // Setup a complete game state
      const cell1 = document.querySelector('#l1_1') as HTMLElement
      const cell2 = document.querySelector('#l3_2') as HTMLElement
      const keyQ = document.querySelector('.keyboard__key[data-key="Q"]') as HTMLElement
      
      if (cell1 && cell2 && keyQ) {
        cell1.textContent = 'Q'
        cell2.textContent = 'W'
        cell1.classList.add('correct')
        cell2.classList.add('present')
        keyQ.classList.add('correct')
      }
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const gameData = [
        { word: 'QUERY', row: 1, date: yesterday.toISOString() },
        { word: 'WORLD', row: 3, date: yesterday.toISOString() }
      ]
      
      localStorage.setItem('moootGameData', JSON.stringify(gameData))
      localStorage.setItem('stats', JSON.stringify({ games: 5, totalPoints: 20 }))
      
      // Initial state verification
      expect(localStorage.getItem('moootGameData')).not.toBeNull()
      expect(localStorage.getItem('stats')).not.toBeNull()
      expect(cell1?.textContent).toBe('Q')
      expect(cell2?.textContent).toBe('W')
      
      // Clean on new day
      const result = checkCleanLocalStorage(yesterday.toISOString())
      
      // Verify complete cleaning
      expect(result).toBe(true)
      expect(localStorage.getItem('moootGameData')).toBeNull()
      expect(localStorage.getItem('stats')).not.toBeNull() // Stats should remain
      expect(cell1?.textContent).toBe('')
      expect(cell2?.textContent).toBe('')
      expect(cell1?.classList.contains('correct')).toBe(false)
      expect(keyQ?.classList.contains('correct')).toBe(false)
    })
  })
})