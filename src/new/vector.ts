export interface ICard {
	name: string;
	type: number;
	setcode: number;
	alias?: number;
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
