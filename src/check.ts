import { TypedDeck } from "ydke";

export type CardVector = { [passcode: number]: number };

export function deckToVector(deck: TypedDeck): CardVector {
	const deckReducer = (vector: CardVector, card: number) => {
		if (card in vector) {
			vector[card]++;
		} else {
			vector[card] = 1;
		}
		return vector;
	}
	const vector: CardVector = {};
	deck.main.reduce<CardVector>(deckReducer, vector);
	deck.extra.reduce<CardVector>(deckReducer, vector);
	deck.side.reduce<CardVector>(deckReducer, vector);
	return vector;
}

export function checkDeck(deck: CardVector, cardPool: CardVector): [boolean, CardVector] {
	let good = true;
	const difference: CardVector = {};
	for (const card in deck) {
		difference[card] = (cardPool[card] || 0) - deck[card];
		if (difference[card] < 0) {
			good = false;
		}
	}
	return [good, difference];
}
