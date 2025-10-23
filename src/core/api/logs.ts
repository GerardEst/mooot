import { supabase } from '@src/core/supabase'
import { getUserFirstName, getUserId } from '../telegram'

interface Log {
    type: string | LoggableFeatures
    message?: string
    details?: object
    userId?: number
}

type LoggableFeatures =
    | 'feature_crono'
    | 'feature_menu'
    | 'feature_tapToWrite'

async function logToDatabase({
    type,
    message,
    details,
}: Log) {
    try {
        const { error } = await supabase
            .schema('analytics')
            .from('front_logs')
            .insert([
                {
                    type,
                    error: message,
                    details: { userName: getUserFirstName(), ...details },
                    user_id: getUserId(),
                },
            ])

        if (error) {
            await supabase
                .from('front_logs')
                .insert([{ error: 'Error obtaining user error' }])
        }
    } catch (error) {
        console.log(error)
    }
}

export const supalog = {
    feature: (type: LoggableFeatures, message?: string, details?: Object) => {
        logToDatabase({ type, message, details })
    },
    error: (type: string, message: string, details?: Object) => {
        logToDatabase({ type, message, details })
    },
    buttonClick: (buttonLabel: string) => {
        logToDatabase({ type: 'buttonClick', message: buttonLabel })
    }
}
