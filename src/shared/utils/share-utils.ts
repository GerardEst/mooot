import { supalog } from '@src/core/api/logs'
import type { storedRow } from '@src/shared/utils/storage-utils'
import * as words from '@src/features/game/services/words-service.js'
import { computeStatuses } from '@src/shared/utils/hints-utils'
import { isFromTelegram } from '@src/core/telegram'

function readStoredRows(): storedRow[] {
    try {
        const raw = localStorage.getItem('moootGameData')
        if (!raw) return []
        const rows: storedRow[] = JSON.parse(raw)
        // Ensure ascending order by row index just in case
        return rows.sort((a, b) => a.row - b.row)
    } catch {
        return []
    }
}

function statusesToEmoji(statuses: ReturnType<typeof computeStatuses>): string {
    return statuses
        .map((s) => (s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬜️'))
        .join('')
}

function buildResultPatternFromRows(
    rows: storedRow[],
    tries: number,
    target: string
) {
    let result = ''
    const count = Math.min(rows.length, tries === 7 ? 6 : tries)
    for (let i = 0; i < count; i++) {
        const guess = rows[i].word || ''
        const pattern = statusesToEmoji(computeStatuses(guess, target))
        result += pattern + '\n'
    }
    return result
}

export async function shareResult(
    wordIndex: number,
    tries: number,
    time: string,
    hidden = false
) {
    try {
        // Ensure words data is loaded so we can compute the grid purely
        await words.loadWordsData({ inLeagues: isFromTelegram() })

        // Get the current user ID from Telegram
        const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id

        if (!userId) {
            alert('User ID not found')
            return
        }

        // TODO - Aquí hauria d'afegir els trofeus o algo, en contes del titol i tal
        // després buscar una altra manera per detectar que és el joc i no un missatge normal
        // de fet podria aprofitar per detectar que és enviat a través del back per evitar 
        // que es puguin fer trampes copiant i enganxant
        const shareTitle = `#mooot ${wordIndex}`
        const shareTries = tries === 7 ? 'X/6' : tries + '/6'
        const storedRows = readStoredRows()
        const target = words.getTodayWord()
        const resultPattern = `${buildResultPatternFromRows(
            storedRows,
            tries,
            target
        )} \n`
        const resultText = `${shareTitle}\n🎯 ${shareTries}\n⏳ ${time}\n\n${hidden ? 'Quadrícula oculta 🫥 \n' : resultPattern
            }`

        // Prepare the request body
        const requestBody = {
            user_id: userId,
            message: resultText,
        }

        // Call your backend
        const response = await fetch('https://motbot.deno.dev/prepare-share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
            throw { message: 'Failed to prepare message', details: response }
        }

        const data = await response.json()

        // Now share the message using Telegram
        if (window.Telegram.WebApp.shareMessage) {
            window.Telegram.WebApp.shareMessage(data.id)
        } else {
            alert('Share feature not available. Please update Telegram.')
        }

        return true
    } catch (error: any) {
        supalog.error('error', error.message, error.details || error,)

        return false
    }
}
