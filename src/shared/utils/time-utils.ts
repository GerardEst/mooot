export function formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`
    }

    return `${pad(minutes)}:${pad(seconds)}`
}

function pad(value: number): string {
    return value.toString().padStart(2, '0')
}
