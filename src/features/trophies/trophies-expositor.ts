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
                --left-space: 40px;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .league_emoji {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                border-radius: 10px;
                padding: 1rem;
                &.gold {
                    background-color: var(--gold);
                }
                &.silver {
                    background-color: var(--silver);
                }
                &.bronze {
                    background-color: var(--bronze);
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
