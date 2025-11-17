import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'
import { CollectibleInterface } from '@src/features/game/services/collectibles-controller'

@customElement('mooot-collectible')
export class Collectible extends LitElement {
    static styles = [
        global,
        css`
            :host{
                perspective: 100px;
            }
            .collectible{
                position: relative;
                background: #FFF6C5;
                background: radial-gradient(circle, rgba(255, 246, 197, 1) 31%, rgb(245 228 134) 100%);
                width: 100px;
                height: 120px;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                box-sizing: border-box;
                padding: 10px;
                box-shadow: 10px 5px 10px 0px #ffb34f3e;
                perspective-origin: center;
                perspective: 1000px;
                transform: rotateY(0);
                transform-style: preserve-3d;
                transform: rotateY(15deg);
                .image{
                    position: absolute;
                    top: -33px;
                    left: 0;
                    width: 100%;
                    transform-style: preserve-3d;
                }
                .name{
                    font-size: 0.8rem;
                    text-align: center;
                    line-height: 1.3;
                    font-weight: 700;
                }
                .rarity{
                    background-color: white;
                    border-radius: 20px;
                    transform: translateZ(10px);
                    transform-style: preserve-3d;
                    p{
                        transform: scale(1.3)
                    }
                }
                &.revealed{
                    animation: revealing-card 0.8s forwards ease-in-out;

                    & .image{
                        animation: revealing-image 0.8s forwards ease-in-out;
                    }

                    & .rarity{
                        animation: revealing-image 0.8s forwards ease-in-out;
                    }
                }
            }
            
            
            @keyframes revealing-card{
                0%{
                    transform: rotateY(15deg);
                }
                50%{
                    transform: rotateY(-15deg);
                }
                100%{
                    transform: rotateY(0);
                }
            }

            @keyframes revealing-image{
                0%{
                    transform: translateZ(0);
                }
                50%{
                    transform: translateZ(20px);
                }
                100%{
                    transform: translateZ(0);
                }
            }
        `,
    ]

    @property({ type: Object }) collectibleData: CollectibleInterface | null = null
    @property({ type: Boolean }) revealed = false

    connectedCallback(): void {
        super.connectedCallback()

        setTimeout(() => {
            this.revealed = true
        }, 100)
    }

    render() {
        return html`
            <div class="collectible ${this.revealed ? 'revealed' : null}" @click=${() => this.revealed = true}>
                <div class="image">
                    <img src="assets/collectibles/collectible-${this.collectibleData?.image_tag}.png">
                </div>
                <div class="name">
                    <p>${this.collectibleData?.name}</p>
                </div>
                <div class="rarity">
                    <p>${this.collectibleData?.rarity === 3 ? '⭐⭐⭐' : this.collectibleData?.rarity === 2 ? '⭐⭐' : '⭐'}</p>
                </div>
            </div>
        `
    }
}
