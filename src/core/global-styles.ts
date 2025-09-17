import { css } from 'lit'

export const global = css`
    /* Make custom properties available in both document and shadow roots */
    :host,
    :root {
        --cell: #f9f9f9;
        --cell-border: #ccc;

        --correct-color: var(--color-green-success);
        --correct-border-color: var(--color-green-success--border);
        --present-color: #ffe99a;
        --present-border-color: #fdc264;
        --missing-color: #848484;
        --missing-border-color: #3a3a3a;
        --text-color: #333333;
        --used-text-color: var(--text-color);

        --color-red-warning: #ffe4e4;
        --color-red-warning--border: #ffb5b5;
        --color-green-success: #dbffd9;
        --color-green-success-shine: #ecffeb;
        --color-green-success--border: #68c563;

        --button-callout: #ffe298;

        --gold: #ffcb4578;
        --silver: #aaefff60;
        --bronze: #b99c6e60;

        --button-color: var(--color-green-success);
        --button-border-color: var(--color-green-success--border);

        --button-danger-color: var(--present-color);
        --button-danger-border-color: var(--present-border-color);
        --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
    }

    html,
    body {
        height: 100dvh;
        font-family: sans-serif;
        margin: 0;
    }

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
        color: var(--text-color);
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

    body {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .button {
        text-decoration: none;
        color: black;
    }
`
