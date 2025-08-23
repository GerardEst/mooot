import { showFeedback } from './dom-utils'

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

// TODO - Tot això ha de cambiar molt
export function shareResult(
    wordIndex: number,
    tries: number,
    time: string,
    hidden = false
) {
    const shareTitle = `#mooot ${wordIndex}`
    const shareTries = tries === 7 ? 'X/6' : tries + '/6'
    const resultPattern = `${buildResultPattern(tries)} \n`
    const resultText = `${shareTitle}\n🎯 ${shareTries}\n⏳ ${time}\n\n${
        hidden ? 'Quadrícula oculta 🫥 \n' : resultPattern
    }t.me/mooot_cat_bot/mooot`

    //window.Telegram.WebApp.switchInlineQuery(['groups'])
    //const noLinkPreview = resultText.replace(/https?:\/\//g, '$&\u200B')
    //if (isMobileDevice() && navigator.share) {
    const shareData = {
        text: resultText,
    }

    navigator
        .share(shareData)
        .catch((error) => console.error('Error sharing:', error))
    // } else {
    //     copyToClipboard(resultText).catch((error) => {
    //         console.error('Error copying to clipboard:', error)
    //     })
    //     showFeedback("Resultat copiat, enganxa'l on vulguis compartir-lo")
    // }
}

export function isMobileDevice() {
    return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ) ||
        (navigator.maxTouchPoints &&
            navigator.maxTouchPoints > 2 &&
            /MacIntel/.test(navigator.platform))
    )
}

export async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
    } else {
        throw new Error('Clipboard API not available')
    }
}
