import { extractURLs, parseURL, toURL, TypedDeck } from "ydke";
import { CardIndex, CardVector } from "./vector";
import { ydkToTypedDeck } from "./ydk";

export type YDKE = { url: string };
export type YDK = { ydk: string };
export type DeckSizes = {
	[subdeck in keyof TypedDeck]: { min: number; max: number };
};

interface BaseError {
	max: number;
	actual: number;
}

interface SizeError extends BaseError {
	type: "size";
	target: keyof TypedDeck;
	min?: number;
}

interface LimitError extends BaseError {
	type: "limit";
	target: number;
	name: string;
}

export type DeckError = SizeError | LimitError;

export class Deck {
	public readonly url: string;
	public readonly contents: TypedDeck;

	constructor(args: YDKE | YDK) {
		if ("url" in args) {
			const urls = extractURLs(args.url);
			if (urls.length !== 1) {
				throw new Error(); // TODO
			}
			this.url = urls[0];
			this.contents = parseURL(this.url);
		} else {
			this.contents = ydkToTypedDeck(args.ydk);
			this.url = toURL(this.contents);
		}
	}

	/**
	 * Is this a legal list?
	 *
	 * @param allowVector    Legal card pool and limits for this format
	 * @param cards          If provided, normalises any aliased cards in the deck
	 * @param options        If provided, overrides default Master Duel size limits
	 * @returns
	 */
	public validate(allowVector: CardVector, cards?: CardIndex, options?: Partial<DeckSizes>): DeckError[] {
		const sizes: DeckSizes = {
			main: { min: 40, max: 60 },
			extra: { min: 0, max: 15 },
			side: { min: 0, max: 15 },
			...options
		};
		const errors: DeckError[] = [
			...checkSize(this.contents, "main", sizes),
			...checkSize(this.contents, "extra", sizes),
			...checkSize(this.contents, "side", sizes)
		];
		const deckVector = deckToVector(this.contents, cards);
		for (const [password, count] of deckVector) {
			// We're actually computing the vector difference here, but we just don't particularly
			// care about the resulting difference vector per se
			const max = allowVector.get(password) || 0;
			if (count > max) {
				errors.push({
					type: "limit",
					target: password,
					name: cards?.get(password)?.name || `${password}`,
					max,
					actual: count
				});
			}
		}
		return errors;
	}
}

function checkSize(contents: TypedDeck, subdeck: keyof TypedDeck, sizes: DeckSizes): DeckError[] {
	const errors: DeckError[] = [];
	if (contents[subdeck].length < sizes[subdeck].min) {
		errors.push({
			type: "size",
			target: subdeck,
			min: sizes[subdeck].min,
			max: sizes[subdeck].max,
			actual: contents[subdeck].length
		});
	}
	if (contents[subdeck].length > sizes[subdeck].max) {
		errors.push({
			type: "size",
			target: subdeck,
			max: sizes[subdeck].max,
			actual: contents[subdeck].length
		});
	}
	return errors;
}

/**
 * @param deck   The standard deck representation to vectorise
 * @param cards  If provided, normalises aliases to the same card
 * @returns      Card vector where each component is the quantity of that card and aliases
 */
function deckToVector(deck: TypedDeck, cards?: CardIndex): CardVector {
	const vector: CardVector = new Map();
	const deckReducer = (password: number) => {
		const index = cards?.get(password)?.alias || password;
		vector.set(index, 1 + (vector.get(index) || 0));
	};
	deck.main.forEach(deckReducer);
	deck.extra.forEach(deckReducer);
	deck.side.forEach(deckReducer);
	return vector;
}
