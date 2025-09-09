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
import { fillRow } from './services/game-service'

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
        this.loadStoredGame()
    }

    async loadStoredGame() {
        const storedData = localStorage.getItem('moootGameData')
        if (!storedData) {
            // No saved game for today: show modal with current stats and empty time
            this.fillModalStats(0, getTodayTime())
            this.showModal()

            return
        }

        const storedGame = JSON.parse(storedData)
        await words.loadWordsData()

        if (Array.isArray(storedGame) && storedGame.length === 0) {
            // Explicitly empty saved game
            this.fillModalStats(0, getTodayTime())
            this.showModal()

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

    protected firstUpdated(): void {
        // Ensure DOM (including modal) is rendered before trying to show it
        this.init()
    }

    // UI methods (inside component, reactive)
    public showModal() {
        this.modalActive = true
    }

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

export function checkWord(word: string) {
    const cleanWord = word.toUpperCase().trim()

    if (cleanWord === words.getTodayWord().toUpperCase()) {
        return 'correct'
    }

    if (words.wordExists(cleanWord)) return 'next'

    return 'invalid'
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
