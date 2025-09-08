import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { jocPage } from './style'
import { global } from '@src/pages/global-styles'
import '@src/features/game/game'
import '@src/features/menu/menu'
import '@src/shared/components/header-logo'
import '@src/shared/components/flag'

@customElement('mooot-joc-page')
export class MoootJocPage extends LitElement {
    static styles = [global, jocPage]

    firstUpdated(): void {
        const root = this.renderRoot
        const openMenuBtn = root.querySelector(
            '#openMenu'
        ) as HTMLElement | null
        openMenuBtn?.addEventListener('click', () => {
            const menu = root.querySelector('mooot-menu') as any
            menu?.open?.()
        })
    }

    render() {
        return html`
            <header>
                <mooot-flag></mooot-flag>
                <mooot-header-logo text="MOOOT"></mooot-header-logo>
                <div id="openMenu" class="openMenuButton">
                    <img alt="Obrir menu" width="20" src="/assets/menu.svg" />
                </div>
            </header>
            <mooot-joc-game></mooot-joc-game>
            <mooot-menu></mooot-menu>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mooot-joc-page': MoootJocPage
    }
}
