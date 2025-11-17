import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'
import { CollectibleInterfaceFront } from '@src/features/game/services/collectibles-controller'

@customElement('mooot-collectible')
export class Collectible extends LitElement {
    static styles = [
        global,
        css`
            :host{
                position: relative;
                perspective: 100px;
                width: 100px;
                height: 120px;
            }
            .background{
                position: absolute;
                background: #FFF6C5;
                background: linear-gradient(#fff7da 40%, #ffe99a 100%);
                width: 100%;
                height: 100%;
                border-radius: 10px;
                box-shadow: 3px 3px 0 0 var(--present-border-color);
                overflow: hidden;

                transition: opacity 1s ease-in-out;
                opacity: 0;
                &.revealed{
                    opacity: 1;
                }
            }
            .collectible{
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                box-sizing: border-box;
                padding: 10px;
                .image{
                    position: absolute;
                    top: -33px;
                    left: 0;
                    width: 100%;

                    transition: 500ms cubic-bezier(0.850, 0.185, 0.105, 1.365) 500ms;
                    transform: translateY(10px) scale(0.9);
                    opacity: 0;
                }
                .name{
                    font-size: 0.8rem;
                    text-align: center;
                    line-height: 1.3;
                    font-weight: 700;
                    
                    transition: 1s ease-out 300ms;
                    //transform: translateY(5px) scale(0.98);
                    opacity: 0;
                }
                .rarity{
                    background-color: white;
                    border-radius: 20px;
                    
                    transition: 1s ease-in-out 100ms;
                    // transform: translateY(5px) scale(0.98);
                    opacity: 0;
                    p{
                        transform: scale(1.3)
                    }
                }
                &.revealed{
                    & .image{
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }

                    & .name{
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }

                    & .rarity{
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            }
        `,
    ]

    @property({ type: Object }) collectibleData: CollectibleInterfaceFront | null = null
    @property({ type: Boolean }) revealed = false

    connectedCallback(): void {
        super.connectedCallback()
    }

    render() {
        return html`
            <div class="background ${this.revealed ? 'revealed' : null}"></div>
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
