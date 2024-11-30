import {observer} from "mobx-react-lite";
import {ComponentProps, useCallback, useEffect, useRef} from "react";
import {useFormState} from "./state/FormState.ts";

type ValidityCheckResult = [true] | [false, string]

export const FormInput = observer(function FormInput(
    {validityCheck, className, index, ...inputProps}: ComponentProps<"input"> &
        {validityCheck: (value: string) => ValidityCheckResult, className?: string, index: number}
) {
    const formState = useFormState()
    const inputRef = useRef<HTMLInputElement | null>(null)
    
    useEffect(() => {
        const result = validityCheck(inputRef.current!.value)
        formState.validationSuccess.set(index, result[0])
    }, [formState.validationSuccess, index, validityCheck])
    
     const onInputChange = useCallback(() => {
         const result = validityCheck(inputRef.current!.value)
         formState.validationSuccess.set(index, result[0])
         if (!result[0]) {
             inputRef.current!.setCustomValidity(result[1])
         } else {
             inputRef.current!.setCustomValidity("")
         }
         formState.updateFormData()
     }, [formState, index, validityCheck])
    
    return (
        <input ref={inputRef} {...inputProps} className={className} onChange={onInputChange}/>
    )
})