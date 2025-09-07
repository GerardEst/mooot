import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('mooot-flag')
export class MoootFlag extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
        }
        img {
            width: 36px;
            height: 27px;
            border-radius: 5px;
            display: block;
        }
    `

    @property({ type: String })
    src: string = '/assets/flag.jpg'

    @property({ type: String })
    alt: string = "Mooot Logo"

    render() {
        return html`<img src=${this.src} alt=${this.alt} />`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mooot-flag': MoootFlag
    }
}

