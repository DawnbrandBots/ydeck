import { TypedDeck, extractURLs, toURL, parseURL } from "ydke";
import { CardType } from "ygopro-data/dist/module/enums";
import { getCardList } from "./data";
export { TypedDeck };

interface MainTypeCounts {
	monster: number;
	spell: number;
	trap: number;
}

interface ExtraTypeCounts {
	fusion: number;
	synchro: number;
	xyz: number;
	link: number;
}

export class Deck {
	private url: string;
	private cachedDeck: TypedDeck | undefined;
	private cachedMainTypeCounts: MainTypeCounts | undefined;
	private cachedExtraTypeCounts: ExtraTypeCounts | undefined;
	private cachedSideTypeCounts: MainTypeCounts | undefined;
	constructor(url: string) {
		const urls = extractURLs(url);
		if (urls.length < 1) {
			throw new Error(
				"Decks must be initialised with a YDKE URL! If you have another format, use one of the converter functions!"
			);
		}
		this.url = url;
	}

	public static TypedDeckToUrl(deck: TypedDeck): string {
		return toURL(deck);
	}

	public static YdkToUrl(ydk: string): string {
		const deck = ydk.split(/\r|\n|\r\n/);
		const mainIndex = deck.indexOf("#main");
		if (mainIndex < 0) {
			throw new Error("YDK input does not conform to expected format!");
		}
		const extraIndex = deck.indexOf("#extra");
		if (extraIndex < 0) {
			throw new Error("YDK input does not conform to expected format!");
		}
		const sideIndex = deck.indexOf("!side");
		if (sideIndex < 0) {
			throw new Error("YDK input does not conform to expected format!");
		}

		const mainString = deck.slice(mainIndex + 1, extraIndex - 1);
		const mainNumber = mainString.map(s => parseInt(s, 10));
		const main = Uint32Array.from(mainNumber);

		const extraString = deck.slice(extraIndex + 1, sideIndex - 1);
		const extraNumber = extraString.map(s => parseInt(s, 10));
		const extra = Uint32Array.from(extraNumber);

		const sideString = deck.slice(sideIndex + 1);
		const sideNumber = sideString.map(s => parseInt(s, 10));
		const side = Uint32Array.from(sideNumber);

		const typedDeck = { main, extra, side };
		return Deck.TypedDeckToUrl(typedDeck);
	}

	private get typedDeck(): TypedDeck {
		if (!this.cachedDeck) {
			this.cachedDeck = parseURL(this.url);
		}
		return this.cachedDeck;
	}

	async getMainTypeCounts(): Promise<MainTypeCounts> {
		if (!this.cachedMainTypeCounts) {
			const list = await getCardList();
			const mainDeck = [...this.typedDeck.main].map(code => list[code]);
			const monster = mainDeck.filter(card => card.data.isType(CardType.TYPE_MONSTER)).length;
			const spell = mainDeck.filter(card => card.data.isType(CardType.TYPE_SPELL)).length;
			const trap = mainDeck.filter(card => card.data.isType(CardType.TYPE_TRAP)).length;
			this.cachedMainTypeCounts = { monster, spell, trap };
		}
		return this.cachedMainTypeCounts;
	}

	async getExtraTypeCounts(): Promise<ExtraTypeCounts> {
		if (!this.cachedExtraTypeCounts) {
			const list = await getCardList();
			const extraDeck = [...this.typedDeck.extra].map(code => list[code]);
			const fusion = extraDeck.filter(card => card.data.isType(CardType.TYPE_FUSION)).length;
			const synchro = extraDeck.filter(card => card.data.isType(CardType.TYPE_SYNCHRO)).length;
			const xyz = extraDeck.filter(card => card.data.isType(CardType.TYPE_XYZ)).length;
			const link = extraDeck.filter(card => card.data.isType(CardType.TYPE_LINK)).length;
			this.cachedExtraTypeCounts = { fusion, synchro, xyz, link };
		}
		return this.cachedExtraTypeCounts;
	}

	async getSideTypeCounts(): Promise<MainTypeCounts> {
		if (!this.cachedSideTypeCounts) {
			const list = await getCardList();
			const sideDeck = [...this.typedDeck.side].map(code => list[code]);
			const monster = sideDeck.filter(card => card.data.isType(CardType.TYPE_MONSTER)).length;
			const spell = sideDeck.filter(card => card.data.isType(CardType.TYPE_SPELL)).length;
			const trap = sideDeck.filter(card => card.data.isType(CardType.TYPE_TRAP)).length;
			this.cachedSideTypeCounts = { monster, spell, trap };
		}
		return this.cachedSideTypeCounts;
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
}
