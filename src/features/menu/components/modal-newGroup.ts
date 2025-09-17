import { LitElement, html, css } from 'lit'
import { global } from '@src/core/global-styles'

export class ModalNewGroup extends LitElement {
    static styles = [
        global,
        css`
            .modal {
                position: fixed;
                inset: 0;
                display: flex;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
                z-index: 1;
                animation: backdropIn 160ms ease-out both;
            }
            .modal__content {
                max-width: 600px;
                width: 100%;
                background-color: white;
                border-radius: 8px;
                padding: 1rem;
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                transform: translateY(10px) scale(0.98);
                animation: contentIn 180ms ease-out both;
            }
            .modal__content__close {
                position: absolute;
                width: 20px;
                height: 20px;
                padding: 1rem;
                top: 0;
                right: 0;
                cursor: pointer;
            }
            .modal__title {
                margin: 0;
                font-size: 1rem;
            }
            @keyframes backdropIn {
                from {
                    background-color: rgba(0, 0, 0, 0);
                }
                to {
                    background-color: rgba(0, 0, 0, 0.5);
                }
            }
            @keyframes contentIn {
                from {
                    transform: translateY(10px) scale(0.98);
                }
                to {
                    transform: translateY(0) scale(1);
                }
            }
        `,
    ]

    private onClose = () => {
        this.dispatchEvent(
            new CustomEvent('modal-close', { bubbles: true, composed: true })
        )
    }

    private onBackdropClick = (e: Event) => {
        const target = e.currentTarget as HTMLElement | null
        if (!target) return

        if (e.target === target) this.onClose()
    }

    render() {
        return html`
            <section class="modal" @click=${this.onBackdropClick}>
                <div class="modal__content">
                    <div class="header">
                        <h2 class="modal__title">Com crear lligues?</h2>
                        <img
                            class="modal__content__close"
                            src="/assets/close.svg"
                            alt="Tancar modal"
                            @click=${this.onClose}
                        />
                    </div>
                    <div>
                        <p>
                            Dons és increiblement fàcil, segueix aquets dos
                            passos:
                        </p>
                        <ol>
                            <li>
                                Crea un grup de Telegram amb qui vulguis jugar
                            </li>
                            <li>
                                Afegeix-hi el bot
                                <strong>@mooot_cat_bot</strong><br />
                                <i
                                    >Els bots s'afegeixen igual que afegiries
                                    una persona. Busca mooot_cat_bot i el
                                    trobaràs</i
                                >
                            </li>
                        </ol>

                        <p>
                            Si vols jugar en un grup ja creat, passem de dos
                            simples passos a un simplíssim pas:
                        </p>
                        <ol>
                            <li>
                                Clica l'enllaç<br /><a
                                    href="https://t.me/mooot_cat_bot?startgroup=true"
                                    rel="noopener"
                                    >Afegir Mooot a un grup</a
                                >
                            </li>
                        </ol>

                        <br />
                        <p>Apa, a jugar!</p>
                    </div>
                </div>
            </section>
        `
    }
}

customElements.define('modal-newgroup', ModalNewGroup)
