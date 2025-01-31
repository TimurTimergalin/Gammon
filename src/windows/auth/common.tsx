import styled from "styled-components";
import {FormInput} from "../../components/forms/FormInput";
import {inputBaseStyle} from "../../css/forms";
import {FormInputMessage} from "../../components/forms/FormInputMessage";
import {authFormInputMessageStyle} from "./styles";

export const AuthFormInput = styled(FormInput)`
    ${inputBaseStyle}
`
export const AuthFormInputMessage = styled(FormInputMessage)`
    ${authFormInputMessageStyle}
`