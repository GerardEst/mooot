function getGameRoot(): Document | ShadowRoot {
    const game = document.querySelector('mooot-joc-game') as HTMLElement & {
        shadowRoot?: ShadowRoot
    }
    return game?.shadowRoot || document
}

function getMenuRoot(): Document | ShadowRoot {
    const menu = document.querySelector('mooot-menu') as HTMLElement & {
        shadowRoot?: ShadowRoot
    }
    return menu?.shadowRoot || document
}

// updateCell has moved into the game component (mooot-joc-game)

export function updateKey(
    letter: string,
    status: 'correct' | 'present' | 'absent'
) {
    const root = getGameRoot()
    const key = (root as ParentNode).querySelector?.(
        `.keyboard__key[data-key="${letter}"]`
    ) as HTMLElement | null
    if (key) key.classList.add(status)
}

export function updateStat(stat: string, content: string) {
    const root = getGameRoot()
    const domstat = (root as ParentNode).querySelector?.(
        `#stats-${stat}`
    ) as HTMLElement | null

    if (!domstat) {
        console.error('Cant find stat element')
        return
    }

    domstat.textContent = content
}

export function updateMenuStat(stat: string, content: string) {
    const root = getMenuRoot()
    const domstat = (root as ParentNode).querySelector?.(
        `#menustats-${stat}`
    ) as HTMLElement | null

    if (!domstat) {
        console.error('Cant find stat element')
        return
    }

    domstat.textContent = content
}

// Feedback

export function showFeedback(message) {
    const root = getGameRoot()
    const feedbackElement = (root as ParentNode).querySelector?.(
        '.feedback'
    ) as HTMLElement | null

    if (!feedbackElement) {
        console.error('Cant find feedback element')
        return
    }

    feedbackElement.textContent = message
    feedbackElement.classList.add('active')

    setTimeout(() => {
        feedbackElement.classList.remove('active')
    }, 4000)
}

// Modal

export function showModal() {
    const root = getGameRoot()
    const modal = (root as ParentNode).querySelector?.(
        '.modal'
    ) as HTMLElement | null

    if (!modal) {
        console.error('Cant find modal element')
        return
    }
    modal.classList.add('active')
}

export function closeModal() {
    const root = getGameRoot()
    const modal = (root as ParentNode).querySelector?.(
        '.modal'
    ) as HTMLElement | null

    if (!modal) {
        console.error('Cant find modal element')
        return
    }

    modal.classList.remove('active')
}

// Menu

export function openMenu() {
    const root = getMenuRoot()
    const menu = (root as ParentNode).querySelector?.(
        '.menu'
    ) as HTMLElement | null

    if (!menu) {
        console.error('Cant find menu element')
        return
    }

    menu.classList.add('active')
}

export function closeMenu() {
    const root = getMenuRoot()
    const menu = (root as ParentNode).querySelector?.(
        '.menu'
    ) as HTMLElement | null

    if (!menu) {
        console.error('Cant find menu element')
        return
    }

    menu.classList.remove('active')
}
