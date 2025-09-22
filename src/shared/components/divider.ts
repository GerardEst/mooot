import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('mooot-divider')
export class MoootDivider extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            border-bottom: 1px solid var(--cell-border);
            margin: 1rem 0;
        }
    `

    render() {
        return html``
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mooot-divider': MoootDivider
    }
}

