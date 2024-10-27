import { Either } from "npm:effect";

const MINIMUM_AMOUNT_PLAYERS = 4;
const MAXIMUM_AMOUNT_PLAYERS = 12;

interface GameInfo {
  players: PlayerInfo[];
}

interface PlayerInfo {
  position: number;
  name: string;
  cardAmount: number;
}

export class TooFewPlayersError {
  readonly _tag = "TooFewPlayersError";
  constructor(readonly playerAmount: number) {}
}

export class TooManyPlayersError {
  readonly _tag = "TooManyPlayersError";
  constructor(readonly playerAmount: number) {}
}

export function initializeGame(
  playerNames: string[]
): Either.Either<GameInfo, TooFewPlayersError | TooManyPlayersError> {
  return Either.gen(function* () {
    const validNumberOfPlayers = yield* parseValidNumberOfPlayers(
      playerNames.length
    );
    const cardAmount =
      initialCardAmountPerNumberOfPlayers[validNumberOfPlayers];

    return {
      players: playerNames.map((name, position) => ({
        position,
        name,
        cardAmount,
      })),
    };
  });
}

enum ValidNumberOfPlayers {
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Eleven = 11,
  Twelve = 12,
}

function parseValidNumberOfPlayers(
  amountOfPlayers: number
): Either.Either<
  ValidNumberOfPlayers,
  TooFewPlayersError | TooManyPlayersError
> {
  if (amountOfPlayers < MINIMUM_AMOUNT_PLAYERS) {
    return Either.left(new TooFewPlayersError(amountOfPlayers));
  }

  if (amountOfPlayers > MAXIMUM_AMOUNT_PLAYERS) {
    return Either.left(new TooManyPlayersError(amountOfPlayers));
  }

  return Either.right(amountOfPlayers);
}

const initialCardAmountPerNumberOfPlayers: Record<
  ValidNumberOfPlayers,
  number
> = {
  [ValidNumberOfPlayers.Four]: 5,
  [ValidNumberOfPlayers.Five]: 5,
  [ValidNumberOfPlayers.Six]: 5,
  [ValidNumberOfPlayers.Seven]: 4,
  [ValidNumberOfPlayers.Eight]: 4,
  [ValidNumberOfPlayers.Nine]: 4,
  [ValidNumberOfPlayers.Ten]: 3,
  [ValidNumberOfPlayers.Eleven]: 3,
  [ValidNumberOfPlayers.Twelve]: 3,
};
