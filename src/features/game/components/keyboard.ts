import { LitElement, html, css } from 'lit-element'
import { customElement } from 'lit/decorators.js'

@customElement('mooot-keyboard')
export class Keyboard extends LitElement {
    static get styles() {
        return css`
            .keyboard {
                --spacing: 5px;
                max-width: 500px;
                display: grid;
                grid-template-rows: repeat(3, 1fr);
                gap: var(--spacing);
                touch-action: manipulation;
                padding: 1rem;
                box-sizing: border-box;
                margin: auto;
            }
            .keyboard > .keyboard__row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing);
            }
            .keyboard > .keyboard__row > .keyboard__key,
            .keyboard > .keyboard__row > .keyboard__enter,
            .keyboard > .keyboard__row > .keyboard__back {
                flex: 1;
                min-height: 2.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0.2rem;
                background-color: #f3f3f3;
                cursor: pointer;
                transition: background-color 0.3s ease;
                color: var(--keyboard-text);
            }
            .keyboard > .keyboard__row > .keyboard__key.present,
            .keyboard > .keyboard__row > .keyboard__enter.present,
            .keyboard > .keyboard__row > .keyboard__back.present {
                background-color: var(--keyboard-present);
                color: var(--keyboard-used);
            }
            .keyboard > .keyboard__row > .keyboard__key.absent,
            .keyboard > .keyboard__row > .keyboard__enter.absent,
            .keyboard > .keyboard__row > .keyboard__back.absent {
                background-color: var(--keyboard-missing);
                color: white;
            }
            .keyboard > .keyboard__row > .keyboard__key.correct,
            .keyboard > .keyboard__row > .keyboard__enter.correct,
            .keyboard > .keyboard__row > .keyboard__back.correct {
                background-color: var(--keyboard-correct);
                color: var(--keyboard-used);
            }
            .keyboard > .keyboard__row > .keyboard__key > img,
            .keyboard > .keyboard__row > .keyboard__enter > img,
            .keyboard > .keyboard__row > .keyboard__back > img {
                width: 20px;
                height: 20px;
            }
            .keyboard > .keyboard__row > .keyboard__enter,
            .keyboard > .keyboard__row > .keyboard__back {
                flex: 1.8;
            }
        `
    }

    // Allow game to update key statuses without querying outside
    public setKeyStatus(
        letter: string,
        status: 'correct' | 'present' | 'absent'
    ) {
        const key = this.renderRoot.querySelector(
            `.keyboard__key[data-key="${letter}"]`
        ) as HTMLElement | null
        key?.classList.add(status)
    }

    letterClick(letter: string) {
        this.dispatchEvent(
            new CustomEvent('letter-clicked', {
                detail: { letter },
                bubbles: true,
                composed: true,
            })
        )
    }

    enterClick() {
        this.dispatchEvent(
            new CustomEvent('enter-clicked', {
                bubbles: true,
                composed: true,
            })
        )
    }

    backClick() {
        this.dispatchEvent(
            new CustomEvent('back-clicked', {
                bubbles: true,
                composed: true,
            })
        )
    }

    render() {
        return html` <section class="keyboard">
            <div class="keyboard__row">
                <div
                    class="keyboard__key"
                    data-key="Q"
                    @click="${() => this.letterClick('Q')}"
                >
                    Q
                </div>
                <div
                    class="keyboard__key"
                    data-key="W"
                    @click="${() => this.letterClick('W')}"
                >
                    W
                </div>
                <div
                    class="keyboard__key"
                    data-key="E"
                    @click="${() => this.letterClick('E')}"
                >
                    E
                </div>
                <div
                    class="keyboard__key"
                    data-key="R"
                    @click="${() => this.letterClick('R')}"
                >
                    R
                </div>
                <div
                    class="keyboard__key"
                    data-key="T"
                    @click="${() => this.letterClick('T')}"
                >
                    T
                </div>
                <div
                    class="keyboard__key"
                    data-key="Y"
                    @click="${() => this.letterClick('Y')}"
                >
                    Y
                </div>
                <div
                    class="keyboard__key"
                    data-key="U"
                    @click="${() => this.letterClick('U')}"
                >
                    U
                </div>
                <div
                    class="keyboard__key"
                    data-key="I"
                    @click="${() => this.letterClick('I')}"
                >
                    I
                </div>
                <div
                    class="keyboard__key"
                    data-key="O"
                    @click="${() => this.letterClick('O')}"
                >
                    O
                </div>
                <div
                    class="keyboard__key"
                    data-key="P"
                    @click="${() => this.letterClick('P')}"
                >
                    P
                </div>
            </div>

            <div class="keyboard__row">
                <div
                    class="keyboard__key"
                    data-key="A"
                    @click="${() => this.letterClick('A')}"
                >
                    A
                </div>
                <div
                    class="keyboard__key"
                    data-key="S"
                    @click="${() => this.letterClick('S')}"
                >
                    S
                </div>
                <div
                    class="keyboard__key"
                    data-key="D"
                    @click="${() => this.letterClick('D')}"
                >
                    D
                </div>
                <div
                    class="keyboard__key"
                    data-key="F"
                    @click="${() => this.letterClick('F')}"
                >
                    F
                </div>
                <div
                    class="keyboard__key"
                    data-key="G"
                    @click="${() => this.letterClick('G')}"
                >
                    G
                </div>
                <div
                    class="keyboard__key"
                    data-key="H"
                    @click="${() => this.letterClick('H')}"
                >
                    H
                </div>
                <div
                    class="keyboard__key"
                    data-key="J"
                    @click="${() => this.letterClick('J')}"
                >
                    J
                </div>
                <div
                    class="keyboard__key"
                    data-key="K"
                    @click="${() => this.letterClick('K')}"
                >
                    K
                </div>
                <div
                    class="keyboard__key"
                    data-key="L"
                    @click="${() => this.letterClick('L')}"
                >
                    L
                </div>
                <div
                    class="keyboard__key"
                    data-key="Ç"
                    @click="${() => this.letterClick('Ç')}"
                >
                    Ç
                </div>
            </div>
            <div class="keyboard__row">
                <div
                    class="keyboard__enter keyboard__key--wide"
                    data-key="enter"
                    @click="${() => this.enterClick()}"
                >
                    <img alt="Intro teclat" src="/assets/intro.svg" />
                </div>
                <div
                    class="keyboard__key"
                    data-key="Z"
                    @click="${() => this.letterClick('Z')}"
                >
                    Z
                </div>
                <div
                    class="keyboard__key"
                    data-key="X"
                    @click="${() => this.letterClick('X')}"
                >
                    X
                </div>
                <div
                    class="keyboard__key"
                    data-key="C"
                    @click="${() => this.letterClick('C')}"
                >
                    C
                </div>
                <div
                    class="keyboard__key"
                    data-key="V"
                    @click="${() => this.letterClick('V')}"
                >
                    V
                </div>
                <div
                    class="keyboard__key"
                    data-key="B"
                    @click="${() => this.letterClick('B')}"
                >
                    B
                </div>
                <div
                    class="keyboard__key"
                    data-key="N"
                    @click="${() => this.letterClick('N')}"
                >
                    N
                </div>
                <div
                    class="keyboard__key"
                    data-key="M"
                    @click="${() => this.letterClick('M')}"
                >
                    M
                </div>
                <div
                    class="keyboard__back keyboard__key--wide"
                    @click="${() => this.backClick()}"
                >
                    <img alt="Esborrar teclat" src="/assets/backspace.svg" />
                </div>
            </div>
        </section>`
    }
}
