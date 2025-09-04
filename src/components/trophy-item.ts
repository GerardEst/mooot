import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('trophy-item')
export class TrophyItem extends LitElement {
    @property({ type: Number }) trophyId!: number
    @property({ type: String }) emoji: string = ''
    @property({ type: Boolean, reflect: true }) active: boolean = false

    createRenderRoot() {
        // Render in light DOM so page CSS applies to .trophy elements
        return this
    }

    render() {
        const classes = ['trophy']
        if (this.active) classes.push('active')

        return html`
            <div id=${`t_${this.trophyId}`} class=${classes.join(' ')}>
                ${this.emoji}
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'trophy-item': TrophyItem
    }
}
