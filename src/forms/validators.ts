export type ValidityCheckResult = [true] | [false, string]

export const required = (value: string): ValidityCheckResult => value !== "" ? [true] : [false, "Поле не должно быть пустым"]

export const composition = (...validators: ((value: string) => ValidityCheckResult)[]) => (value: string): ValidityCheckResult => {
    for (const validator of validators) {
        const res = validator(value)
        if (!res[0]) {
            return [false, res[1]]
        }
    }
    return [true]
}
