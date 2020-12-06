import { TypedDeck } from "ydke";

export function ydkToTypedDeck(ydk: string): TypedDeck {
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

	const mainString = deck.slice(mainIndex + 1, extraIndex);
	const mainNumber = mainString.map(s => parseInt(s, 10));
	const main = Uint32Array.from(mainNumber);

	const extraString = deck.slice(extraIndex + 1, sideIndex);
	const extraNumber = extraString.map(s => parseInt(s, 10));
	const extra = Uint32Array.from(extraNumber);

	const sideString = deck.slice(sideIndex + 1, deck.length - 1); // trim off trailing newline
	const sideNumber = sideString.map(s => parseInt(s, 10));
	const side = Uint32Array.from(sideNumber);

	return { main, extra, side };
}

export function typedDeckToYdk(deck: TypedDeck): string {
	let out = "#created by the YGO Deck Manager\n#main\n";
	out += [...deck.main].map(code => code.toString()).join("\n");
	// should only add the newline if there is a main deck
	if (!out.endsWith("\n")) {
		out += "\n";
	}
	out += "#extra\n";
	out += [...deck.extra].map(code => code.toString()).join("\n");
	// should only add the newline if there is an extra deck
	if (!out.endsWith("\n")) {
		out += "\n";
	}
	out += "!side\n";
	out += [...deck.side].map(code => code.toString()).join("\n");
	// should only add the newline if there is a side deck
	if (!out.endsWith("\n")) {
		out += "\n";
	}
	return out;
}