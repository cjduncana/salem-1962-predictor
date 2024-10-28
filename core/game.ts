import { Either } from "effect";

import { type NumberOfPlayers, Player } from "./player.ts";
import { TooFewPlayersError, TooManyPlayersError } from "./error.ts";

export class Game {
  #players: Player[];

  private constructor(players: Player[]) {
    this.#players = players;
  }

  static initialize(
    playerNames: string[],
  ): Either.Either<Game, TooFewPlayersError | TooManyPlayersError> {
    return Either.gen(function* () {
      const numberOfPlayers = yield* parseValidNumberOfPlayers(
        playerNames.length,
      );

      return new Game(
        playerNames.map((name) => Player.initialize(name, numberOfPlayers)),
      );
    });
  }

  revealTrialCard(
    targetedPlayerPosition: number,
    isRevealedCardAWitch: boolean,
  ): Game {
    return new Game(
      this.#players.map((player, position) =>
        position === targetedPlayerPosition
          ? player.revealTrialCard(isRevealedCardAWitch)
          : player
      ),
    );
  }

  killPlayers(...targetedPlayerPositions: number[]): Game {
    return new Game(
      this.#players.map((player, position) =>
        targetedPlayerPositions.includes(position) ? player.kill() : player
      ),
    );
  }

  get playersStillAlive(): Player[] {
    return this.#players.filter((player) => player.trialCardsRemaining > 0);
  }
}

const MINIMUM_AMOUNT_PLAYERS = 4;
const MAXIMUM_AMOUNT_PLAYERS = 12;

function parseValidNumberOfPlayers(
  amountOfPlayers: number,
): Either.Either<
  NumberOfPlayers,
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
