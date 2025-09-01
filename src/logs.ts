import { supabase } from './supabase'

interface Log {
    type?: string
    message?: string
    details?: Object
    userId?: number
}
export async function supalog({ type, message, details, userId }: Log) {
    const { data, error: logError } = await supabase.from('front_logs').insert([
        {
            type,
            error: message,
            details,
            user_id: userId,
        },
    ])

    if (logError) {
        await supabase
            .from('front_logs')
            .insert([{ error: 'Error obtaining user error' }])
    }
}
