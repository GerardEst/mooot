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

describe('user can play', () => {
    beforeEach(() => {
        // Set up the actual DOM structure from index.html
        document.body.innerHTML = html
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('should let user click on letters when there is space', () => {})
    it('should not add the letter if the row is full', () => {})
    it('should validate the word if user clicks enter and the row is full', () => {})
    it('should not validate the word if user clicks enter but the row is not full', () => {})
    it('should write letters on the next row after user validates correctly a row', () => {})
    it('should write letters on the same row after user validates incorrectly a row', () => {})
    it('should write letters on the same row after user validates incorrectly a row', () => {})
    it('should show end modal if user validates a correct row', () => {})
    it('should show end modal if user loose the game', () => {})
    it('should alter the status of the cells and keyboard when user validates a row with appropiated stats', () => {})
    it('should allow users to delete a letter in the active row', () => {})
    it('should not delete anything if the row is empty', () => {})
    it('should not allow to validate if the row is not filled', () => {})
})
