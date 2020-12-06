import { TypedDeck, extractURLs, toURL } from "ydke";
export { TypedDeck };

export class Deck {
	private url: string;
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
}
