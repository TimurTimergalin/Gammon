import {observer} from "mobx-react-lite";
import {ComponentProps, useCallback, useEffect, useRef} from "react";
import {useFormState} from "../../forms/FormState";
import {ComplexValidator, SimpleValidator} from "../../forms/validators";
import {runInAction} from "mobx";


export const FormInput = observer(function FormInput(
    {validityCheck, className, index, complexValidityCheck, ...inputProps}: ComponentProps<"input"> &
        { validityCheck: SimpleValidator, className?: string, index: number, complexValidityCheck?: ComplexValidator }
) {
    const formState = useFormState()
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const result = validityCheck(inputRef.current!.value)
        formState.validity.set(index, result)
        formState.touched.set(index, false)
    }, [formState, index, validityCheck])

    const touched = formState.touched.get(index)!

    const checkValidity = useCallback(() => {
        const result = validityCheck(inputRef.current!.value)
        if (!result.success) {
            inputRef.current!.setCustomValidity(result.message)
            runInAction(() => formState.validity.set(index, result))
            return
        }
        if (complexValidityCheck === undefined) {
            inputRef.current!.setCustomValidity("")
            runInAction(() => formState.validity.set(index, result))
            return;
        }
        const result1 = complexValidityCheck(formState.formData!)
        runInAction(() => formState.validity.set(index, result1))
        if (result1.success) {
            inputRef.current!.setCustomValidity("")
        } else {
            inputRef.current!.setCustomValidity(result1.message)
        }

    }, [complexValidityCheck, formState.formData, formState.validity, index, validityCheck])

    useEffect(() => {
        if (touched) {
            checkValidity()
        }
    }, [checkValidity, touched]);

    const onInputChange = useCallback(() => {
        runInAction(() => {
            formState.touched.set(index, true)
        })
        checkValidity()
        formState.updateFormData()
    }, [checkValidity, formState, index])

    return (
        <input ref={inputRef} {...inputProps} className={className} onChange={onInputChange} onFocus={onInputChange}/>
    )
})