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

        // Order trophies by last digit of ID (1 is gold, 2 is silver, 3 is bronze)
        const orderedTrophies = [...trophiesChats].sort((a, b) => {
            const getLastDigit = (value: unknown) => {
                const numericId = Number.parseInt(String(value), 10)
                return Number.isNaN(numericId) ? 0 : numericId % 10
            }

            const lastDigitA = getLastDigit(a.trophy_id)
            const lastDigitB = getLastDigit(b.trophy_id)

            if (lastDigitA === lastDigitB) {
                const numericA = Number.parseInt(String(a.trophy_id), 10)
                const numericB = Number.parseInt(String(b.trophy_id), 10)
                if (!Number.isNaN(numericA) && !Number.isNaN(numericB)) {
                    return numericA - numericB
                }
                return String(a.trophy_id).localeCompare(String(b.trophy_id))
            }

            return lastDigitA - lastDigitB
        })

        return orderedTrophies
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
