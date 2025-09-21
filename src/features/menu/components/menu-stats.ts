import { LitElement, html, css } from 'lit'
import { global } from '@src/core/app-reset-styles'
import '@src/shared/components/stat-display'

export class MenuStats extends LitElement {
    static styles = [
        global,
        css`
            :host {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            div {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
            }
        `,
    ]

    render() {
        return html` <div>
            <h4>Estadístiques totals</h4>
            <stat-display key="games" name="Partides jugades"></stat-display>
            <stat-display key="totalPoints" name="Punts totals"></stat-display>
            <stat-display
                key="averagePoints"
                name="Mitjana de punts"
            ></stat-display>
            <stat-display
                key="averageTime"
                name="Mitjana de temps"
            ></stat-display>
            <stat-display key="streak" name="Ratxa actual"></stat-display>
            <stat-display key="maxStreak" name="Ratxa màxima"></stat-display>
        </div>`
    }
}

customElements.define('menu-stats', MenuStats)
