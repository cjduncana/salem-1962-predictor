export class TooFewPlayersError {
    readonly _tag = "TooFewPlayersError";
    constructor(readonly playerAmount: number) {}
}

export class TooManyPlayersError {
    readonly _tag = "TooManyPlayersError";
    constructor(readonly playerAmount: number) {}
}
