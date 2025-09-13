import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@src/shared/components/trophy-badge'
import '@src/features/menu/components/user-trophies'
import { menu } from './style'
import { global } from '@src/pages/global-styles'

import '@src/shared/components/divider'
import '@src/features/menu/components/menu-header'
import '@src/shared/components/callout-creategroups'
import '@src/shared/components/pages-menu'

@customElement('mooot-menu')
export class MoootMenu extends LitElement {
    static styles = [menu, global]

    firstUpdated() {
        this.setScrollOnMainElement()
    }

    setScrollOnMainElement() {
        const content = this.renderRoot?.querySelector('.menu_content')
        if (content) {
            content.scrollTo({ left: content.clientWidth, behavior: 'instant' })
        }
    }

    open() {
        const menu = this.renderRoot?.querySelector('.menu') as HTMLElement
        menu?.classList.add('active')
    }

    close() {
        const menu = this.renderRoot?.querySelector('.menu') as HTMLElement
        menu?.classList.remove('active')
    }

    render() {
        return html`
            <section class="menu active">
                <menu-header @closeMenu=${() => this.close()}></menu-header>
                <div class="menu_content">
                    <div id="menu-trophies" class="menu_section">
                        <div class="menu_section_content">
                            <p>Trofeus</p>
                        </div>
                    </div>
                    <div id="menu-profile" class="menu_section">
                        <div class="menu_section_content">
                            <p>Tu</p>
                        </div>
                    </div>
                    <div id="menu-leagues" class="menu_section">
                        <div class="menu_section_content">
                            <p>Lligues</p>
                        </div>
                    </div>
                </div>
                <div class="menu_footer">
                    <callout-creategroups></callout-creategroups>
                    <pages-menu></pages-menu>
                </div>
            </section>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mooot-menu': MoootMenu
    }
}
