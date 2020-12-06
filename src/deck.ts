import { extractURLs } from "ydke";

export class Deck {
	private url: string;
	constructor(url: string) {
		const urls = extractURLs(url);
		if (urls.length < 1) {
			throw new Error(
				"Decks must be initialised with a YDKE URL!" // If you have another format, use one of the converter functions!"
			);
		}
		this.url = url;
	}
}
