import { TypedDeck, extractURLs, toURL, parseURL } from "ydke";
import { Card } from "ygopro-data";
import { classify } from "./classify";
import { ExtraTypeCounts, MainTypeCounts, countMain, countExtra } from "./counts";
import { UrlConstructionError } from "./errors";
import { generateText } from "./text";
import { validateDeck, validateDeckVectored } from "./validation";
import { typedDeckToYdk, ydkToTypedDeck } from "./ydk";

export type CardArray = { [id: number]: Card };

export class Deck {
	public url: string;
	private data: CardArray;
	private cachedDeck: TypedDeck | undefined;
	private cachedMainTypeCounts: MainTypeCounts | undefined;
	private cachedExtraTypeCounts: ExtraTypeCounts | undefined;
	private cachedSideTypeCounts: MainTypeCounts | undefined;
	private cachedMainText: string | undefined;
	private cachedExtraText: string | undefined;
	private cachedSideText: string | undefined;
	private cachedYdk: string | undefined;
	private cachedErrors: string[] | undefined;
	private cachedThemes: string[] | undefined;
	constructor(url: string, data: CardArray) {
		const urls = extractURLs(url);
		if (urls.length < 1) {
			throw new UrlConstructionError();
		}
		this.url = url;
		this.data = data;
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

	async validate(): Promise<string[]> {
		if (!this.cachedErrors) {
			this.cachedErrors = await validateDeckVectored(this.typedDeck, this.data);
		}
		return this.cachedErrors;
	}

	get themes(): string[] {
		if (!this.cachedThemes) {
			this.cachedThemes = classify(this.typedDeck, this.data);
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
