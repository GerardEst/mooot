import { supabase } from './supabase'

interface Log {
    type?: string
    message?: string
    details?: Object
}
export async function log({ type, message, details }: Log) {
    const { data, error: logError } = await supabase.from('front_logs').insert([
        {
            error:
                'Error sharing proposal: ' + message + JSON.stringify(details),
        },
    ])

    if (logError) {
        await supabase
            .from('front_logs')
            .insert([{ error: 'Error obtaining user error' }])
    }
}
