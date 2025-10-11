import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'
import { formatTime } from '@src/shared/utils/time-utils'

const CHRONO_STORAGE_KEY = 'mooot:game:chrono'

type ChronoStoragePayload = {
    startAt: number | null
    running: boolean
    elapsed: number
}

@customElement('mooot-chrono')
export class MoootChrono extends LitElement {
    static styles = [
        global,
        css`
            .chrono {
                    display: flex;
                    gap: 5px;
                    align-items: flex-end;
                    align-items: center;
                    font-family: 'Montserrat';
                    font-size: 1rem;
                    background: var(--button-callout);
                    justify-content: space-between;
                    border: none;
                    border-radius: 27px;
                    justify-content: space-between;
                    padding: 2px;
                    padding-left: 13px;
                    font-variant-numeric: tabular-nums;
                & img.toggleHide{
                    background: var(--present-color);
                    border-radius: 20px;
                    padding: 3px;
                    border: 1px solid var(--present-border-color);
                }
                & p.visible{
                    filter: blur(0)    
                }
                & p.blurry{
                    filter: blur(4px)    
                }
            }
        `,
    ]

    @state()
    public elapsedMs = 0

    @state()
    private isVisible = true

    private running = false
    private hasStarted = false
    private startTimestamp: number | null = null
    private tickId: number | null = null

    connectedCallback(): void {
        super.connectedCallback()
        this.restoreFromStorage()
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        this.stopTick()
    }

    public start() {
        if (this.running || this.hasStarted) {
            return
        }

        this.hasStarted = true
        this.running = true
        this.startTimestamp = Date.now()

        this.updateElapsedTime()
        this.startTick()
    }

    public stop() {
        if (!this.running) {
            return
        }

        this.updateElapsedTime()
        this.running = false
        this.stopTick()
        this.startTimestamp = null

        this.saveTimeToLocalStorage({
            startAt: null,
            running: false,
            elapsed: this.elapsedMs,
        })
    }

    render() {
        return html`
            <button
                type="button"
                class="chrono"
                @click=${this.toggleVisibility}
                aria-pressed=${this.isVisible ? 'true' : 'false'}
            >
                <p class="${this.isVisible ? 'visible' : 'blurry'}">
                    ${formatTime(this.elapsedMs)}
                </p>
                <img
                    class="toggleHide"
                    slot="icon"
                    alt="Configurar cronometre"
                    width="25"
                    src="/assets/hidden_eye.svg"
                />
            </button>
        `
    }

    private toggleVisibility = () => {
        this.isVisible = !this.isVisible
    }

    private startTick() {
        if (this.tickId !== null || this.startTimestamp === null) {
            return
        }

        this.tickId = window.setInterval(() => this.updateElapsedTime(), 1000)
    }

    private stopTick() {
        if (this.tickId === null) {
            return
        }

        window.clearInterval(this.tickId)
        this.tickId = null
    }

    private updateElapsedTime() {
        if (!this.running || this.startTimestamp === null) {
            return
        }

        this.elapsedMs = Math.max(0, Date.now() - this.startTimestamp)

        this.saveTimeToLocalStorage({
            startAt: this.startTimestamp,
            running: true,
            elapsed: this.elapsedMs,
        })
    }

    private restoreFromStorage() {
        const payload = this.readStorage()
        if (!payload) {
            this.hasStarted = false
            this.running = false
            this.elapsedMs = 0
            this.startTimestamp = null
            return
        }

        this.elapsedMs = payload.elapsed
        this.hasStarted =
            payload.elapsed > 0 || payload.running || payload.startAt !== null

        if (payload.running) {
            this.running = true
            this.startTimestamp = payload.startAt
            this.updateElapsedTime()
            this.startTick()
        } else {
            this.running = false
            this.startTimestamp = null
        }
    }

    private saveTimeToLocalStorage(payload: ChronoStoragePayload) {
        window.localStorage.setItem(CHRONO_STORAGE_KEY, JSON.stringify(payload))
    }

    private readStorage(): ChronoStoragePayload | null {
        const raw = window.localStorage.getItem(CHRONO_STORAGE_KEY)
        if (!raw) return null

        return JSON.parse(raw)
    }
}
