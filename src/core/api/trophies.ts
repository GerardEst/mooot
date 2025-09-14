import { supabase } from '../supabase'

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
