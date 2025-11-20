import { css } from 'lit'

export const global = css`
    h1,
    h2,
    h3,
    h4,
    p,
    a {
        margin: 0;
    }

    .smallText {
        font-size: 0.8rem;
        color: var(--keyboard-text);
        font-style: italic;
    }

    * {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        /* Remove blue tap highlight on mobile Safari/Chrome */
        -webkit-tap-highlight-color: transparent;
    }

    /* Keep keyboard focus outlines, hide for pointer taps/clicks */
    *:focus {
        outline: none;
    }
    *:focus-visible {
        outline: auto;
    }

    .button {
        text-decoration: none;
        color: black;
    }
`
