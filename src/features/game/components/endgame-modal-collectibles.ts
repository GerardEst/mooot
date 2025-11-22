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
                transform: translateX(-70%) scale(0);
                opacity: 0;
                transition: 200ms;
                &.revealed{
                    opacity: 1;
                    transform: translateX(-60%) scale(1);
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

    @property({ type: Array }) collectibles: CollectibleInterfaceFront[] = []
    @state() collectiblesContainers: any[] = []

    connectedCallback(): void {
        super.connectedCallback()

        this.collectiblesContainers = this.collectibles.map(collectible => {
            return { revealed: false }
        })


        this.revealCollectiblesContainers()

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
            }, 200 * i)
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
