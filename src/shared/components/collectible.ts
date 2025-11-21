import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'
import { CollectibleInterface, CollectibleInterfaceFront } from '@src/features/game/services/collectibles-controller'

import '@src/shared/components/rarity-stars'

@customElement('mooot-collectible')
export class Collectible extends LitElement {
    static styles = [
        global,
        css`
            :host{
                position: relative;
                max-width: 100px;
            }
            .background{
                position: absolute;
                background: #FFF6C5;
                background: linear-gradient(#fff7da 40%, #ffe99a 100%);
                width: 100%;
                height: 100%;
                border-radius: 10px;
                box-shadow: 3px 3px 0 0 var(--keyboard-border-present);
                overflow: hidden;
                box-sizing: border-box;

                transition: opacity 1s ease-in-out;
                opacity: 0;
                &.revealed{
                    opacity: 1;
                }
                &.disabled{
                    opacity: 0.6;
                    background: none;
                    border: 2px dashed var(--keyboard-border-present);
                    box-shadow: none;
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
                gap: 5px;
                .image{
                    width: 90%;
                    height: 50px;

                    transition: 500ms cubic-bezier(0.850, 0.185, 0.105, 1.365) 500ms;
                    transform: translateY(-20px) scale(0.9);
                    opacity: 0;
                }
                .name{
                    font-size: 0.8rem;
                    text-align: center;
                    line-height: 1.3;
                    font-weight: 700;
                    
                    transition: 1s ease-out 300ms;
                    opacity: 0;
                }
                &.revealed{
                    & .image{
                        opacity: 1;
                        transform: translateY(-30px) scale(1);
                    }

                    & .name{
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                &.disabled{
                    & .image{
                        filter: brightness(0) contrast(0.1)    
                    }
                }
            }
        `,
    ]

    @property({ type: Object }) collectibleData: CollectibleInterfaceFront | CollectibleInterface | null = null
    @property({ type: Boolean }) revealed = false
    @property({ type: Boolean }) disabled = false

    connectedCallback(): void {
        super.connectedCallback()
    }

    render() {
        return html`
            <div class="background ${this.revealed ? 'revealed' : null} ${this.disabled ? 'disabled' : null}"></div>
            <div class="collectible ${this.revealed ? 'revealed' : null} ${this.disabled ? 'disabled' : null}" @click=${() => this.revealed = true}>
                <div class="image">
                    <img width="100%" src="assets/collectibles/${this.collectibleData?.image_tag}.webp">
                </div>
                ${!this.disabled ? html`
                        <div class="name">
                            <p>${this.collectibleData?.name}</p>
                        </div>
                    ` : null
            }
                <rarity-stars rarity=${this.collectibleData?.rarity || 1}></rarity-stars>
            </div>
        `
    }
}
