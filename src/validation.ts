import { TypedDeck } from "ydke";
import { CardVector, checkDeck } from "./check";
//import { countNumbers } from "./counts";
import { CardArray } from "./deck";
import { banlistCardVector, TCG } from "./ygodata";

const DECK_SIZE_MAIN_MIN_MASTER = 40;
const DECK_SIZE_MAIN_MAX_MASTER = 60;
const DECK_SIZE_EXTRA_MAX_MASTER = 15;
const DECK_SIZE_SIDE_MAX_MASTER = 15;

/* Obsoleted by validateVectoredDeck
export async function validateDeck(deck: TypedDeck, data: CardArray): Promise<string[]> {
	const errors: string[] = [];

	// Deck size. Assuming Master Duel for now.
	if (deck.main.length < DECK_SIZE_MAIN_MIN_MASTER) {
		errors.push(`Main Deck too small! Should be at least ${DECK_SIZE_MAIN_MIN_MASTER}, is ${deck.main.length}!`);
	}

	if (deck.main.length > DECK_SIZE_MAIN_MAX_MASTER) {
		errors.push(`Main Deck too large! Should be at most ${DECK_SIZE_MAIN_MAX_MASTER}, is ${deck.main.length}!`);
	}

	if (deck.extra.length > DECK_SIZE_EXTRA_MAX_MASTER) {
		errors.push(`Extra Deck too large! Should be at most ${DECK_SIZE_EXTRA_MAX_MASTER}, is ${deck.extra.length}!`);
	}

	if (deck.side.length > DECK_SIZE_SIDE_MAX_MASTER) {
		errors.push(`Side Deck too large! Should be at most ${DECK_SIZE_SIDE_MAX_MASTER}, is ${deck.side.length}!`);
	}

	// Card pool and banlist. Assuming TCG for now.
	const counts = countNumbers([...deck.main, ...deck.extra, ...deck.side]);
	const uniqueCards = Object.keys(counts).map(k => parseInt(k, 10));

	for (const card of uniqueCards) {
		const dataCard = data[card];
		// Card pool
		if (!dataCard.data.isOT(enums.ot.OT_TCG)) {
			errors.push(
				`${dataCard.text.en.name} (${card}) not TCG-legal! Its scopes are ${dataCard.data.names.en.ot.join(
					", "
				)}.`
			);
			continue; // if it's not in the TCG cardpool, it won't have a TCG banlist entry
		}
		if (dataCard.data.isOT(OT_PRERELEASE)) {
			errors.push(`${dataCard.text.en.name} (${card}) not yet officially released!`);
			continue;
		}
		// Banlist
		const tcgReg = /TCG: (\d)/;
		const status = await dataCard.status;
		const regResult = tcgReg.exec(status);
		const count = regResult ? parseInt(regResult[1], 10) : -1; //should exist, -1 will sniff out errors
		if (counts[card] > count) {
			errors.push(
				`Too many copies of ${dataCard.text.en.name} (${card})! Should be at most ${count}, is ${counts[card]}.`
			);
		}
	}

	return errors;
}*/

let cardPool: CardVector;

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
}

export async function validateDeckVectored(deck: TypedDeck, vector: CardVector, data: CardArray): Promise<DeckError[]> {
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

	if (!cardPool) {
		cardPool = await banlistCardVector(data, TCG);
	}
	const [, results] = checkDeck(vector, cardPool);

	for (const passcode in results) {
		if (results[passcode] < 0) {
			errors.push({
				type: "limit",
				target: parseInt(passcode, 10),
				max: cardPool[passcode],
				actual: vector[passcode]
			});
		}
	}

	return errors;
}
