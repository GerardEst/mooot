import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { jocPage } from './style'
import { global } from '@src/pages/global-styles'
import '@src/features/game/game'
import '@src/features/menu/menu'
import '@src/shared/components/header-logo'
import '@src/shared/components/flag'

@customElement('mooot-joc-page')
export class MoootJocPage extends LitElement {
    static styles = [global, jocPage]

    @property({ type: Boolean }) menuActive = false

    openMenu() {
        this.menuActive = true
    }

    closeMenu() {
        this.menuActive = false
    }

    render() {
        return html`
            <header>
                <mooot-flag></mooot-flag>
                <mooot-header-logo text="MOOOT"></mooot-header-logo>
                <div @click=${() => this.openMenu()} class="openMenuButton">
                    <img alt="Obrir menu" width="20" src="/assets/menu.svg" />
                </div>
            </header>
            <mooot-joc-game></mooot-joc-game>
            ${this.menuActive
                ? html`<mooot-menu @closeMenu=${this.closeMenu}></mooot-menu>`
                : ''}
        `
    }
}
