import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@src/shared/components/trophy-badge'
import '@src/pages/joc/components/user-trophies'
import { menu } from './style'
import { global } from '@src/pages/global-styles'
import '@src/pages/joc/components/header-logo'
import '@src/pages/joc/components/flag'
import '@src/pages/joc/components/divider'

@customElement('mooot-menu')
export class MoootMenu extends LitElement {
    static styles = [menu, global]

    fillPlaceholderWith(text: string, location: string) {
        const usernamePlaceholders = document.querySelectorAll(location)

        for (const placeholder in usernamePlaceholders) {
            // @ts-ignore - querySelectorAll NodeList access via index
            usernamePlaceholders[placeholder].textContent = text
        }
    }

    firstUpdated(): void {
        // updateMenuData()

        // Fill placeholder with name
        const firstName =
            window?.Telegram?.WebApp?.initDataUnsafe?.user?.first_name
        if (firstName)
            this.fillPlaceholderWith(firstName, '.placeholder_userName')
    }

    // Public API to control menu from parent
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
            <section class="menu">
                <div class="menu__content">
                    <header class="menu__content__header">
                        <mooot-flag></mooot-flag>
                        <mooot-header-logo text="LLIGA"></mooot-header-logo>
                        <div
                            id="closeMenu"
                            class="closeMenu"
                            @click=${this.close}
                        >
                            <img
                                alt="Tancar menu"
                                width="20"
                                src="/assets/close.svg"
                            />
                        </div>
                    </header>
                    <div class="menu__motbot">
                        <div class="menu__motbot__row">
                            <div>
                                <h4>💛 Lliga de Catalunya</h4>
                                <p class="smallText">1 - 30 de Setembre</p>
                            </div>
                        </div>
                        <div>
                            <h4>Premis en joc</h4>
                            <div class="motbot_trophies">
                                <div class="motbot_trophies_col">
                                    <i>Estàndar</i>
                                    <trophy-badge
                                        position=${0}
                                        emoji="🥇🌾"
                                        name="Segador d'or"
                                    ></trophy-badge>
                                    <trophy-badge
                                        position=${1}
                                        emoji="🥈👫🏻"
                                        name="Gegant de plata"
                                    ></trophy-badge>
                                    <trophy-badge
                                        position=${2}
                                        emoji="🥉💩"
                                        name="Caganer de bronze"
                                    ></trophy-badge>
                                </div>
                                <div class="motbot_trophies_col">
                                    <i>Contrarrellotge</i>
                                    <trophy-badge
                                        position=${5}
                                        emoji="🥇🖐🏼"
                                        name="Anxaneta d'or"
                                    ></trophy-badge>
                                    <trophy-badge
                                        position=${6}
                                        emoji="🥈🤝🏼"
                                        name="Sardana de plata"
                                    ></trophy-badge>
                                    <trophy-badge
                                        position=${7}
                                        emoji="🥉🪈"
                                        name="Gralla de bronze"
                                    ></trophy-badge>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4>Els teus trofeus</h4>
                            <user-trophies></user-trophies>
                        </div>
                        <div class="moootbotCallout">
                            <img
                                alt="Logo Mooot"
                                class="moootbot_badge"
                                width="60"
                                src="/assets/moootbot_M.png"
                            />
                            <h4>
                                Psst,
                                <span class="placeholder_userName"></span>, vols
                                guanyar més premis?
                            </h4>
                            <p style="line-height: 1.5">
                                Crea altres lligues privades amb qui vulguis
                                afegint el bot <i>mooot_cat_bot</i> a qualsevol
                                grup
                            </p>
                            <div class="callout_buttons">
                                <a
                                    class="button"
                                    href="https://t.me/mooot_cat_bot?startgroup=true"
                                    ><strong>Crea una altra lliga</strong></a
                                >
                                <a class="button" href="/">Com es fa?</a>
                            </div>
                        </div>
                    </div>
                    <mooot-divider></mooot-divider>
                    <div class="menu__section">
                        <p class="smallText">
                            Basat en el joc
                            <a
                                href="https://www.nytimes.com/games/wordle/index.html"
                                >Wordle</a
                            >
                            de <a href="https://www.nytco.com/">TNYT</a>
                        </p>
                        <p class="smallText">
                            Llistat de paraules extret del
                            <a href="https://diccionari.totescrable.cat/"
                                >DISC</a
                            >
                        </p>
                    </div>
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
