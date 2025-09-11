import { css } from 'lit'

export const menu = css`
    .menu {
        position: fixed;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(7px);
        &.active {
            display: flex;
        }
        & .menu__content {
            position: relative;
            max-width: 500px;
            width: 100%;
            height: 100vh;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            padding: 0 1rem;
            & .menu__content__header {
                padding: 1rem 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                box-sizing: border-box;
                justify-items: center;
                & .closeMenu {
                    display: flex;
                    cursor: pointer;
                    padding: 15px;
                    margin-right: -15px;
                    justify-self: flex-end;
                }
            }
            & .menu__stats {
                display: none;
                flex: 1;
                padding: 2rem 0;
            }
            & .menu__section {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding-bottom: 2rem;
            }
            & .menu__links {
                display: flex;
                gap: 0.6rem;
                flex-wrap: wrap;
                justify-content: center;
                padding-bottom: 1rem;
            }
            & .menu__motbot {
                flex: 1;
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                & .moootbot_badge {
                    position: absolute;
                    top: -20px;
                    right: -20px;
                    transform: rotate(14deg);
                    /* background-color: var(--button-danger-color); */
                    border-radius: 100%;
                    padding: 0.3rem;
                }
                & .menu__motbot__row {
                    display: flex;
                    gap: 1rem;
                    justify-content: space-between;
                }
                & .moootbotCallout {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    margin-top: auto;
                    gap: 0.7rem;
                    padding: 10px 13px;
                    padding-right: 40px;
                    border: 1px solid var(--cell-border);
                    border-radius: 4px;
                    background-color: var(--cell);
                    & .callout_buttons {
                        display: flex;
                        gap: 0.5rem;
                        a:first-child {
                            background-color: var(--button-callout);
                            border: none;
                            padding: 0.7rem 1rem;
                        }
                        a:last-child {
                            background: white;
                            border-color: var(--cell-border);
                            padding: 0.7rem 1rem;
                        }
                    }
                }
            }
        }
    }
    .motbot_trophies {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        & .motbot_trophies_col {
            display: flex;
            flex: 1;
            flex-direction: column;
            gap: 0.4rem;
        }
    }
`
