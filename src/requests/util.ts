export function logResponseError(resp: Response, source: string): void {
    if (resp.ok) {
        return
    }
    resp.text().then(error => console.error(`Error while ${source}: ${error}`))
}