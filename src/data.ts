import { Card, YgoData } from "ygopro-data";
import cardOpts from "./config/cardOpts.json";
import dataOpts from "./config/dataOpts.json";
import transOpts from "./config/transOpts.json";
import { octokitToken } from "./config/env";

const data = new YgoData(cardOpts, transOpts, dataOpts, "./dbs", octokitToken);
export type CardArray = { [id: number]: Card };
let cachedList: CardArray | undefined;

// since we'll always have the ID, we don't need ygo-data's help to search by name

export async function getCardList(): Promise<CardArray> {
	if (!cachedList) {
		cachedList = await data.getCardList();
	}
	return cachedList;
}
