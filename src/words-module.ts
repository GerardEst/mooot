let dicc: any
let allWords: { key: string; value: string }
let todayWord: string
let todayWordIndex: number

export async function loadDiccData() {
    const diccFetch = await fetch('/assets/dicc.json')
    const diccJson = await diccFetch.json()
    dicc = new Set(diccJson)

    return dicc
}

export async function loadWordsData() {
    console.log('Fetching all the possible words')

    const wordsFetch = await fetch('/assets/words.json')
    allWords = await wordsFetch.json()

    return allWords
}

export function wordExists(word: string) {
    return dicc.has(word)
}

export function getTodayWord() {
    if (todayWord) return todayWord

    const todayIndex = getTodayWordIndex()
    const wordsArray = Object.keys(allWords)
    todayWord = wordsArray[todayIndex]

    return todayWord
}

export function getTodayNiceWord() {
    return allWords[todayWord.toLowerCase()].toUpperCase()
}

export function getTodayWordIndex() {
    if (todayWordIndex) return todayWordIndex

    const startDate = '2025-07-18'
    const currentDate = new Date()
    const gameStartDate = new Date(startDate)

    // Normalize both dates to midnight UTC to avoid timezone issues
    const normalizedStartDate = new Date(
        Date.UTC(
            gameStartDate.getFullYear(),
            gameStartDate.getMonth(),
            gameStartDate.getDate()
        )
    )

    const normalizedCurrentDate = new Date(
        Date.UTC(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
        )
    )

    // Calculate days elapsed since start date
    const millisecondsPerDay = 24 * 60 * 60 * 1000
    const daysElapsed = Math.floor(
        (normalizedCurrentDate.getTime() - normalizedStartDate.getTime()) /
            millisecondsPerDay
    )

    // Handle negative days (before start date) by returning 0
    if (daysElapsed < 0) return 0

    // Return index using modulo to cycle through word list
    todayWordIndex = daysElapsed % Object.keys(allWords).length

    return todayWordIndex
}
