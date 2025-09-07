import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { supabase } from '@src/supabase'
import { AWARDS } from '@src/conf'

@customElement('user-trophies')
export class UserTrophies extends LitElement {
    static styles = css`
        .userTrophies {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
        }
    `

    @state()
    private userTrophies: any

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

    private async loadUserTrophies() {
        const isDev = import.meta.env.DEV
        const devUserId = import.meta.env.VITE_DEV_USER_ID as string | undefined
        const userId =
            this.getTelegramUserId() || (isDev ? Number(devUserId) : undefined)
        if (!userId) return
        const { data: trophiesChats, error } = await supabase
            .from('trophies_chats')
            .select('*')
            .eq('user_id', userId)

        if (error) {
            console.error(error)
            return
        }

        this.userTrophies = trophiesChats
    }

    render() {
        return html`
            <div class="userTrophies">
                ${this.userTrophies?.map((trophy: any) => {
                    const position = trophy.trophy_id.toString().at(-1)
                    const trophyInfo = AWARDS.cat.find(
                        (award) => award.id === trophy.trophy_id
                    )
                    if (!trophyInfo) return

                    return html`
                        <trophy-badge
                            position=${position}
                            name=${trophyInfo.name}
                            emoji=${trophyInfo.emoji}
                        ></trophy-badge>
                    `
                })}
            </div>
        `
    }
}
