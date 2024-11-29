export const AuthButton = () => {  // TODO: Delete
    const url = "/login"
    const credentials = JSON.stringify({
        username: "timur",
        password: "123"
    })
    const callback = () => {
        fetch(url, {
            method: "POST",
            credentials: "include",
            body: credentials,
            headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '*'
            }
        }).then(
            resp => {
                console.log(resp)
                return resp.text()
            }
        ).then(console.log)
    }
    return (
        <button onClick={callback}>DEBUG: авторизация</button>
    )
}