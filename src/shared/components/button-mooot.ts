import { LitElement, html, css } from 'lit-element'
import { global } from '@src/core/global-styles'
import { property } from 'lit/decorators.js'

class ButtonMooot extends LitElement {
    static styles = [
        global,
        css`
            button {
                padding: 6px 15px;
                border-radius: 30px;
                background-color: white;
                border: 2px solid #fdd70e;
                font-weight: 700;
            }
            button.selected {
                background-color: #fdd70e;
                border-color: white;
                color: white;
            }
        `,
    ]

    @property() label: string = ''
    @property({ type: Boolean }) selected: boolean = false

    onClick() {
        this.dispatchEvent(
            new CustomEvent('button-click', { bubbles: true, composed: true })
        )
    }

    render() {
        return html`
            <button
                @click=${() => this.onClick()}
                class=${this.selected ? 'selected' : ''}
            >
                ${this.label}
            </button>
        `
    }
}

customElements.define('button-mooot', ButtonMooot)
