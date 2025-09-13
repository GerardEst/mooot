import { LitElement, html, css } from 'lit-element'
import { global } from '@src/pages/global-styles'

class MenuHeader extends LitElement {
    event = new Event('closeMenu', { bubbles: true, composed: true })

    static styles = [
        global,
        css`
            header {
                --spacing: 20px;
                position: relative;
                display: flex;
                flex-direction: column;
                background: #fff6c5;
                background: linear-gradient(
                    157deg,
                    rgba(255, 246, 197, 1) 31%,
                    rgb(255 219 95) 100%
                );
                padding: var(--spacing);
                gap: var(--spacing);
            }
            .closeMenu {
                position: absolute;
                top: 0;
                right: 0;
                padding: var(--spacing);
            }
        `,
    ]

    close() {
        this.dispatchEvent(this.event)
    }
    render() {
        return html` <header>
            <div class="closeMenu" @click=${this.close}>
                <img alt="Tancar menu" width="20" src="/assets/close.svg" />
            </div>
            <div>
                <h4>💛 Lliga de Catalunya</h4>
                <p class="smallText">1 - 30 de Setembre</p>
            </div>
            <div class="sections">
                <span>Trofeus</span>
                <span>Gerard</span>
                <span>Lligues</span>
            </div>
        </header>`
    }
}
customElements.define('menu-header', MenuHeader)
