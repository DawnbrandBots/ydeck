import { TypedDeck } from "ydke";
import { CardArray } from ".";
import { CardVector, checkDeck } from "./check";

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
		let out = mainCards.filter(c => c?.isSetcode(setCode)).length >= mainThreshold;
		if (extraThreshold !== undefined) {
			const extraCards = [...deck.extra].map(c => data[c]);
			out = out && extraCards.filter(c => c?.isSetcode(setCode)).length >= extraThreshold;
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

const mekkKnight = setCodeClassifier(0x10c, 5);

const mysticMine = cardCodeClassifier({
	76375976: 3, // Mystic Mine
	7153114: 1 // Field Barrier
});

const virtualWorld = setCodeClassifier(0x150, 5);

const drytron = setCodeClassifier(0x151, 5);

const infernoble = (deck: TypedDeck, vec: CardVector, data: CardArray) => {
	// noble knight + charles
	return setCodeClassifier(0x107a, 5)(deck, vec, data) && cardCodeClassifier({ 77656797: 1 })(deck, vec, data);
};

const dlink = cardCodeClassifier({
	11969228: 1, // Romulus
	15381421: 2 // Seyfert
});

const dino = cardCodeClassifier({
	44335251: 3, // Ovi
	18940556: 1 // UCT
});

const eldlich = (deck: TypedDeck, vec: CardVector, data: CardArray) => {
	// eldlich + eldlixir + golden land
	return (
		setCodeClassifier(0x142, 1)(deck, vec, data) &&
		setCodeClassifier(0x143, 1)(deck, vec, data) &&
		setCodeClassifier(0x1434, 1)(deck, vec, data)
	);
};

const zoodiac = setCodeClassifier(0xf1, 5);

const invoked = (deck: TypedDeck, vec: CardVector, data: CardArray) => {
	// invoked + aleister + invoc
	return (
		setCodeClassifier(0xf4, 1)(deck, vec, data) &&
		cardCodeClassifier({
			86120751: 1,
			74063034: 1
		})(deck, vec, data)
	);
};

const dogma = setCodeClassifier(0x146, 5);

const pk = cardCodeClassifier({ 25538345: 3 }); // Torn Scales

const pranks = setCodeClassifier(0x120, 5);

const blader = cardCodeClassifier({
	11790356: 1, // Buster Dragon
	86240887: 1, // The fusion
	32104431: 1, // Fusion trap
	33280639: 1 // Synchro trap
});

const striker = setCodeClassifier(0x115, 5);

const geist = setCodeClassifier(0x103, 5);

const classifiers: { [theme: string]: Classifier } = {
	"Mekk-Knight": mekkKnight,
	"Mystic Mine": mysticMine,
	"Virtual World": virtualWorld,
	Drytron: drytron,
	"Infernoble Knight": infernoble,
	"Dragon Link": dlink,
	Dinosaur: dino,
	Eldlich: eldlich,
	Zoodiac: zoodiac,
	Invoked: invoked,
	Dogmatika: dogma,
	"Phantom Knight": pk,
	"Prank-Kids": pranks,
	"Buster Blader": blader,
	"Sky Striker": striker,
	Altergeist: geist
};
