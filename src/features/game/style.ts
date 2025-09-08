import { css } from 'lit'

// Game styles moved from the previous components/game/style.ts
export const game = css`
    .game {
        display: flex;
        flex-direction: column;
    }

    /* Buttons (not defined in global styles) */
    button,
    .button {
        border: none;
        background-color: var(--button-color);
        color: var(--text-color);
        border: 1px solid var(--button-border-color);
        padding: 0.8rem 1rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        text-decoration: none;
    }
    .button.button--danger,
    button.button--danger {
        background-color: var(--button-danger-color);
        border: 1px solid var(--button-danger-border-color);
        color: var(--text-color);
    }
    .button img,
    button img {
        width: 15px;
        height: 15px;
    }

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

    /* Win modal */
    .modal {
        position: fixed;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 20px;
        box-sizing: border-box;
    }
    .modal.active {
        display: flex;
    }
    .modal .modal__content {
        min-width: 300px;
        position: relative;
        background-color: white;
        padding: 2rem;
        padding-top: 1.7rem;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 1.8rem;
    }
    .modal .modal__content .header {
        display: flex;
        justify-content: space-between;
        position: relative;
    }
    .modal .modal__content .modal__content__close {
        position: absolute;
        width: 20px;
        height: 20px;
        padding: 1rem;
        top: -1rem;
        right: -1rem;
        cursor: pointer;
    }
    .modal .modal__content .modal__buttons {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 1fr 1fr;
    }

    .motbot_nextleague {
        padding: 0.5rem 0.6rem;
        border-radius: 4px;
        border: 1px solid var(--present-border-color);
        background-color: var(--present-color);
    }
    /* Feedback toast */
    .feedback {
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 5px;
        display: none;
        z-index: 1;
        text-align: center;
        line-height: 1.4;
    }
    .feedback.active {
        display: block;
    }

    .stats {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`
