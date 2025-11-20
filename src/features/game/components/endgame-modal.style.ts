import { css } from 'lit'

export const modalStyles = css`
    .modal {
        --spacing: 1.4rem;

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
        h2 {
            color: #7f6300;
        }
    }
    .modal.active {
        display: flex;
    }
    .modal .modal_box {
        position: relative;
        background-color: white;
        border-radius: 25px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .modal .modal_box::after {
        content: '';
        position: absolute;
        top: 7px;
        left: 6px;
        width: 95%;
        height: 96%;
        border: 2px dashed #e9b600;
        border-radius: 20px;
        pointer-events: none;
    }
    .modal .modal_box .header {
        display: flex;
        justify-content: space-between;
        position: relative;
        background-color: var(--keyboard-present);
        padding: var(--spacing);
        padding-bottom: 0.7rem;
    }
    .modal .modal_box .modal_content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing);
        padding: var(--spacing);
    }
    .modal .modal_box .modal__content__close {
        position: absolute;
        width: 20px;
        height: 20px;
        padding: 1rem;
        top: 13px;
        right: 10px;
        cursor: pointer;
    }
    .modal .modal_box .modal__buttons {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 1fr 1fr;
        background-color: var(--keyboard-present);
        padding: var(--spacing);
        padding-top: 0.9rem;
    }

    .stats {
        display: flex;
        flex-direction: column;
    }

    .collectibles{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding: var(--spacing);
    }

    .motbot_nextleague {
        padding: 0.5rem 0.6rem;
        border-radius: 4px;
        border: 1px solid var(--keyboard-border-present);
        background-color: var(--keyboard-present);
    }

    .modal button,
    .modal .button {
        border: none;
        background-color: var(--button-color);
        color: var(--keyboard-text);
        border: 1px solid var(--button-border-color);
        padding: 0.8rem 1rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        text-decoration: none;
    }
    .modal .button.button--danger,
    .modal button.button--danger {
        background-color: var(--button-danger-color);
        border: 1px solid var(--button-danger-border-color);
        color: var(--keyboard-text);
    }
    .modal .button img,
    .modal button img {
        width: 15px;
        height: 15px;
    }
    .pointedRow {
        display: flex;
        gap: 0.2rem;
        & p:first-child {
            font-style: italic;
            font-weight: 400;
        }
        & p:last-child {
            font-weight: 900;
            font-family: monospace;
        }
        & a {
            font-weight: 900;
            font-family: monospace;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            text-decoration: none;
            color: #7f6300;
            & img {
                width: 15px;
                height: 15px;
            }
        }
        & > span {
            flex: 1;
            border-bottom: 1px dotted var(--cell-border);
            margin-bottom: 5px;
        }
    }
`
