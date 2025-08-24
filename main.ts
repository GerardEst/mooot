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
function isFromTelegram() {
    const initData = window.Telegram.WebApp.initDataUnsafe
    const isFromTelegram = initData && (initData.user || initData.chat_type)

    return isFromTelegram
}

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
    if (!isFromTelegram()) {
        shareButton?.remove()
        shareHiddenButton?.remove()
    }
    shareButton!.addEventListener('click', async () => {
        const buttonImg = shareButton?.querySelector('img')
        buttonImg?.setAttribute('src', '/assets/loading.svg')

        await shareResult(
            words.getTodayWordIndex(),
            gameboard.currentTry,
            getTodayTime()
        )

        setTimeout(() => {
            buttonImg?.setAttribute('src', '/assets/share.svg')
        }, 1000)
    })
    shareHiddenButton!.addEventListener('click', async () => {
        const buttonImg = shareHiddenButton?.querySelector('img')
        buttonImg?.setAttribute('src', '/assets/loading.svg')

        await shareResult(
            words.getTodayWordIndex(),
            gameboard.currentTry,
            getTodayTime(),
            true
        )

        setTimeout(() => {
            buttonImg?.setAttribute('src', '/assets/hidden_eye.svg')
        }, 1000)
    })

    // Modal events
    modalCloseButton!.addEventListener('click', closeModal)

    // Menu events
    menuOpenButton!.addEventListener('click', openMenu)
    menuCloseButton!.addEventListener('click', closeMenu)
}
