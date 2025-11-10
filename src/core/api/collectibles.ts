import { supabase } from "@src/core/supabase"
import { getUserId } from "@src/core/telegram";

export async function saveUserCollectible(collectibleId: number) {
    const userId = getUserId()

    try {
        if (!userId) throw 'user dont exist'
        if (!collectibleId) throw 'collectible dont exist'

        const { data, error } = await supabase
            .from('users_collectibles')
            .upsert({ user_id: userId, collectible_id: collectibleId })
            .select()

        if (error) throw error
    } catch (error) {
        console.error(error)
    }
}