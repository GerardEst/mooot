import { LitElement, html, css } from 'lit-element'
import { global } from '@src/core/app-reset-styles'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

class ButtonMooot extends LitElement {
    static styles = [
        global,
        css`
            button,
            a.button {
                padding: 6px 15px;
                border-radius: 5px;
                background-color: white;
                border: none;
                box-shadow: 0 2px 0 #ffdc1b;
                font-weight: 600;
                font-size: 0.8rem;
                font-family: 'Montserrat';
                color: #7f6300;
            }
            .icon {
                display: inline-flex;
                margin-right: 6px;
                line-height: 0;
            }
            slot[name='icon']::slotted(*) {
                display: inline-flex;
                margin-right: 6px;
                line-height: 0;
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
    @property() borders: string | null = null
    @property({ type: Boolean }) selected: boolean = false
    @property({ type: Boolean }) fillContainer: boolean = false
    // Optional icon. If provided, rendered before label. Alternatively, use a named slot "icon".
    @property() icon: string | null = null

    onClick() {
        this.dispatchEvent(
            new CustomEvent('button-click', { bubbles: true, composed: true })
        )
    }

    render() {
        const classes = {
            selected: this.selected,
            fillContainer: this.fillContainer,
        }
        const iconTemplate = this.icon
            ? html`<span class="icon" aria-hidden="true">${this.icon}</span>`
            : html`<slot name="icon"></slot>`

        return html`${this.link
            ? html`<a class="button" href=${this.link}
                  >${iconTemplate}${this.label}</a
              >`
            : html`<button
                  @click=${() => this.onClick()}
                  class=${classMap(classes)}
                  style=${this.borders ? `border-radius: ${this.borders}` : ''}
              >
                  ${iconTemplate}${this.label}
              </button>`}`
    }
}

customElements.define('button-mooot', ButtonMooot)
