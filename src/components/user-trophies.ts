import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { supabase } from '@src/supabase'
import '@src/components/trophy-item'

@customElement('user-trophies')
export class UserTrophies extends LitElement {
    static styles = css``

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

    // private waitForTelegram(): Promise<void> {
    //     return new Promise((resolve) => {
    //         const telegramWindow = window as any
    //         if (telegramWindow?.Telegram?.WebApp) return resolve()
    //         let attempts = 0
    //         const maxAttempts = 30
    //         const check = () => {
    //             attempts++
    //             if (telegramWindow?.Telegram?.WebApp || attempts >= maxAttempts)
    //                 return resolve()
    //             setTimeout(check, 100)
    //         }
    //         setTimeout(check, 100)
    //     })
    // }

    private async loadUserTrophies() {
        //await this.waitForTelegram()
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

        this.userTrophies = trophiesChats
    }

    render() {
        return html`
            <div>
                ${this.userTrophies?.map((trophy: any) => {
                    console.log(trophy)
                    return html`
                        <trophy-item trophyId=${trophy.trophy_id}></trophy-item>
                    `
                })}
            </div>
        `
    }
}
