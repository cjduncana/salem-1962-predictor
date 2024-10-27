import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { Either } from "npm:effect";

import {
  initializeGame,
  revealTrialCard,
  TooFewPlayersError,
  TooManyPlayersError,
  type GameInfo,
} from "./main.ts";

describe("#initializeGame", () => {
  it("should return an error if there are too few players", () => {
    const result = initializeGame(["Alice"]);

    expect(result).toEqual(Either.left(new TooFewPlayersError(1)));
  });

  it("should give five cards to each player if there are four or more players", () => {
    const result = initializeGame(["Alice", "Bob", "Charlie", "David"]);

    expect(result).toEqual(
      Either.right({
        players: [
          { position: 0, name: "Alice", cardAmount: 5 },
          { position: 1, name: "Bob", cardAmount: 5 },
          { position: 2, name: "Charlie", cardAmount: 5 },
          { position: 3, name: "David", cardAmount: 5 },
        ],
      })
    );
  });

  it("should give five cards to each player if there are six or less players", () => {
    const result = initializeGame([
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
    ]);

    expect(result).toEqual(
      Either.right({
        players: [
          { position: 0, name: "Alice", cardAmount: 5 },
          { position: 1, name: "Bob", cardAmount: 5 },
          { position: 2, name: "Charlie", cardAmount: 5 },
          { position: 3, name: "David", cardAmount: 5 },
          { position: 4, name: "Eve", cardAmount: 5 },
          { position: 5, name: "Frank", cardAmount: 5 },
        ],
      })
    );
  });

  it("should give four cards to each player if there are seven or more players", () => {
    const result = initializeGame([
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
    ]);

    expect(result).toEqual(
      Either.right({
        players: [
          { position: 0, name: "Alice", cardAmount: 4 },
          { position: 1, name: "Bob", cardAmount: 4 },
          { position: 2, name: "Charlie", cardAmount: 4 },
          { position: 3, name: "David", cardAmount: 4 },
          { position: 4, name: "Eve", cardAmount: 4 },
          { position: 5, name: "Frank", cardAmount: 4 },
          { position: 6, name: "Grace", cardAmount: 4 },
        ],
      })
    );
  });

  it("should give four cards to each player if there are nine or less players", () => {
    const result = initializeGame([
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

    expect(result).toEqual(
      Either.right({
        players: [
          { position: 0, name: "Alice", cardAmount: 4 },
          { position: 1, name: "Bob", cardAmount: 4 },
          { position: 2, name: "Charlie", cardAmount: 4 },
          { position: 3, name: "David", cardAmount: 4 },
          { position: 4, name: "Eve", cardAmount: 4 },
          { position: 5, name: "Frank", cardAmount: 4 },
          { position: 6, name: "Grace", cardAmount: 4 },
          { position: 7, name: "Heidi", cardAmount: 4 },
          { position: 8, name: "Ivan", cardAmount: 4 },
        ],
      })
    );
  });

  it("should give three cards to each player if there are ten or more players", () => {
    const result = initializeGame([
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

    expect(result).toEqual(
      Either.right({
        players: [
          { position: 0, name: "Alice", cardAmount: 3 },
          { position: 1, name: "Bob", cardAmount: 3 },
          { position: 2, name: "Charlie", cardAmount: 3 },
          { position: 3, name: "David", cardAmount: 3 },
          { position: 4, name: "Eve", cardAmount: 3 },
          { position: 5, name: "Frank", cardAmount: 3 },
          { position: 6, name: "Grace", cardAmount: 3 },
          { position: 7, name: "Heidi", cardAmount: 3 },
          { position: 8, name: "Ivan", cardAmount: 3 },
          { position: 9, name: "Judy", cardAmount: 3 },
        ],
      })
    );
  });

  it("should give three cards to each player if there are twelve or less players", () => {
    const result = initializeGame([
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

    expect(result).toEqual(
      Either.right({
        players: [
          { position: 0, name: "Alice", cardAmount: 3 },
          { position: 1, name: "Bob", cardAmount: 3 },
          { position: 2, name: "Charlie", cardAmount: 3 },
          { position: 3, name: "David", cardAmount: 3 },
          { position: 4, name: "Eve", cardAmount: 3 },
          { position: 5, name: "Frank", cardAmount: 3 },
          { position: 6, name: "Grace", cardAmount: 3 },
          { position: 7, name: "Heidi", cardAmount: 3 },
          { position: 8, name: "Ivan", cardAmount: 3 },
          { position: 9, name: "Judy", cardAmount: 3 },
          { position: 10, name: "Kevin", cardAmount: 3 },
          { position: 11, name: "Laura", cardAmount: 3 },
        ],
      })
    );
  });

  it("should return an error if there are too many players", () => {
    const result = initializeGame([
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
    const gameInfo: GameInfo = {
      players: [
        { position: 0, name: "Alice", cardAmount: 3 },
        { position: 1, name: "Bob", cardAmount: 3 },
        { position: 2, name: "Charlie", cardAmount: 3 },
        { position: 3, name: "David", cardAmount: 3 },
      ],
    };

    const result = revealTrialCard(gameInfo, 1, false);

    expect(result).toEqual({
      players: [
        { position: 0, name: "Alice", cardAmount: 3 },
        { position: 1, name: "Bob", cardAmount: 2 },
        { position: 2, name: "Charlie", cardAmount: 3 },
        { position: 3, name: "David", cardAmount: 3 },
      ],
    });
  });

  it("should remove all cards from the targeted player if the revealed card is a witch", () => {
    const gameInfo: GameInfo = {
      players: [
        { position: 0, name: "Alice", cardAmount: 3 },
        { position: 1, name: "Bob", cardAmount: 3 },
        { position: 2, name: "Charlie", cardAmount: 3 },
        { position: 3, name: "David", cardAmount: 3 },
      ],
    };

    const result = revealTrialCard(gameInfo, 1, true);

    expect(result).toEqual({
      players: [
        { position: 0, name: "Alice", cardAmount: 3 },
        { position: 1, name: "Bob", cardAmount: 0 },
        { position: 2, name: "Charlie", cardAmount: 3 },
        { position: 3, name: "David", cardAmount: 3 },
      ],
    });
  });
});
