import { supabase } from '../supabase'
import { AWARDS } from '../conf'

export async function getUserTrophies(userId: number) {
    console.log('Supabase - Get user trophies')
    try {
        const { data: trophiesChats, error } = await supabase
            .from('trophies_chats')
            .select('*')
            .eq('user_id', userId)

        if (error) throw error

        return trophiesChats
    } catch (error) {
        console.error(error)
    }
}

export async function getDetailedUserTrophies(userId: number) {
    const trophies = await getUserTrophies(userId)
    if (!trophies) return []

    return trophies.map((trophy) => {
        const trophyDetails = getTrophyFromId(trophy.trophy_id.toString())
        return {
            ...trophy,
            ...trophyDetails,
        }
    })
}

function getTrophyFromId(trophyId: string) {
    return AWARDS.cat.find((trophy) => trophy.id.toString() === trophyId)
}
