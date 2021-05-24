import { CardIndex } from "./vector";

export interface MainTypeCounts {
	monster: number;
	spell: number;
	trap: number;
}

export interface ExtraTypeCounts {
	fusion: number;
	synchro: number;
	xyz: number;
	link: number;
}

function typeReducer(typeBit: number, index: CardIndex) {
	// If the card has the type bit set, increment the total
	return (total: number, password: number) => (typeBit & (index.get(password)?.type || 0) ? total + 1 : total);
}

export function countMain(deck: Uint32Array, index: CardIndex): MainTypeCounts {
	return {
		monster: deck.reduce(typeReducer(1, index)),
		spell: deck.reduce(typeReducer(2, index)),
		trap: deck.reduce(typeReducer(4, index))
	};
}

export function countExtra(deck: Uint32Array, index: CardIndex): ExtraTypeCounts {
	return {
		fusion: deck.reduce(typeReducer(64, index)),
		synchro: deck.reduce(typeReducer(8192, index)),
		xyz: deck.reduce(typeReducer(8388608, index)),
		link: deck.reduce(typeReducer(67108864, index))
	};
}
