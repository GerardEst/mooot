import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'

@customElement('mooot-collectible')
export class Collectible extends LitElement {
    static styles = [
        global,
        css`
            .collectible{
                background-color: var(--present-color);
                width: 100px;
                height: 120px;
                border-radius: 15px;
            }
        `,
    ]

    @property({ type: String }) name = ''
    @property({ type: Number }) rarity = 0

    @state() revealed = false

    connectedCallback(): void {
        super.connectedCallback()
    }

    render() {
        return html`
            <div class="collectible" @click=${() => this.revealed = true}>
                ${this.revealed ? html`
                        ${this.name}
                ` : html`
                ${this.rarity}
                `}
            </div>
        `
    }
}
