import { supabase } from "../supabase"
import { supalog } from "./logs"

let isUserTester: boolean | null = null

export async function getIsUserTester(userId: number | boolean) {
    if (isUserTester) return isUserTester

    try {
        const { data, error } = await supabase
            .from('users')
            .select('tester')
            .eq('id', userId)
            .eq('tester', true)
            .single()

        if (error) throw error

        isUserTester = data.tester
        return data.tester

    } catch (error) {
        supalog.error('cant get user tester status', { error: error })
    }
}