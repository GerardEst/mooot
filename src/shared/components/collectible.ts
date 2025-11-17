import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'
import { CollectibleInterface } from '@src/features/game/services/collectibles-controller'

@customElement('mooot-collectible')
export class Collectible extends LitElement {
    static styles = [
        global,
        css`
            .collectible{
                position: relative;
                background-color: var(--present-color);
                width: 100px;
                height: 120px;
                border-radius: 10px;
                display: flex;
                flex-direction:column;
                align-items: center;
                justify-content: flex-end;
                box-sizing: border-box;
                padding: 10px;
                box-shadow: 0 0 30px 0px #ff910063;
                border: 2px solid #9c8816
            }
            .image{
                position: absolute;
                top: -33px;
                left: 0;
                width: 100%;
            }
            .name{
                font-size: 0.8rem;
                text-align: center;
                line-height: 1.3;
                font-weight: 700;
            }
        `,
    ]

    @property({ type: Object }) collectibleData: CollectibleInterface | null = null

    @state() revealed = true

    connectedCallback(): void {
        super.connectedCallback()
    }

    render() {
        return html`
            <div class="collectible" @click=${() => this.revealed = true}>
                ${this.revealed ? html`
                    <div class="image">
                        <img src="assets/collectibles/collectible-${this.collectibleData?.image_tag}.png">
                    </div>
                    <div class="name">
                        <p>${this.collectibleData?.name}</p>
                    </div>
                ` : null}
                <div class="rarity">
                    ${this.collectibleData?.rarity === 3 ? '⭐⭐⭐' : this.collectibleData?.rarity === 2 ? '⭐⭐' : '⭐'}
                </div>
            </div>
        `
    }
}
