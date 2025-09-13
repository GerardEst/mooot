import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { getStoredStat, storedStats } from '../utils/stats-utils'
import { global } from '@src/pages/global-styles'

@customElement('stat-display')
export class StatDisplay extends LitElement {
    static styles = [
        global,
        css`
            :host {
                display: flex;
                gap: 0.6rem;
                align-items: flex-end;
            }
            p:first-child {
                font-style: italic;
            }
            p:last-child {
                font-weight: 900;
                font-family: monospace;
            }
            span {
                flex: 1;
                border-bottom: 1px dotted gray;
            }
        `,
    ]
    @property({ type: String }) name: string | undefined = undefined
    @property({ type: String }) key: keyof storedStats | undefined = undefined
    @property({ type: String }) value: number | string | undefined = undefined

    firstUpdated() {
        if (!this.key) return

        const value = getStoredStat(this.key)
        if (typeof value === 'number' && value % 1 !== 0) {
            // If the value is a float, show only 2 decimals
            this.value = value.toFixed(2)
        } else {
            this.value = value
        }
    }

    render() {
        return html`
            <p>${this.name}</p>
            <span></span>
            <p>${this.value}</p>
        `
    }
}
