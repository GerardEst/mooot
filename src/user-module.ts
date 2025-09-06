export function initUser(userData: any) {
    if (!userData.user) return

    fillPlaceholderWith(userData.user.first_name, '.placeholder_userName')
}

function fillPlaceholderWith(text: string, location: string) {
    const usernamePlaceholders = document.querySelectorAll(location)

    for (const placeholder in usernamePlaceholders) {
        usernamePlaceholders[placeholder].textContent = text
    }
}
