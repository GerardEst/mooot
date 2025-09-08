import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as words from '@src/words-module.js'
import {
    runStorageCheck,
    loadStoredGame,
    getTodayTime,
} from '@src/storage-module.js'
import * as gameboard from '@src/features/game/gameboard-module'
import { shareResult } from '@src/shared/utils/share-utils'
import { closeModal } from '@src/shared/utils/dom-utils'
import { game } from './style'
import { global } from '@src/pages/global-styles'
import './components/keyboard'

declare global {
    interface Window {
        Telegram: any
    }
}

function isFromTelegram() {
    const initData = window?.Telegram?.WebApp?.initDataUnsafe
    const isFromTelegram = initData && (initData.user || initData.chat_type)
    return Boolean(isFromTelegram)
}

@customElement('mooot-joc-game')
export class MoootJocGame extends LitElement {
    static styles = [global, game]

    connectedCallback(): void {
        super.connectedCallback()
        runStorageCheck()
        document.addEventListener('visibilitychange', this.onVisibility)

        const isDev = import.meta.env.DEV
        console.log({ isDev })
        if (isFromTelegram() || isDev) {
            this.init()
        }
    }

    disconnectedCallback(): void {
        document.removeEventListener('visibilitychange', this.onVisibility)
        super.disconnectedCallback()
    }

    private onVisibility = () => {
        if (!document.hidden) runStorageCheck()
    }

    private init() {
        loadStoredGame()
    }

    letterClick(e: CustomEvent) {
        console.log(e.detail.letter)

        gameboard.letterClick(e.detail.letter)
    }

    backClick() {
        console.log('back clicked')

        gameboard.deleteLastLetter()
    }

    enterClick() {
        console.log('enter clicked')

        gameboard.validateLastRow()
    }

    // LitElement-scoped DOM update for cells
    updateCell(
        row: number,
        col: number,
        text?: string,
        status?: 'correct' | 'present' | 'absent'
    ) {
        const cell = this.renderRoot.querySelector(
            `#l${row}_${col}`
        ) as HTMLElement | null
        if (!cell) return
        if (text !== undefined) cell.textContent = text
        if (status) cell.classList.add(status)
    }

    private onShareClick = async (e: Event) => {
        const target = e.currentTarget as HTMLElement | null
        const buttonImg = target?.querySelector('img') || undefined
        buttonImg?.setAttribute('src', '/assets/loading.svg')

        await shareResult(
            words.getTodayWordIndex(),
            gameboard.currentTry,
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
            gameboard.currentTry,
            getTodayTime(),
            true
        )

        setTimeout(() => {
            buttonImg?.setAttribute('src', '/assets/hidden_eye.svg')
        }, 1000)
    }

    private onModalCloseClick = () => {
        closeModal()
    }

    render() {
        return html`
            <div class="game">
                <section class="feedback">
                    <p>...</p>
                </section>
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
                    @letter-clicked="${(e: CustomEvent) => this.letterClick(e)}"
                    @back-clicked="${() => this.backClick()}"
                    @enter-clicked="${() => this.enterClick()}"
                ></mooot-keyboard>

                <section class="modal modal-win">
                    <div class="modal__content">
                        <div class="header">
                            <h2 id="stats-title" class="modal__title">...</h2>
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
                                <a id="dicLink" target="_blank" href="#"
                                    ><span id="stats-word"></span>
                                    <img
                                        alt="Obrir en una pestanya nova"
                                        src="/assets/open-external.svg"
                                /></a>
                            </div>
                            <div class="pointedRow">
                                <p>Punts</p>
                                <span></span>
                                <p>+<span id="stats-points"></span></p>
                            </div>
                            <div class="pointedRow">
                                <p>Temps</p>
                                <span></span>
                                <p><span id="stats-time"></span></p>
                            </div>
                        </section>
                        <section class="stats">
                            <div class="pointedRow">
                                <p>Partides jugades</p>
                                <span></span>
                                <p id="stats-games"></p>
                            </div>
                            <div class="pointedRow">
                                <p>Punts totals</p>
                                <span></span>
                                <p id="stats-totalPoints"></p>
                            </div>
                            <div class="pointedRow">
                                <p>Mitjana de punts</p>
                                <span></span>
                                <p id="stats-averagePoints"></p>
                            </div>
                            <div class="pointedRow">
                                <p>Mitjana de temps</p>
                                <span></span>
                                <p id="stats-averageTime"></p>
                            </div>
                            <div class="pointedRow">
                                <p>Ratxa actual</p>
                                <span></span>
                                <p id="stats-streak"></p>
                            </div>
                            <div class="pointedRow">
                                <p>Ratxa màxima</p>
                                <span></span>
                                <p id="stats-maxStreak"></p>
                            </div>
                        </section>
                        <div class="modal__buttons">
                            <button
                                class="button--danger"
                                id="shareHidden"
                                @click="${(e: Event) =>
                                    this.onShareHiddenClick(e)}"
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
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mooot-joc-game': MoootJocGame
    }
}
