// Extracted functions for testing
export function cleanGameboard() {
    // Clear all game cells
    for (let row = 1; row <= 6; row++) {
        for (let col = 1; col <= 5; col++) {
            const cell = document.querySelector(`#l${row}_${col}`)
            if (cell) {
                cell.textContent = ''
                cell.classList.remove('correct', 'present', 'absent')
            }
        }
    }
    
    // Reset keyboard keys
    document.querySelectorAll('.keyboard__key').forEach(key => {
        key.classList.remove('correct', 'present', 'absent')
    })
}

export function checkCleanLocalStorage(savedDate) {
    const date = new Date(savedDate)
    const today = new Date()

    if (date.toDateString() !== today.toDateString()) {
        console.warn('Saved data is not from today, clearing.')
        localStorage.removeItem('moootGameData')
        
        // Clean the gameboard
        cleanGameboard()
        return true
    }
    return false
}