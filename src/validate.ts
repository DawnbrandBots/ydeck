import { TypedDeck } from "ydke";
import { CardIndex, CardVector } from "./vector";

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

function checkSize(contents: TypedDeck, subdeck: keyof TypedDeck, sizes: DeckSizes): SizeError[] {
	const errors: SizeError[] = [];
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

export function checkSizes(deck: TypedDeck, options?: Partial<DeckSizes>): SizeError[] {
	const sizes: DeckSizes = {
		main: { min: 40, max: 60 },
		extra: { min: 0, max: 15 },
		side: { min: 0, max: 15 },
		...options
	};
	return [...checkSize(deck, "main", sizes), ...checkSize(deck, "extra", sizes), ...checkSize(deck, "side", sizes)];
}

export function checkLimits(deckVector: CardVector, allowVector: CardVector, index: CardIndex): LimitError[] {
	const errors: LimitError[] = [];
	for (const [password, count] of deckVector) {
		// We're actually computing the vector difference here, but we just don't particularly
		// care about the resulting difference vector per se
		const max = allowVector.get(password) || 0;
		if (count > max) {
			errors.push({
				type: "limit",
				target: password,
				name: index.get(password)?.name || `${password}`,
				max,
				actual: count
			});
		}
	}
	return errors;
}
