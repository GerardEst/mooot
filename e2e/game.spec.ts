import { test, expect } from '@playwright/test'

// Stub assets so the game is deterministic
const WORDS = {
    abcde: 'ABCDE',
}
const DIC = ['ABCDE', 'AAAAA', 'BBBBB', 'CCCCC', 'DDDDD', 'EEEEE', 'FFFFF']

async function stubAssets(page: any) {
    await page.route('**/assets/words.json', (route: any) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(WORDS),
        })
    })
    await page.route('**/assets/dicc.json', (route: any) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(DIC),
        })
    })
}

async function clickKey(page: any, letter: string) {
    const key = page
        .locator('mooot-keyboard')
        .locator(`.keyboard__key`, { hasText: letter })
    await key.first().click()
}

async function pressEnter(page: any) {
    await page
        .locator('mooot-keyboard')
        .locator('.keyboard__enter')
        .click({ force: true })
}

function cell(page: any, row: number, col: number) {
    return page.locator('mooot-joc-game').locator(`#l${row}_${col}`)
}

test.beforeEach(async ({ page }) => {
    await stubAssets(page)
})

test('win on first try shows endgame modal with the correct info', async ({
    page,
}) => {
    await page.goto('/joc/')

    await test.step('type target word and submit', async () => {
        for (const l of ['A', 'B', 'C', 'D', 'E']) await clickKey(page, l)
        await pressEnter(page)
    })

    await test.step('cells updated with letters', async () => {
        await expect(cell(page, 1, 1)).toHaveText('A')
        await expect(cell(page, 1, 5)).toHaveText('E')
    })

    await test.step('all cells in first row become correct', async () => {
        for (let i = 1; i <= 5; i++) {
            await expect(cell(page, 1, i)).toHaveClass(/correct/)
        }
    })

    await test.step('modal visible with 6 points', async () => {
        const modal = page
            .locator('mooot-joc-game')
            .locator('mooot-endgame-modal')
            .locator('.modal.active')
        await expect(modal).toBeVisible()

        const points = page
            .locator('mooot-joc-game')
            .locator('mooot-endgame-modal')
            .locator('#stats-points')
        await expect(points).toHaveText('6')
    })

    await test.step('modal displays the word', async () => {
        const word = page
            .locator('mooot-joc-game')
            .locator('mooot-endgame-modal')
            .locator('#stats-word')
        await expect(word).toHaveText('ABCDE')
    })

    await test.step('modal title matches points', async () => {
        const title = page
            .locator('mooot-joc-game')
            .locator('mooot-endgame-modal')
            .locator('#stats-title')
        await expect(title).toHaveText('🤨 ESCANDALÓS!')
    })
})

test('six valid misses end with modal with correct info', async ({ page }) => {
    await page.goto('/joc/')

    await test.step('play six valid wrong guesses', async () => {
        const guesses = ['AAAAA', 'BBBBB', 'CCCCC', 'DDDDD', 'EEEEE', 'FFFFF']
        for (const g of guesses) {
            for (const l of g) await clickKey(page, l)
            await pressEnter(page)
        }
    })

    await test.step('modal visible with 0 points', async () => {
        const modal = page
            .locator('mooot-joc-game')
            .locator('mooot-endgame-modal')
            .locator('.modal.active')
        await expect(modal).toBeVisible()

        const points = page
            .locator('mooot-joc-game')
            .locator('mooot-endgame-modal')
            .locator('#stats-points')
        await expect(points).toHaveText('0')
    })

    await test.step('modal displays the word', async () => {
        const word = page
            .locator('mooot-joc-game')
            .locator('mooot-endgame-modal')
            .locator('#stats-word')
        await expect(word).toHaveText('ABCDE')
    })

    await test.step('modal title matches points (loss)', async () => {
        const title = page
            .locator('mooot-joc-game')
            .locator('mooot-endgame-modal')
            .locator('#stats-title')
        await expect(title).toHaveText('💩 Vaja...')
    })

    await test.step('row 6 is filled', async () => {
        for (let i = 1; i <= 5; i++) {
            await expect(cell(page, 6, i)).not.toHaveText('')
        }
    })
})

test('typing into a specific clicked cell works end-to-end', async ({ page }) => {
    await page.goto('/joc/')

    await test.step('place C in third cell via cell click + key', async () => {
        await page.locator('mooot-joc-game').locator('#l1_3').click()
        await clickKey(page, 'C')
        await expect(cell(page, 1, 3)).toHaveText('C')
    })

    await test.step('fill remaining cells via targeted clicks to form ABCDE', async () => {
        await page.locator('mooot-joc-game').locator('#l1_1').click()
        await clickKey(page, 'A')
        await page.locator('mooot-joc-game').locator('#l1_2').click()
        await clickKey(page, 'B')
        await page.locator('mooot-joc-game').locator('#l1_4').click()
        await clickKey(page, 'D')
        await page.locator('mooot-joc-game').locator('#l1_5').click()
        await clickKey(page, 'E')
    })

    await test.step('submit and verify modal + title', async () => {
        await pressEnter(page)
        const modal = page
            .locator('mooot-joc-game')
            .locator('mooot-endgame-modal')
            .locator('.modal.active')
        await expect(modal).toBeVisible()
        await expect(
            page
                .locator('mooot-joc-game')
                .locator('mooot-endgame-modal')
                .locator('#stats-points')
        ).toHaveText('6')
        await expect(
            page
                .locator('mooot-joc-game')
                .locator('mooot-endgame-modal')
                .locator('#stats-title')
        ).toHaveText('🤨 ESCANDALÓS!')
    })
})

test('mix targeted cell click then sequential input completes the word', async ({ page }) => {
    await page.goto('/joc/')

    await test.step('place D in fourth cell via click', async () => {
        await page.locator('mooot-joc-game').locator('#l1_4').click()
        await clickKey(page, 'D')
        await expect(cell(page, 1, 4)).toHaveText('D')
    })

    await test.step('fill rest via sequential input (no further clicks)', async () => {
        for (const l of ['A', 'B', 'C', 'E']) await clickKey(page, l)
        await expect(cell(page, 1, 1)).toHaveText('A')
        await expect(cell(page, 1, 2)).toHaveText('B')
        await expect(cell(page, 1, 3)).toHaveText('C')
        await expect(cell(page, 1, 5)).toHaveText('E')
    })

    await test.step('submit and verify win', async () => {
        await pressEnter(page)
        await expect(
            page
                .locator('mooot-joc-game')
                .locator('mooot-endgame-modal')
                .locator('.modal.active')
        ).toBeVisible()
        await expect(
            page
                .locator('mooot-joc-game')
                .locator('mooot-endgame-modal')
                .locator('#stats-points')
        ).toHaveText('6')
    })
})
