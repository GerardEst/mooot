let currentRow = 1
let currentColumn = 1
let currentWord = ""
let todayWord
let wordsSet

fetch('/assets/words.json')
    .then(response => response.json())
    .then(data => {
        wordsSet = new Set(data);
        console.log("Words loaded:", wordsSet);
        
        todayWord = getTodayWord()
    })

function getTodayWord() {
    const totalWords = wordsSet.size;
    console.log("Total words available:", totalWords);

    const todayIndex = getTodayWordIndex(totalWords);
    console.log("Today's word index:", todayIndex);

    const wordsArray = Array.from(wordsSet);
    console.log("Words array:", wordsArray);
    
    const todayWord = wordsArray[todayIndex];
    console.log("Today's word is:", todayWord);

    return todayWord;
}

function initiateEvents(){
    document.querySelectorAll('.keyboard__key').forEach(key => {
        key.addEventListener('click', letterClick);
    });
    document.querySelector('.keyboard__back').addEventListener('click', () => {
        if (currentColumn <= 1) return;
        
        currentColumn--;
        document.querySelector(`#l${currentRow}_${currentColumn}`).textContent = '';
        currentWord = currentWord.slice(0, -1);
    });
    document.querySelector('.keyboard__enter').addEventListener('click', () => {
        if (currentWord.length !== 5) return
        
            const tryStatus = checkWord(currentWord);
            if (tryStatus === 'correct') {
                showHints(currentWord, todayWord, currentRow);
                showModal()
            } else if (tryStatus === 'invalid') {
                currentColumn = 1;
                cleanRow(currentRow);
            } else {
                showHints(currentWord, todayWord, currentRow);
                currentColumn = 1;
                currentRow++;
            }
            currentWord = "";
        }
    );

    // Modal events
    document.querySelector('#share').addEventListener('click', shareResult)
    document.querySelector('#modal-close').addEventListener('click', closeModal);
}

initiateEvents();

function letterClick(event) {
    if (currentColumn > 5) return;
    
    const element = event.target
    const letter = element.dataset.key;

    document.querySelector(`#l${currentRow}_${currentColumn}`).textContent = letter;
    
    if( currentColumn > 5) return;

    currentWord += letter;
    currentColumn++;
}

function checkWord(word) {
    console.log("Checking word:", word);

    const cleanWord = word.toUpperCase().trim();
    
    if( cleanWord === todayWord.toUpperCase()) {
        return 'correct';
    }

    if (wordsSet.has(cleanWord)) return 'next';

    return 'invalid';
}

function cleanRow(row) {
    for (let i = 1; i <= 5; i++) {
        document.querySelector(`#l${row}_${i}`).textContent = '';
    }
}

function showHints(guess, target, row) {
    const guessLetters = guess.toUpperCase().split('');
    const targetLetters = target.toUpperCase().split('');
    
    for (let i = 0; i < 5; i++) {
        const cell = document.querySelector(`#l${row}_${i + 1}`);
        const letter = guessLetters[i];
        
        if (letter === targetLetters[i]) {
            cell.classList.add('correct');
            console.log(`Letter ${letter} is correct at position ${i + 1}`);
            console.log(document.querySelector(`.keyboard__key[data-key="${letter}"]`));
            document.querySelector(`.keyboard__key[data-key="${letter}"]`).classList.add('correct');
        } else if (targetLetters.includes(letter)) {
            cell.classList.add('present');
            document.querySelector(`.keyboard__key[data-key="${letter}"]`).classList.add('present');
        } else {
            cell.classList.add('absent');
            document.querySelector(`.keyboard__key[data-key="${letter}"]`).classList.add('absent');
        }
    }
}

function getTodayWordIndex(totalWords, startDate = '2025-07-18', currentDate = new Date()) {
    const gameStartDate = new Date(startDate);
    
    // Normalize both dates to midnight UTC to avoid timezone issues
    const normalizedStartDate = new Date(Date.UTC(
        gameStartDate.getFullYear(),
        gameStartDate.getMonth(),
        gameStartDate.getDate()
    ));
    
    const normalizedCurrentDate = new Date(Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    ));
    
    // Calculate days elapsed since start date
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysElapsed = Math.floor(
        (normalizedCurrentDate.getTime() - normalizedStartDate.getTime()) / millisecondsPerDay
    );
    
    // Handle negative days (before start date) by returning 0
    if (daysElapsed < 0) {
        return 0;
    }
    
    // Return index using modulo to cycle through word list
    return daysElapsed % totalWords;
}

function showModal() {
    const modal = document.querySelector('.modal');
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.querySelectorAll('.modal');
    
    modal.forEach(m => m.classList.remove('active'));
}

function shareResult() {
    
    const resultPattern = buildResultPattern();

    const resultText = `
    ${resultPattern}
    `;
    
    const shareData = {
        title: `#Mooot ${getTodayWordIndex()} ${currentRow}/6`,
        text: resultText,
        url: window.location.href
    };

    navigator.share(shareData)
        .then(() => console.log('Share successful'))
        .catch(error => console.error('Error sharing:', error));
}

function buildResultPattern() {
    let result = '';
    for (let i = 1; i <= currentRow; i++) {
        const row = [];
        for (let j = 1; j <= 5; j++) {
            const cell = document.querySelector(`#l${i}_${j}`);
            if (cell.classList.contains('correct')) {
                row.push('🟩');
            }
            else if (cell.classList.contains('present')) {
                row.push('🟨');
            } else if (cell.classList.contains('absent')) {
                row.push('⬜️');
            }
        }
        result += row.join('') + '\n';
    }
    return result;
}