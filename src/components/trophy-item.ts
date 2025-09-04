import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('trophy-item')
export class TrophyItem extends LitElement {
    static styles = css`
        .trophy {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            border: 1px solid var(--cell-border, #ccc);
            background-color: var(
                --cell,
                #f9f9f9
            ); /* fallback for encapsulation */
            transition: background-color 0.3s ease;
            color: var(--text-color, #333);
            opacity: 0.2;
        }
        .trophy.active {
            opacity: 1;
        }
    `
    @property({ type: Number }) trophyId!: number
    @property({ type: String }) emoji: string = ''
    @property({ type: Boolean, reflect: true }) active: boolean = false

    // Use shadow DOM to encapsulate styles

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
