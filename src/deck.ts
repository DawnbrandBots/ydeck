import { TypedDeck, extractURLs, toURL, parseURL } from "ydke";
import { ExtraTypeCounts, MainTypeCounts, countMain, countExtra } from "./counts";
import { generateText } from "./text";
import { typedDeckToYdk, ydkToTypedDeck } from "./ydk";
export { TypedDeck };

export class Deck {
	public url: string;
	private cachedDeck: TypedDeck | undefined;
	private cachedMainTypeCounts: MainTypeCounts | undefined;
	private cachedExtraTypeCounts: ExtraTypeCounts | undefined;
	private cachedSideTypeCounts: MainTypeCounts | undefined;
	private cachedMainText: string | undefined;
	private cachedExtraText: string | undefined;
	private cachedSideText: string | undefined;
	private cachedYdk: string | undefined;
	constructor(url: string) {
		const urls = extractURLs(url);
		if (urls.length < 1) {
			throw new Error(
				"Decks must be initialised with a YDKE URL! If you have another format, use one of the converter functions!"
			);
		}
		this.url = url;
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

	async getMainTypeCounts(): Promise<MainTypeCounts> {
		if (!this.cachedMainTypeCounts) {
			this.cachedMainTypeCounts = await countMain(this.typedDeck.main);
		}
		return this.cachedMainTypeCounts;
	}

	async getExtraTypeCounts(): Promise<ExtraTypeCounts> {
		if (!this.cachedExtraTypeCounts) {
			this.cachedExtraTypeCounts = await countExtra(this.typedDeck.extra);
		}
		return this.cachedExtraTypeCounts;
	}

	async getSideTypeCounts(): Promise<MainTypeCounts> {
		if (!this.cachedSideTypeCounts) {
			this.cachedSideTypeCounts = await countMain(this.typedDeck.side);
		}
		return this.cachedSideTypeCounts;
	}

	async getMainText(): Promise<string> {
		if (!this.cachedMainText) {
			this.cachedMainText = await generateText(this.typedDeck.main);
		}
		return this.cachedMainText;
	}

	async getExtraText(): Promise<string> {
		if (!this.cachedExtraText) {
			this.cachedExtraText = await generateText(this.typedDeck.extra);
		}
		return this.cachedExtraText;
	}

	async getSideText(): Promise<string> {
		if (!this.cachedSideText) {
			this.cachedSideText = await generateText(this.typedDeck.side);
		}
		return this.cachedSideText;
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
