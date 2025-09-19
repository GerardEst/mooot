import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type NavItem = { href: string; label: string }

const navItems: NavItem[] = [
    { href: '/joc/', label: 'Joc' },
    { href: '/com-jugar/', label: 'Com jugar' },
    { href: '/', label: 'Sobre Mooot' },
    { href: '/legal/', label: 'Legal' },
]

@customElement('pages-menu')
export class PagesMenu extends LitElement {
    static styles = css`
        :host {
            display: block;
            color: #666;
            font-size: 14px;
            padding: 15px;
            padding-top: 30px;
        }
        nav {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: space-between;
            width: fit-content;
            margin: auto;
        }
        a {
            color: var(--present-border-color);
        }
        a:hover {
            text-decoration: underline;
        }
    `

    protected render() {
        const path =
            typeof window !== 'undefined' ? window.location.pathname : ''
        const isJoc = path === '/joc' || path === '/joc/'
        const items = isJoc
            ? navItems.filter((item) => item.href !== '/joc/')
            : navItems

        return html`
            <nav>
                ${items.map(
                    (item) => html`<a href=${item.href}>${item.label}</a>`
                )}
            </nav>
        `
    }
}
