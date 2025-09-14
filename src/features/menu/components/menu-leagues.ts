import { LitElement, html, css } from 'lit'

export class MenuLeagues extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
        }
    `

    render() {
        return html`<p>Tops mundials</p>`
    }
}

customElements.define('menu-leagues', MenuLeagues)
