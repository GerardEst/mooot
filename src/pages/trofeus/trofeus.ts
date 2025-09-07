import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { supabase } from '@src/supabase'
// import { leagues } from '@src/conf'
import '@src/components/trophy-item'

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

    private getTelegramUserId(): number | false {
        const telegramWindow = window as any
        const initData = telegramWindow?.Telegram?.WebApp?.initDataUnsafe
        const userId = initData?.user?.id
        return userId || false
    }

    private waitForTelegram(): Promise<void> {
        return new Promise((resolve) => {
            const telegramWindow = window as any
            if (telegramWindow?.Telegram?.WebApp) return resolve()
            let attempts = 0
            const maxAttempts = 30
            const check = () => {
                attempts++
                if (telegramWindow?.Telegram?.WebApp || attempts >= maxAttempts)
                    return resolve()
                setTimeout(check, 100)
            }
            setTimeout(check, 100)
        })
    }

    private async loadUserTrophies() {
        await this.waitForTelegram()
        const isDev = import.meta.env.DEV
        const devUserId = import.meta.env.VITE_DEV_USER_ID as string | undefined
        const userId =
            this.getTelegramUserId() || (isDev ? Number(devUserId) : undefined)
        if (!userId) return
        const { data: trophiesChats, error } = await supabase
            .from('trophies_chats')
            .select('*')
            .eq('user_id', userId)

        console.log({ trophiesChats })

        if (error) {
            console.error(error)
            return
        }
        const nextActiveTrophyIds = new Set<number>()
        for (const trophy of trophiesChats || []) {
            if (typeof trophy.trophy_id === 'number')
                nextActiveTrophyIds.add(trophy.trophy_id)
        }
        this.activeTrophyIds = nextActiveTrophyIds
    }

    private renderHeader() {
        return html`
            <div class="header">
                <div class="header_column">⭐️</div>
                <div class="header_column">⚡️</div>
            </div>
        `
    }

    render() {
        return html` <div class="expositor">${this.renderHeader()}</div> `
    }
}
