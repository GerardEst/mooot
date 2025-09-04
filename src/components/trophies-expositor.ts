import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { supabase } from '@src/supabase'
import '@src/components/trophy-item'

type League = {
    id: number
    emoji: string
    trophies: { id: number; emoji: string }[]
}

const leagues: League[] = [
    {
        id: 1,
        emoji: '⛄️',
        trophies: [
            { id: 11, emoji: '🥇' },
            { id: 12, emoji: '🥈' },
            { id: 13, emoji: '🥉' },
            { id: 15, emoji: '🥇' },
            { id: 16, emoji: '🥈' },
            { id: 17, emoji: '🥉' },
        ],
    },
    {
        id: 2,
        emoji: '🐥',
        trophies: [
            { id: 21, emoji: '🥇' },
            { id: 22, emoji: '🥈' },
            { id: 23, emoji: '🥉' },
            { id: 25, emoji: '🥇' },
            { id: 26, emoji: '🥈' },
            { id: 27, emoji: '🥉' },
        ],
    },
    {
        id: 3,
        emoji: '🌻',
        trophies: [
            { id: 31, emoji: '🥇' },
            { id: 32, emoji: '🥈' },
            { id: 33, emoji: '🥉' },
            { id: 35, emoji: '🥇' },
            { id: 36, emoji: '🥈' },
            { id: 37, emoji: '🥉' },
        ],
    },
    {
        id: 4,
        emoji: '🐉',
        trophies: [
            { id: 41, emoji: '🥇' },
            { id: 42, emoji: '🥈' },
            { id: 43, emoji: '🥉' },
            { id: 45, emoji: '🥇' },
            { id: 46, emoji: '🥈' },
            { id: 47, emoji: '🥉' },
        ],
    },
    {
        id: 5,
        emoji: '⚡',
        trophies: [
            { id: 51, emoji: '🧔🏼' },
            { id: 52, emoji: '⛈️' },
            { id: 53, emoji: '☂️' },
            { id: 55, emoji: '🥇' },
            { id: 56, emoji: '🥈' },
            { id: 57, emoji: '🥉' },
        ],
    },
    {
        id: 6,
        emoji: '🍈',
        trophies: [
            { id: 61, emoji: '🍈' },
            { id: 62, emoji: '🍈' },
            { id: 63, emoji: '🥥' },
            { id: 65, emoji: '🥇' },
            { id: 66, emoji: '🥈' },
            { id: 67, emoji: '🥉' },
        ],
    },
    {
        id: 7,
        emoji: '💨',
        trophies: [
            { id: 71, emoji: '🐫' },
            { id: 72, emoji: '🌵' },
            { id: 73, emoji: '🦗' },
            { id: 75, emoji: '🐆' },
            { id: 76, emoji: '🦏' },
            { id: 77, emoji: '🐖' },
        ],
    },
    {
        id: 8,
        emoji: '💃🏻',
        trophies: [
            { id: 81, emoji: '🥃' },
            { id: 82, emoji: '🍺' },
            { id: 83, emoji: '🍹' },
            { id: 85, emoji: '🧨' },
            { id: 86, emoji: '🌷' },
            { id: 87, emoji: '💥' },
        ],
    },
    {
        id: 9,
        emoji: '💛',
        trophies: [
            { id: 91, emoji: '🌾' },
            { id: 92, emoji: '👫🏻' },
            { id: 93, emoji: '💩' },
            { id: 95, emoji: '🖐🏼' },
            { id: 96, emoji: '🤝🏼' },
            { id: 97, emoji: '🪈' },
        ],
    },
    {
        id: 10,
        emoji: '🌰',
        trophies: [
            { id: 101, emoji: '🥇' },
            { id: 102, emoji: '🥈' },
            { id: 103, emoji: '🥉' },
            { id: 105, emoji: '🥇' },
            { id: 106, emoji: '🥈' },
            { id: 107, emoji: '🥉' },
        ],
    },
    {
        id: 11,
        emoji: '🪰',
        trophies: [
            { id: 111, emoji: '🥇' },
            { id: 112, emoji: '🥈' },
            { id: 113, emoji: '🥉' },
            { id: 115, emoji: '🥇' },
            { id: 116, emoji: '🥈' },
            { id: 117, emoji: '🥉' },
        ],
    },
    {
        id: 12,
        emoji: '🐫',
        trophies: [
            { id: 121, emoji: '🥇' },
            { id: 122, emoji: '🥈' },
            { id: 123, emoji: '🥉' },
            { id: 125, emoji: '🥇' },
            { id: 126, emoji: '🥈' },
            { id: 127, emoji: '🥉' },
        ],
    },
]

@customElement('trophies-expositor')
export class TrophiesExpositor extends LitElement {
    static styles = css``

    createRenderRoot() {
        // Render in light DOM so page CSS applies
        return this
    }

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
        const userId = this.getTelegramUserId() || (isDev ? Number(devUserId) : undefined)
        if (!userId) return
        const { data: trophiesChats, error } = await supabase
            .from('trophies_chats')
            .select('*')
            .eq('user_id', userId)
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
        return html`
            <div class="expositor">
                ${this.renderHeader()} ${leagues.map(
                    (league) => html`
                        <div id="league_${league.id}" class="league_section">
                            <div class="league_emoji">${league.emoji}</div>
                            <div class="league_trophies">
                                ${league.trophies.map(
                                    (trophy) => html`
                                        <trophy-item
                                            .trophyId=${trophy.id}
                                            .emoji=${trophy.emoji}
                                            .active=${this.activeTrophyIds.has(
                                                trophy.id
                                            )}
                                        ></trophy-item>
                                    `
                                )}
                            </div>
                        </div>
                    `
                )}
            </div>
        `
    }
}
