import { getIsUserTester } from "../../../core/api/users"
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { getUserId } from "../../../core/telegram";
import { matrixFromDate } from "@src/shared/utils/matrix.utils";
import { saveUserCollectible } from "@src/core/api/collectibles";
import { saveCollectiblesToLocalStorage } from "@src/shared/utils/storage-utils";

type Rarity = 0 | 1 | 2 | 3;
type Row = [Rarity, Rarity, Rarity, Rarity, Rarity];
type CollectiblesMatrix = [Row, Row, Row, Row, Row, Row];

export class FlagsController implements ReactiveController {
    host: ReactiveControllerHost;

    userCollectibles: number[] = []
    activeTestingFeatures: boolean | null = null
    collectiblesMatrix: CollectiblesMatrix = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]

    constructor(host: ReactiveControllerHost, userId: number | false) {
        (this.host = host).addController(this);
    }

    async hostConnected() {
        if (this.activeTestingFeatures) return this.activeTestingFeatures

        const testingUser = await getIsUserTester(getUserId())
        this.activeTestingFeatures = testingUser

        this.loadCollectibles()

        this.host.requestUpdate()
    }

    hostDisconnected() { }

    loadCollectibles() {
        const today = new Date().toISOString().split('T')[0];
        this.collectiblesMatrix = matrixFromDate(today)
    }

    checkCollectiblesOnRow(row: number, statuses: any) {
        const collectiblesInTheRow = []
        for (let i = 0; i < 5; i++) {
            if (statuses[i] !== 'correct') continue

            const collectible = this.collectiblesMatrix[row - 1][i]
            if (collectible === 0) continue

            collectiblesInTheRow.push(collectible)
            this.userCollectibles.push(collectible)
            saveCollectiblesToLocalStorage(this.userCollectibles)
            saveUserCollectible(collectible)

            // TODO - es aixo gaire ineficient? esta refrescant tot el compondent de joc sencer?
            this.host.requestUpdate()
        }

        return collectiblesInTheRow
    }

    loadStoredCollectibles() {
        const storedGameCollectibles = localStorage.getItem('mooot:game:collectibles')
        if (!storedGameCollectibles) return

        this.userCollectibles = JSON.parse(storedGameCollectibles)
    }
}