export interface Labels {
    white: number,
    black: number
}

export interface LabelMapper {
    map(pi: number): Labels

    flipped(): LabelMapper
}