import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('pages-header')
export class PagesHeader extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
        header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 24px;
        }
        .left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        h1 {
            margin: 0;
            font-size: 28px;
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
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            color: #0366d6;
            text-decoration: none;
            background: #fafafa;
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
                            width="40"
                            height="40"
                            loading="eager"
                        />
                    </a>
                    <h1>${this.title}</h1>
                </div>
                <a class="backBtn" href="/joc/" title="Torna al joc">
                    <img
                        src="/assets/backspace.svg"
                        alt=""
                        width="16"
                        height="16"
                        aria-hidden="true"
                    />
                    <span>Torna al joc</span>
                </a>
            </header>
        `
    }
}

