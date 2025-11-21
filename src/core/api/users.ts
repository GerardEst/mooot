import { supabase } from "../supabase"

let isUserTester: boolean | null = null
let inFlightRequest: Promise<boolean | null> | null = null

export async function getIsUserTester(userId: number | boolean) {

    /**
     * In-flight request deduplication (dedupe)
     *  
     * Per assegurar-nos de que només fem una request encara que es demani múltiples vegades, 
     * (al ser async potser encara no hem rebut la primera que ja estem demanant l'altra), el 
     * que fem és guardar LA PROMESA com a inflight, i retornem això quan existeix, és a dir quan
     * tenim una request en marxa. Com que retornem la promesa, a la que es resolgui, es resoldrà
     * per tots les que l'estan esperant.
     */

    if (inFlightRequest) return inFlightRequest

    inFlightRequest = (async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('tester')
                .eq('id', userId)
                .eq('tester', true)
                .single()

            if (error) throw error

            isUserTester = data.tester
            return isUserTester

        } catch (error) {
            throw error
        } finally {
            inFlightRequest = null
        }
    })()

    return inFlightRequest;
}