import { getAllCollectibles, getUserCollectibles } from '@src/core/api/collectibles'
import { LitElement, html, css } from 'lit'
import { state } from 'lit/decorators.js'

import '@src/shared/components/collectible'

export class MenuAlbum extends LitElement {
    static styles = css`
        .month_collectibles{
            display: flex;
            flex-direction: column;
        }
        .month_collectibles_list{
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: auto;
            gap: 20px;
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
                <p>Mes ${i}</p>
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
        return html`${months}`
    }
}

customElements.define('menu-album', MenuAlbum)
