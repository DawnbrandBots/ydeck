import { expect } from "chai";
import { describe } from "mocha";
import { CardArray, Deck } from "../deck";
import { YgoData } from "ygopro-data";
import cardOpts from "./config/cardOpts.json";
import dataOpts from "./config/dataOpts.json";
import transOpts from "./config/transOpts.json";
import { octokitToken } from "./config/env";

const url =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";

const ydk =
	"#created by the YGO Deck Manager\n#main\n99249638\n99249638\n46659709\n46659709\n46659709\n65367484\n65367484\n65367484\n43147039\n30012506\n30012506\n30012506\n77411244\n77411244\n77411244\n3405259\n3405259\n3405259\n89132148\n39890958\n14558127\n14558127\n14558127\n32807846\n73628505\n12524259\n12524259\n12524259\n24224830\n80352158\n80352158\n80352158\n66399653\n66399653\n66399653\n10045474\n10045474\n10045474\n55784832\n55784832\n#extra\n1561110\n10443957\n10443957\n58069384\n58069384\n73289035\n581014\n21887175\n4280258\n38342335\n2857636\n75452921\n50588353\n83152482\n65741786\n!side\n43147039\n";

const urlMainOnly =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBPqRxAZ4TygSeE8oEnhPKBKUt9QOlLfUDpS31AyJImQAiSJkAIkiZAA==!!!";

const ydkMainOnly =
	"#created by the YGO Deck Manager\n#main\n99249638\n99249638\n46659709\n46659709\n46659709\n65367484\n65367484\n65367484\n43147039\n30012506\n30012506\n30012506\n77411244\n77411244\n77411244\n3405259\n3405259\n3405259\n89132148\n39890958\n14558127\n14558127\n14558127\n32807846\n73628505\n12524259\n12524259\n12524259\n24224830\n24224830\n24224830\n80352158\n80352158\n80352158\n66399653\n66399653\n66399653\n10045474\n10045474\n10045474\n#extra\n!side\n";

const urlNoMain = "ydke://!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";

const ydkNoMain =
	"#created by the YGO Deck Manager\n#main\n#extra\n1561110\n10443957\n10443957\n58069384\n58069384\n73289035\n581014\n21887175\n4280258\n38342335\n2857636\n75452921\n50588353\n83152482\n65741786\n!side\n43147039\n";

const ydkMalformedExtra =
	"#created by AlphaKretin (Luna)\n#main\n27204311\n27204311\n27204311\n31759689\n94142993\n94142993\n12678601\n94365540\n26517393\n26517393\n26517393\n68860936\n11375683\n81035362\n10802915\n10802915\n10802915\n48468330\n14558127\n14558127\n14558127\n24158464\n24158464\n24158464\n84211599\n84211599\n84211599\n24224830\n10045474\n10045474\n10045474\n20899496\n20899496\n20899496\n82956214\n82956214\n82956214\n99157310\n99157310\n99157310\n";

const ydkMalformedSide =
	"#created by AlphaKretin (Luna)\n#main\n27204311\n27204311\n27204311\n31759689\n94142993\n94142993\n12678601\n94365540\n26517393\n26517393\n26517393\n68860936\n11375683\n81035362\n10802915\n10802915\n10802915\n48468330\n14558127\n14558127\n14558127\n24158464\n24158464\n24158464\n84211599\n84211599\n84211599\n24224830\n10045474\n10045474\n10045474\n20899496\n20899496\n20899496\n82956214\n82956214\n82956214\n99157310\n99157310\n99157310\n#extra\n";

const badString =
	"Cuz we're gonna shout it loud, even if our words seem meaningless, like we're carrying the weight of the world";

const data = new YgoData(cardOpts, transOpts, dataOpts, "./dbs", octokitToken);
let cachedList: CardArray | undefined;

// since we'll always have the ID, we don't need ygo-data's help to search by name

export async function getCardList(): Promise<CardArray> {
	if (!cachedList) {
		cachedList = await data.getCardList();
	}
	return cachedList;
}

describe("Construction", function () {
	it("Successful construction with URL", async function () {
		const data = await getCardList();
		expect(() => new Deck(url, data)).to.not.throw();
	});
	it("Failed construction with URL", async function () {
		const data = await getCardList();
		expect(() => new Deck(badString, data)).to.throw();
	});
	it("Successful construction with full YDK", async function () {
		const data = await getCardList();
		expect(() => new Deck(Deck.ydkToUrl(ydk), data)).to.not.throw();
	});
	it("Successful construction with YDK - main deck only", async function () {
		const data = await getCardList();
		expect(() => new Deck(Deck.ydkToUrl(ydkMainOnly), data)).to.not.throw();
	});
	it("Failed construction with YDK - missing extra tag", async function () {
		const data = await getCardList();
		expect(() => new Deck(Deck.ydkToUrl(ydkMalformedExtra), data)).to.throw();
	});
	it("Failed construction with YDK - missing side tag", async function () {
		const data = await getCardList();
		expect(() => new Deck(Deck.ydkToUrl(ydkMalformedSide), data)).to.throw();
	});
	it("Failed construction with YDK - non-YDK", async function () {
		const data = await getCardList();
		expect(() => new Deck(Deck.ydkToUrl(badString), data)).to.throw();
	});
});
describe("Validate YDK parser", function () {
	it("Parsing full deck", function () {
		expect(Deck.ydkToUrl(ydk)).to.equal(url);
	});
	it("Parsing with no main deck", function () {
		expect(Deck.ydkToUrl(ydkNoMain)).to.equal(urlNoMain);
	});
	it("Parsing with only main deck", function () {
		expect(Deck.ydkToUrl(ydkMainOnly)).to.equal(urlMainOnly);
	});
});
describe("Deck information", function () {
	it("Deck sizes", async function () {
		const data = await getCardList();
		const deck = new Deck(url, data);
		expect(deck.mainSize).to.equal(40);
		expect(deck.extraSize).to.equal(15);
		expect(deck.sideSize).to.equal(1);
	});
	it("Type counts", async function () {
		const data = await getCardList();
		const deck = new Deck(url, data);
		let mainCounts = deck.mainTypeCounts;
		let extraCounts = deck.extraTypeCounts;
		let sideCounts = deck.sideTypeCounts;
		expect(mainCounts.monster).to.equal(25);
		expect(mainCounts.spell).to.equal(12);
		expect(mainCounts.trap).to.equal(3);
		expect(extraCounts.fusion).to.equal(1);
		expect(extraCounts.synchro).to.equal(0);
		expect(extraCounts.xyz).to.equal(6);
		expect(extraCounts.link).to.equal(8);
		expect(sideCounts.monster).to.equal(1);
		expect(sideCounts.spell).to.equal(0);
		expect(sideCounts.trap).to.equal(0);
		// go again to check memoisation
		mainCounts = deck.mainTypeCounts;
		extraCounts = deck.extraTypeCounts;
		sideCounts = deck.sideTypeCounts;
		expect(mainCounts.monster).to.equal(25);
		expect(extraCounts.fusion).to.equal(1);
		expect(sideCounts.monster).to.equal(1);
	});
	it("Deck contents", async function () {
		const data = await getCardList();
		const deck = new Deck(url, data);
		let mainText = deck.mainText;
		let extraText = deck.extraText;
		let sideText = deck.sideText;
		expect(mainText).to.equal(
			"2 Union Driver\n3 Galaxy Soldier\n3 Photon Thrasher\n1 Photon Vanisher\n3 A-Assault Core\n3 B-Buster Drake\n3 C-Crush Wyvern\n1 Photon Orbital\n1 Heavy Mech Support Armor\n3 Ash Blossom & Joyous Spring\n1 Reinforcement of the Army\n1 Terraforming\n3 Unauthorized Reactivation\n1 Called by the Grave\n3 Magnet Reverse\n3 Union Hangar\n3 Infinite Impermanence\n2 Morinphen"
		);
		expect(extraText).to.equal(
			"1 ABC-Dragon Buster\n2 Cyber Dragon Infinity\n2 Cyber Dragon Nova\n1 Bujintei Tsukuyomi\n1 Daigusto Emeral\n1 Mekk-Knight Crusadia Avramax\n1 Apollousa, Bow of the Goddess\n1 Knightmare Unicorn\n1 Knightmare Phoenix\n1 Knightmare Cerberus\n1 Crystron Halqifibrax\n1 Union Carrier\n1 I:P Masquerena"
		);
		expect(sideText).to.equal("1 Photon Vanisher");
		// go again to check memoisation
		mainText = deck.mainText;
		extraText = deck.extraText;
		sideText = deck.sideText;
		expect(mainText).to.equal(
			"2 Union Driver\n3 Galaxy Soldier\n3 Photon Thrasher\n1 Photon Vanisher\n3 A-Assault Core\n3 B-Buster Drake\n3 C-Crush Wyvern\n1 Photon Orbital\n1 Heavy Mech Support Armor\n3 Ash Blossom & Joyous Spring\n1 Reinforcement of the Army\n1 Terraforming\n3 Unauthorized Reactivation\n1 Called by the Grave\n3 Magnet Reverse\n3 Union Hangar\n3 Infinite Impermanence\n2 Morinphen"
		);
		expect(extraText).to.equal(
			"1 ABC-Dragon Buster\n2 Cyber Dragon Infinity\n2 Cyber Dragon Nova\n1 Bujintei Tsukuyomi\n1 Daigusto Emeral\n1 Mekk-Knight Crusadia Avramax\n1 Apollousa, Bow of the Goddess\n1 Knightmare Unicorn\n1 Knightmare Phoenix\n1 Knightmare Cerberus\n1 Crystron Halqifibrax\n1 Union Carrier\n1 I:P Masquerena"
		);
		expect(sideText).to.equal("1 Photon Vanisher");
	});
});
describe("YDK format output", function () {
	it("Normal usage", async function () {
		const data = await getCardList();
		const deck = new Deck(url, data);
		expect(deck.ydk).to.equal(ydk);
		// go again to check memoisation
		expect(deck.ydk).to.equal(ydk);
	});
	it("Missing main deck", async function () {
		const data = await getCardList();
		const deck = new Deck(urlNoMain, data);
		expect(deck.ydk).to.equal(ydkNoMain);
	});
	it("Only main deck", async function () {
		const data = await getCardList();
		const deck = new Deck(urlMainOnly, data);
		expect(deck.ydk).to.equal(ydkMainOnly);
	});
});
describe("Deck validation", function () {
	it("Legal deck", async function () {
		const data = await getCardList();
		const deck = new Deck(url, data);
		let errors = await deck.validate();
		expect(errors.length).to.equal(0);
		// go again to test memoisation
		errors = await deck.validate();
		expect(errors.length).to.equal(0);
	});
	it("Small main deck", async function () {
		const data = await getCardList();
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMD!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!",
			data
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.equal("Main Deck too small! Should be at least 40, is 39!");
	});
	it("Large main deck", async function () {
		const data = await getCardList();
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCjqVcFo6lXBaOpVwV6nbUFep21BXqdtQXwYV0C8GFdAvBhXQIt2PEBLdjxAS3Y8QGJZ2ADiWdgA4lnYAPSFVMC0hVTAtIVUwL2yVQC9slUAvbJVAKANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!",
			data
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.equal("Main Deck too large! Should be at most 60, is 61!");
	});
	it("Large extra deck", async function () {
		const data = await getCardList();
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATJX78D2iPrAw==!H1+SAg==!",
			data
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.equal("Extra Deck too large! Should be at most 15, is 16!");
	});
	it("Large side deck", async function () {
		const data = await getCardList();
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAqOpVwWjqVcFo6lXBXqdtQV6nbUFep21BfBhXQLwYV0C8GFdAi3Y8QEt2PEBLdjxAYlnYAOJZ2ADiWdgAw==!",
			data
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.equal("Side Deck too large! Should be at most 15, is 16!");
	});
	it("Non-TCG card", async function () {
		const data = await getCardList();
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTA9hGRAE=!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!",
			data
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.equal("Light Bringer Lucifer (21251800) not TCG-legal! Its scopes are OCG.");
	});
	/* This test requires a custom DB to ensure reliable access to a card with these parameters
	it("Unreleased TCG card", async function () {
		const data = await getCardList();
		const deck = new Deck(
			"...",
			data
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.equal("Card Name (code) not yet officially released!");
	});
	*/
	it("Banlist", async function () {
		const data = await getCardList();
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBPqRxAZ4TygSeE8oEnhPKBKUt9QOlLfUDpS31AyJImQAiSJkAIkiZAA==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!",
			data
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.equal("Too many copies of Called by the Grave (24224830)! Should be at most 1, is 3.");
	});
	// 4 copies of a card is also handled by the banlist system
});
