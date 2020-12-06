import { enums } from "ygopro-data";
import { getCardList } from "./data";

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

export async function countMain(deck: Uint32Array): Promise<MainTypeCounts> {
	const list = await getCardList();
	const mainDeck = [...deck].map(code => list[code]);
	const monster = mainDeck.filter(card => card.data.isType(enums.type.TYPE_MONSTER)).length;
	const spell = mainDeck.filter(card => card.data.isType(enums.type.TYPE_SPELL)).length;
	const trap = mainDeck.filter(card => card.data.isType(enums.type.TYPE_TRAP)).length;
	return { monster, spell, trap };
}

export async function countExtra(deck: Uint32Array): Promise<ExtraTypeCounts> {
	const list = await getCardList();
	const extraDeck = [...deck].map(code => list[code]);
	const fusion = extraDeck.filter(card => card.data.isType(enums.type.TYPE_FUSION)).length;
	const synchro = extraDeck.filter(card => card.data.isType(enums.type.TYPE_SYNCHRO)).length;
	const xyz = extraDeck.filter(card => card.data.isType(enums.type.TYPE_XYZ)).length;
	const link = extraDeck.filter(card => card.data.isType(enums.type.TYPE_LINK)).length;
	return { fusion, synchro, xyz, link };
}
