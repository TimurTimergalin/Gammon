import {observer} from "mobx-react-lite";
import {ReactNode, useCallback, useEffect, useRef} from "react";
import {NavigateFunction} from "react-router";
import {useFormState} from "../../forms/FormState.ts";

interface FormProps {
    children: ReactNode | ReactNode[],
    onSubmit: (navigate: NavigateFunction) => void,
    className?: string
}

export const Form = observer(function FormBase(
    {children, onSubmit, className}: FormProps
) {
    const formState = useFormState()
    const formRef = useRef<HTMLFormElement | null>(null)

    const onSubmitWithValidate = useCallback((navigate: NavigateFunction) => {
        for (const success of formState.validationSuccess.values()) {
            if (!success) {
                for (const key of formState.touched.keys()) {
                    formState.touched.set(key, true)
                }
                return
            }
            onSubmit(navigate)
        }
    }, [formState, onSubmit])

    useEffect(() => {
        formState.onSubmit = onSubmitWithValidate
        formState.formRef = formRef
        formState.updateFormData()
        return () => {
            formState.onSubmit = formState.defaultOnSubmit
        }
    }, [formState, onSubmitWithValidate])

    return (
        <form className={className} style={{position: "relative", overflow: "clip"}} ref={formRef}>
            {children}
            {!formState.enabled &&
                <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#66666666"
                }}>
                </div>}
        </form>
    )
})
