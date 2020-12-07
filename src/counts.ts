import { enums } from "ygopro-data";
import { CardArray } from "./deck";

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

export function countMain(deck: Uint32Array, data: CardArray): MainTypeCounts {
	const mainDeck = [...deck].map(code => data[code]);
	const monster = mainDeck.filter(card => card.isType(enums.type.TYPE_MONSTER)).length;
	const spell = mainDeck.filter(card => card.isType(enums.type.TYPE_SPELL)).length;
	const trap = mainDeck.filter(card => card.isType(enums.type.TYPE_TRAP)).length;
	return { monster, spell, trap };
}

export function countExtra(deck: Uint32Array, data: CardArray): ExtraTypeCounts {
	const extraDeck = [...deck].map(code => data[code]);
	const fusion = extraDeck.filter(card => card.isType(enums.type.TYPE_FUSION)).length;
	const synchro = extraDeck.filter(card => card.isType(enums.type.TYPE_SYNCHRO)).length;
	const xyz = extraDeck.filter(card => card.isType(enums.type.TYPE_XYZ)).length;
	const link = extraDeck.filter(card => card.isType(enums.type.TYPE_LINK)).length;
	return { fusion, synchro, xyz, link };
}

export function countNumbers(list: number[]): { [element: number]: number } {
	return list.reduce<{ [element: number]: number }>((acc, curr) => {
		acc[curr] = (acc[curr] || 0) + 1;
		return acc;
	}, {});
}

export function countStrings(list: string[]): { [element: string]: number } {
	return list.reduce<{ [element: string]: number }>((acc, curr) => {
		acc[curr] = (acc[curr] || 0) + 1;
		return acc;
	}, {});
}
