import { supalog } from '@src/core/logs'

function buildResultPattern(tries: number) {
    let result = ''
    for (let i = 1; i <= tries; i++) {
        const row: string[] = []

        for (let j = 1; j <= 5; j++) {
            const cell = document.querySelector(`#l${i}_${j}`)
            if (!cell) continue

            if (cell.classList.contains('correct')) {
                row.push('🟩')
            } else if (cell.classList.contains('present')) {
                row.push('🟨')
            } else {
                row.push('⬜️')
            }
        }
        result += row.join('') + '\n'
    }

    console.log(result)

    return result
}

export async function shareResult(
    wordIndex: number,
    tries: number,
    time: string,
    hidden = false
) {
    try {
        // Get the current user ID from Telegram
        const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id

        if (!userId) {
            alert('User ID not found')
            return
        }

        const shareTitle = `#mooot ${wordIndex}`
        const shareTries = tries === 7 ? 'X/6' : tries + '/6'
        const resultPattern = `${buildResultPattern(tries)} \n`
        const resultText = `${shareTitle}\n🎯 ${shareTries}\n⏳ ${time}\n\n${
            hidden ? 'Quadrícula oculta 🫥 \n' : resultPattern
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
        supalog({
            message: error.message || 'Error sharing game',
            details: error.details || error,
            userId: window.Telegram.WebApp.initDataUnsafe?.user?.id,
        })

        return false
    }
}
