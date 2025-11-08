import { css, type CSSResultGroup } from 'lit'

type StyleModule = Record<string, CSSResultGroup>

// Importa
const modules = import.meta.glob('./game-styles/*.style.ts', {
    eager: true,
}) as Record<string, StyleModule>

const stylesByKey = Object.entries(modules).reduce<
    Record<string, CSSResultGroup>
>((acc, [path, mod]) => {
    const keyMatch = /game-styles\/(.+)\.style\.ts$/.exec(path)
    if (!keyMatch) return acc

    const [styleExport] = Object.values(mod)
    if (styleExport) acc[keyMatch[1]] = styleExport
    return acc
}, {})

const getCurrentMonthKey = (): string => {
    const month = new Date().getMonth() + 1
    return `game-league${String(month).padStart(2, '0')}`
}

export const loadMonthStyle = (): CSSResultGroup =>
    stylesByKey[getCurrentMonthKey()] ?? css``
