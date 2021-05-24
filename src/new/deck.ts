import { extractURLs, parseURL, toURL, TypedDeck } from "ydke";
import { classify } from "./classify";
import { checkLimits, checkSizes, DeckError, DeckSizes } from "./validate";
import { CardIndex, CardVector, deckToVector } from "./vector";
import { typedDeckToYdk, ydkToTypedDeck } from "./ydk";

export type YDKE = { url: string };
export type YDK = { ydk: string };

export class Deck {
	public readonly url: string;
	public readonly contents: TypedDeck;

	constructor(private readonly index: CardIndex, args: YDKE | YDK) {
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

	private cachedYdk?: string;
	get ydk(): string {
		return (this.cachedYdk ||= typedDeckToYdk(this.contents));
	}

	private cachedThemes?: string[];
	get themes(): string[] {
		return (this.cachedThemes ||= classify(this.contents, this.vector, this.index));
	}

	private cachedVector?: CardVector;
	private get vector(): CardVector {
		return (this.cachedVector ||= deckToVector(this.contents, this.index));
	}

	/**
	 * Is this a legal list?
	 *
	 * @param allowVector    Legal card pool and limits for this format
	 * @param cards          If provided, normalises any aliased cards in the deck
	 * @param options        If provided, overrides default Master Duel size limits
	 * @returns
	 */
	public validate(allowVector: CardVector, options?: Partial<DeckSizes>): DeckError[] {
		return [...checkSizes(this.contents, options), ...checkLimits(this.vector, allowVector)];
	}
}
