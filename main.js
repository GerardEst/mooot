let currentRow = 1
let currentColumn = 1
let currentWord = ""
let todayWord
let wordsSet
let dicSet

import { isMobileDevice, copyToClipboard } from './utils.js';

const savedGameData = localStorage.getItem('moootGameData');
checkCleanLocalStorage(savedData[0].date);
        
fetch('/assets/words.json')
    .then(response => response.json())
    .then(data => {
        wordsSet = data
        
        todayWord = getTodayWord()

        if (savedGameData) {
            const parsedData = JSON.parse(savedGameData);
            loadSavedGameData(parsedData);
            currentRow = parsedData.at(-1).row;
            currentColumn = 1
            currentWord = ""

            if (currentRow > 6 || parsedData.at(-1).word.toUpperCase() === todayWord.toUpperCase()) {
                // Load stats from localStorage
                const storedStats = getStoredStats()
                fillStats(todayWord, 7 - currentRow, storedStats)
                editLinkToDictionary(wordsSet[todayWord]);
                showModal();
            } else {
                currentRow++;
            }
        }
    })

fetch('/assets/dic.json')
    .then(response => response.json())
    .then(data => {
        dicSet = new Set(data)
    })

function getTodayWord() {
    const todayIndex = getTodayWordIndex();
    const wordsArray = Object.keys(wordsSet);
    const todayWord = wordsArray[todayIndex];

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
                saveToLocalStorage(currentWord, currentRow);

                const updatedStats = updateStats(7 - currentRow);
                localStorage.setItem('stats', JSON.stringify(updatedStats))

                fillStats(currentWord, 7 - currentRow, updatedStats)

                setTimeout(() => {
                    showModal()
                    editLinkToDictionary(wordsSet[todayWord]);
                }, 1000);
            } else if (tryStatus === 'invalid') {
                showFeedback("Aquesta paraula no existeix");
                currentColumn = 1;
                cleanRow(currentRow);
            } else {
                showHints(currentWord, todayWord, currentRow);
                saveToLocalStorage(currentWord, currentRow);
                if (currentRow >= 6) {
                    showModal();
                }
                currentColumn = 1;
                currentRow++;
            }
            currentWord = "";
        }
    );

    // Modal events
    document.querySelector('#share').addEventListener('click', () => {
        shareResult(false);
    });
    document.querySelector('#shareOpen').addEventListener('click', () => {
        shareResult(true);
    });
    document.querySelector('#modal-close').addEventListener('click', closeModal);

    // Menu events
    // document.querySelector('#openMenu').addEventListener('click', openMenu)
    document.querySelector('#closeMenu').addEventListener('click', closeMenu)
}

initiateEvents();

function editLinkToDictionary(word) {
    const dicLink = document.querySelector('#dicLink');
    const dicUrl = `https://diccionari.cat/cerca/gran-diccionari-de-la-llengua-catalana?search_api_fulltext_cust=${word}&search_api_fulltext_cust_1=&field_faceta_cerca_1=5065&show=title`;
    dicLink.setAttribute('href', dicUrl);
    // dicLink.textContent = `${word} a diccionari.cat`;
}

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
    const cleanWord = word.toUpperCase().trim();
    
    if( cleanWord === todayWord.toUpperCase()) {
        return 'correct';
    }

    if (dicSet.has(cleanWord)) return 'next';

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
            
            document.querySelector(`.keyboard__key[data-key="${letter}"]`).classList.add('correct');
        } else if (targetLetters.includes(letter)) {
            // If the letter is correct in another cell of the same row, dont mark it as present
            const DOMrow = document.querySelector(`#l${row}`)
            const presentCellsInRow = DOMrow.querySelectorAll(`.wordgrid__cell.correct`)

            let isLetterAlreadyPresent = Array.from(presentCellsInRow).some(cell => cell.textContent === letter)

            if (!isLetterAlreadyPresent) cell.classList.add('present');
            
            document.querySelector(`.keyboard__key[data-key="${letter}"]`).classList.add('present');
        } else {
            cell.classList.add('absent');
            document.querySelector(`.keyboard__key[data-key="${letter}"]`).classList.add('absent');
        }
    }
}

function getTodayWordIndex(startDate = '2025-07-18', currentDate = new Date()) {
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
    return daysElapsed % Object.keys(wordsSet).length;
}

function showModal() {
    const modal = document.querySelector('.modal');
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.querySelectorAll('.modal');
    
    modal.forEach(m => m.classList.remove('active'));
}

function openMenu() {
    const modal = document.querySelector('.menu');
    
    modal.classList.add('active');
}

function closeMenu() {
    const modal = document.querySelector('.menu');
    
    modal.classList.remove('active');
}

function shareResult(open = false) {
    const resultPattern = buildResultPattern(open);
    const shareTitle = `#mooot  ${getTodayWordIndex()}  ${currentRow === 7 ? 'X' : currentRow}/6`;
    const resultText = `${shareTitle}\n\n${resultPattern}\nhttps://mooot.cat`;

    if (isMobileDevice() && navigator.share) {
        const shareData = {
            text: resultText
        };

        navigator.share(shareData)
            .catch(error => console.error('Error sharing:', error));
    } else {
        copyToClipboard(resultText)
            .catch(error => {
                console.error('Error copying to clipboard:', error);
            });
    }
}



function buildResultPattern(open = false) {
    let result = '';
    for (let i = 1; i <= currentRow; i++) {
        const row = [];
        for (let j = 1; j <= 5; j++) {
            const cell = document.querySelector(`#l${i}_${j}`);
            if(!cell) continue;
            if (cell.classList.contains('correct')) {
                open ? row.push('🟩' + cell.textContent +'  ') : row.push('🟩');
            }
            else if (cell.classList.contains('present')) {
                open ? row.push('🟨' + cell.textContent +'  ') : row.push('🟨');
            } else {
                open ? row.push('⬜️' + cell.textContent +'  ') : row.push('⬜️');
            }
        }
        result += row.join('') + '\n';
    }

    console.log(result);
    
    return result;
}

function saveToLocalStorage(word, row) {
    const dataToSave = {
            word: word,
            row: row,
            date: new Date().toISOString()
    };

    const currentStored = localStorage.getItem('moootGameData');
    if (currentStored) {
        const savedData = JSON.parse(currentStored);
        savedData.push(dataToSave);
        localStorage.setItem('moootGameData', JSON.stringify(savedData));
    } else {
        localStorage.setItem('moootGameData', JSON.stringify([dataToSave]));
    }
}

function checkCleanLocalStorage(savedDate) {
    if(savedDate) {
        const date = new Date(savedDate);
        const today = new Date();
        
        if (date.toDateString() !== today.toDateString()) {
            console.warn("Saved data is not from today, clearing.");
            localStorage.removeItem('moootGameData');
            return;
        }
    }
}

function loadSavedGameData(savedData) {    
    savedData.forEach((row,index) => {
        for (let i = 1; i <= 5; i++) {
            const cell = document.querySelector(`#l${row.row}_${i}`);
            cell.textContent = row.word[i - 1];
        }
        showHints(row.word, todayWord, row.row);
    })
}

function showFeedback(message) {
    const feedbackElement = document.querySelector('.feedback');
    feedbackElement.textContent = message;
    feedbackElement.classList.add('active');

    setTimeout(() => {
        feedbackElement.classList.remove('active');
    }, 3000);
}


function getStoredStats() {
    return JSON.parse(localStorage.getItem('stats'))
}

function updateStats(todayPoints) {
    const storedStats = JSON.parse(localStorage.getItem('stats'))
    
    const currentGames = storedStats?.games || 0
    const currentTotalPoints = storedStats?.totalPoints || 0
    const currentStreak = storedStats?.streak || 0
    const currentMaxStreak = storedStats?.maxStreak || 0
    
    const newGames = currentGames + 1
    const newTotalPoints = currentTotalPoints + todayPoints
    const newStreak = todayPoints !== 0 ? currentStreak + 1 : 0

    const updatedStats = {
        games: newGames,
        totalPoints: newTotalPoints,
        averagePoints: newTotalPoints / newGames,
        streak: newStreak,
        maxStreak: Math.max(newStreak, currentMaxStreak)
    }

    return updatedStats
}

function fillStats(todayWord, todayPoints, stats) {
    console.log(stats)

    const statsTitle = document.querySelector('#stats-title');
    const statsWord = document.querySelector('#stats-word');
    const statsPoints = document.querySelector('#stats-points');
    const statsGames = document.querySelector('#stats-games');
    const statsTotalPoints = document.querySelector('#stats-totalPoints');
    const statsAveragePoints = document.querySelector('#stats-averagePoints');
    const statsStreak = document.querySelector('#stats-streak');
    const statsMaxStreak = document.querySelector('#stats-maxStreak');

    statsTitle.textContent = todayPoints === 6 ? '🤨 ESCANDALÓS!' : todayPoints === 5 ? '🏆 Increíble!' : todayPoints === 4 ? '🤯 Impresionant!' : todayPoints === 3 ? '😎 Molt bé!' : todayPoints === 2 ? '😐 Fet!' : todayPoints === 1 ? '😭 Pels pèls!' : '☠️ Vaja...';
    statsWord.textContent = wordsSet[todayWord].toUpperCase();
    statsPoints.textContent = todayPoints;
    statsGames.textContent = stats.games;
    statsTotalPoints.textContent = stats.totalPoints
    statsAveragePoints.textContent = stats.averagePoints
    statsStreak.textContent = stats.streak
    statsMaxStreak.textContent = stats.maxStreak
}