import { css } from 'lit'

// Game styles moved from the previous components/game/style.ts
export const game = css`
    /* Word grid */
    .wordgrid {
        --spacing: 10px;
        flex: 1;
        display: grid;
        align-content: center;
        gap: var(--spacing);
    }
    .wordgrid > .wordgrid__row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing);
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        border: 1px solid var(--cell-border);
        background-color: var(--cell);
        color: var(--text-color);
        overflow: hidden;
        position: relative;
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell.selected {
        outline: 2px solid var(--correct-border-color);
        outline-offset: -2px;
        box-shadow: inset 0 0 0 1px var(--correct-border-color);
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell::after {
        content: '';
        position: absolute;
        inset: 0;
        background-color: var(--cell);
        opacity: 0;
        border-radius: 4px;
        will-change: opacity, border-radius;
        pointer-events: none;
        border-radius: 3px;
        outline: 1px solid var(--cell-border);
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell.soft-reveal {
        animation: cell-scale-pop 400ms var(--ease-smooth) both;
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell.hard-reveal {
        animation: cell-scale-big-pop 600ms var(--ease-smooth) both;
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell.soft-reveal::after {
        animation: cell-overlay-fade 400ms var(--ease-smooth) both;
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell.hard-reveal::after {
        animation: cell-overlay-fade 600ms var(--ease-smooth) both;
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell.correct {
        background-color: var(--correct-color);
        border: 1px solid var(--correct-border-color);
        color: var(--used-text-color);
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell.correct.hard-reveal {
        animation: cell-scale-big-pop 600ms var(--ease-smooth) both,
            success-shine 600ms var(--ease-smooth) both;
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell.present {
        background-color: var(--present-color);
        border: 1px solid var(--present-border-color);
        color: var(--used-text-color);
    }
    .wordgrid > .wordgrid__row > .wordgrid__cell.absent {
        background-color: var(--missing-color);
        border: 1px solid var(--missing-border-color);
        color: white;
    }

    /* Animations */
    @keyframes cell-overlay-fade {
        0% {
            opacity: 1;
        }
        60% {
            opacity: 0.2;
        }
        100% {
            opacity: 0;
        }
    }

    @keyframes cell-scale-pop {
        0% {
            border-radius: 4px;
            transform: scale(1);
        }
        20% {
            transform: scale(0.9);
        }
        60% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes cell-scale-big-pop {
        0% {
            border-radius: 4px;
            transform: scale(1) rotate(0deg);
        }
        20% {
            border-radius: 50%;
            transform: scale(0.6) rotate(0deg);
        }
        30% {
            border-radius: 50%;
            transform: scale(0.6) rotate(0deg);
        }
        50% {
            transform: scale(1.18) rotate(0deg);
        }
        60% {
            border-radius: 4px;
            transform: scale(1.18) rotate(-3deg);
        }
        68% {
            transform: scale(1.18) rotate(3deg);
        }
        76% {
            transform: scale(1.16) rotate(-1.5deg);
        }
        90% {
            transform: scale(1.08) rotate(0.5deg);
        }
        100% {
            transform: scale(1) rotate(0deg);
        }
    }

    @keyframes success-shine {
        0% {
            background-color: var(--color-green-success);
        }
        40% {
            background-color: var(--color-green-success);
        }
        50% {
            background-color: var(--color-green-success-shine);
        }
        95% {
            background-color: var(--color-green-success-shine);
        }
        100% {
            background-color: var(--color-green-success);
        }
    }

    mooot-keyboard {
        width: 100%;
    }
`
