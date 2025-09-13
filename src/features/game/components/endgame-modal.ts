import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as words from '@src/features/game/services/words-service.js'
import { getTodayTime } from '@src/shared/utils/storage-utils.js'
import { shareResult } from '@src/shared/utils/share-utils'
import { modalStyles } from './endgame-modal.style'
import { global } from '@src/pages/global-styles'
import { getStoredStats } from '@src/shared/utils/stats-utils'

@customElement('mooot-endgame-modal')
export class MoootEndgameModal extends LitElement {
    static styles = [global, modalStyles]

    @property({ type: String }) points = '0'
    @property({ type: String }) time = '00:00:00'
    @property({ type: Boolean }) active = false
    @property({ type: Number }) currentTry = 0
    @property({ type: String }) private modalTitle = '...'
    @property({ type: String }) private word = ''
    @property({ type: String }) private games = '0'
    @property({ type: String }) private totalPoints = '0'
    @property({ type: String }) private averagePoints = '0.00'
    @property({ type: String }) private averageTime = '00:00:00'
    @property({ type: String }) private streak = '0'
    @property({ type: String }) private maxStreak = '0'
    @property({ type: String }) private dicHref = '#'

    connectedCallback(): void {
        super.connectedCallback()

        this.fillStats()
    }

    private fillStats() {
        this.word = words.getTodayNiceWord() || ''
        this.modalTitle = this.computeTitle(Number(this.points))
        this.dicHref = this.buildDicUrl(this.word)

        const stats = getStoredStats()
        this.games = String(stats?.games ?? 0)
        this.totalPoints = String(stats?.totalPoints ?? 0)
        this.averagePoints = (stats?.averagePoints ?? 0).toFixed(2)
        this.averageTime = stats?.averageTime || '00:00:00'
        this.streak = String(stats?.streak ?? 0)
        this.maxStreak = String(stats?.maxStreak ?? 0)
    }

    private computeTitle(points: number) {
        return points === 6
            ? '🤨 ESCANDALÓS!'
            : points === 5
            ? '🏆 Increíble!'
            : points === 4
            ? '🤯 Impressionant!'
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

    private onModalCloseClick = () => {
        this.dispatchEvent(
            new CustomEvent('modal-close', { bubbles: true, composed: true })
        )
    }

    private onShareClick = async (e: Event) => {
        const target = e.currentTarget as HTMLElement | null
        const buttonImg = target?.querySelector('img') || undefined
        buttonImg?.setAttribute('src', '/assets/loading.svg')

        await shareResult(
            words.getTodayWordIndex(),
            this.currentTry,
            getTodayTime()
        )

        setTimeout(() => {
            buttonImg?.setAttribute('src', '/assets/share.svg')
        }, 1000)
    }

    private onShareHiddenClick = async (e: Event) => {
        const target = e.currentTarget as HTMLElement | null
        const buttonImg = target?.querySelector('img') || undefined
        buttonImg?.setAttribute('src', '/assets/loading.svg')

        await shareResult(
            words.getTodayWordIndex(),
            this.currentTry,
            getTodayTime(),
            true
        )

        setTimeout(() => {
            buttonImg?.setAttribute('src', '/assets/hidden_eye.svg')
        }, 1000)
    }

    render() {
        return html`
            <section class="modal modal-win ${this.active ? 'active' : ''}">
                <div class="modal__content">
                    <div class="header">
                        <h2 id="stats-title" class="modal__title">
                            ${this.modalTitle}
                        </h2>
                        <img
                            alt="Tancar modal"
                            id="modal-close"
                            class="modal__content__close"
                            src="/assets/close.svg"
                            @click="${() => this.onModalCloseClick()}"
                        />
                    </div>
                    <section class="stats">
                        <div class="pointedRow">
                            <p>Paraula</p>
                            <span></span>
                            <a
                                id="dicLink"
                                target="_blank"
                                href="${this.dicHref}"
                                ><span id="stats-word">${this.word}</span>
                                <img
                                    alt="Obrir en una pestanya nova"
                                    src="/assets/open-external.svg"
                            /></a>
                        </div>
                        <div class="pointedRow">
                            <p>Punts</p>
                            <span></span>
                            <p>
                                +<span id="stats-points">${this.points}</span>
                            </p>
                        </div>
                        <div class="pointedRow">
                            <p>Temps</p>
                            <span></span>
                            <p><span id="stats-time">${this.time}</span></p>
                        </div>
                    </section>
                    <section class="stats">
                        <div class="pointedRow">
                            <p>Partides jugades</p>
                            <span></span>
                            <p id="stats-games">${this.games}</p>
                        </div>
                        <div class="pointedRow">
                            <p>Punts totals</p>
                            <span></span>
                            <p id="stats-totalPoints">${this.totalPoints}</p>
                        </div>
                        <div class="pointedRow">
                            <p>Mitjana de punts</p>
                            <span></span>
                            <p id="stats-averagePoints">
                                ${this.averagePoints}
                            </p>
                        </div>
                        <div class="pointedRow">
                            <p>Mitjana de temps</p>
                            <span></span>
                            <p id="stats-averageTime">${this.averageTime}</p>
                        </div>
                        <div class="pointedRow">
                            <p>Ratxa actual</p>
                            <span></span>
                            <p id="stats-streak">${this.streak}</p>
                        </div>
                        <div class="pointedRow">
                            <p>Ratxa màxima</p>
                            <span></span>
                            <p id="stats-maxStreak">${this.maxStreak}</p>
                        </div>
                    </section>
                    <div class="modal__buttons">
                        <button
                            class="button--danger"
                            id="shareHidden"
                            @click="${(e: Event) => this.onShareHiddenClick(e)}"
                        >
                            Compartir sense cubs
                            <img alt="Ocult" src="/assets/hidden_eye.svg" />
                        </button>
                        <button
                            id="share"
                            @click="${(e: Event) => this.onShareClick(e)}"
                        >
                            Compartir
                            <img alt="Compartir" src="/assets/share.svg" />
                        </button>
                    </div>
                </div>
            </section>
        `
    }
}
