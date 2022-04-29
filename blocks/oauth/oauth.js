const WORKER_URL = "https://worker.cpilsworth.workers.dev"
const code = new URL(location.href).searchParams.get("code")
const $login = document.querySelector(".oauth")

if (code) {
    login(code)
}

async function login(code) {
    // remove ?code=... from URL
    const path =
        location.pathname +
        location.search.replace(/\bcode=\w+/, "").replace(/\?$/, "")
    history.pushState({}, "", path)

    document.body.dataset.state = "loading"

    try {
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
    } catch (error) {
        alert(error)
        location.reload()
    }
}