import { TypedDeck } from "ydke";
import { CardIndex, CardVector, ICard } from "./vector";

type Classifier = (deck: TypedDeck, vector: CardVector, data: CardIndex) => boolean;

/**
 * Helper for setCodeClassifer. Copied from ygo-data's CardData.isSetcode.
 * Note: despite outward appearances, because JavaScript numbers are 64-bit floats,
 * JavaScript bitwise operations only work on 32-bit integers, and the setcode bit
 * array is a 64-bit integer, only the first two setcodes are actually checked.
 * @param card
 * @param code The specific 16-bit setcode to check for in the card's setcode bit array
 * @returns
 */
function hasSetcode(card: ICard | undefined, code: number): boolean {
	let set = card?.setcode || 0;
	while (set > 0) {
		// 4th digit is for extensions
		if (code === (set & 0xffff) || code === (set & 0xfff)) {
			return true;
		}
		set >>= 16;
	}
	return false;
}

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
		const mainCards = main.map(c => data.get(c));
		let out = mainCards.filter(c => hasSetcode(c, setCode)).length >= mainThreshold;
		if (extraThreshold !== undefined) {
			const extraCards = [...deck.extra].map(c => data.get(c));
			out = out && extraCards.filter(c => c && hasSetcode(c, setCode)).length >= extraThreshold;
		}
		return out;
	};
}

function cardCodeClassifier(requirements: Record<number, number>): Classifier {
	// possibly allow ORs? e.g mystic mine is mine AND (dd guide OR wobby OR cannon OR countdown)
	return function (_, deckVector): boolean {
		// We're actually computing the vector difference here, but we only care about
		// whether the requirements multiset is a subset of the deck multiset
		for (const password in requirements) {
			if (requirements[password] > (deckVector.get(Number(password)) || 0)) {
				return false;
			}
		}
		return true;
	};
}

const mekkKnight = setCodeClassifier(0x10c, 5);

const mysticMine = cardCodeClassifier({
	76375976: 3, // Mystic Mine
	7153114: 1 // Field Barrier
});

const virtualWorld = setCodeClassifier(0x150, 5);

const drytron = cardCodeClassifier({
	22398665: 1 // Meteonis Drytron
});

const infernoble = (deck: TypedDeck, vec: CardVector, data: CardIndex) => {
	// noble knight + charles
	return setCodeClassifier(0x107a, 5)(deck, vec, data) && cardCodeClassifier({ 77656797: 1 })(deck, vec, data);
};

const dlink = cardCodeClassifier({
	5969957: 1 // Rokket Recharger
});

const dino = cardCodeClassifier({
	18940556: 1 // UCT
});

const eldlich = (deck: TypedDeck, vec: CardVector, data: CardIndex) => {
	// eldlich + eldlixir + golden land
	return (
		setCodeClassifier(0x142, 1)(deck, vec, data) &&
		setCodeClassifier(0x143, 1)(deck, vec, data) &&
		setCodeClassifier(0x144, 1)(deck, vec, data)
	);
};

const zoodiac = setCodeClassifier(0xf1, 5);

const invoked = (deck: TypedDeck, vec: CardVector, data: CardIndex) => {
	// invoked + aleister + invoc
	return (
		setCodeClassifier(0xf4, 1)(deck, vec, data) &&
		cardCodeClassifier({
			86120751: 1,
			74063034: 1
		})(deck, vec, data)
	);
};

const dogma = (deck: TypedDeck, vec: CardVector, data: CardIndex) => {
	// dogma + nadir servant
	return setCodeClassifier(0x146, 2)(deck, vec, data) && cardCodeClassifier({ 1984618: 1 })(deck, vec, data);
};

const pk = cardCodeClassifier({
	26692769: 1 // The Phantom Knights of Rusty Bardiche
});

const pranks = setCodeClassifier(0x120, 5);

const blader = cardCodeClassifier({
	11790356: 1, // Buster Dragon
	86240887: 1, // The fusion
	32104431: 1, // Fusion trap
	33280639: 1 // Synchro trap
});

const striker = cardCodeClassifier({
	63166095: 1 // Sky Striker Mobilize - Engage!
});

const geist = setCodeClassifier(0x103, 5);

const dolls = setCodeClassifier(0x9d, 5);

const tribe = setCodeClassifier(0x14f, 5);

const lyrilusc = setCodeClassifier(0xf7, 5);

const maju = cardCodeClassifier({
	36584821: 1 // Gren Maju
});

const ba = setCodeClassifier(0xb1, 5);

const salad = setCodeClassifier(0x119, 5);

const guru = setCodeClassifier(0xed, 5);

const adam = setCodeClassifier(0x140, 5);

const dolche = setCodeClassifier(0x71, 5);

const numer = setCodeClassifier(0x14b, 5);

const amazement = cardCodeClassifier({
	94821366: 1 // Amazement Administrator Arlekino
});

const plant = cardCodeClassifier({
	21200905: 1 // Aromaseraphy Jasmine
});

const paleo = setCodeClassifier(0xd4, 5);

const fluffal = cardCodeClassifier({
	70245411: 1 // Toy Vendor
});

const plunder = cardCodeClassifier({
	31374201: 1 // Whitebeard, the Plunder Patroll Helm
});

const orcust = cardCodeClassifier({
	30741503: 1 // Galatea, the Orcust Automaton
});

const swordsoul = cardCodeClassifier({
	14821890: 1 // Swordsoul Blackout
});

const flunder = cardCodeClassifier({
	18940725: 1 // Floowandereeze & Robina
});

const twins = cardCodeClassifier({
	36609518: 1, // Evil★Twin Lil-la
	9205573: 1 // Evil★Twin Ki-sikil
});

const peng = cardCodeClassifier({
	14761450: 1 // Penguin Squire
});

const branded = cardCodeClassifier({
	44362883: 1 // Branded Fusion
});

const despia = cardCodeClassifier({
	62962630: 1 // Aluber the Jester of Despia
});

const therion = cardCodeClassifier({
	10604644: 1 // Therion "King" Regulus
});

const sunavalon = cardCodeClassifier({
	27520594: 1 // Sunseed Genius Loci
});

const brave = cardCodeClassifier({
	3285551: 1 // Rite of Aramesir
});

const punk = cardCodeClassifier({
	55920742: 1 // Noh-P.U.N.K. Foxy Tune
});

const predap = cardCodeClassifier({
	44932065: 1 // Predaplant Byblisp
});

const spright = cardCodeClassifier({
	76145933: 1 // Spright Blue
});

const tearlaments = cardCodeClassifier({
	37961969: 1 // Tearlaments Havnis
});

const ghoti = cardCodeClassifier({
	46037983: 1 // Paces, Light of the Ghoti
});

const vernusylph = cardCodeClassifier({
	62133026: 1 // Vernusylph of the Flowering Fields
});

const exosister = cardCodeClassifier({
	37343995: 1 // Exosister Martha
});

const mathmech = cardCodeClassifier({
	36521307: 1 // Mathmech
});

const labrynth = cardCodeClassifier({
	5380979: 1 // Welcome Labrynth
});

const runick = cardCodeClassifier({
	55990317: 1 // Hugin the Runick Wings
});

const vaylantz = setCodeClassifier(0x17e, 5);

const classifiers: Record<string, Classifier> = {
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
	Altergeist: geist,
	Shaddoll: dolls,
	"Tri-Brigade": tribe,
	Lyrilusc: lyrilusc,
	"Gren Maju": maju,
	"Burning Abyss": ba,
	Salamangreat: salad,
	Subterror: guru,
	Adamancipator: adam,
	Madolche: dolche,
	Numeron: numer,
	Amazement: amazement,
	Plant: plant,
	Paleozoic: paleo,
	Fluffal: fluffal,
	"Plunder Patroll": plunder,
	Orcust: orcust,
	Swordsoul: swordsoul,
	Floowandereeze: flunder,
	"Evil★Twin": twins,
	Penguin: peng,
	Branded: branded,
	Despia: despia,
	Therion: therion,
	Sunavalon: sunavalon,
	Adventurer: brave,
	"P.U.N.K.": punk,
	Predaplant: predap,
	Spright: spright,
	Tearlaments: tearlaments,
	Ghoti: ghoti,
	Vernusylph: vernusylph,
	Exosister: exosister,
	Mathmech: mathmech,
	Labrynth: labrynth,
	Runick: runick,
	Vaylantz: vaylantz
};

export function classify(deck: TypedDeck, vector: CardVector, data: CardIndex): string[] {
	return Object.entries(classifiers)
		.filter(([, match]) => match(deck, vector, data))
		.map(([theme]) => theme);
}
