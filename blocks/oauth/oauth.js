const WORKER_URL = "https://worker.cpilsworth.workers.dev"
const code = new URL(window.location.href).searchParams.get("code")
const $login = document.querySelector(".oauth")

async function login(code) {
    // remove ?code=... from URL
    const { history } = window
    const { location } = history

    const path =
        location.pathname +
        location.search.replace(/\bcode=\w+/, "").replace(/\?$/, "")
    history.pushState({}, "", path)

    document.body.dataset.state = "loading"

    const response = await fetch(WORKER_URL, {
        method: "POST",
        mode: "cors",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ code }),
    })

    const result = await response.json()

    if (result.error) {
        return alert(JSON.stringify(result, null, 2))
    }

    // token can now be used to send authenticated requests against https://api.github.com
    const getUserResponse = await fetch("https://api.github.com/user", {
        headers: {
            accept: "application/vnd.github.v3+json",
            authorization: `token ${result.token}`,
        },
    })
    const { login } = await getUserResponse.json()
    $login.textContent = login
    document.body.dataset.state = "signed-in"
    return Promise.resolve("ok")
}

function getCookies() {
    const cookies = document.cookie.split("; ")
    return cookies.reduce((acc, cookie) => {
        const [key, value] = cookie.split("=")
        acc[key] = value
        return acc
    }, {})
}

if (code) {
    login(code)
}