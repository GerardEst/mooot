import { supabase } from '../src/supabase'

console.log('trofeus')

function isFromTelegram() {
    const initData = window.Telegram.WebApp.initDataUnsafe
    const isFromTelegram = initData && (initData.user || initData.chat_type)

    return isFromTelegram
}

if (isFromTelegram()) {
    // Call per pillar els premis de l'usuari
    // Potser només en aquet xat, potser a tots?
    putTrophies()
}

async function putTrophies() {
    const trophies = await getTrophiesFromUser(
        window.Telegram.WebApp.initDataUnsafe.user_id
    )
    if (!trophies) return

    for (let trohpy of trophies) {
        const trophyDOM = document.querySelector(`#${trohpy.trophy_id}`)
        trophyDOM?.classList.add('active')
    }

    console.log({ trophies })
}

async function getTrophiesFromUser(userId: number) {
    let { data: trophies_chats, error } = await supabase
        .from('trophies_chats')
        .select('*')
        .eq('user_id', userId)

    return trophies_chats
}

// function generateLayout() {
//     const expositor = document.querySelector('.expositor')

//     const league =
// }
