import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('trophy-badge')
export class TrophyBadge extends LitElement {
    static styles = css`
        .trophy {
            height: 50px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            border-radius: 5px;
            padding: 6px 8px;
            border: 2px solid;
            margin: 0;
        }
        .trophy.small {
            width: 60px;
            height: 60px;
            border-radius: 15px;
        }
        .gold_trophy {
            background-color: var(--gold);
            border-color: var(--gold-border);
        }
        .silver_trophy {
            background-color: var(--silver);
            border-color: var(--silver-border);
        }
        .bronze_trophy {
            background-color: var(--bronze);
            border-color: var(--bronze-border);
        }
    `

    @property({ type: Number })
    position: number = 1
    @property({ type: String })
    name: string = ''
    @property({ type: String })
    emoji: string = ''
    @property({ type: Boolean })
    small: boolean = false

    private computeVariant(): 'gold' | 'silver' | 'bronze' | 'normal' {
        return this.position === 0 || this.position === 5
            ? 'gold'
            : this.position === 1 || this.position === 6
            ? 'silver'
            : this.position === 2 || this.position === 7
            ? 'bronze'
            : 'normal'
    }

    render() {
        const variant = this.computeVariant()
        return html`<div class="trophy ${variant}_trophy">
            ${this.emoji} ${!this.small ? this.name : ''}
        </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'trophy-badge': TrophyBadge
    }
}
