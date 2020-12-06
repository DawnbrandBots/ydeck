import { TypedDeck } from "ydke";
import { enums } from "ygopro-data";
import { countNumbers } from "./counts";
import { CardArray } from "./deck";

const DECK_SIZE_MAIN_MIN_MASTER = 40;
const DECK_SIZE_MAIN_MAX_MASTER = 60;
const DECK_SIZE_EXTRA_MAX_MASTER = 15;
const DECK_SIZE_SIDE_MAX_MASTER = 15;

const OT_PRERELEASE = 0x100;

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
		const count = regResult ? parseInt(regResult[1], 10) : /* istanbul ignore next */ -1; //should exist, -1 will sniff out errors
		if (counts[card] > count) {
			errors.push(
				`Too many copies of ${dataCard.text.en.name} (${card})! Should be at most ${count}, is ${counts[card]}.`
			);
		}
	}

	return errors;
}
