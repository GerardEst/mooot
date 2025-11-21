import { getAllCollectibles, getUserCollectibles } from '@src/core/api/collectibles'
import { LitElement, html, css } from 'lit'
import { state } from 'lit/decorators.js'

import '@src/shared/components/collectible'
import { getMonthName } from '@src/shared/utils/time-utils'

export class MenuAlbum extends LitElement {
    static styles = css`
        .album{
            display: flex;
            flex-direction: column;
            overflow: auto;
            height: 100%;
            padding: 3px; // Perquè es vegin les sombres de les cartes de l'última columna
        }
        .month_collectibles:not(:first-child){
            display: flex;
            flex-direction: column;
            margin-top: 50px;
        }
        .month_name{
            text-transform: capitalize;
            font-weight: 900;
            font-size: 1.2rem;
            margin: 0;
        }
        .month_collectibles_list{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
            grid-template-rows: auto;
            gap: 30px 15px;
        }
    `
    @state() allCollectibles = []
    @state() userCollectibles = []

    async connectedCallback(): Promise<void> {
        super.connectedCallback()

        this.allCollectibles = await getAllCollectibles()
        this.userCollectibles = await getUserCollectibles()
    }

    render() {
        const months = []
        for (let i = 11; i <= 12; i++) {
            months.push(html`
                <div class="month_collectibles">
                <p class="month_name">${getMonthName(i)}</p>
                <div class="month_collectibles_list">
                ${this.allCollectibles
                    .filter(collectible => collectible.month === i)
                    .map(collectible => html`
                        <mooot-collectible 
                            .collectibleData=${collectible} 
                            ?revealed=${true} 
                            ?disabled=${!this.userCollectibles.includes(collectible.id)}>
                        </mooot-collectible>
                    `)
                }
                </div>    
                </div>
            `)
        }
        return html`
            <div class="album">${months}</div>`
    }
}

customElements.define('menu-album', MenuAlbum)
