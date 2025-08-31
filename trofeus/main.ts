import { log } from '../src/logs'
import { supabase } from '../src/supabase'

const isDev = import.meta.env.DEV!
const devUserId = import.meta.env.VITE_DEV_USER_ID!

log({ message: 'hola' })

function isFromTelegram() {
    log({ details: window.Telegram })

    if (!window.Telegram) return false

    log({ details: window.Telegram.WebApp })

    const initData = window.Telegram.WebApp.initDataUnsafe

    log({ message: 'Check isFromTelegram', details: initData })

    const isFromTelegram = initData && (initData.user || initData.chat_type)

    if (initData.user) {
        document.querySelector('userId')!.textContent =
            initData.user.id.toString()
    }

    return isFromTelegram
}

function waitForTelegram() {
    return new Promise<void>((resolve) => {
        if (window.Telegram?.WebApp) {
            resolve()
        } else {
            const checkTelegram = () => {
                if (window.Telegram?.WebApp) {
                    resolve()
                } else {
                    setTimeout(checkTelegram, 100)
                }
            }
            setTimeout(checkTelegram, 100)
        }
    })
}

async function init() {
    await waitForTelegram()
    
    if (isFromTelegram() || isDev) {
        // Call per pillar els premis de l'usuari
        // Potser només en aquet xat, potser a tots?
        const activeUserId =
            window.Telegram?.WebApp?.initDataUnsafe.user?.id || devUserId

        log({ details: devUserId })
        loadTrophiesFromUser(activeUserId)
    }
}

init()

async function loadTrophiesFromUser(userId: number) {
    log({ details: 'wtf' })

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
