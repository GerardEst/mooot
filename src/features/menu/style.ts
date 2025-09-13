import { css } from 'lit'

export const menu = css`
    .menu {
        position: fixed;
        display: none;
        flex-direction: column;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: white;
        timeline-scope: --menu-x;
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
            scroll-timeline-name: --menu-x;
            scroll-timeline-axis: inline;
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
            padding: 16px 20px;
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

    @keyframes hide {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-100px);
        }
    }

    @supports (animation-timeline: --foo) and (scroll-timeline-name: --bar) {
        .menu menu-header {
            animation-name: hide;
            animation-duration: 1s;
            animation-timing-function: linear;
            animation-fill-mode: both;
            animation-timeline: --menu-x;
            animation-range: 0% 100%;
        }
    }
`
