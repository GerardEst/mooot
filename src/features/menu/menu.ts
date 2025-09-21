import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@src/shared/components/trophy-badge'
import { menu } from './style'
import { global } from '@src/core/app-reset-styles'

import '@src/shared/components/divider'
import '@src/features/menu/components/menu-header'
import '@src/shared/components/callout-creategroups'
import '@src/features/subpages/components/pages-menu'
import '@src/shared/components/stat-display'
import '@src/features/trophies/trophies-expositor'
import '@src/features/menu/components/menu-stats'
import '@src/features/menu/components/menu-leagues'

@customElement('mooot-menu')
export class MoootMenu extends LitElement {
    static styles = [global, menu]

    @property() activeMenuSection: string = 'profile'

    menuSections = ['trophies', 'profile', 'leagues']

    // When navigating programmatically, hold the target index to avoid
    // scroll events temporarily overriding the clicked active state.
    private scrollTargetIndex: number | null = null
    private clearTargetTimeout: number | null = null

    firstUpdated() {
        this.scrollOnMenuSection(1, true)
    }

    scrollOnMenuSection(index: number, instant = false) {
        const content = this.renderRoot?.querySelector('.menu_content')

        if (content) {
            content.scrollTo({
                left: index * content.clientWidth,
                behavior: instant ? 'instant' : 'smooth',
            })
        }
    }

    updateActiveMenuSection(scrollEvent: Event) {
        const content = scrollEvent.target as HTMLElement | null
        if (!content) return
        const width = content.clientWidth || 1
        const index = Math.round((content as HTMLElement).scrollLeft / width)
        const section = this.menuSections[index]
        // If we're in a programmatic scroll, ignore intermediate indices
        // until we reach the intended target index. This prevents flicker
        // where click sets active, scroll resets it, and then sets again.
        if (this.scrollTargetIndex !== null) {
            if (index === this.scrollTargetIndex) {
                if (section && section !== this.activeMenuSection) {
                    this.activeMenuSection = section
                }
                this.scrollTargetIndex = null
                if (this.clearTargetTimeout !== null) {
                    clearTimeout(this.clearTargetTimeout)
                    this.clearTargetTimeout = null
                }
            }
            return
        }

        if (section && section !== this.activeMenuSection) {
            this.activeMenuSection = section
        }
    }

    goToMenuSection(section: string) {
        this.activeMenuSection = section
        const targetIndex = this.menuSections.findIndex(
            (mappedSection) => section === mappedSection
        )
        if (targetIndex < 0) return

        // Set target index to suppress intermediate scroll updates
        this.scrollTargetIndex = targetIndex
        // Failsafe to clear the lock in case of interruptions
        if (this.clearTargetTimeout !== null) {
            clearTimeout(this.clearTargetTimeout)
        }
        this.clearTargetTimeout = window.setTimeout(() => {
            this.scrollTargetIndex = null
            this.clearTargetTimeout = null
        }, 1000)

        this.scrollOnMenuSection(targetIndex)
    }

    close() {
        this.dispatchEvent(new CustomEvent('closeMenu', { bubbles: true }))
    }

    render() {
        return html`
            <section class="menu active">
                <menu-header
                    @onClickMenuSection=${(e: CustomEvent) =>
                        this.goToMenuSection(e.detail)}
                    .activeMenuSection=${this.activeMenuSection}
                    @closeMenu=${() => this.close()}
                ></menu-header>
                <div
                    class="menu_content"
                    @scroll=${(e: Event) => this.updateActiveMenuSection(e)}
                >
                    <div id="menu-trophies" class="menu_section">
                        <div class="menu_section_content">
                            <trophies-expositor></trophies-expositor>
                        </div>
                    </div>
                    <div id="menu-profile" class="menu_section">
                        <div class="menu_section_content">
                            <menu-stats></menu-stats>
                        </div>
                    </div>
                    <div id="menu-leagues" class="menu_section">
                        <div class="menu_section_content">
                            <menu-leagues></menu-leagues>
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
