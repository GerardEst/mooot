import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { getUserId } from '@src/core/telegram'
import { getDetailedUserTrophies } from '@src/core/api/trophies'

@customElement('trophies-expositor')
export class TrophiesExpositor extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
        .expositor {
            --left-space: 40px;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    `

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

    render() {
        return html`
            <div class="expositor">
                ${this.userTrophies.map((trophy) => {
                    return html` <div class="league_emoji">
                        <span>${trophy.emoji}</span>
                        <p>${trophy.name}</p>
                    </div>`
                })}
            </div>
        `
    }
}
