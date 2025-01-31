import {ReactNode, useRef} from "react";
import {FormState, FormStateContext} from "./FormState";

export const FormStateProvider = ({children}: {children: ReactNode | ReactNode[]}) => {
    const formState = useRef(new FormState())
    return <FormStateContext.Provider value={formState.current}>
        {children}
    </FormStateContext.Provider>
}