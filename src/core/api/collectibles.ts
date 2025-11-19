import { supabase } from "@src/core/supabase"
import { getUserId } from "@src/core/telegram";
import { CollectibleInterface } from "@src/features/game/services/collectibles-controller";

export async function saveUserCollectible(collectibleId: number) {
    const userId = getUserId()

    try {
        if (!userId) throw 'user dont exist'
        if (!collectibleId) throw 'collectible dont exist'

        const { data, error } = await supabase
            .from('users_collectibles')
            .upsert({ user_id: userId, collectible_id: collectibleId })

        if (error) throw error
    } catch (error) {
        console.error(error)
    }
}

export async function getUserCollectibles() {
    const userId = getUserId()

    try {
        if (!userId) throw 'user dont exist'

        const { data: collectiblesIds, error } = await supabase
            .from('users_collectibles')
            .select('collectible_id')
            .eq('user_id', userId)

        if (error) throw error

        return collectiblesIds.map(collectible => collectible.collectible_id) as unknown as number[]
    } catch (error) {
        console.error(error)
    }
}

export async function getAllCollectibles() {
    // TODO - Cachejar això

    try {
        const { data: collectibles, error } = await supabase
            .from('collectibles')
            .select('*')

        if (error) throw error

        return collectibles as unknown as CollectibleInterface[]
    } catch (error) {
        console.error(error)
    }
}