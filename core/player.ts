export class Player {
	readonly name: string
	#tryalCardAmount: number

	private constructor(name: string, cardAmount: number) {
		this.name = name
		this.#tryalCardAmount = cardAmount
	}

	static new(
		name: string,
		numberOfPlayers: NumberOfPlayers,
	): Player {
		const cardAmount = initialCardAmountPerNumberOfPlayers[numberOfPlayers]

		return new Player(name, cardAmount)
	}

	revealTryalCard(isRevealedCardAWitch: boolean): Player {
		return new Player(
			this.name,
			isRevealedCardAWitch ? 0 : this.#tryalCardAmount - 1,
		)
	}

	kill(): Player {
		return new Player(this.name, 0)
	}

	get tryalCardsRemaining(): number {
		return this.#tryalCardAmount
	}

	get isAlive(): boolean {
		return this.#tryalCardAmount > 0
	}
}

export enum NumberOfPlayers {
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

const initialCardAmountPerNumberOfPlayers: Record<
	NumberOfPlayers,
	number
> = {
	[NumberOfPlayers.Four]: 5,
	[NumberOfPlayers.Five]: 5,
	[NumberOfPlayers.Six]: 5,
	[NumberOfPlayers.Seven]: 4,
	[NumberOfPlayers.Eight]: 4,
	[NumberOfPlayers.Nine]: 4,
	[NumberOfPlayers.Ten]: 3,
	[NumberOfPlayers.Eleven]: 3,
	[NumberOfPlayers.Twelve]: 3,
}
