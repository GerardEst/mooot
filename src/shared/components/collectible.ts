import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'

@customElement('mooot-collectible')
export class Collectible extends LitElement {
    static styles = [
        global,
        css`
            .collectible{
                padding: 2rem;
            }
        `,
    ]

    @property({ type: String }) name = ''
    @property({ type: Number }) rarity = 0

    connectedCallback(): void {
        super.connectedCallback()
    }

    render() {
        return html`<div class="collectible">${this.name}</div>`
    }
}
