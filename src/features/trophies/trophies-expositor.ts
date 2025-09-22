import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { getUserId } from '@src/core/telegram'
import { getDetailedUserTrophies } from '@src/core/api/trophies'
import { global } from '@src/core/app-reset-styles'

@customElement('trophies-expositor')
export class TrophiesExpositor extends LitElement {
    static styles = [
        global,
        css`
            :host {
                display: block;
            }
            .expositor {
                display: flex;
                position: relative;
                flex-direction: column;
                gap: 0.5rem;
                padding: 30px;
                border-radius: 14px;
                background-color: var(--present-color);
                box-shadow: inset 0 0 3px 4px #00000017;
                &:before {
                    content: '';
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    width: calc(100% - 31px);
                    height: calc(100% - 31px);
                    border: 1px solid #d5b788;
                    background-color: #f1dd93;
                    border-radius: 8px;
                    box-shadow: inset 0 4px 19px 0 #0000004a,
                        0 0 4px 0px #0000002e;
                }
                &:after {
                    content: '';
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    width: calc(100% - 31px);
                    height: calc(100% - 31px);
                    border-left: 1px solid #ffffff80;
                    /* background-color: #ffffff24; */
                    border-radius: 8px;
                    z-index: 1;
                    border-top: 2px solid #ffffff8f;
                }
            }
            .league_emoji {
                display: flex;
                align-items: center;
                /* gap: 0.5rem; */
                overflow: hidden;
                border-radius: 10px;
                z-index: 1;
                border-bottom: 4px solid #00000054;
                border-top: 2px solid #ffffff87;
                box-shadow: 0 5px 4px 0px #0000002e;
                position: relative;
                &:before {
                    content: '🥇';
                    position: absolute;
                    top: -5px;
                    right: 6px;
                    z-index: 1;
                    font-size: 1.7rem;
                }
                &:after {
                    content: '';
                    position: absolute;
                    border-radius: 7px;
                    top: 4px;
                    left: 4px;
                    width: calc(100% - 12px);
                    height: calc(100% - 11px);
                }

                &.bronze:before {
                    content: '🥉';
                }
                &.silver:before {
                    content: '🥈';
                }
                &.gold:before {
                    content: '🥇';
                }
                &.bronze:after {
                    border: 2px solid #a18052;
                }
                &.silver:after {
                    border: 2px solid #bbdfed;
                }
                &.gold:after {
                    border: 2px solid #ffe762;
                }
                & span {
                    background: #ffffff30;
                    width: 50px;
                    aspect-ratio: 1;
                    display: grid;
                    place-content: center;
                    transform: rotate(16deg) scale(1.5);
                }
                p {
                    font-family: 'Libre Baskerville';
                }
                &.gold p {
                    color: #b3920e;
                }
                &.silver p {
                    color: #def6ff;
                }
                &.bronze p {
                    color: #655431;
                }
                &.gold {
                    background-color: #ffd941;
                }
                &.silver {
                    background-color: #aecad5;
                }
                &.bronze {
                    background-color: #b79155;
                }
            }
        `,
    ]

    @state()
    private userTrophies: any[] = []

    connectedCallback(): void {
        super.connectedCallback()

        this.loadUserTrophies()
    }

    private async loadUserTrophies() {
        const isDev = import.meta.env.DEV
        const devUserId = import.meta.env.VITE_DEV_USER_ID as string | undefined
        const userId = getUserId() || (isDev ? Number(devUserId) : undefined)
        if (!userId) return

        const userTrophies = await getDetailedUserTrophies(userId)
        if (!userTrophies) return

        this.userTrophies = userTrophies
    }

    // TODO - Afegir la lliga on s'han aconseguit, i a partir d'ara contra quanta gent i amb quants punts (s'ha de guardar a la db)

    render() {
        return html`
            <div class="expositor">
                ${this.userTrophies.map((trophy) => {
                    const category =
                        trophy.id.toString().at(-1) === '0'
                            ? 'gold'
                            : trophy.id.toString().at(-1) === '1'
                            ? 'silver'
                            : 'bronze'

                    return html` <div class="league_emoji ${category}">
                        <span>${trophy.emoji}</span>
                        <p>${trophy.name}</p>
                    </div>`
                })}
            </div>
        `
    }
}
