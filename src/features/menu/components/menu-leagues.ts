import { LitElement, html, css } from 'lit'

export class MenuLeagues extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
        }
    `

    render() {
        return html`<p><i>Algun dia hi haurà coses guais aquí</i></p>`
    }
}

customElements.define('menu-leagues', MenuLeagues)
