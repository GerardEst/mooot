import { updateMenuStat, updateStat } from './dom-utils'
import { getTodayNiceWord } from './words-module'

interface storedStats {
    games: number
    totalPoints: number
    averagePoints: number
    streak: number
    maxStreak: number
}

export function getStoredStats() {
    const storedStats = localStorage.getItem('stats')
    if (!storedStats) {
        console.warn('There are no stored stats')
        return
    }
    return JSON.parse(storedStats) as storedStats
}

export function updateStoredStats(todayPoints: number) {
    const storedStats = localStorage.getItem('stats')
    if (!storedStats) {
        console.error('There are not stored stats')
        return
    }
    const stats = JSON.parse(storedStats)

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

export function fillModalStats(todayPoints: number) {
    const storedStats = getStoredStats()

    if (!storedStats) return

    updateStat(
        'title',
        todayPoints === 6
            ? '🤨 ESCANDALÓS!'
            : todayPoints === 5
            ? '🏆 Increíble!'
            : todayPoints === 4
            ? '🤯 Impresionant!'
            : todayPoints === 3
            ? '😎 Molt bé!'
            : todayPoints === 2
            ? '😐 Fet!'
            : todayPoints === 1
            ? '😭 Pels pèls!'
            : '☠️ Vaja...'
    )
    updateStat('word', getTodayNiceWord())
    updateStat('points', todayPoints.toString())
    updateStat('games', storedStats.games.toString())
    updateStat('totalPoints', storedStats.totalPoints.toString())
    updateStat('averagePoints', storedStats.averagePoints.toFixed(2))
    updateStat('streak', storedStats.streak.toString())
    updateStat('maxStreak', storedStats.maxStreak.toString())
}

export function updateMenuData() {
    const storedStats = getStoredStats()

    updateMenuStat('games', storedStats?.games.toString() || '0')
    updateMenuStat('totalPoints', storedStats?.totalPoints.toString() || '0')
    updateMenuStat(
        'averagePoints',
        storedStats?.averagePoints.toFixed(2) || '0'
    )
    updateMenuStat('streak', storedStats?.streak.toString() || '0')
    updateMenuStat('maxStreak', storedStats?.maxStreak.toString() || '0')
}

export function editLinkToDictionary(word: string) {
    const dicLink = document.querySelector('#dicLink')
    const dicUrl = `https://diccionari.cat/cerca/gran-diccionari-de-la-llengua-catalana?search_api_fulltext_cust=${word}&search_api_fulltext_cust_1=&field_faceta_cerca_1=5065&show=title`

    if (!dicLink) {
        console.warn('Cant find dicLink')
        return
    }

    dicLink.setAttribute('href', dicUrl)
}
