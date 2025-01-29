import styled from "styled-components";
import {FormInput} from "../../components/forms/FormInput.tsx";
import {inputBaseStyle} from "../../css/forms.ts";
import {FormInputMessage} from "../../components/forms/FormInputMessage.tsx";
import {authFormInputMessageStyle} from "./styles.ts";

export const AuthFormInput = styled(FormInput)`
    ${inputBaseStyle}
`
export const AuthFormInputMessage = styled(FormInputMessage)`
    ${authFormInputMessageStyle}
`