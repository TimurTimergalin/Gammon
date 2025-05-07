import {makeAutoObservable, runInAction} from "mobx";

export class ImgCache {
    private images = new Map<string, string>()
    static readonly placeholder = "/user_icon_placeholder.svg"
    private placeholderDataUrl: string | undefined = undefined
    private errors = new Set<string>()

    constructor() {
        this.getDataUrl(ImgCache.placeholder).then(
            dataUrl => runInAction(() => {this.placeholderDataUrl = dataUrl})
        )
        makeAutoObservable(this)
    }

    private async getDataUrl(src: string): Promise<string> {
        const resp = await fetch(src)
        const blob = await resp.blob()
        return await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }) as string
    }

    get(src: string): string {
        if (this.images.has(src)) {
            return this.images.get(src)!
        }
        if (this.errors.has(src)) {
            return this.placeholderDataUrl ?? ImgCache.placeholder
        }
        this.getDataUrl(src)
            .then(dataUrl => runInAction(() => {this.images.set(src, dataUrl as string)}))
            .catch(() => this.errors.add(src))
        return src
    }

    getPlaceholder() {
        return this.placeholderDataUrl ?? ImgCache.placeholder
    }

    invalidate(src: string) {
        this.images.delete(src)
    }
}