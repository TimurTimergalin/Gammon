import {observer} from "mobx-react-lite";
import {useFormState} from "../../controller/forms/FormState";
import {FetcherFormProps, FetcherWithComponents} from "react-router";


export const FormWithValidation = observer(function FormWithValidation(
    {children, fetcher, ...args}: Omit<FetcherFormProps, "onSubmit"> & {fetcher: FetcherWithComponents<unknown>}
) {
    const formState = useFormState()

    return (
        <fetcher.Form style={{position: "relative", overflow: "auto"}} onSubmit={formState.onSubmit} {...args} noValidate={true}>
            {children}
            {fetcher.state !== "idle" &&
                <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#66666666"
                }}>
                </div>}
        </fetcher.Form>
    )
})
