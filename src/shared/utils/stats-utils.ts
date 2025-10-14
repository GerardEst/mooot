export interface storedStats {
    games: number
    totalPoints: number
    averagePoints: number
    streak: number
    maxStreak: number
    averageTime?: string // Format: hh:mm:ss
}

export function getStoredStat(stat: keyof storedStats) {
    const stats = getStoredStats()
    if (!stats) return

    return stats[stat as keyof storedStats]
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
) {
    console.log('Updating stored stats')

    const stats = JSON.parse(
        localStorage.getItem('stats') || '{}'
    ) as storedStats

    const currentGames = stats?.games || 0
    const currentTotalPoints = stats?.totalPoints || 0
    const currentStreak = stats?.streak || 0
    const currentMaxStreak = stats?.maxStreak || 0

    const newGames = currentGames + 1
    const newTotalPoints = currentTotalPoints + todayPoints
    const newStreak = todayPoints !== 0 ? currentStreak + 1 : 0

    const updatedStats = {
        games: newGames,
        totalPoints: newTotalPoints,
        averagePoints: newTotalPoints / newGames,
        streak: newStreak,
        maxStreak: Math.max(newStreak, currentMaxStreak),
    }

    localStorage.setItem('stats', JSON.stringify(updatedStats))

    return updatedStats
}