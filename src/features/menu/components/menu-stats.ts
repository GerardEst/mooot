import { LitElement, html, css } from 'lit'
import { global } from '@src/core/app-reset-styles'
import '@src/shared/components/stat-display'
import '@src/shared/components/callout-creategroups'

export class MenuStats extends LitElement {
    static styles = [
        global,
        css`
            :host {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                height: 100%;
            }
            div {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
            }
            callout-creategroups{
                margin-top: auto;
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
            <stat-display key="streak" name="Ratxa actual"></stat-display>
            <stat-display key="maxStreak" name="Ratxa màxima"></stat-display>
            <callout-creategroups></callout-creategroups>
        </div>`
    }
}

customElements.define('menu-stats', MenuStats)
