import { getUserFirstName } from '@src/core/telegram'
import { LitElement, html, css } from 'lit-element'
import { property } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'

import '@src/shared/components/button-mooot'

class CalloutCreategroups extends LitElement {
    static styles = [
        global,
        css`
            .callout {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                justify-content: space-between;
                background-color: #fff6c5;
                border-radius: 5px;
                padding: 15px;
                p {
                    color: var(--text-dark);
                    font-size: 0.8rem;
                }
                .callout_buttons {
                    margin-left: auto;
                }
            }
        `,
    ]

    @property({ type: String }) userName = ''

    firstUpdated(): void {
        this.userName = getUserFirstName()
    }

    render() {
        return html`
            <div class="callout">
                <p>
                    <strong
                        >Psst, ${this.userName}, vols crear una lliga amb altra
                        gent?</strong
                    ><br />
                    <i>Crea un grup de Telegram, afegeix els teus amics i a @mooot_cat_bot</i>
                </p>
                <div class="callout_buttons">
                    <button-mooot
                        link="/com-jugar/"
                        label="Veure instruccions"
                    ></button-mooot>
                </div>
            </div>
        `
    }
}
customElements.define('callout-creategroups', CalloutCreategroups)
