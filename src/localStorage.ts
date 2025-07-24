export function runStorageCheck() {
    const storedGame = localStorage.getItem('moootGameData')
    if (storedGame) {
        const storedGameData = JSON.parse(storedGame)
        const storedGameTime = storedGameData[0]?.date
        const cleanedLocalStorage = checkCleanLocalStorage(storedGameTime)
        if (cleanedLocalStorage) cleanGameboard()
    } else {
        // Preventive cleaning
        cleanGameboard()
    }
}

export function checkCleanLocalStorage(localDate: string) {
    const date = new Date(localDate)
    const today = new Date()

    if (date.toDateString() !== today.toDateString()) {
        console.warn('Saved data is not from today, clearing.')
        localStorage.removeItem('moootGameData')

        return true
    }
    return false
}

export function cleanGameboard() {
    // Clean game cells
    for (let row = 1; row <= 6; row++) {
        for (let col = 1; col <= 5; col++) {
            const cell = document.querySelector(`#l${row}_${col}`)
            if (cell) {
                cell.textContent = ''
                cell.classList.remove('correct', 'present', 'absent')
            }
        }
    }

    // Clean keyboard
    document.querySelectorAll('.keyboard__key').forEach((key) => {
        key.classList.remove('correct', 'present', 'absent')
    })
}
