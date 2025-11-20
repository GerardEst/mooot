import { css } from 'lit'

export const game = css`
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
        position: relative;
        font-family: 'jua';
        background-color: var(--cell);
        box-sizing: border-box;
        color: var(--cell-text);
        padding-top: 3px;
        & p{
            position: absolute;
        }
        & .collectible{
            width: 100%;
            height: 100%;
            opacity: 0.8;
            background: url('/assets/icons/collectible_present.svg') no-repeat center/30px;
            transition: 300ms cubic-bezier(0.510, -0.375, 0.180, 1.270);
            transform: translateY(-2px)
        }
        & p:not(:empty) ~ .collectible{
            background: url('/assets/icons/collectible_present.svg') no-repeat left top/20px;
            transform: translateY(-4px) translateX(-3px) rotate(8deg);
        }
        &.selected{
            box-shadow: inset 0 0 10px 2px #898989;
            background-color: #d3d3d3;
        }
        &.soft-reveal {
            animation: cell-scale-pop 400ms var(--ease-smooth) both;
        }
        &.hard-reveal {
            animation: cell-scale-big-pop 600ms var(--ease-smooth) both;
        }
        &.correct {
            color: #4d684a;
            box-sizing: border-box;
            padding-bottom: 2px;
            box-shadow: inset 0 -3px #c9edc8, inset 0 5px 20px #ffffffb8;
            background-color: var(--color-green-success);
            & .collectible{
               background: url('/assets/icons/collectible_present-open.svg') no-repeat left top/20px !important;
            }
        }
        &.correct.hard-reveal {
            animation: cell-scale-big-pop 600ms var(--ease-smooth) both,
                success-shine 600ms var(--ease-smooth) both;
        }
        &.present {
            background-color: var(--keyboard-present);
            box-sizing: border-box;
            color: var(--cell-present);
            box-shadow: inset 0px -3px 0px 0px var(--cell-present), inset 0 5px 20px #ffffffb8;
            padding-bottom: 2px;
        }
        &.absent {
            background-color: #e1dede;
            box-sizing: border-box;
            color: var(--cell-absent);
            box-shadow: inset 0px 3px 0px 0px var(--cell-absent), inset 0px 5px 10px #b5b5b5;
            padding-top: 3px;
            & .collectible{
                filter: grayscale(1);
            }
        }
    }

    /* Animations */
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

    mooot-crono{
        margin-left: auto;
    }

    mooot-keyboard {
        width: 100%;
    }
`
