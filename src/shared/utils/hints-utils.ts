export type LetterStatus = 'correct' | 'present' | 'absent'

// Compute Wordle-like statuses for a guess against a target word
export function computeStatuses(guess: string, target: string): LetterStatus[] {
    const guessLetters = guess.toUpperCase().split('')
    const targetLetters = target.toUpperCase().split('')

    const statuses: LetterStatus[] = new Array(5)

    const remaining: Record<string, number> = {}
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            statuses[i] = 'correct'
        } else {
            const t = targetLetters[i]
            remaining[t] = (remaining[t] || 0) + 1
        }
    }

    for (let i = 0; i < 5; i++) {
        if (statuses[i] === 'correct') continue
        const g = guessLetters[i]
        if ((remaining[g] || 0) > 0) {
            statuses[i] = 'present'
            remaining[g] -= 1
        } else {
            statuses[i] = 'absent'
        }
    }

    return statuses
}

