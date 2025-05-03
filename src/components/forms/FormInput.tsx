import {observer} from "mobx-react-lite";
import {ComponentProps, MutableRefObject, useCallback, useEffect, useRef} from "react";
import {useFormState} from "../../controller/forms/FormState";
import {SimpleValidator} from "../../controller/forms/validators";
import {runInAction} from "mobx";


export const FormInput = observer(function FormInput(
    {validityCheck, className, index, valueRef, ...inputProps}: ComponentProps<"input"> &
        { validityCheck: SimpleValidator, className?: string, index: number, valueRef?: MutableRefObject<string> }
) {
    const formState = useFormState()
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const result = validityCheck(inputRef.current!.value)
        runInAction(() => {
            formState.validity.set(index, result)
            formState.touched.set(index, false)
        })
    }, [formState, index, validityCheck])

    const touched = formState.touched.get(index)!

    const checkValidity = useCallback(() => {
        const result = validityCheck(inputRef.current!.value)
        if (!result.success) {
            inputRef.current!.setCustomValidity(result.message)
            runInAction(() => formState.validity.set(index, result))
            return
        }
        inputRef.current!.setCustomValidity("")
        runInAction(() => formState.validity.set(index, result))

    }, [formState.validity, index, validityCheck])

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
        if (valueRef !== undefined) {
            valueRef.current = inputRef.current!.value!
        }
    }, [checkValidity, formState, index, valueRef])

    return (
        <input ref={inputRef} {...inputProps} className={className} onChange={onInputChange} onFocus={onInputChange}/>
    )
})