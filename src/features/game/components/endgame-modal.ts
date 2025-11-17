import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as words from '@src/features/game/services/words-service.js'
import { getTodayTime } from '@src/shared/utils/storage-utils.js'
import { shareResult } from '@src/shared/utils/share-utils'
import { modalStyles } from './endgame-modal.style'
import { global } from '@src/core/app-reset-styles'

import '@src/shared/components/button-mooot'
import '@src/shared/components/stat-display'
import '@src/shared/components/collectible'

import { CollectiblesController } from '../services/collectibles-controller'
import { repeat } from 'lit/directives/repeat.js'


@customElement('mooot-endgame-modal')
export class MoootEndgameModal extends LitElement {
    static styles = [global, modalStyles]
    private collectibles = new CollectiblesController(this);

    @property({ type: String }) points = '0'
    @property({ type: String }) time = '00:00:00'
    @property({ type: Boolean }) active = false
    @property({ type: Number }) currentTry = 0

    @property({ type: String }) private modalTitle = '...'
    @property({ type: String }) private word = ''
    @property({ type: String }) private dicHref = '#'

    @property({ type: Boolean }) private sharing = false
    @property({ type: Boolean }) private sharingOpen = false

    async firstUpdated() {
        this.fillStats()
        await this.collectibles.grantCollectiblesToUser()
        this.revealCollectibles()
    }

    private async fillStats() {
        this.word = (await words.getTodayNiceWord()) || ''
        this.modalTitle = this.computeTitle(Number(this.points))
        this.dicHref = this.buildDicUrl(this.word)
    }

    protected async updated(changed: Map<string, unknown>) {
        if (changed.has('points')) {
            this.modalTitle = this.computeTitle(Number(this.points))
        }
        if (changed.has('active') && this.active && this.collectibles.activeTestingFeatures) {
            this.collectibles.grantCollectiblesToUser()
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

    private revealCollectibles() {
        for (let i = 1; i <= this.collectibles.userCollectibles?.length; i++) {
            setTimeout(() => {
                this.collectibles.userCollectibles[i - 1].revealed = true
                this.requestUpdate()
            }, 500 * i)
        }
    }

    private onModalCloseClick = () => {
        this.dispatchEvent(
            new CustomEvent('modal-close', { bubbles: true, composed: true })
        )
    }

    private onShareClick = async () => {
        this.sharingOpen = true

        await shareResult(
            words.getTodayWordIndex(),
            this.currentTry,
            getTodayTime()
        )

        setTimeout(() => {
            this.sharingOpen = false
        }, 1000)
    }

    private onShareHiddenClick = async () => {
        this.sharing = true

        await shareResult(
            words.getTodayWordIndex(),
            this.currentTry,
            getTodayTime(),
            true
        )

        setTimeout(() => {
            this.sharing = false
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
                                key="streak"
                                name="Ratxa actual"
                            ></stat-display>
                            <stat-display
                                key="maxStreak"
                                name="Ratxa màxima"
                            ></stat-display>
                        </div>
                    </section>
                    ${this.collectibles.activeTestingFeatures && this.collectibles.userCollectibles ? html`
                        <section class="collectibles">
                            ${repeat(
            this.collectibles.userCollectibles,
            (item, index) => `${item.id}_${index}`,
            item => html`
                            <mooot-collectible
                                id="collectible_${item.id}"
                                .collectibleData=${item}
                                ?revealed=${item.revealed}
                            ></mooot-collectible>
                            `
        )}
                            </section>    
                    `: null}
                    <div class="modal__buttons">
                        <button-mooot
                            @button-click="${(e: Event) =>
                this.onShareHiddenClick()}"
                            label="Compartir sense cubs"
                            ?fillContainer=${true}
                            borders="5px 5px 5px 14px"
                        >
                            <img
                                slot="icon"
                                alt="Ocult"
                                width="12"
                                src="${this.sharing
                ? '/assets/loading.svg'
                : '/assets/hidden_eye.svg'}"
                            />
                        </button-mooot>
                        <button-mooot
                            @button-click="${(e: Event) => this.onShareClick()}"
                            label="Compartir"
                            ?fillContainer=${true}
                            borders="5px 5px 14px 5px"
                        >
                            <img
                                slot="icon"
                                alt="Compartir"
                                width="12"
                                src="${this.sharingOpen
                ? '/assets/loading.svg'
                : '/assets/share.svg'}"
                            />
                        </button-mooot>
                    </div>
                </div>
            </section>
        `
    }
}
