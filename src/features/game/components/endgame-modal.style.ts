import { css } from 'lit'

export const modalStyles = css`
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

    .stats {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .motbot_nextleague {
        padding: 0.5rem 0.6rem;
        border-radius: 4px;
        border: 1px solid var(--present-border-color);
        background-color: var(--present-color);
    }

    .modal button,
    .modal .button {
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
    .modal .button.button--danger,
    .modal button.button--danger {
        background-color: var(--button-danger-color);
        border: 1px solid var(--button-danger-border-color);
        color: var(--text-color);
    }
    .modal .button img,
    .modal button img {
        width: 15px;
        height: 15px;
    }
`
