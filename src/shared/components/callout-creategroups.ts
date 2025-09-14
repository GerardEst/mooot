import { getUserFirstName } from '@src/core/telegram'
import { LitElement, html, css } from 'lit-element'
import { property } from 'lit/decorators.js'
import { global } from '@src/core/global-styles'

import '@src/shared/components/button-mooot'

class CalloutCreategroups extends LitElement {
    static styles = [
        global,
        css`
            .callout {
                display: flex;
                gap: 1rem;
                justify-content: space-between;
                border: 2px solid #fdd70e;
                background-color: #fff6c5;
                border-radius: 30px;
                padding: 5px;
                padding-left: 15px;
                align-items: center;
                p {
                    font-size: 0.8rem;
                }
            }
        `,
    ]

    @property({ type: String }) userName = ''

    firstUpdated(): void {
        this.userName = getUserFirstName()
    }

    render() {
        return html`<div class="callout">
            <p>
                <strong
                    >Psst, ${this.userName}, vos jugar contra més gent?</strong
                ><br />
                <i>Potser així guanyaràs algo</i>
            </p>
            <div class="callout_buttons">
                <button-mooot label="Si!"></button-mooot>
            </div>
        </div>`
    }
}
customElements.define('callout-creategroups', CalloutCreategroups)
