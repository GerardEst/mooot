import { LitElement, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import * as words from '@src/features/game/services/words-service.js'
import { runStorageCheck } from '@src/shared/utils/storage-utils.js'
import { saveToLocalStorage } from '@src/shared/utils/storage-utils.js'
import type { storedRow } from '@src/shared/utils/storage-utils.js'
import { updateStoredStats } from '@src/shared/utils/stats-utils'
import { game } from './game.style'
import { global } from '@src/core/global-styles'
import './components/keyboard'
import './components/endgame-modal'
import { showFeedback as showFeedbackToast } from './services/feedback-service'
import type { Keyboard } from './components/keyboard'

@customElement('mooot-joc-game')
export class MoootJocGame extends LitElement {
    static styles = [global, game]

    @query('mooot-keyboard') private keyboardEl?: Keyboard
    @state() private modalActive = false
    @state() private points = '0'
    @state() private time = '00:00:00'
    @state() private gameState = {
        currentRow: 1,
        currentColumn: 1,
        currentTry: 1,
        currentWord: '',
    }
    @state() private selectedCell: { row: number; col: number } | null = null

    connectedCallback(): void {
        super.connectedCallback()

        runStorageCheck()
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) runStorageCheck()
        })
    }

    setCurrentRow(to: number) {
        this.gameState.currentRow = to
    }

    setCurrentColumn(to: number) {
        this.gameState.currentColumn = to
    }

    setCurrentWord(to: string) {
        this.gameState.currentWord = to
    }

    setCurrentTry(to: number) {
        this.gameState.currentTry = to
    }

    moveToNextRow() {
        this.gameState.currentRow++
        this.gameState.currentTry++
    }

    protected firstUpdated(): void {
        this.loadStoredGame()
    }

    async loadStoredGame() {
        // We get the stored game data from localStorage
        const storedGameData = localStorage.getItem('moootGameData')

        // If no stored game, we exit
        if (!storedGameData) return

        const storedGame = JSON.parse(storedGameData)

        // We need the words data from the beginning
        await words.loadWordsData()

        // We fill each row of the gameboard
        storedGame.forEach((row: storedRow) => this.fillRow(row))

        const playerWon =
            this.gameState.currentTry <= 6 &&
            storedGame.at(-1).word.toUpperCase() ===
                words.getTodayWord().toUpperCase()

        const playerLost =
            this.gameState.currentTry === 6 &&
            storedGame.at(-1).word.toUpperCase() !==
                words.getTodayWord().toUpperCase()

        const time = localStorage.getItem('todayTime') || null

        if (playerWon) {
            this.fillModalStats(7 - this.gameState.currentTry, time)
            this.setCurrentRow(0)

            this.showModal()
        } else if (playerLost) {
            this.fillModalStats(0, time)
            this.setCurrentRow(0)
            this.setCurrentTry(7)

            this.showModal()
        } else {
            this.moveToNextRow()
        }
    }

    // UI methods (inside component, reactive)
    public showModal() {
        this.modalActive = true
    }

    public fillModalStats(todayPoints: number, todayTime: string | null) {
        this.points = String(todayPoints)
        this.time = todayTime || '-'
    }

    public setKeyStatus(
        letter: string,
        status: 'correct' | 'present' | 'absent'
    ) {
        this.keyboardEl?.setKeyStatus?.(letter, status)
    }

    onLetterClick(e: CustomEvent) {
        this.letterClick(e.detail.letter)
    }

    onBackClick() {
        this.deleteLastLetter()
    }

    onEnterClick() {
        this.validateLastRow()
    }

    letterClick(letter: string) {
        if (
            this.selectedCell &&
            this.selectedCell.row === this.gameState.currentRow &&
            this.gameState.currentRow > 0
        ) {
            const row = this.gameState.currentRow
            const col = this.selectedCell.col

            // Just in case, try to load words every time when user inputs letters directly
            words.loadDiccData()
            words.loadWordsData()

            this.updateCell(row, col, letter)

            this.recomputeCurrentWordFromRow(row)

            this.selectedCell = null

            this.gameState.currentColumn = this.getFirstEmptyColumn(row)

            // Start timer if this was the very first letter overall
            // TODO - Crec que treure això d'aquí
            if (row === 1 && !localStorage.getItem('timetrial-start')) {
                localStorage.setItem(
                    'timetrial-start',
                    new Date().toISOString()
                )
            }

            return
        }

        if (
            this.countFilled(this.gameState.currentRow) === 0 &&
            this.gameState.currentRow === 1 &&
            !localStorage.getItem('timetrial-start')
        ) {
            localStorage.setItem('timetrial-start', new Date().toISOString())
        }
        const targetCol = this.getFirstEmptyColumn(this.gameState.currentRow)
        if (targetCol > 5) return
        if (targetCol === 3) {
            words.loadDiccData()
            words.loadWordsData()
        }

        this.updateCell(this.gameState.currentRow, targetCol, letter)
        this.recomputeCurrentWordFromRow(this.gameState.currentRow)
        this.gameState.currentColumn = this.getFirstEmptyColumn(
            this.gameState.currentRow
        )
    }

    deleteLastLetter() {
        if (this.gameState.currentColumn <= 1) return

        this.gameState.currentColumn--
        this.updateCell(
            this.gameState.currentRow,
            this.gameState.currentColumn,
            ' '
        )
        this.recomputeCurrentWordFromRow(this.gameState.currentRow)
    }

    validateLastRow() {
        if (this.gameState.currentWord.length !== 5) return

        const rowStatus = words.checkWord(this.gameState.currentWord)
        if (rowStatus === 'correct') {
            this.selectedCell = null
            this.showHints(
                this.gameState.currentWord,
                words.getTodayWord(),
                this.gameState.currentRow
            )
            saveToLocalStorage(
                this.gameState.currentWord,
                this.gameState.currentRow
            )

            const time = this.calculateTime()
            localStorage.removeItem('timetrial-start')
            localStorage.setItem('todayTime', time)

            updateStoredStats(7 - this.gameState.currentTry, time)
            this.fillModalStats(7 - this.gameState.currentTry, time)

            this.gameState.currentRow = 0
            setTimeout(() => {
                this.showModal()
            }, 1000)
        } else if (rowStatus === 'invalid') {
            showFeedbackToast('No és una paraula vàlida')
            this.gameState.currentColumn = 1
            this.selectedCell = null
            this.cleanRow(this.gameState.currentRow)
        } else {
            this.showHints(
                this.gameState.currentWord,
                words.getTodayWord(),
                this.gameState.currentRow
            )
            saveToLocalStorage(
                this.gameState.currentWord,
                this.gameState.currentRow
            )

            if (this.gameState.currentRow >= 6) {
                const time = this.calculateTime()
                localStorage.removeItem('timetrial-start')
                localStorage.setItem('todayTime', time)

                updateStoredStats(0, time)
                this.fillModalStats(0, time)

                setTimeout(() => {
                    this.showModal()
                }, 1000)
            }
            this.selectedCell = null
            this.gameState.currentColumn = 1
            this.gameState.currentRow++
            this.gameState.currentTry++
        }
        this.gameState.currentWord = ''
    }

    cleanRow(row: number) {
        for (let i = 1; i <= 5; i++) this.updateCell(row, i, '')
    }

    showHints(
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
                this.updateCell(row, i + 1, undefined, statuses[i])

                this.setKeyStatus(guessLetters[i], statuses[i])
            }
            return
        }

        for (let i = 0; i < 5; i++) {
            const delay = i * baseDelay
            const cell =
                ((this?.renderRoot as ShadowRoot)?.getElementById?.(
                    `l${row}_${i + 1}`
                ) as HTMLElement | null) ||
                (document.getElementById(
                    `l${row}_${i + 1}`
                ) as HTMLElement | null)
            const status = statuses[i]
            const letter = guessLetters[i]
            if (!cell) continue

            setTimeout(() => {
                this.updateCell(row, i + 1, undefined, status)
                this.setKeyStatus(letter, status)

                if (status === 'correct') {
                    cell.classList.add('hard-reveal')
                } else {
                    cell.classList.add('soft-reveal')
                }
            }, delay)
        }
    }

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

    // Helpers for selective cell placement
    private getCell(row: number, col: number): HTMLElement | null {
        return (
            ((this?.renderRoot as ShadowRoot)?.getElementById?.(
                `l${row}_${col}`
            ) as HTMLElement | null) ||
            (document.getElementById(`l${row}_${col}`) as HTMLElement | null)
        )
    }

    private countFilled(row: number): number {
        let count = 0
        for (let i = 1; i <= 5; i++) {
            const txt = this.getCell(row, i)?.textContent || ''
            if (txt.trim().length > 0) count++
        }
        return count
    }

    private getFirstEmptyColumn(row: number): number {
        for (let i = 1; i <= 5; i++) {
            const txt = this.getCell(row, i)?.textContent || ''
            if (txt.trim().length === 0) return i
        }
        return 6
    }

    private recomputeCurrentWordFromRow(row: number) {
        let s = ''
        for (let i = 1; i <= 5; i++) {
            const txt = this.getCell(row, i)?.textContent || ''
            const t = txt.trim()
            if (t) s += t
        }
        this.gameState.currentWord = s
    }

    onCellClick(row: number, col: number) {
        if (this.gameState.currentRow <= 0) return
        if (row !== this.gameState.currentRow) return

        this.selectedCell = { row, col }
    }

    fillRow(row: storedRow) {
        for (let i = 1; i <= 5; i++) {
            this.updateCell(row.row, i, row.word[i - 1])
        }
        this.showHints(row.word, words.getTodayWord(), row.row, false)

        this.setCurrentRow(row.row)
        this.setCurrentTry(row.row)
        this.setCurrentColumn(1)
        this.setCurrentWord('')
    }

    calculateTime(): string {
        // Get the time from the start to now, in HH:MM:SS format
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

    seeAd() {
        // Rewarded interstitial

        // Rewarded Popup

        show_9902259('pop')
            .then(() => {
                alert(
                    "Per tancar l'anunci, clica la creu de dalt a l'esquerra!"
                )
            })
            .catch((e) => {
                // user get error during playing ad
                // do nothing or whatever you want
            })
    }

    render() {
        return html`
            <section class="wordgrid">
                <button @click=${() => this.seeAd()}>Ad test</button>
                <div class="wordgrid__row" id="l1">
                    <div
                        id="l1_1"
                        class="wordgrid__cell ${this.selectedCell?.row === 1 &&
                        this.selectedCell.col === 1
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(1, 1)}"
                    ></div>
                    <div
                        id="l1_2"
                        class="wordgrid__cell ${this.selectedCell?.row === 1 &&
                        this.selectedCell.col === 2
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(1, 2)}"
                    ></div>
                    <div
                        id="l1_3"
                        class="wordgrid__cell ${this.selectedCell?.row === 1 &&
                        this.selectedCell.col === 3
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(1, 3)}"
                    ></div>
                    <div
                        id="l1_4"
                        class="wordgrid__cell ${this.selectedCell?.row === 1 &&
                        this.selectedCell.col === 4
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(1, 4)}"
                    ></div>
                    <div
                        id="l1_5"
                        class="wordgrid__cell ${this.selectedCell?.row === 1 &&
                        this.selectedCell.col === 5
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(1, 5)}"
                    ></div>
                </div>
                <div class="wordgrid__row" id="l2">
                    <div
                        id="l2_1"
                        class="wordgrid__cell ${this.selectedCell?.row === 2 &&
                        this.selectedCell.col === 1
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(2, 1)}"
                    ></div>
                    <div
                        id="l2_2"
                        class="wordgrid__cell ${this.selectedCell?.row === 2 &&
                        this.selectedCell.col === 2
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(2, 2)}"
                    ></div>
                    <div
                        id="l2_3"
                        class="wordgrid__cell ${this.selectedCell?.row === 2 &&
                        this.selectedCell.col === 3
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(2, 3)}"
                    ></div>
                    <div
                        id="l2_4"
                        class="wordgrid__cell ${this.selectedCell?.row === 2 &&
                        this.selectedCell.col === 4
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(2, 4)}"
                    ></div>
                    <div
                        id="l2_5"
                        class="wordgrid__cell ${this.selectedCell?.row === 2 &&
                        this.selectedCell.col === 5
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(2, 5)}"
                    ></div>
                </div>
                <div class="wordgrid__row" id="l3">
                    <div
                        id="l3_1"
                        class="wordgrid__cell ${this.selectedCell?.row === 3 &&
                        this.selectedCell.col === 1
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(3, 1)}"
                    ></div>
                    <div
                        id="l3_2"
                        class="wordgrid__cell ${this.selectedCell?.row === 3 &&
                        this.selectedCell.col === 2
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(3, 2)}"
                    ></div>
                    <div
                        id="l3_3"
                        class="wordgrid__cell ${this.selectedCell?.row === 3 &&
                        this.selectedCell.col === 3
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(3, 3)}"
                    ></div>
                    <div
                        id="l3_4"
                        class="wordgrid__cell ${this.selectedCell?.row === 3 &&
                        this.selectedCell.col === 4
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(3, 4)}"
                    ></div>
                    <div
                        id="l3_5"
                        class="wordgrid__cell ${this.selectedCell?.row === 3 &&
                        this.selectedCell.col === 5
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(3, 5)}"
                    ></div>
                </div>
                <div class="wordgrid__row" id="l4">
                    <div
                        id="l4_1"
                        class="wordgrid__cell ${this.selectedCell?.row === 4 &&
                        this.selectedCell.col === 1
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(4, 1)}"
                    ></div>
                    <div
                        id="l4_2"
                        class="wordgrid__cell ${this.selectedCell?.row === 4 &&
                        this.selectedCell.col === 2
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(4, 2)}"
                    ></div>
                    <div
                        id="l4_3"
                        class="wordgrid__cell ${this.selectedCell?.row === 4 &&
                        this.selectedCell.col === 3
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(4, 3)}"
                    ></div>
                    <div
                        id="l4_4"
                        class="wordgrid__cell ${this.selectedCell?.row === 4 &&
                        this.selectedCell.col === 4
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(4, 4)}"
                    ></div>
                    <div
                        id="l4_5"
                        class="wordgrid__cell ${this.selectedCell?.row === 4 &&
                        this.selectedCell.col === 5
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(4, 5)}"
                    ></div>
                </div>
                <div class="wordgrid__row" id="l5">
                    <div
                        id="l5_1"
                        class="wordgrid__cell ${this.selectedCell?.row === 5 &&
                        this.selectedCell.col === 1
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(5, 1)}"
                    ></div>
                    <div
                        id="l5_2"
                        class="wordgrid__cell ${this.selectedCell?.row === 5 &&
                        this.selectedCell.col === 2
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(5, 2)}"
                    ></div>
                    <div
                        id="l5_3"
                        class="wordgrid__cell ${this.selectedCell?.row === 5 &&
                        this.selectedCell.col === 3
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(5, 3)}"
                    ></div>
                    <div
                        id="l5_4"
                        class="wordgrid__cell ${this.selectedCell?.row === 5 &&
                        this.selectedCell.col === 4
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(5, 4)}"
                    ></div>
                    <div
                        id="l5_5"
                        class="wordgrid__cell ${this.selectedCell?.row === 5 &&
                        this.selectedCell.col === 5
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(5, 5)}"
                    ></div>
                </div>
                <div class="wordgrid__row" id="l6">
                    <div
                        id="l6_1"
                        class="wordgrid__cell ${this.selectedCell?.row === 6 &&
                        this.selectedCell.col === 1
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(6, 1)}"
                    ></div>
                    <div
                        id="l6_2"
                        class="wordgrid__cell ${this.selectedCell?.row === 6 &&
                        this.selectedCell.col === 2
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(6, 2)}"
                    ></div>
                    <div
                        id="l6_3"
                        class="wordgrid__cell ${this.selectedCell?.row === 6 &&
                        this.selectedCell.col === 3
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(6, 3)}"
                    ></div>
                    <div
                        id="l6_4"
                        class="wordgrid__cell ${this.selectedCell?.row === 6 &&
                        this.selectedCell.col === 4
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(6, 4)}"
                    ></div>
                    <div
                        id="l6_5"
                        class="wordgrid__cell ${this.selectedCell?.row === 6 &&
                        this.selectedCell.col === 5
                            ? 'selected'
                            : ''}"
                        @click="${() => this.onCellClick(6, 5)}"
                    ></div>
                </div>
            </section>

            <mooot-keyboard
                @letter-clicked="${(e: CustomEvent) => this.onLetterClick(e)}"
                @back-clicked="${() => this.onBackClick()}"
                @enter-clicked="${() => this.onEnterClick()}"
            ></mooot-keyboard>

            <mooot-endgame-modal
                .active=${this.modalActive}
                .points=${this.points}
                .time=${this.time}
                .currentTry=${this.gameState.currentTry}
                @modal-close=${() => (this.modalActive = false)}
            ></mooot-endgame-modal>
        `
    }
}
