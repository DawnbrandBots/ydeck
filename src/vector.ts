import { TypedDeck } from "ydke";

export interface ICard {
	/// Human-readable name
	name: string;
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
 * Only cards in this vector are considered for acceptance, and cards not in this
 * vector are rejected. If the evaluation function decides to accept an alias and
 * treat it as the same card, it should return a negative value.
 *
 * @param cards      Base card pool
 * @param evaluate   Evaluate the card and decide how many copies are allowed
 * @returns          Card vector where each component is the maximum number of that card allowed
 */
export function createAllowVector(cards: CardIndex, evaluate: (card: ICard) => number): CardVector {
	const vector: CardVector = new Map();
	for (const [password, card] of cards) {
		const limit = evaluate(card);
		if (limit != 0) {
			vector.set(password, limit);
		}
	}
	return vector;
}

/**
 * @param deck        The standard deck representation to vectorise
 * @param cards       Used to normalise aliases to the same card
 * @param allowVector If provided, used to decide whether to normalise an alias or leave it be
 * @returns           Card vector where each component is the quantity of that card and aliases
 */
export function deckToVector(deck: TypedDeck, cards: CardIndex, allowVector?: CardVector): CardVector {
	const vector: CardVector = new Map();
	const deckReducer = (password: number) => {
		const index = (() => {
			if (!allowVector || (allowVector.get(password) || 0) < 0) {
				return cards.get(password)?.alias || password;
			} else {
				return password;
			}
		})();
		vector.set(index, 1 + (vector.get(index) || 0));
	};
	deck.main.forEach(deckReducer);
	deck.extra.forEach(deckReducer);
	deck.side.forEach(deckReducer);
	return vector;
}
