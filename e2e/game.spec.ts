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

test('six valid misses end with modal and 0 points', async ({ page }) => {
    await page.goto('/joc/')

    const guesses = ['AAAAA', 'BBBBB', 'CCCCC', 'DDDDD', 'EEEEE', 'FFFFF']
    for (const g of guesses) {
        for (const l of g) await clickKey(page, l)
        await pressEnter(page)
    }

    // Modal should show with 0 points
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

    // Ensure row 6 has letters
    for (let i = 1; i <= 5; i++) {
        await expect(cell(page, 6, i)).not.toHaveText('')
    }
})
