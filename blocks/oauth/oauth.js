async function getUser(token) {
    return fetch("https://api.github.com/user", {
        headers: {
            accept: "application/vnd.github.v3+json",
            authorization: `token ${token}`,
        },
    }).then((res) => res.json())
}

function getCookies() {
    const cookies = document.cookie.split("; ")
    return cookies.reduce((acc, cookie) => {
        const [key, value] = cookie.split("=")
        acc[key] = value
        return acc
    }, {})
}

async function showUser() {
    const { authtoken } = getCookies()
    const user = await getUser(authtoken)
    document.getElementsByClassName("oauth")[0].innerHTML = `${JSON.stringify(
    user,
    null,
    2,
  )}`
}