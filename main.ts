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
declare global {
    interface Window {
        Telegram: any
    }
}

// Add this at the top of your game itialization
function checkTelegramContext() {
    const initData = window.Telegram.WebApp.initDataUnsafe
    const hasUserData = initData && (initData.user || initData.chat_type)

    console.log('Telegram WebApp object exists:', !!window.Telegram.WebApp)
    console.log('Has actual Telegram data:', hasUserData)
    console.log('Init data:', initData)

    if (!hasUserData) {
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
// checkTelegramContext()

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
    shareButton!.addEventListener('click', async () => {
        const buttonImg = shareButton?.querySelector('img')
        buttonImg?.setAttribute('src', '/assets/loading.gif')

        await shareResult(
            words.getTodayWordIndex(),
            gameboard.currentTry,
            getTodayTime()
        )

        buttonImg?.setAttribute('src', '/assets/share.svg')
    })
    shareHiddenButton!.addEventListener('click', async () => {
        const buttonImg = shareHiddenButton?.querySelector('img')
        buttonImg?.setAttribute('src', '/assets/loading.gif')

        await shareResult(
            words.getTodayWordIndex(),
            gameboard.currentTry,
            getTodayTime(),
            true
        )

        buttonImg?.setAttribute('src', '/assets/hidden_eye.svg')
    })

    // Modal events
    modalCloseButton!.addEventListener('click', closeModal)

    // Menu events
    menuOpenButton!.addEventListener('click', openMenu)
    menuCloseButton!.addEventListener('click', closeMenu)
}
