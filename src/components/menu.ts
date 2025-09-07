import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { updateMenuData } from '@src/stats-module'
import '@src/components/trophy-badge'

@customElement('mooot-menu')
export class MoootMenu extends LitElement {
    // Render into light DOM so global CSS and document.querySelector work
    createRenderRoot() {
        return this
    }

    connectedCallback(): void {
        super.connectedCallback()
        // Hook external open button
        const opener = document.getElementById('openMenu')
        opener?.addEventListener('click', this.openMenu)

        console.log('Every time')
    }

    fillPlaceholderWith(text: string, location: string) {
        const usernamePlaceholders = document.querySelectorAll(location)

        for (const placeholder in usernamePlaceholders) {
            usernamePlaceholders[placeholder].textContent = text
        }
    }

    firstUpdated(): void {
        console.log('First time')
        // updateMenuData()

        // Fill placeholder with name
        this.fillPlaceholderWith(
            window.Telegram.WebApp.initDataUnsafe.user.first_name,
            '.placeholder_userName'
        )
    }

    private openMenu = () => {
        const menu = this.querySelector('.menu')
        menu?.classList.add('active')
    }

    private closeMenu = () => {
        const menu = this.querySelector('.menu')
        menu?.classList.remove('active')
    }

    render() {
        return html`
            <section class="menu">
                <div class="menu__content">
                    <header class="menu__content__header">
                        <img
                            alt="Bandera de l'idioma"
                            class="flag"
                            src="/assets/flag.jpg"
                            alt="Mooot Logo"
                        />
                        <div class="header__logo">
                            <span>L</span>
                            <span>L</span>
                            <span>I</span>
                            <span>G</span>
                            <span>A</span>
                        </div>
                        <div
                            id="closeMenu"
                            class="closeMenu"
                            @click=${this.closeMenu}
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
                            <h4>Els teus premis</h4>
                            <user-trophies></user-trophies>
                            <a href="/trofeus">Ampliar</a>
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
                    <!-- <div class="menu__stats">
                        <section class="stats">
                            <div class="pointedRow">
                                <p>Partides jugades</p>
                                <span></span>
                                <p id="menustats-games"></p>
                            </div>
                            <div class="pointedRow">
                                <p>Punts totals</p>
                                <span></span>
                                <p id="menustats-totalPoints"></p>
                            </div>
                            <div class="pointedRow">
                                <p>Mitjana de punts</p>
                                <span></span>
                                <p id="menustats-averagePoints"></p>
                            </div>
                            <div class="pointedRow">
                                <p>Ratxa actual</p>
                                <span></span>
                                <p id="menustats-streak"></p>
                            </div>
                            <div class="pointedRow">
                                <p>Ratxa màxima</p>
                                <span></span>
                                <p id="menustats-maxStreak"></p>
                            </div>
                        </section>
                    </div> -->

                    <div class="divider"></div>
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
