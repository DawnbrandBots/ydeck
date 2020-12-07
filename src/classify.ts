import { TypedDeck } from "ydke";
import { CardVector, checkDeck } from "./check";
import { CardArray } from "./deck";

type Classifier = (deck: TypedDeck, vector: CardVector, data: CardArray) => boolean;

function setCodeClassifier(setCode: number, mainThreshold: number, extraThreshold?: number): Classifier {
	return function (deck, _, data): boolean {
		// if no extraThreshold, assume mainThreshold applies to whole deck. Set extraThreshold to 0 to suppress this behaviour
		// we ignore the side deck, fairly safe assumption that it's usually staples
		// or a smokescreen strategy that isn't part of what the deck is pre-side
		let main: number[];
		if (extraThreshold === undefined) {
			main = [...deck.main, ...deck.extra];
		} else {
			main = [...deck.main];
		}
		const mainCards = main.map(c => data[c]);
		let out = mainCards.filter(c => c.data.isSetCode(setCode)).length >= mainThreshold;
		if (extraThreshold !== undefined) {
			const extraCards = [...deck.extra].map(c => data[c]);
			out = out && extraCards.filter(c => c.data.isSetCode(setCode)).length >= extraThreshold;
		}
		return out;
	};
}

function cardCodeClassifier(requirements: CardVector): Classifier {
	// possibly allow ORs? e.g mystic mine is mine AND (dd guide OR wobby OR cannon OR countdown)
	return function (_, deckVector): boolean {
		const [out] = checkDeck(requirements, deckVector);
		return out; // checks that left subset right
	};
}

export function classify(deck: TypedDeck, vector: CardVector, data: CardArray): string[] {
	const themes: string[] = [];
	for (const theme of Object.keys(classifiers)) {
		if (classifiers[theme](deck, vector, data)) {
			themes.push(theme);
		}
	}
	return themes;
}

const blackwing = setCodeClassifier(0x33, 10, 3);
const mekkKnight = setCodeClassifier(0x10c, 5);
const mysticMineReqs = {
	76375976: 3, // Mystic Mine
	7153114: 1 // Field Barrier
};

const mysticMine = cardCodeClassifier(mysticMineReqs);

const classifiers: { [theme: string]: Classifier } = {
	Blackwing: blackwing,
	"Mekk-Knight": mekkKnight,
	"Mystic Mine": mysticMine
};
