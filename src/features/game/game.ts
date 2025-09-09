import { LitElement, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import * as words from '@src/features/game/services/words-service.js'
import {
    runStorageCheck,
    getTodayTime,
} from '@src/shared/utils/storage-utils.js'
import { saveToLocalStorage } from '@src/shared/utils/storage-utils.js'
import type { storedRow } from '@src/shared/utils/storage-utils.js'
import {
    getStoredStats,
    updateStoredStats,
} from '@src/shared/utils/stats-utils'
import { game } from './game.style'
import { global } from '@src/pages/global-styles'
import './components/keyboard'
import './components/endgame-modal'
import { showFeedback as showFeedbackToast } from './services/feedback-service'
import type { Keyboard } from './components/keyboard'

@customElement('mooot-joc-game')
export class MoootJocGame extends LitElement {
    static styles = [global, game]

    @query('mooot-keyboard') private keyboardEl?: Keyboard
    @state() private modalActive = false
    @state() private modalTitle = '...'
    @state() private modalWord = ''
    @state() private modalPoints = '0'
    @state() private modalTime = '00:00:00'
    @state() private modalGames = '0'
    @state() private modalTotalPoints = '0'
    @state() private modalAveragePoints = '0.00'
    @state() private modalAverageTime = '00:00:00'
    @state() private modalStreak = '0'
    @state() private modalMaxStreak = '0'
    @state() private modalDicHref = '#'

    connectedCallback(): void {
        super.connectedCallback()
        // Register this instance so game logic can update the shadow DOM directly
        gameInstance = this
        runStorageCheck()
        document.addEventListener('visibilitychange', this.onVisibility)
    }

    disconnectedCallback(): void {
        document.removeEventListener('visibilitychange', this.onVisibility)
        // Unregister instance when detached
        if (gameInstance === this) gameInstance = null
        super.disconnectedCallback()
    }

    private onVisibility = () => {
        if (!document.hidden) runStorageCheck()
    }

    private init() {
        loadStoredGame()
    }

    protected firstUpdated(): void {
        // Ensure DOM (including modal) is rendered before trying to show it
        this.init()
    }

    // UI methods (inside component, reactive)
    public showModal() {
        this.modalActive = true
    }

    // feedback handled by feedback service (toast component)

    private computeTitle(points: number) {
        return points === 6
            ? '🤨 ESCANDALÓS!'
            : points === 5
            ? '🏆 Increíble!'
            : points === 4
            ? '🤯 Impresionant!'
            : points === 3
            ? '😎 Molt bé!'
            : points === 2
            ? '😐 Fet!'
            : points === 1
            ? '😭 Pels pèls!'
            : '💩 Vaja...'
    }

    private buildDicUrl(word: string) {
        return `https://dlc.iec.cat/Results?DecEntradaText=${word}&AllInfoMorf=False&OperEntrada=0&OperDef=0&OperEx=0&OperSubEntrada=0&OperAreaTematica=0&InfoMorfType=0&OperCatGram=False&AccentSen=False&CurrentPage=0&refineSearch=0&Actualitzacions=False`
    }

    public fillModalStats(todayPoints: number, todayTime: string | null) {
        const stats = updateStoredStats(todayPoints, todayTime)

        this.modalTitle = this.computeTitle(todayPoints)
        this.modalWord = words.getTodayNiceWord()
        this.modalPoints = String(todayPoints)
        this.modalTime = todayTime || '-'
        this.modalGames = String(stats?.games ?? 0)
        this.modalTotalPoints = String(stats?.totalPoints ?? 0)
        this.modalAveragePoints = (stats?.averagePoints ?? 0).toFixed(2)
        this.modalAverageTime = stats?.averageTime || '00:00:00'
        this.modalStreak = String(stats?.streak ?? 0)
        this.modalMaxStreak = String(stats?.maxStreak ?? 0)
        this.modalDicHref = this.buildDicUrl(this.modalWord)
    }

    public setKeyStatus(
        letter: string,
        status: 'correct' | 'present' | 'absent'
    ) {
        this.keyboardEl?.setKeyStatus?.(letter, status)
    }

    onLetterClick(e: CustomEvent) {
        console.log(e.detail.letter)
        letterClick(e.detail.letter)
    }

    onBackClick() {
        console.log('back clicked')
        deleteLastLetter()
    }

    onEnterClick() {
        console.log('enter clicked')
        validateLastRow()
    }

    // LitElement-scoped DOM update for cells
    updateCell(
        row: number,
        col: number,
        text?: string,
        status?: 'correct' | 'present' | 'absent'
    ) {
        const cell = (this.renderRoot as ShadowRoot).getElementById(
            `l${row}_${col}`
        ) as HTMLElement | null
        if (!cell) return
        if (text !== undefined) cell.textContent = text
        if (status) cell.classList.add(status)
    }

    // Modal lives in <mooot-endgame-modal>

    render() {
        return html`
            <section class="wordgrid">
                <div class="wordgrid__row" id="l1">
                    <div id="l1_1" class="wordgrid__cell"></div>
                    <div id="l1_2" class="wordgrid__cell"></div>
                    <div id="l1_3" class="wordgrid__cell"></div>
                    <div id="l1_4" class="wordgrid__cell"></div>
                    <div id="l1_5" class="wordgrid__cell"></div>
                </div>
                <div class="wordgrid__row" id="l2">
                    <div id="l2_1" class="wordgrid__cell"></div>
                    <div id="l2_2" class="wordgrid__cell"></div>
                    <div id="l2_3" class="wordgrid__cell"></div>
                    <div id="l2_4" class="wordgrid__cell"></div>
                    <div id="l2_5" class="wordgrid__cell"></div>
                </div>
                <div class="wordgrid__row" id="l3">
                    <div id="l3_1" class="wordgrid__cell"></div>
                    <div id="l3_2" class="wordgrid__cell"></div>
                    <div id="l3_3" class="wordgrid__cell"></div>
                    <div id="l3_4" class="wordgrid__cell"></div>
                    <div id="l3_5" class="wordgrid__cell"></div>
                </div>
                <div class="wordgrid__row" id="l4">
                    <div id="l4_1" class="wordgrid__cell"></div>
                    <div id="l4_2" class="wordgrid__cell"></div>
                    <div id="l4_3" class="wordgrid__cell"></div>
                    <div id="l4_4" class="wordgrid__cell"></div>
                    <div id="l4_5" class="wordgrid__cell"></div>
                </div>
                <div class="wordgrid__row" id="l5">
                    <div id="l5_1" class="wordgrid__cell"></div>
                    <div id="l5_2" class="wordgrid__cell"></div>
                    <div id="l5_3" class="wordgrid__cell"></div>
                    <div id="l5_4" class="wordgrid__cell"></div>
                    <div id="l5_5" class="wordgrid__cell"></div>
                </div>
                <div class="wordgrid__row" id="l6">
                    <div id="l6_1" class="wordgrid__cell"></div>
                    <div id="l6_2" class="wordgrid__cell"></div>
                    <div id="l6_3" class="wordgrid__cell"></div>
                    <div id="l6_4" class="wordgrid__cell"></div>
                    <div id="l6_5" class="wordgrid__cell"></div>
                </div>
            </section>

            <mooot-keyboard
                @letter-clicked="${(e: CustomEvent) => this.onLetterClick(e)}"
                @back-clicked="${() => this.onBackClick()}"
                @enter-clicked="${() => this.onEnterClick()}"
            ></mooot-keyboard>

            <mooot-endgame-modal
                .active=${this.modalActive}
                .title=${this.modalTitle}
                .word=${this.modalWord}
                .points=${this.modalPoints}
                .time=${this.modalTime}
                .games=${this.modalGames}
                .totalPoints=${this.modalTotalPoints}
                .averagePoints=${this.modalAveragePoints}
                .averageTime=${this.modalAverageTime}
                .streak=${this.modalStreak}
                .maxStreak=${this.modalMaxStreak}
                .dicHref=${this.modalDicHref}
                @modal-close=${() => (this.modalActive = false)}
            ></mooot-endgame-modal>
        `
    }
}

// -----------------
// Gameboard logic
// -----------------

// Keep a reference to the active game component instance
let gameInstance: MoootJocGame | null = null

export let currentRow = 1
export let currentColumn = 1
export let currentTry = 1
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

export function setCurrentTry(to: number) {
    currentTry = to
}

function updateCellProxy(
    row: number,
    col: number,
    text?: string,
    status?: 'correct' | 'present' | 'absent'
) {
    if (gameInstance?.updateCell) {
        gameInstance.updateCell(row, col, text, status)
        return
    }

    // Fallback for non-component contexts (e.g., tests without custom element)
    const cell = document.getElementById(`l${row}_${col}`) as HTMLElement | null
    if (!cell) return
    if (text !== undefined) cell.textContent = text
    if (status) cell.classList.add(status)
}

export function moveToNextRow() {
    currentRow++
    currentTry++
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
    console.log('heee')
    if (
        currentColumn === 1 &&
        currentRow === 1 &&
        !localStorage.getItem('timetrial-start')
    ) {
        localStorage.setItem('timetrial-start', new Date().toISOString())
    }
    if (currentColumn > 5) return
    if (currentColumn === 3) {
        words.loadDiccData()
        words.loadWordsData()
    }

    updateCellProxy(currentRow, currentColumn, letter)

    currentWord += letter
    currentColumn++
}

export function deleteLastLetter() {
    if (currentColumn <= 1) return

    currentColumn--
    updateCellProxy(currentRow, currentColumn, ' ')
    currentWord = currentWord.slice(0, -1)
}

function updateMenuStat(stat: string, content: string) {
    const menu = document.querySelector('mooot-menu') as HTMLElement & {
        shadowRoot?: ShadowRoot
    }
    const menuRoot = (menu?.shadowRoot as ShadowRoot) || document
    const target = menuRoot.querySelector?.(
        `#menustats-${stat}`
    ) as HTMLElement | null
    if (!target) return
    target.textContent = content
}

function updateMenuData() {
    const storedStats = getStoredStats()

    updateMenuStat('games', storedStats?.games.toString() || '0')
    updateMenuStat('totalPoints', storedStats?.totalPoints.toString() || '0')
    updateMenuStat(
        'averagePoints',
        storedStats?.averagePoints.toFixed(2) || '0'
    )
    updateMenuStat('streak', storedStats?.streak.toString() || '0')
    updateMenuStat('maxStreak', storedStats?.maxStreak.toString() || '0')
}

export function validateLastRow() {
    if (currentWord.length !== 5) return

    const rowStatus = checkWord(currentWord)
    if (rowStatus === 'correct') {
        showHints(currentWord, words.getTodayWord(), currentRow)
        saveToLocalStorage(currentWord, currentRow)

        const time = calculateTime()
        localStorage.removeItem('timetrial-start')
        localStorage.setItem('todayTime', time)

        updateStoredStats(7 - currentTry, time)
        if (gameInstance) gameInstance.fillModalStats(7 - currentTry, time)
        updateMenuData()

        currentRow = 0
        setTimeout(() => {
            if (gameInstance) gameInstance.showModal()
            else document.querySelector('.modal')?.classList.add('active')
        }, 1000)
    } else if (rowStatus === 'invalid') {
        showFeedbackToast('No és una paraula vàlida')
        currentColumn = 1
        cleanRow(currentRow)
    } else {
        showHints(currentWord, words.getTodayWord(), currentRow)
        saveToLocalStorage(currentWord, currentRow)

        if (currentRow >= 6) {
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
        currentColumn = 1
        currentRow++
        currentTry++
    }
    currentWord = ''
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

function calculateTime(): string {
    const startTime = localStorage.getItem('timetrial-start')
    if (!startTime) return '00:00:00'

    const startDate = new Date(startTime)
    const endDate = new Date()

    const diff = endDate.getTime() - startDate.getTime()
    const seconds = Math.floor((diff / 1000) % 60)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const hours = Math.floor(diff / (1000 * 60 * 60))

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
    )}:${String(seconds).padStart(2, '0')}`
}

// ---------------
// Load stored game
// ---------------
export async function loadStoredGame() {
    const storedData = localStorage.getItem('moootGameData')
    if (!storedData) {
        // No saved game for today: show modal with current stats and empty time
        this.fillModalStats(0, getTodayTime())
        if (gameInstance) gameInstance.showModal()
        else document.querySelector('.modal')?.classList.add('active')
        return
    }

    const storedGame = JSON.parse(storedData)
    await words.loadWordsData()

    if (Array.isArray(storedGame) && storedGame.length === 0) {
        // Explicitly empty saved game
        this.fillModalStats(0, getTodayTime())
        if (gameInstance) gameInstance.showModal()
        else document.querySelector('.modal')?.classList.add('active')
        return
    }

    storedGame.forEach((row: storedRow) => fillRow(row))

    const playerWon =
        currentTry <= 6 &&
        storedGame.at(-1).word.toUpperCase() ===
            words.getTodayWord().toUpperCase()

    const playerLost =
        currentTry === 6 &&
        storedGame.at(-1).word.toUpperCase() !==
            words.getTodayWord().toUpperCase()

    const time = localStorage.getItem('todayTime') || null

    if (playerWon) {
        if (gameInstance) gameInstance.fillModalStats(7 - currentTry, time)
        setCurrentRow(0)

        if (gameInstance) gameInstance.showModal()
        else document.querySelector('.modal')?.classList.add('active')
    } else if (playerLost) {
        if (gameInstance) gameInstance.fillModalStats(0, time)
        setCurrentRow(0)
        setCurrentTry(7)

        if (gameInstance) gameInstance.showModal()
        else document.querySelector('.modal')?.classList.add('active')
    } else {
        moveToNextRow()
    }
}

// (No exported UI helper functions; UI is managed within the component)
