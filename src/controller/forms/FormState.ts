import {makeAutoObservable, runInAction} from "mobx";
import {createContext, FormEvent, useContext} from "react";
import {ValidityCheckResult} from "./validators";
import {logger} from "../../logging/main";

const console = logger("forms")

export class FormState {
    private _formData: FormData | null = null
    get formData(): FormData | null {
        return this._formData;
    }

    readonly validity: Map<number, ValidityCheckResult> = new Map()
    readonly touched: Map<number, boolean> = new Map()
    readonly defaultOnSubmit = () => console.error("No onSubmit specified")

    get onSubmit(): (e: FormEvent) => void {
        return (e: FormEvent) => {
            for (const success of this.validity.values()) {
                if (!success.success) {
                    for (const key of this.touched.keys()) {
                        runInAction(() => this.touched.set(key, true))
                    }
                    e.preventDefault()
                    return
                }
            }
            return
        };
    }

    constructor() {
        makeAutoObservable(this)
    }
}

export const FormStateContext = createContext<FormState | null>(null)
export const useFormState = () => {
    const formState = useContext(FormStateContext)
    console.assert(formState !== null)
    return formState!
}