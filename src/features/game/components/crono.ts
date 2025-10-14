import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { global } from '@src/core/app-reset-styles'
import { formatTime } from '@src/shared/utils/time-utils'

const CRONO_STORAGE_KEY = 'mooot:game:crono'

type CronoStoragePayload = {
    startAt: number | null
    running: boolean
    elapsed: number
}

@customElement('mooot-crono')
export class MoootCrono extends LitElement {
    static styles = [
        global,
        css`
            .crono {
                display: flex;
                position: relative;
                gap: 5px;
                align-items: center;
                font-family: Montserrat;
                font-size: 1rem;
                background: #ffefc8;
                border: 0px solid #b17b22;
                border-radius: 5px;
                justify-content: space-between;
                box-shadow: inset 0 0 7px 0px rgba(0, 0, 0, 0.2);
                padding: 7px 22px 5px 18px;
                font-variant-numeric: tabular-nums;
                box-shadow: rgb(173 127 52) 0px 3px 0px 0px inset, rgb(173 127 52) 0px 5px 10px inset;
                overflow: hidden;
                & .buttonCover{
                    position: absolute;
                    top: 0;
                    left: -1px;
                    width: calc(100% + 2px);
                    height: 100%;
                    background-color: rgb(159 149 101 / 60%);
                    transition: left 1s cubic-bezier(0.85, 0, 0.15, 1);
                    backdrop-filter: blur(2.6px);
                    border-radius: 5px;
                    border-left: 1px solid #7b4b4bb0;
                    display: flex;
                    justify-content: flex-end;
                    padding-right: 7px;
                    box-sizing: border-box;
                    &:after{
                        content: "";
                        position: absolute;
                        border-radius: 10px;
                        width: 6px;
                        height: 22px;
                        background-color: #fff4cb;
                        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
                        left: 6px;
                        top: 4px;
                        border-radius: 5px;
                    }
                    &.opened{
                        left: 80%;
                    }
                }
                & p{
                    font-weight: 700;
                    color: #ad7f34;
                    font-family: monospace;
                }
            }
        `,
    ]

    @state()
    public elapsedMs = 0

    @state()
    private isVisible = false

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
                class="crono"
                @click=${this.toggleVisibility}
                aria-pressed=${this.isVisible ? 'true' : 'false'}
            >
                <div class="buttonCover ${this.isVisible ? 'opened' : 'closed'}">
                    <img
                        class="toggleHide"
                        slot="icon"
                        alt="Configurar cronometre"
                        width="20"
                        src="/assets/crono.svg"
                    />
                </div>
                <p>
                    ${formatTime(this.elapsedMs)}
                </p>
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

    private saveTimeToLocalStorage(payload: CronoStoragePayload) {
        window.localStorage.setItem(CRONO_STORAGE_KEY, JSON.stringify(payload))
    }

    private readStorage(): CronoStoragePayload | null {
        const raw = window.localStorage.getItem(CRONO_STORAGE_KEY)
        if (!raw) return null

        return JSON.parse(raw)
    }
}
