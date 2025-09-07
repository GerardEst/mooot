import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as words from '@src/words-module.js'
import {
    runStorageCheck,
    loadStoredGame,
    getTodayTime,
} from '@src/storage-module.js'
import * as gameboard from '@src/gameboard-module.ts'
import { shareResult } from '@src/share-utils.ts'
import { closeModal } from '@src/dom-utils.ts'
import { game } from './style'
import { global } from '@src/pages/global-styles'

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
        this.initDOMEvents()
        loadStoredGame()
    }

    private initDOMEvents() {
        const root = this.renderRoot as DocumentFragment
        const keys = root.querySelectorAll('.keyboard__key')
        const backspace = root.querySelector('.keyboard__back')
        const enter = root.querySelector('.keyboard__enter')
        const shareButton = root.querySelector('#share')
        const shareHiddenButton = root.querySelector('#shareHidden')
        const modalCloseButton = root.querySelector('#modal-close')

        keys.forEach((key) => {
            key.addEventListener('click', (event: Event) => {
                const target = event.target as HTMLElement
                if (target.dataset.key) {
                    gameboard.letterClick(target.dataset.key)
                }
            })
        })

        backspace?.addEventListener('click', () => {
            gameboard.deleteLastLetter()
        })

        enter?.addEventListener('click', () => {
            gameboard.validateLastRow()
        })

        // Share events
        shareButton?.addEventListener('click', async () => {
            const buttonImg = shareButton?.querySelector('img')
            buttonImg?.setAttribute('src', '/assets/loading.svg')

            await shareResult(
                words.getTodayWordIndex(),
                gameboard.currentTry,
                getTodayTime()
            )

            setTimeout(() => {
                buttonImg?.setAttribute('src', '/assets/share.svg')
            }, 1000)
        })

        shareHiddenButton?.addEventListener('click', async () => {
            const buttonImg = shareHiddenButton?.querySelector('img')
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
        })

        // Modal events
        modalCloseButton?.addEventListener('click', closeModal)
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

                <section class="keyboard">
                    <div class="keyboard__row">
                        <div class="keyboard__key" data-key="Q">Q</div>
                        <div class="keyboard__key" data-key="W">W</div>
                        <div class="keyboard__key" data-key="E">E</div>
                        <div class="keyboard__key" data-key="R">R</div>
                        <div class="keyboard__key" data-key="T">T</div>
                        <div class="keyboard__key" data-key="Y">Y</div>
                        <div class="keyboard__key" data-key="U">U</div>
                        <div class="keyboard__key" data-key="I">I</div>
                        <div class="keyboard__key" data-key="O">O</div>
                        <div class="keyboard__key" data-key="P">P</div>
                    </div>
                    <div class="keyboard__row">
                        <div class="keyboard__key" data-key="A">A</div>
                        <div class="keyboard__key" data-key="S">S</div>
                        <div class="keyboard__key" data-key="D">D</div>
                        <div class="keyboard__key" data-key="F">F</div>
                        <div class="keyboard__key" data-key="G">G</div>
                        <div class="keyboard__key" data-key="H">H</div>
                        <div class="keyboard__key" data-key="J">J</div>
                        <div class="keyboard__key" data-key="K">K</div>
                        <div class="keyboard__key" data-key="L">L</div>
                        <div class="keyboard__key" data-key="Ç">Ç</div>
                    </div>
                    <div class="keyboard__row">
                        <div
                            class="keyboard__enter keyboard__key--wide"
                            data-key="enter"
                        >
                            <img alt="Intro teclat" src="/assets/intro.svg" />
                        </div>
                        <div class="keyboard__key" data-key="Z">Z</div>
                        <div class="keyboard__key" data-key="X">X</div>
                        <div class="keyboard__key" data-key="C">C</div>
                        <div class="keyboard__key" data-key="V">V</div>
                        <div class="keyboard__key" data-key="B">B</div>
                        <div class="keyboard__key" data-key="N">N</div>
                        <div class="keyboard__key" data-key="M">M</div>
                        <div
                            class="keyboard__back keyboard__key--wide"
                            data-key="back"
                        >
                            <img
                                alt="Esborrar teclat"
                                src="/assets/backspace.svg"
                            />
                        </div>
                    </div>
                </section>

                <section class="modal modal-win">
                    <div class="modal__content">
                        <div class="header">
                            <h2 id="stats-title" class="modal__title">...</h2>
                            <img
                                alt="Tancar modal"
                                id="modal-close"
                                class="modal__content__close"
                                src="/assets/close.svg"
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
                            <button class="button--danger" id="shareHidden">
                                Compartir sense cubs
                                <img alt="Ocult" src="/assets/hidden_eye.svg" />
                            </button>
                            <button id="share">
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
