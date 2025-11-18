import { LitElement, html, css } from 'lit-element'
import { global } from '@src/core/app-reset-styles'
import { customElement, property } from 'lit/decorators.js'
import star from '/assets/icons/star.svg?raw';

@customElement('rarity-stars')
export class RarityStars extends LitElement {
    static styles = [
        global,
        css`
            .rarityStars{
                display: flex;
                gap: 10px;
            }
            .icon{
                width:30px;
                height: 30px;
                & svg{
                    width:100%;
                    height: 100%;
                }
            }
        `,
    ]

    @property({ type: Number }) rarity: number = 1

    render() {
        const stars = []
        for (let i = 0; i < this.rarity; i++) {
            stars.push(html`<span class="icon" .innerHTML=${star}></span>`)
        }
        return html`
            <div class="rarityStars">
                ${stars}
            </div>
        `
    }
}