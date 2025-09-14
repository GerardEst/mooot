import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { global } from '@src/core/global-styles'

@customElement('mooot-feedback')
export class MoootFeedback extends LitElement {
    static styles = [
        global,
        css`
            :host {
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 8px 16px;
                border-radius: 5px;
                z-index: 9999;
                text-align: center;
                line-height: 1.4;
                opacity: 1;
                transition: opacity 300ms ease;
                pointer-events: none;
            }
            :host(.hide) {
                opacity: 0;
            }
        `,
    ]

    @property({ type: String }) message = ''

    connectedCallback(): void {
        super.connectedCallback()

        setTimeout(() => this.classList.add('hide'), 3700)
        setTimeout(() => this.remove(), 4000)
    }

    render() {
        return html`<p role="status">${this.message}</p>`
    }
}
