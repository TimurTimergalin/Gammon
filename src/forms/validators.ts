export type ValidityCheckResult = { success: true } | { success: false, message: string }
type Validator<T> = (value: T) => ValidityCheckResult
export type SimpleValidator = Validator<string>
export type ComplexValidator = Validator<FormData>

export const required = (value: string): ValidityCheckResult => value !== "" ? {success: true} : {
    success: false,
    message: "Поле не должно быть пустым"
}

export const composition = <T>(...validators: Validator<T>[]) => (value: T): ValidityCheckResult => {
    for (const validator of validators) {
        const res = validator(value)
        if (!res.success) {
            return {success: false, message: res.message}
        }
    }
    return {success: true}
}
