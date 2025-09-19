import { LitElement, html, css } from 'lit-element'
import { global } from '@src/core/global-styles'
import { property } from 'lit/decorators.js'

class ButtonMooot extends LitElement {
    static styles = [
        global,
        css`
            button,
            a {
                padding: 6px 15px;
                border-radius: 30px;
                background-color: white;
                border: 2px solid #fdd70e;
                font-weight: 700;
                font-size: 0.8rem;
            }
            button.selected,
            a.selected {
                background-color: #fdd70e;
                border-color: white;
                color: white;
            }
        `,
    ]

    @property() label: string = ''
    @property() link: string | null = null
    @property({ type: Boolean }) selected: boolean = false

    onClick() {
        this.dispatchEvent(
            new CustomEvent('button-click', { bubbles: true, composed: true })
        )
    }

    render() {
        return html`
            ${this.link
                ? html` <a class="button" href=${this.link}>${this.label}</a> `
                : html`
                      <button
                          @click=${() => this.onClick()}
                          class=${this.selected ? 'selected' : ''}
                      >
                          ${this.label}
                      </button>
                  `}
        `
    }
}

customElements.define('button-mooot', ButtonMooot)
