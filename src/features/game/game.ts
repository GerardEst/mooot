import { LitElement, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import * as words from '@src/features/game/services/words-service.js'
import { getTodayTime, runStorageCheck } from '@src/shared/utils/storage-utils.js'
import { saveToLocalStorage } from '@src/shared/utils/storage-utils.js'
import type { storedRow } from '@src/shared/utils/storage-utils.js'
import { updateStoredStats } from '@src/shared/utils/stats-utils'
import { game } from './game.style'
import { loadMonthStyle } from './monthStyles'
import { global } from '@src/core/app-reset-styles'
import './components/keyboard'
import './components/endgame-modal'
import './components/crono'
import { showFeedback as showFeedbackToast } from './services/feedback-service'
import type { Keyboard } from './components/keyboard'
import { computeStatuses } from '@src/shared/utils/hints-utils'
import type { MoootCrono } from './components/crono.ts'
import { formatTime } from '@src/shared/utils/time-utils'
import { isFromTelegram } from '@src/core/telegram.ts'
import { supalog } from '@src/core/api/logs.ts'
import { CollectiblesController } from '@src/features/game/services/collectibles-controller.ts'

type Row = [string, string, string, string, string];
type GameMatrix = [Row, Row, Row, Row, Row, Row];

@customElement('mooot-joc-game')
export class MoootJocGame extends LitElement {
    static styles = [global, game, loadMonthStyle()]
    private collectibles = new CollectiblesController(this);

    @query('mooot-keyboard') private keyboardEl?: Keyboard
    @query('mooot-crono') private cronoEl?: MoootCrono
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

    // De moment, aquesta matriu només serveix per dibuixar la quadrícula amb el map del template,
    // no guarda estat ni res. Tot i que no estaria mal.
    @state() private gameMatrix: GameMatrix = [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ]

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
        await words.loadWordsData({ inLeagues: isFromTelegram() })

        // We fill each row of the gameboard
        storedGame.forEach((row: storedRow) => this.fillRow(row))

        const playerWon =
            this.gameState.currentTry <= 6 && storedGame.at(-1).word.toUpperCase() === words.getTodayWord().toUpperCase()

        const playerLost =
            this.gameState.currentTry === 6 && storedGame.at(-1).word.toUpperCase() !== words.getTodayWord().toUpperCase()

        const time = getTodayTime() || null

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

            // We load different wordlist for telegram (leagues) and normal browser (casual games)
            words.loadWordsData({ inLeagues: isFromTelegram() })

            this.updateCell(row, col, letter)

            this.recomputeCurrentWordFromRow(row)

            this.selectedCell = null

            this.gameState.currentColumn = this.getFirstEmptyColumn(row)

            if (row === 1) {
                this.cronoEl?.start()
            }

            return
        }

        if (
            this.countFilled(this.gameState.currentRow) === 0 &&
            this.gameState.currentRow === 1
        ) {
            this.cronoEl?.start()
        }
        const targetCol = this.getFirstEmptyColumn(this.gameState.currentRow)
        if (targetCol > 5) return
        if (targetCol === 3) {
            words.loadDiccData()
            words.loadWordsData({ inLeagues: isFromTelegram() })
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

        const statuses = computeStatuses(this.gameState.currentWord, words.getTodayWord())
        const rowStatus = words.checkWord(this.gameState.currentWord)

        if (rowStatus === 'correct') {
            this.selectedCell = null
            this.showHints(
                this.gameState.currentWord,
                statuses,
                this.gameState.currentRow
            )

            if (this.collectibles.activeTestingFeatures) {
                this.collectibles.checkCollectiblesOnRow(this.gameState.currentRow, statuses)
            }

            saveToLocalStorage(
                this.gameState.currentWord,
                this.gameState.currentRow
            )

            this.cronoEl?.stop()
            const time = formatTime(this.cronoEl?.elapsedMs ?? 0)

            updateStoredStats(7 - this.gameState.currentTry)
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
                statuses,
                this.gameState.currentRow
            )

            if (this.collectibles.activeTestingFeatures) {
                this.collectibles.checkCollectiblesOnRow(this.gameState.currentRow, statuses)
            }

            saveToLocalStorage(
                this.gameState.currentWord,
                this.gameState.currentRow
            )

            if (this.gameState.currentRow >= 6) {
                this.cronoEl?.stop()
                const time = formatTime(this.cronoEl?.elapsedMs ?? 0)

                updateStoredStats(0)
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
        statuses: any,
        row: number,
        animate: boolean = true
    ) {
        const guessLetters = guess.toUpperCase().split('')

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

        supalog.feature('feature_tapToWrite')
    }

    fillRow(row: storedRow) {
        for (let i = 1; i <= 5; i++) {
            this.updateCell(row.row, i, row.word[i - 1])
        }
        const statuses = computeStatuses(row.word, words.getTodayWord())
        this.showHints(row.word, statuses, row.row, false)

        this.setCurrentRow(row.row)
        this.setCurrentTry(row.row)
        this.setCurrentColumn(1)
        this.setCurrentWord('')
    }

    render() {
        return html`
            <section class="wordgrid">
                <mooot-crono></mooot-crono>

                ${this.gameMatrix.map((row, rowIndex) => html`
                    <div class="wordgrid__row" id="l1">
                    ${row.map((cell, cellIndex) => html`
                        <div 
                            id="${`l${rowIndex + 1}_${cellIndex + 1}`}"
                            class="
                                wordgrid__cell 
                                ${this.selectedCell?.row === rowIndex + 1 && this.selectedCell.col === cellIndex + 1 ? 'selected' : ''} 
                                ${(this.collectibles.activeTestingFeatures && this.collectibles.collectiblesMatrix[rowIndex][cellIndex]) ? 'collectible collectible_' + this.collectibles.collectiblesMatrix[rowIndex][cellIndex] : ''}"
                            @click="${() => this.onCellClick(rowIndex + 1, cellIndex + 1)}"
                        ></div>`
        )}
                    </div>`
        )}
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
