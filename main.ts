import * as words from './src/words-module.js'
import {
    runStorageCheck,
    loadStoredGame,
    getTodayTime,
} from './src/storage-module.js'
import * as gameboard from './src/gameboard-module.ts'
import { updateMenuData } from './src/stats-module.js'
import { shareResult } from './src/share-utils.ts'
import { closeMenu, closeModal, openMenu } from './src/dom-utils.ts'

// Add this at the top of your game itialization
function checkTelegramContext() {
    if (!window.Telegram?.WebApp) {
        console.log('Not from app')
        document.body.innerHTML = `
          <div style="text-align: center; margin-top: 50px;">
            <h2>🤖 Telegram Only</h2>
            <p>This game only works inside Telegram!</p>
            <p>Open it through your Telegram bot.</p>
          </div>
        `
    }
}
checkTelegramContext()

// We run storage checks at web loading and when visibilitychange
// to ensure even with cached content and not closing pages, it refreshes every day
runStorageCheck()
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        runStorageCheck()
    }
})

async function init() {
    initDOMEvents()
    loadStoredGame()
    updateMenuData()
}

init()

function initDOMEvents() {
    const keys = document.querySelectorAll('.keyboard__key')
    const backspace = document.querySelector('.keyboard__back')
    const enter = document.querySelector('.keyboard__enter')
    const shareButton = document.querySelector('#share')
    const shareHiddenButton = document.querySelector('#shareHidden')
    const modalCloseButton = document.querySelector('#modal-close')
    const menuCloseButton = document.querySelector('#closeMenu')
    const menuOpenButton = document.querySelector('#openMenu')

    keys!.forEach((key) => {
        key.addEventListener('click', (event) => {
            gameboard.letterClick(event.target.dataset.key)
        })
    })

    backspace!.addEventListener('click', () => {
        gameboard.deleteLastLetter()
    })

    enter!.addEventListener('click', () => {
        gameboard.validateLastRow()
    })

    // Share events
    shareButton!.addEventListener('click', () => {
        shareResult(
            words.getTodayWordIndex(),
            gameboard.currentTry,
            getTodayTime()
        )
    })
    shareHiddenButton!.addEventListener('click', () => {
        shareResult(
            words.getTodayWordIndex(),
            gameboard.currentTry,
            getTodayTime(),
            true
        )
    })

    // Modal events
    modalCloseButton!.addEventListener('click', closeModal)

    // Menu events
    menuOpenButton!.addEventListener('click', openMenu)
    menuCloseButton!.addEventListener('click', closeMenu)
}
