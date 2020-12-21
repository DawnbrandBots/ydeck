import { TypedDeck } from "ydke";
import { CardArray } from ".";
import { CardVector, checkDeck } from "./check";
import { banlistCardVector, cardLimiters } from "./ygodata";

const DECK_SIZE_MAIN_MIN_MASTER = 40;
const DECK_SIZE_MAIN_MAX_MASTER = 60;
const DECK_SIZE_EXTRA_MAX_MASTER = 15;
const DECK_SIZE_SIDE_MAX_MASTER = 15;

const cardPools: { [limiter: string]: CardVector } = {};

export type DeckError = SizeError | LimitError;

interface BaseError {
	max: number;
	actual: number;
}

interface SizeError extends BaseError {
	type: "size";
	target: "main" | "extra" | "side";
	min?: number;
}

interface LimitError extends BaseError {
	type: "limit";
	target: number;
	name: string;
}

export function validateDeckVectored(
	deck: TypedDeck,
	vector: CardVector,
	limiter: string,
	data: CardArray
): DeckError[] {
	const errors: DeckError[] = [];

	// Deck size. Assuming Master Duel for now.
	if (deck.main.length < DECK_SIZE_MAIN_MIN_MASTER) {
		errors.push({
			type: "size",
			target: "main",
			min: DECK_SIZE_MAIN_MIN_MASTER,
			max: DECK_SIZE_MAIN_MAX_MASTER,
			actual: deck.main.length
		});
	}

	if (deck.main.length > DECK_SIZE_MAIN_MAX_MASTER) {
		errors.push({
			type: "size",
			target: "main",
			max: DECK_SIZE_MAIN_MAX_MASTER,
			actual: deck.main.length
		});
	}

	if (deck.extra.length > DECK_SIZE_EXTRA_MAX_MASTER) {
		errors.push({
			type: "size",
			target: "extra",
			max: DECK_SIZE_EXTRA_MAX_MASTER,
			actual: deck.extra.length
		});
	}

	if (deck.side.length > DECK_SIZE_SIDE_MAX_MASTER) {
		errors.push({
			type: "size",
			target: "side",
			max: DECK_SIZE_SIDE_MAX_MASTER,
			actual: deck.side.length
		});
	}

	// Banlist and scope
	if (!cardPools[limiter]) {
		cardPools[limiter] = banlistCardVector(data, cardLimiters[limiter]);
	}
	const [, results] = checkDeck(vector, cardPools[limiter]);

	for (const passcode in results) {
		if (results[passcode] < 0) {
			errors.push({
				type: "limit",
				target: parseInt(passcode, 10),
				name: data[passcode]?.name || passcode,
				max: cardPools[limiter][passcode],
				actual: vector[passcode]
			});
		}
	}

	return errors;
}
