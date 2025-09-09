import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as words from '@src/features/game/words-module.js'
import { getTodayTime } from '@src/shared/utils/storage-utils.js'
import { shareResult } from '@src/shared/utils/share-utils'
import { currentTry } from '@src/features/game/game'
import { modalStyles } from './endgame-modal.style'
import { global } from '@src/pages/global-styles'

@customElement('mooot-endgame-modal')
export class MoootEndgameModal extends LitElement {
    static styles = [global, modalStyles]

    @property({ type: Boolean }) active = false
    @property({ type: String }) title = '...'
    @property({ type: String }) word = ''
    @property({ type: String }) points = '0'
    @property({ type: String }) time = '00:00:00'
    @property({ type: String }) games = '0'
    @property({ type: String }) totalPoints = '0'
    @property({ type: String }) averagePoints = '0.00'
    @property({ type: String }) averageTime = '00:00:00'
    @property({ type: String }) streak = '0'
    @property({ type: String }) maxStreak = '0'
    @property({ type: String }) dicHref = '#'

    private onModalCloseClick = () => {
        this.dispatchEvent(
            new CustomEvent('modal-close', { bubbles: true, composed: true })
        )
    }

    private onShareClick = async (e: Event) => {
        const target = e.currentTarget as HTMLElement | null
        const buttonImg = target?.querySelector('img') || undefined
        buttonImg?.setAttribute('src', '/assets/loading.svg')

        await shareResult(words.getTodayWordIndex(), currentTry, getTodayTime())

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
            currentTry,
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
                            ${this.title}
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
