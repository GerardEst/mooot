declare global {
    interface Window {
        Telegram: any
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
    const initData = window?.Telegram?.WebApp?.initDataUnsafe
    const userId = initData?.user?.id
    return userId || false
}
