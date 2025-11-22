import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'

import '@src/shared/components/collectible'
import { repeat } from 'lit/directives/repeat.js'
import { CollectibleInterfaceFront } from '../services/collectibles-controller'

@customElement('endgame-modal-collectibles')
export class EndgameModalCollectibles extends LitElement {
    static styles = [
        global,
        css`
            .container{
                position: relative;
                max-width: 110px;
            }
            .collectibleContainer{
                position: absolute;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: opacity 1s;
                &.revealed{
                    opacity: 1;
                }
            }
           .collectibles{
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                margin: var(--spacing);
                padding: 10px;
                border-radius: 20px; 
                background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #fff5d2 10px, #fff5d2 20px);
                background-color: #ffffff;
                & .title{
                    position: absolute;
                    top: -14px;
                    left: 2px;
                    font-weight: 700;
                    color: #7f6300;
                }
            }
        `,
    ]

    /** Esta apunt per currarnos una aparició més guai de tot. Primer els regals, després els sobres de cada un.
     * El dubte  que queda és, fem aquesta aparició aquí mateix o dins el component del collectible? 
     * Potser simplement animar aquí el que seria el conteinidor, es a dir la carta en si, i al component tot lo de dins.
     * Aqui el zoom i lo que sigui, al component la imatge, les estrelles...
     * 
     * Lo increible ja seria que gemini em fes una animació de com apareixen, i que al pitjar s'activi l'animació també
     */
    @property({ type: Array }) collectibles: CollectibleInterfaceFront[] = [{
        id: 20,
        image_tag: "neules",
        month: 11,
        name: "Coleccionable 5", rarity: 1,
        revealed: false
    }, {
        id: 20,
        image_tag: "neules",
        month: 11,
        name: "Coleccionable 5", rarity: 1,
        revealed: false
    }]
    @state() collectiblesContainers: any[] = this.collectibles.map(collectible => {
        return { revealed: false }
    })

    connectedCallback(): void {
        super.connectedCallback()

        setTimeout(() => {
            this.revealCollectiblesContainers()
        }, 100)

        // Revelar coleccionables després d'un moment, perquè tingui temps
        // de donar a entendre que venen dels regals aconseguits
        setTimeout(() => {
            this.revealCollectibles()
        }, 1000)
    }

    private revealCollectiblesContainers() {
        for (let i = 1; i <= this.collectiblesContainers?.length; i++) {
            setTimeout(() => {
                this.collectiblesContainers[i - 1].revealed = true
                this.requestUpdate()
            }, 500 * i)
        }
    }

    private revealCollectibles() {
        for (let i = 1; i <= this.collectibles?.length; i++) {
            setTimeout(() => {
                this.collectibles[i - 1].revealed = true
                this.requestUpdate()
            }, 500 * i)
        }
    }

    render() {
        return html`
        <div class="collectibles">
            <p class="title">Troballes</p>
            ${repeat(
            this.collectibles,
            (item, index) => `${item.id}_${index}`,
            (item, index) => html`
                <div class="container">
                    <div class="collectibleContainer ${this.collectiblesContainers[index].revealed ? 'revealed' : ''}">
                        <img src="assets/icons/collectible_present-open.svg" width="50" />
                    </div>
                    <mooot-collectible
                        id="collectible_${item.id}"
                        .collectibleData=${item}
                        ?revealed=${item.revealed}
                    ></mooot-collectible>
                </div>`

        )}
        </div>    
        `
    }
}
