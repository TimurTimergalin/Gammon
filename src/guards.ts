export function assertNN<T>(value: T | null): asserts value is T {
    if (value === null) {
        throw TypeError("Not null assertion failed")
    }
}