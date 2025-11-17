import { getIsUserTester } from "../../../core/api/users"
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { getUserId } from "../../../core/telegram";
import { matrixFromDate } from "@src/shared/utils/matrix.utils";
import { getLocalUserCollectibles, saveCollectiblesRaritiesToLocalStorage, saveCollectiblesToLocalStorage } from "@src/shared/utils/storage-utils";
import { supalog } from "@src/core/api/logs";
import { supabase } from "@src/core/supabase";
import { getCurrentMonth } from "@src/shared/utils/time-utils";

type Rarity = 0 | 1 | 2 | 3;
type Row = [Rarity, Rarity, Rarity, Rarity, Rarity];
type CollectiblesMatrix = [Row, Row, Row, Row, Row, Row];
export interface CollectibleInterface {
    id: number,
    name: string,
    month: number,
    rarity: number,
    image_tag: string,
}
export interface CollectibleInterfaceFront extends CollectibleInterface {
    revealed: boolean
}


export class CollectiblesController implements ReactiveController {
    host: ReactiveControllerHost;
    activeTestingFeatures: boolean | null = null

    // Abans de saber quin coleccionable és, sabem només la raresa
    userCollectiblesRarities: number[] = []
    collectiblesMatrix: CollectiblesMatrix = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
    userCollectibles: CollectibleInterfaceFront[] = []

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this);
    }

    async hostConnected() {
        if (this.activeTestingFeatures) return this.activeTestingFeatures

        const testingUser = await getIsUserTester(getUserId())
        this.activeTestingFeatures = testingUser

        this.loadStoredRarities()
        this.loadCollectiblesMatrix()

        this.host.requestUpdate()
    }

    hostDisconnected() { }

    loadCollectiblesMatrix() {
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
            this.userCollectiblesRarities.push(collectible)
            saveCollectiblesRaritiesToLocalStorage(this.userCollectiblesRarities)

            // TODO - es aixo gaire ineficient? esta refrescant tot el compondent de joc sencer?
            this.host.requestUpdate()
        }

        return collectiblesInTheRow
    }

    /** Fem servir l'arrai de rareses trobades durant la partida per
    * obtenir un coleccionable a l'atzar, guardar-lo a users_collectibles i obtenir-los al front
    * Tot això es fa a la funció de supabase.
    */
    async grantCollectiblesToUser() {
        // Si ja tenom userCollectibles en local, els retornem directament
        const localUserCollectibles = getLocalUserCollectibles()
        if (localUserCollectibles) {
            this.userCollectibles = localUserCollectibles
            return localUserCollectibles
        }

        // Ens assegurem que tenim les últimes dades primer (seran les últimes perquè sempre que aconseguim un collectible es guarda en local)
        this.loadStoredRarities()

        console.log(this.userCollectiblesRarities)
        try {
            const { data, error } = await supabase.rpc('get_collectibles_by_rarities', {
                in_month: getCurrentMonth(),
                in_rarities: this.userCollectiblesRarities,
                in_user_id: getUserId()
            })

            if (error) throw error

            this.userCollectibles = data as unknown as CollectibleInterfaceFront[]
            saveCollectiblesToLocalStorage(this.userCollectibles)

            this.host.requestUpdate()

            return this.userCollectibles
        } catch (error) {
            supalog.error('cant grant collectibles')
        }
    }


    loadStoredRarities() {
        const storedGameCollectibles = localStorage.getItem('mooot:game:rarities')
        if (!storedGameCollectibles) return

        this.userCollectiblesRarities = JSON.parse(storedGameCollectibles)
    }

}