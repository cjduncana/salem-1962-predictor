import { assert } from "jsr:@std/assert@1/assert";
import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { Either } from "npm:effect";

import { TooFewPlayersError, TooManyPlayersError } from "./error.ts";
import { Game } from "./game.ts";

describe("#initialize", () => {
  it("should return an error if there are too few players", () => {
    const result = Game.initialize(["Alice"]);

    expect(result).toEqual(Either.left(new TooFewPlayersError(1)));
  });

  it("should give five cards to each player if there are four or more players", () => {
    const gameResult = Game.initialize(["Alice", "Bob", "Charlie", "David"]);

    assert(
      Either.isRight(gameResult),
      "Expected Either.right, got Either.left",
    );

    const { playersStillAlive } = gameResult.right;

    expect(playersStillAlive).toHaveLength(4);

    playersStillAlive.forEach((player) => {
      expect(player.trialCardsRemaining).toEqual(5);
    });
  });

  it("should give five cards to each player if there are six or less players", () => {
    const gameResult = Game.initialize([
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
    ]);

    assert(
      Either.isRight(gameResult),
      "Expected Either.right, got Either.left",
    );

    const { playersStillAlive } = gameResult.right;

    expect(playersStillAlive).toHaveLength(6);

    playersStillAlive.forEach((player) => {
      expect(player.trialCardsRemaining).toEqual(5);
    });
  });

  it("should give four cards to each player if there are seven or more players", () => {
    const gameResult = Game.initialize([
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
    ]);

    assert(
      Either.isRight(gameResult),
      "Expected Either.right, got Either.left",
    );

    const { playersStillAlive } = gameResult.right;

    expect(playersStillAlive).toHaveLength(7);

    playersStillAlive.forEach((player) => {
      expect(player.trialCardsRemaining).toEqual(4);
    });
  });

  it("should give four cards to each player if there are nine or less players", () => {
    const gameResult = Game.initialize([
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Heidi",
      "Ivan",
    ]);

    assert(
      Either.isRight(gameResult),
      "Expected Either.right, got Either.left",
    );

    const { playersStillAlive } = gameResult.right;

    expect(playersStillAlive).toHaveLength(9);

    playersStillAlive.forEach((player) => {
      expect(player.trialCardsRemaining).toEqual(4);
    });
  });

  it("should give three cards to each player if there are ten or more players", () => {
    const gameResult = Game.initialize([
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Heidi",
      "Ivan",
      "Judy",
    ]);

    assert(
      Either.isRight(gameResult),
      "Expected Either.right, got Either.left",
    );

    const { playersStillAlive } = gameResult.right;

    expect(playersStillAlive).toHaveLength(10);

    playersStillAlive.forEach((player) => {
      expect(player.trialCardsRemaining).toEqual(3);
    });
  });

  it("should give three cards to each player if there are twelve or less players", () => {
    const gameResult = Game.initialize([
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Heidi",
      "Ivan",
      "Judy",
      "Kevin",
      "Laura",
    ]);

    assert(
      Either.isRight(gameResult),
      "Expected Either.right, got Either.left",
    );

    const { playersStillAlive } = gameResult.right;

    expect(playersStillAlive).toHaveLength(12);

    playersStillAlive.forEach((player) => {
      expect(player.trialCardsRemaining).toEqual(3);
    });
  });

  it("should return an error if there are too many players", () => {
    const result = Game.initialize([
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Heidi",
      "Ivan",
      "Judy",
      "Kevin",
      "Laura",
      "Mallory",
    ]);

    expect(result).toEqual(Either.left(new TooManyPlayersError(13)));
  });
});

describe("#revealTrialCard", () => {
  it("should reduce the card amount of the targeted player by one if the revealed card is not a witch", () => {
    const gameResult = Game.initialize(["Alice", "Bob", "Charlie", "David"]);

    assert(
      Either.isRight(gameResult),
      "Expected Either.right, got Either.left",
    );

    const { right: game } = gameResult;

    const updatedGame = game.revealTrialCard(1, false);

    const { playersStillAlive } = updatedGame;

    expect(playersStillAlive).toHaveLength(4);

    playersStillAlive.forEach((player, position) => {
      if (position === 1) {
        expect(player.name).toEqual("Bob");
        expect(player.trialCardsRemaining).toEqual(4);
      } else {
        expect(player.name).not.toEqual("Bob");
        expect(player.trialCardsRemaining).toEqual(5);
      }
    });
  });

  it("should kill the targeted player if the revealed card is a witch", () => {
    const gameResult = Game.initialize(["Alice", "Bob", "Charlie", "David"]);

    assert(
      Either.isRight(gameResult),
      "Expected Either.right, got Either.left",
    );

    const { right: game } = gameResult;

    const updatedGame = game.revealTrialCard(1, true);

    const { playersStillAlive } = updatedGame;

    expect(playersStillAlive).toHaveLength(3);

    playersStillAlive.forEach((player) => {
      expect(player.name).not.toEqual("Bob");
      expect(player.trialCardsRemaining).toEqual(5);
    });
  });
});

describe("#killPlayers", () => {
  it("should remove all cards from the targeted players", () => {
    const gameResult = Game.initialize(["Alice", "Bob", "Charlie", "David"]);

    assert(
      Either.isRight(gameResult),
      "Expected Either.right, got Either.left",
    );

    const { right: game } = gameResult;

    const updatedGame = game.killPlayers(1, 3);

    const { playersStillAlive } = updatedGame;

    expect(playersStillAlive).toHaveLength(2);

    playersStillAlive.forEach((player) => {
      expect(player.name).not.toEqual("Bob");
      expect(player.name).not.toEqual("David");
    });
  });
});
