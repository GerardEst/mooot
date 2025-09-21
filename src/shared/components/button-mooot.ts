import { LitElement, html, css } from 'lit-element'
import { global } from '@src/core/app-reset-styles'
import { property } from 'lit/decorators.js'

class ButtonMooot extends LitElement {
    static styles = [
        global,
        css`
            button,
            a {
                padding: 6px 15px;
                border-radius: 5px;
                background-color: white;
                border: none;
                box-shadow: 0 2px 0 #ffdc1b;
                font-weight: 600;
                font-size: 0.8rem;
                font-family: 'Montserrat';
            }
            button.selected,
            a.selected {
                background-color: #fdd70e;
                border-color: white;
                color: white;
                box-shadow: 0 2px 0 #e3c000;
            }

            button.fillContainer,
            a.fillContainer {
                width: 100%;
                height: 100%;
            }
        `,
    ]

    @property() label: string = ''
    @property() link: string | null = null
    @property({ type: Boolean }) selected: boolean = false
    @property({ type: Boolean }) fillContainer: boolean = false

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
