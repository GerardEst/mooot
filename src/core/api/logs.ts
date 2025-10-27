import { supabase } from '@src/core/supabase'
import { getUserFirstName, getUserId } from '../telegram'

interface Log {
    type: string | LoggableFeatures | UserOutsider
    message?: string
    details?: object
    userId?: number
}

// TODO - Implementar observabilitat d'usuaris que marxen i tornen 
type UserOutsider =
    | 'user_leaves_without_ending'
    | 'user_returns'

type LoggableFeatures =
    | 'feature_crono'
    | 'feature_menu'
    | 'feature_tapToWrite'

let tapToWriteHasBeenLogged = false

async function logToDatabase({
    type,
    message,
    details,
}: Log) {
    // Si es tapToWrite, volem loguejar només un cop per cada conjunt d'accions
    // Es a dir, si l'usuari activa un altre log i després torna a fer servir tapToWrite,
    // tornem a loguejar-lo. Així no tenim 50 events quan algú juga però veiem si fa altres
    // coses pel mig
    if (message === 'feature_tapToWrite' && tapToWriteHasBeenLogged) return
    tapToWriteHasBeenLogged = message === 'feature_tapToWrite'

    try {
        const { error } = await supabase
            .schema('analytics')
            .from('front_logs')
            .insert([
                {
                    type,
                    details: { userName: getUserFirstName(), ...details },
                    message,
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
    feature: (feature: LoggableFeatures, details?: string) => {
        logToDatabase({ type: 'feature', message: feature, details: { details } })
    },
    error: (message: string, details?: Object) => {
        logToDatabase({ type: 'error', message, details })
    },
    buttonClick: (buttonLabel: string) => {
        logToDatabase({ type: 'buttonClick', message: buttonLabel })
    }
}
