import { css } from 'lit'

export const jocPage = css`
    header {
        max-width: 500px;
        padding: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        justify-items: center;
    }
    header > mooot-flag {
        justify-self: flex-start;
    }
    header > .openMenuButton {
        display: flex;
        cursor: pointer;
        padding: 15px;
        margin-right: -15px;
        justify-self: flex-end;
    }

    mooot-joc-game {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        padding-bottom: 50px;
    }
`
