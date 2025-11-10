declare global {
    interface Window {
        Telegram: any
    }
}

export function telegramDisableClosingOnSwipe() {
    if (window?.Telegram?.WebApp) {
        window.Telegram.WebApp.ready()
        window.Telegram.WebApp.disableVerticalSwipes()
    }
}

export function telegramEnableClosingOnSwipe() {
    if (window?.Telegram?.WebApp) {
        window.Telegram.WebApp.ready()
        window.Telegram.WebApp.enableVerticalSwipes()
    }
}

export function isFromTelegram() {
    const initData = window?.Telegram?.WebApp?.initDataUnsafe
    const isFromTelegram = initData && (initData.user || initData.chat_type)
    return Boolean(isFromTelegram)
}

export function getUserFirstName() {
    return window?.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || '...'
}

export function getUserId(): number | false {
    const isDev = import.meta.env.DEV
    const devUserId = import.meta.env.VITE_DEV_USER_ID as string | undefined

    const initData = window?.Telegram?.WebApp?.initDataUnsafe
    const userId = initData?.user?.id
    return userId || (isDev ? Number(devUserId) : undefined)
}
