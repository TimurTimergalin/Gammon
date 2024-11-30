import {NavigateFunction} from "react-router";
import {makeAutoObservable} from "mobx";
import {createContext, RefObject, useContext} from "react";

export class FormState {
    private _formData: FormData | null = null
    get formData(): FormData | null {
        return this._formData;
    }

    readonly validationSuccess: Map<number, boolean> = new Map()
    readonly defaultOnSubmit = () => console.error("No onSubmit specified")
    onSubmit: (navigate: NavigateFunction) => void = this.defaultOnSubmit
    enabled = true
    formRef: RefObject<HTMLFormElement> | null = null

    constructor() {
        makeAutoObservable(this)
    }

    updateFormData() {
        this._formData = new FormData(this.formRef!.current!)
    }
}

export const FormStateContext = createContext<FormState | null>(null)
export const useFormState = () => {
    const formState = useContext(FormStateContext)
    console.assert(formState !== null)
    return formState!
}