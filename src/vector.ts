import { TypedDeck } from "ydke";

export interface ICard {
	// name: string;
	/// CDB card type bitset
	type: number;
	/// CDB setcode bit array
	setcode: number;
	/// Password for the main card with the same name. undefined means no alias; do not use 0.
	alias?: number;
	/// These aren't actually used by YDeck but may be useful for constructing allow vectors
	limitTCG: number;
	limitOCG: number;
	isPrerelease: boolean;
}

export type CardIndex = Map<number, ICard>;
export type CardVector = Map<number, number>;

/**
 * Aliases are treated as the same card.
 *
 * @param cards      Base card pool
 * @param evaluate   Evaluate the card and decide how many copies are allowed
 * @returns          Card vector where each component is the maximum number of that card allowed
 */
export function createAllowVector(cards: CardIndex, evaluate: (card: ICard) => number): CardVector {
	const vector: CardVector = new Map();
	for (const [password, card] of cards) {
		if (card.alias === undefined) {
			vector.set(password, evaluate(card));
		}
	}
	return vector;
}

/**
 * @param deck   The standard deck representation to vectorise
 * @param cards  Used to normalise aliases to the same card
 * @returns      Card vector where each component is the quantity of that card and aliases
 */
export function deckToVector(deck: TypedDeck, cards: CardIndex): CardVector {
	const vector: CardVector = new Map();
	const deckReducer = (password: number) => {
		const index = cards.get(password)?.alias || password;
		vector.set(index, 1 + (vector.get(index) || 0));
	};
	deck.main.forEach(deckReducer);
	deck.extra.forEach(deckReducer);
	deck.side.forEach(deckReducer);
	return vector;
}
