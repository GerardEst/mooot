import { AWARDS } from '@src/conf'
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('trophy-item')
export class TrophyItem extends LitElement {
    static styles = css`
        .trophy {
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            border: 1px solid var(--cell-border, #ccc);
            background-color: var(--cell, #f9f9f9);
            color: var(--text-color, #333);
        }
    `

    @property({ type: Number }) trophyId!: number

    render() {
        const award = AWARDS.cat.find((award) => award.id === this.trophyId)
        if (!award) return

        return html` <div class="trophy">${award.emoji} ${award.name}</div> `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'trophy-item': TrophyItem
    }
}
