import { extractURLs, parseURL, toURL, TypedDeck } from "ydke";
import { Card } from "./Card";
import { CardVector, deckToVector } from "./check";
import { classify } from "./classify";
import { countExtra, countMain, ExtraTypeCounts, MainTypeCounts } from "./counts";
import { LimiterConstructionError, UrlConstructionError, YdkConstructionError } from "./errors";
import { generateText } from "./text";
import { DeckError, validateDeckVectored } from "./validation";
import { typedDeckToYdk, ydkToTypedDeck } from "./ydk";
import { cardLimiters } from "./ygodata";

export { Card, DeckError, LimiterConstructionError, UrlConstructionError, YdkConstructionError };
export type CardArray = { [id: number]: Card | undefined };

export class Deck {
	public url: string;
	private data: CardArray;
	private limiter: string;
	private cachedDeck: TypedDeck | undefined;
	private cachedVector: CardVector | undefined;
	private cachedMainTypeCounts: MainTypeCounts | undefined;
	private cachedExtraTypeCounts: ExtraTypeCounts | undefined;
	private cachedSideTypeCounts: MainTypeCounts | undefined;
	private cachedMainText: string | undefined;
	private cachedExtraText: string | undefined;
	private cachedSideText: string | undefined;
	private cachedYdk: string | undefined;
	private cachedErrors: DeckError[] | undefined;
	private cachedThemes: string[] | undefined;
	constructor(url: string, data: CardArray, limiter?: string) {
		const urls = extractURLs(url);
		if (urls.length < 1) {
			throw new UrlConstructionError();
		}
		this.url = url;
		this.data = data;
		if (limiter && !(limiter in cardLimiters)) {
			throw new LimiterConstructionError();
		}
		this.limiter = limiter || "TCG";
	}

	public static typedDeckToUrl(deck: TypedDeck): string {
		return toURL(deck);
	}

	public static ydkToUrl(ydk: string): string {
		return Deck.typedDeckToUrl(ydkToTypedDeck(ydk));
	}

	private get typedDeck(): TypedDeck {
		if (!this.cachedDeck) {
			this.cachedDeck = parseURL(this.url);
		}
		return this.cachedDeck;
	}

	private get vector(): CardVector {
		if (!this.cachedVector) {
			this.cachedVector = deckToVector(this.typedDeck);
		}
		return this.cachedVector;
	}

	get mainTypeCounts(): MainTypeCounts {
		if (!this.cachedMainTypeCounts) {
			this.cachedMainTypeCounts = countMain(this.typedDeck.main, this.data);
		}
		return this.cachedMainTypeCounts;
	}

	get extraTypeCounts(): ExtraTypeCounts {
		if (!this.cachedExtraTypeCounts) {
			this.cachedExtraTypeCounts = countExtra(this.typedDeck.extra, this.data);
		}
		return this.cachedExtraTypeCounts;
	}

	get sideTypeCounts(): MainTypeCounts {
		if (!this.cachedSideTypeCounts) {
			this.cachedSideTypeCounts = countMain(this.typedDeck.side, this.data);
		}
		return this.cachedSideTypeCounts;
	}

	get mainText(): string {
		if (!this.cachedMainText) {
			this.cachedMainText = generateText(this.typedDeck.main, this.data);
		}
		return this.cachedMainText;
	}

	get extraText(): string {
		if (!this.cachedExtraText) {
			this.cachedExtraText = generateText(this.typedDeck.extra, this.data);
		}
		return this.cachedExtraText;
	}

	get sideText(): string {
		if (!this.cachedSideText) {
			this.cachedSideText = generateText(this.typedDeck.side, this.data);
		}
		return this.cachedSideText;
	}

	get validationErrors(): DeckError[] {
		if (!this.cachedErrors) {
			this.cachedErrors = validateDeckVectored(this.typedDeck, this.vector, this.limiter, this.data);
		}
		return this.cachedErrors;
	}

	get themes(): string[] {
		if (!this.cachedThemes) {
			this.cachedThemes = classify(this.typedDeck, this.vector, this.data);
		}
		return this.cachedThemes;
	}

	get mainSize(): number {
		return this.typedDeck.main.length;
	}

	get extraSize(): number {
		return this.typedDeck.extra.length;
	}

	get sideSize(): number {
		return this.typedDeck.side.length;
	}

	get ydk(): string {
		if (!this.cachedYdk) {
			this.cachedYdk = typedDeckToYdk(this.typedDeck);
		}
		return this.cachedYdk;
	}
}
