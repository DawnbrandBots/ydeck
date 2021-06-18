import { extractURLs, parseURL, toURL, TypedDeck } from "ydke";
import { classify } from "./classify";
import { countExtra, countMain, ExtraTypeCounts, MainTypeCounts } from "./count";
import { generateText } from "./text";
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
				throw new Error("Could not parse exactly one YDKE URL!");
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

	private cachedMainTypeCounts?: MainTypeCounts;
	get mainTypeCounts(): MainTypeCounts {
		return (this.cachedMainTypeCounts ||= countMain(this.contents.main, this.index));
	}

	private cachedExtraTypeCounts?: ExtraTypeCounts;
	get extraTypeCounts(): ExtraTypeCounts {
		return (this.cachedExtraTypeCounts ||= countExtra(this.contents.extra, this.index));
	}

	private cachedSideTypeCounts?: MainTypeCounts;
	get sideTypeCounts(): MainTypeCounts {
		return (this.cachedSideTypeCounts ||= countMain(this.contents.side, this.index));
	}

	private cachedMainText?: string;
	get mainText(): string {
		return (this.cachedMainText ||= generateText(this.contents.main, this.index));
	}

	private cachedExtraText?: string;
	get extraText(): string {
		return (this.cachedExtraText ||= generateText(this.contents.extra, this.index));
	}

	private cachedSideText?: string;
	get sideText(): string {
		return (this.cachedSideText ||= generateText(this.contents.side, this.index));
	}

	private cachedThemes?: string[];
	get themes(): string[] {
		return (this.cachedThemes ||= classify(this.contents, deckToVector(this.contents, this.index), this.index));
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
		const deckVector = deckToVector(this.contents, this.index);
		return [...checkSizes(this.contents, options), ...checkLimits(deckVector, allowVector, this.index)];
	}
}
