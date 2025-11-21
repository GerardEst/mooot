import { css } from 'lit'

export const menu = css`
    .menu {
        position: fixed;
        display: none;
        flex-direction: column;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100% - 1px);
        background-color: white;
        &.active {
            display: flex;
        }
        & .menu_content {
            flex: 1;
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            /* Hide scrollbar across browsers */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
            &::-webkit-scrollbar {
                display: none; /* Safari and Chrome */
            }
            & .menu_section {
                min-width: 100%;
                scroll-snap-align: start;
                scroll-snap-stop: always;
                & .menu_section_content {
                    padding: 20px;
                    min-height: 100%;
                    height: 100%;
                    box-sizing: border-box;
                }
            }
            & #menu-trophies {
                & .menu_section_content {
                    padding: 10px;
                }
            }
            & callout-creategroups {
                margin-top: auto;
            }
        }
        & .menu_footer {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 8px 10px;
            width: 100%;
            box-sizing: border-box;
            background-color: white;
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
