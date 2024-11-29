export const AuthButton = (credentials: {
    username: string,
    password: string
} ) => {  // TODO: Delete
    const url = "/login"
    const callback = () => {
        fetch(url, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(credentials),
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