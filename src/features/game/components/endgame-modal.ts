import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as words from '@src/features/game/services/words-service.js'
import { getTodayTime } from '@src/shared/utils/storage-utils.js'
import { shareResult } from '@src/shared/utils/share-utils'
import { modalStyles } from './endgame-modal.style'
import { global } from '@src/core/app-reset-styles'

import '@src/shared/components/button-mooot'
import '@src/shared/components/stat-display'

@customElement('mooot-endgame-modal')
export class MoootEndgameModal extends LitElement {
    static styles = [global, modalStyles]

    @property({ type: String }) points = '0'
    @property({ type: String }) time = '00:00:00'
    @property({ type: Boolean }) active = false
    @property({ type: Number }) currentTry = 0

    @property({ type: String }) private modalTitle = '...'
    @property({ type: String }) private word = ''
    @property({ type: String }) private dicHref = '#'

    connectedCallback(): void {
        super.connectedCallback()
    }

    firstUpdated() {
        this.fillStats()
    }

    private async fillStats() {
        this.word = (await words.getTodayNiceWord()) || ''
        this.modalTitle = this.computeTitle(Number(this.points))
        this.dicHref = this.buildDicUrl(this.word)
    }

    protected updated(changed: Map<string, unknown>) {
        if (changed.has('points')) {
            this.modalTitle = this.computeTitle(Number(this.points))
        }
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
                <div class="modal_box">
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
                    <section class="modal_content">
                        <div class="stats">
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
                                    +<span id="stats-points"
                                        >${this.points}</span
                                    >
                                </p>
                            </div>
                            <div class="pointedRow">
                                <p>Temps</p>
                                <span></span>
                                <p><span id="stats-time">${this.time}</span></p>
                            </div>
                        </div>
                        <div class="stats">
                            <stat-display
                                key="games"
                                name="Partides jugades"
                            ></stat-display>
                            <stat-display
                                key="totalPoints"
                                name="Punts totals"
                            ></stat-display>
                            <stat-display
                                key="averagePoints"
                                name="Mitjana de punts"
                            ></stat-display>
                            <stat-display
                                key="averageTime"
                                name="Mitjana de temps"
                            ></stat-display>
                            <stat-display
                                key="streak"
                                name="Ratxa actual"
                            ></stat-display>
                            <stat-display
                                key="maxStreak"
                                name="Ratxa màxima"
                            ></stat-display>
                        </div>
                    </section>
                    <div class="modal__buttons">
                        <button-mooot
                            @button-click="${(e: Event) =>
                                this.onShareHiddenClick(e)}"
                            label="Compartir sense cubs"
                        ></button-mooot>
                        <button-mooot
                            @button-click="${(e: Event) =>
                                this.onShareClick(e)}"
                            label="Compartir"
                        ></button-mooot>
                        <!-- <button
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
                        </button> -->
                    </div>
                </div>
            </section>
        `
    }
}
