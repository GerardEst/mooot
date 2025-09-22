import '@src/features/game/components/feedback'

export function showFeedback(message: string) {
    const el = document.createElement('mooot-feedback') as any
    el.message = message
    document.body.appendChild(el)
}
