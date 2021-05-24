import { TypedDeck } from "ydke";

export class YDKParseError extends Error {
	constructor(readonly message: string) {
		super(`Error in YDK format: ${message}.`);
	}
}

function ydkIndexOf(deck: string[], heading: string): number {
	const index = deck.indexOf(heading);
	if (index < 0) {
		throw new YDKParseError(`missing section ${heading}`);
	}
	return index;
}

function parseYdkSection(deck: string[], begin: number, end: number): Uint32Array {
	const numbers: number[] = [];
	// begin is the line with the heading, so we start at the next one
	for (let i = begin + 1, line = deck[i]; i < end; line = deck[++i]) {
		if (!line) {
			continue; // Skip blank lines
		}
		const decimalInteger = parseInt(line, 10);
		if (isNaN(decimalInteger)) {
			throw new YDKParseError(`unexpected value on line ${i + 1}; ${line}`);
		}
		numbers.push(decimalInteger);
	}
	return Uint32Array.from(numbers);
}

export function ydkToTypedDeck(ydk: string): TypedDeck {
	const deck = ydk.split("\n").map(s => s.trim());
	const mainIndex = ydkIndexOf(deck, "#main");
	const extraIndex = ydkIndexOf(deck, "#extra");
	const sideIndex = ydkIndexOf(deck, "!side");
	if (!(mainIndex < extraIndex && extraIndex < sideIndex)) {
		throw new YDKParseError("invalid section ordering; expected #main, #extra, !side");
	}
	return {
		main: parseYdkSection(deck, mainIndex, extraIndex),
		extra: parseYdkSection(deck, extraIndex, sideIndex),
		side: parseYdkSection(deck, sideIndex, deck.length)
	};
}

export function typedDeckToYdk(deck: TypedDeck): string {
	let out = "#created by YDeck\n#main\n";
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
