import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'

@customElement('mooot-header-logo')
export class MoootHeaderLogo extends LitElement {
    static styles = [
        global,
        css`
            :host {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            .tile {
                width: 28px;
                aspect-ratio: 1;
                border-radius: 3px;
                display: grid;
                place-content: center;
                font-size: 0.8rem;
                color: var(--text-color);
                font-family: 'Jua';

                background-color: var(--present-color);
                box-sizing: border-box;
                color: #e9b600;
                box-shadow: inset 0px -2px 0px 0px #e9b600;
                padding-top: 1px;
            }
        `,
    ]

    @property({ type: String })
    text: string = 'MOOOT'

    render() {
        const chars = Array.from(this.text?.toUpperCase?.() || '')
        return html`${chars.map((c) => html`<span class="tile">${c}</span>`)}`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mooot-header-logo': MoootHeaderLogo
    }
}
