import { getUserFirstName } from '@src/core/telegram'
import { LitElement, html, css } from 'lit-element'
import { property } from 'lit/decorators.js'
import { global } from '@src/pages/global-styles'

class CalloutCreategroups extends LitElement {
    static styles = [
        global,
        css`
            .callout {
                border: 2px solid #fdd70e;
                background-color: #fff6c5;
                border-radius: 30px;
                padding: 10px 20px;
            }
        `,
    ]

    @property({ type: String }) userName = ''

    firstUpdated(): void {
        this.userName = getUserFirstName()
    }

    render() {
        return html`<div class="callout">
            <h4>Psst, ${this.userName}, vols guanyar més premis?</h4>
            <div class="callout_buttons">
                <a
                    class="button"
                    href="https://t.me/mooot_cat_bot?startgroup=true"
                    ><strong>Crea una altra lliga</strong></a
                >
                <a class="button" href="/com-jugar/">Com es fa?</a>
            </div>
        </div>`
    }
}
customElements.define('callout-creategroups', CalloutCreategroups)
