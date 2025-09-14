import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { supabase } from '@src/core/supabase'
import { getUserId } from '@src/core/telegram'
import { getUserTrophies } from '@src/core/api/trophies'
// import { leagues } from '@src/conf'
// import '@src/components/trophy-item'

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
            width: fit-content;
            margin-bottom: 1rem;
            margin: auto;
        }
        .header {
            padding-left: var(--left-space);
            display: flex;
            padding-bottom: 5px;
        }
        .header .header_column {
            flex: 1;
            display: flex;
            justify-content: center;
        }
        .league_section {
            display: flex;
            align-items: center;
        }
        .league_emoji {
            width: var(--left-space);
        }
        .league_trophies {
            display: flex;
            gap: 0.5rem;
        }
    `

    @state()
    private activeTrophyIds = new Set<number>()

    connectedCallback(): void {
        super.connectedCallback()

        this.loadUserTrophies()
    }

    private async loadUserTrophies() {
        const isDev = import.meta.env.DEV
        const devUserId = import.meta.env.VITE_DEV_USER_ID as string | undefined
        const userId = getUserId() || (isDev ? Number(devUserId) : undefined)

        if (!userId) return

        const userTrophies = await getUserTrophies(userId)

        console.log({ userTrophies })

        const nextActiveTrophyIds = new Set<number>()
        for (const trophy of userTrophies || []) {
            if (typeof trophy.trophy_id === 'number')
                nextActiveTrophyIds.add(trophy.trophy_id)
        }
        this.activeTrophyIds = nextActiveTrophyIds
    }

    render() {
        return html` <div class="expositor"></div> `
    }
}
