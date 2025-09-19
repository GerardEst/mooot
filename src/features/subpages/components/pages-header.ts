import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('pages-header')
export class PagesHeader extends LitElement {
    static styles = css`
        :host {
            display: block;
            position: sticky;
            top: 0;
            background-color: white;
        }
        header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 20px;
            padding: 15px;
        }
        .left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        h1 {
            margin: 0;
            font-size: 16px;
            color: #333;
        }
        a.logo {
            display: inline-flex;
            line-height: 0;
        }
        a.backBtn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 4px 12px;
            border: 1px solid var(--present-border-color);
            border-radius: 8px;
            color: var(--present-border-color);
            text-decoration: none;
            background: white;
        }
        a.backBtn:hover {
            background: #f0f7ff;
        }
    `

    @property({ type: String }) title = ''

    render() {
        return html`
            <header>
                <div class="left">
                    <a class="logo" href="/joc/" title="Joc">
                        <img
                            src="/assets/moootbot_M.png"
                            alt="Mooot"
                            width="35"
                            height="35"
                            loading="eager"
                        />
                    </a>
                    <h1>${this.title}</h1>
                </div>
                <a class="backBtn" href="/joc/" title="Ves al joc">
                    Ves al joc
                </a>
            </header>
        `
    }
}
