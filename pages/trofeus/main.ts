import { supabase } from '../../src/supabase'

const isDev = import.meta.env.DEV!
const devUserId = import.meta.env.VITE_DEV_USER_ID!

function getTelegramUserID() {
    if (!window.Telegram) return false

    const initData = window.Telegram.WebApp.initDataUnsafe
    const userId = initData.user.id

    return userId
}

function waitForTelegram() {
    return new Promise<void>((resolve) => {
        if (window.Telegram?.WebApp) {
            resolve()
        } else {
            let attempts = 0
            const maxAttempts = 30 // 3 seconds max
            const checkTelegram = () => {
                attempts++
                if (window.Telegram?.WebApp) {
                    resolve()
                } else if (attempts < maxAttempts) {
                    setTimeout(checkTelegram, 100)
                } else {
                    resolve()
                }
            }
            setTimeout(checkTelegram, 100)
        }
    })
}

async function init() {
    await waitForTelegram()

    const userId = getTelegramUserID()

    if (userId || isDev) {
        loadTrophiesFromUser(userId || devUserId)
    }
}

init()

async function loadTrophiesFromUser(userId: number) {
    const trophies = await getTrophiesFromUser(userId)
    if (!trophies) return

    for (let trohpy of trophies) {
        const trophyDOM = document.querySelector(`#t_${trohpy.trophy_id}`)
        trophyDOM?.classList.add('active')
    }

    console.log({ trophies })
}

async function getTrophiesFromUser(userId: number) {
    console.log({ userId })
    let { data: trophies_chats, error } = await supabase
        .from('trophies_chats')
        .select('*')
        .eq('user_id', userId)

    if (error) {
        console.error(error)
    }

    return trophies_chats
}

// function generateLayout() {
//     const expositor = document.querySelector('.expositor')

//     const league =
// }
