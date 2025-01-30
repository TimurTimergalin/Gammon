import {NavigateFunction} from "react-router";
import {makeAutoObservable} from "mobx";
import React, {createContext, RefObject, useContext} from "react";
import {ValidityCheckResult} from "./validators.ts";
import {logger} from "../logging/main.ts";

const console = logger("forms")

export class FormState {
    private _formData: FormData | null = null
    get formData(): FormData | null {
        return this._formData;
    }

    readonly validity: Map<number, ValidityCheckResult> = new Map()
    readonly touched: Map<number, boolean> = new Map()
    readonly defaultOnSubmit = () => console.error("No onSubmit specified")
    onSubmit: (navigate: NavigateFunction) => void = this.defaultOnSubmit

    private _enabled = true

    get enabled(): boolean {
        return this._enabled;
    }
    set enabled(value: boolean) {
        this._enabled = value;
    }

    private _formRef: RefObject<HTMLFormElement> | null = null
    get formRef(): React.RefObject<HTMLFormElement> | null {
        return this._formRef;
    }
    set formRef(value: React.RefObject<HTMLFormElement> | null) {
        this._formRef = value;
    }

    constructor() {
        makeAutoObservable(this)
    }

    updateFormData() {
        this._formData = new FormData(this._formRef!.current!)
    }
}

export const FormStateContext = createContext<FormState | null>(null)
export const useFormState = () => {
    const formState = useContext(FormStateContext)
    console.assert(formState !== null)
    return formState!
}