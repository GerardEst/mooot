interface storedStats {
    games: number
    totalPoints: number
    averagePoints: number
    streak: number
    maxStreak: number
    averageTime?: string // Format: hh:mm:ss
}

export function getStoredStats() {
    const storedStats = localStorage.getItem('stats')
    if (!storedStats) {
        console.warn('There are no stored stats')
        return
    }
    return JSON.parse(storedStats) as storedStats
}

export function updateStoredStats(
    todayPoints: number,
    todayTime: string | null
) {
    console.log('Updating stored stats')

    const stats = JSON.parse(
        localStorage.getItem('stats') || '{}'
    ) as storedStats

    const currentGames = stats?.games || 0
    const currentTotalPoints = stats?.totalPoints || 0
    const currentStreak = stats?.streak || 0
    const currentMaxStreak = stats?.maxStreak || 0
    const currentAverageTime = stats?.averageTime || '00:00:00'

    const newGames = currentGames + 1
    const newTotalPoints = currentTotalPoints + todayPoints
    const newStreak = todayPoints !== 0 ? currentStreak + 1 : 0

    const updatedStats = {
        games: newGames,
        totalPoints: newTotalPoints,
        averagePoints: newTotalPoints / newGames,
        averageTime: calculateAverageTime(
            currentAverageTime,
            todayTime,
            newGames
        ),
        streak: newStreak,
        maxStreak: Math.max(newStreak, currentMaxStreak),
    }

    localStorage.setItem('stats', JSON.stringify(updatedStats))

    return updatedStats
}

function calculateAverageTime(
    currentAverageTime: string,
    todayTime: string | null,
    gamesPlayed: number
): string | undefined {
    // Time is stored in this format: hh:mm:ss and should be returned in the same format

    if (!todayTime) return currentAverageTime

    const todayTimeParts = todayTime.split(':').map(Number)
    const todayTimeInSeconds =
        todayTimeParts[0] * 3600 + todayTimeParts[1] * 60 + todayTimeParts[2]

    if (gamesPlayed <= 1) return todayTime // If it's the first game, return today's time

    const currentAverageParts = currentAverageTime.split(':').map(Number)
    const currentAverageInSeconds =
        currentAverageParts[0] * 3600 +
        currentAverageParts[1] * 60 +
        currentAverageParts[2]
    const newAverageInSeconds =
        (currentAverageInSeconds * (gamesPlayed - 1) + todayTimeInSeconds) /
        gamesPlayed
    const hours = Math.floor(newAverageInSeconds / 3600)
    const minutes = Math.floor((newAverageInSeconds % 3600) / 60)
    const seconds = Math.floor(newAverageInSeconds % 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
    )}:${String(seconds).padStart(2, '0')}`
}
