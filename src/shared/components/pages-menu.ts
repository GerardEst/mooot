import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

type NavItem = { href: string; label: string }

const navItems: NavItem[] = [
    { href: '/joc/', label: 'Joc' },
    { href: '/com-jugar/', label: 'Com jugar' },
    { href: '/', label: 'Sobre Mooot' },
    { href: '/contact/', label: 'Contacte' },
    { href: '/legal/', label: 'Legal' },
]

@customElement('pages-menu')
export class PagesMenu extends LitElement {
    static styles = css`
        :host {
            display: block;
            color: #666;
            font-size: 14px;
        }
        nav {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    `

    protected render() {
        return html`
            <nav>
                ${navItems.map(
                    (item) => html`<a href=${item.href}>${item.label}</a>`
                )}
            </nav>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pages-menu': PagesMenu
    }
}
