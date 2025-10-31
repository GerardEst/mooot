import { LitElement, html, css } from 'lit-element'
import { global } from '@src/core/app-reset-styles'

import '@src/shared/components/button-mooot'
import { property } from 'lit/decorators.js'

class MenuHeader extends LitElement {
    static styles = [
        global,
        css`
            header {
                --spacing: 25px;
                position: relative;
                display: flex;
                flex-direction: column;
                background: var(--present-color);
                /* background: linear-gradient(
                    157deg,
                    rgba(255, 246, 197, 1) 31%,
                    rgb(255 219 95) 100%
                ); */
                padding: var(--spacing);
                padding-bottom: 12px;
                gap: var(--spacing);
                h4 {
                    color: rgb(127 99 0);
                }
                & .sections {
                    display: flex;
                    justify-content: space-between;
                }
                & .closeMenu {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: var(--spacing);
                }
            }
        `,
    ]

    @property() activeMenuSection: string = 'profile'

    onClickMenuSection(section: string) {
        this.dispatchEvent(
            new CustomEvent('onClickMenuSection', {
                bubbles: true,
                composed: true,
                detail: section,
            })
        )
    }

    close() {
        this.dispatchEvent(
            new Event('closeMenu', { bubbles: true, composed: true })
        )
    }
    render() {
        return html` <header>
            <div class="closeMenu" @click=${this.close}>
                <img alt="Tancar menu" width="20" src="/assets/close.svg" />
            </div>
            <div>
                <h4>🍯 Lliga Artesanal</h4>
                <p class="smallText">1 - 31 d'Octubre</p>
            </div>
            <div class="sections">
                <button-mooot
                    ?selected="${this.activeMenuSection === 'trophies'}"
                    @button-click=${() => this.onClickMenuSection('trophies')}
                    label="Trofeus"
                ></button-mooot>
                <button-mooot
                    ?selected=${this.activeMenuSection === 'profile'}
                    @button-click=${() => this.onClickMenuSection('profile')}
                    label="Perfil"
                ></button-mooot>
                <button-mooot
                    ?selected=${this.activeMenuSection === 'leagues'}
                    @button-click=${() => this.onClickMenuSection('leagues')}
                    label="Lligues"
                ></button-mooot>
            </div>
        </header>`
    }
}
customElements.define('menu-header', MenuHeader)
