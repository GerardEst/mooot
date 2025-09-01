import { supabase } from './supabase'

interface Log {
    type?: string
    message?: string
    details?: any
    userId?: number
}
export async function supalog({ type, message, details }: Log) {
    const { data, error: logError } = await supabase.from('front_logs').insert([
        {
            error: message + ' | ' + JSON.stringify(details),
        },
    ])

    if (logError) {
        await supabase
            .from('front_logs')
            .insert([{ error: 'Error obtaining user error' }])
    }
}
