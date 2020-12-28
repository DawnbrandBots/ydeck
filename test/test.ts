import { expect } from "chai";
import { describe } from "mocha";
import { Card as DataCard, YgoData } from "ygopro-data";
import { Card, CardArray, Deck } from "../src";
import { countNumbers } from "../src/counts";
import { LimiterConstructionError, UrlConstructionError, YdkConstructionError } from "../src/errors";
import cardOpts from "./config/cardOpts.json";
import dataOpts from "./config/dataOpts.json";
import { octokitToken } from "./config/env";
import transOpts from "./config/transOpts.json";

const url =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";

const ydk =
	"#created by YDeck\n#main\n99249638\n99249638\n46659709\n46659709\n46659709\n65367484\n65367484\n65367484\n43147039\n30012506\n30012506\n30012506\n77411244\n77411244\n77411244\n3405259\n3405259\n3405259\n89132148\n39890958\n14558127\n14558127\n14558127\n32807846\n73628505\n12524259\n12524259\n12524259\n24224830\n80352158\n80352158\n80352158\n66399653\n66399653\n66399653\n10045474\n10045474\n10045474\n55784832\n55784832\n#extra\n1561110\n10443957\n10443957\n58069384\n58069384\n73289035\n581014\n21887175\n4280258\n38342335\n2857636\n75452921\n50588353\n83152482\n65741786\n!side\n43147039\n";

const crlfYdk =
	"#created by YDeck\r\n#main\r\n99249638\r\n99249638\r\n46659709\r\n46659709\r\n46659709\r\n65367484\r\n65367484\r\n65367484\r\n43147039\r\n30012506\r\n30012506\r\n30012506\r\n77411244\r\n77411244\r\n77411244\r\n3405259\r\n3405259\r\n3405259\r\n89132148\r\n39890958\r\n14558127\r\n14558127\r\n14558127\r\n32807846\r\n73628505\r\n12524259\r\n12524259\r\n12524259\r\n24224830\r\n80352158\r\n80352158\r\n80352158\r\n66399653\r\n66399653\r\n66399653\r\n10045474\r\n10045474\r\n10045474\r\n55784832\r\n55784832\r\n#extra\r\n1561110\r\n10443957\r\n10443957\r\n58069384\r\n58069384\r\n73289035\r\n581014\r\n21887175\r\n4280258\r\n38342335\r\n2857636\r\n75452921\r\n50588353\r\n83152482\r\n65741786\r\n!side\r\n43147039\r\n";

const urlMainOnly =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBPqRxAZ4TygSeE8oEnhPKBKUt9QOlLfUDpS31AyJImQAiSJkAIkiZAA==!!!";

const ydkMainOnly =
	"#created by YDeck\n#main\n99249638\n99249638\n46659709\n46659709\n46659709\n65367484\n65367484\n65367484\n43147039\n30012506\n30012506\n30012506\n77411244\n77411244\n77411244\n3405259\n3405259\n3405259\n89132148\n39890958\n14558127\n14558127\n14558127\n32807846\n73628505\n12524259\n12524259\n12524259\n24224830\n24224830\n24224830\n80352158\n80352158\n80352158\n66399653\n66399653\n66399653\n10045474\n10045474\n10045474\n#extra\n!side\n";

const urlNoMain = "ydke://!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";

const ydkNoMain =
	"#created by YDeck\n#main\n#extra\n1561110\n10443957\n10443957\n58069384\n58069384\n73289035\n581014\n21887175\n4280258\n38342335\n2857636\n75452921\n50588353\n83152482\n65741786\n!side\n43147039\n";

const ydkMalformedExtra =
	"#created by AlphaKretin (Luna)\n#main\n27204311\n27204311\n27204311\n31759689\n94142993\n94142993\n12678601\n94365540\n26517393\n26517393\n26517393\n68860936\n11375683\n81035362\n10802915\n10802915\n10802915\n48468330\n14558127\n14558127\n14558127\n24158464\n24158464\n24158464\n84211599\n84211599\n84211599\n24224830\n10045474\n10045474\n10045474\n20899496\n20899496\n20899496\n82956214\n82956214\n82956214\n99157310\n99157310\n99157310\n";

const ydkMalformedSide =
	"#created by AlphaKretin (Luna)\n#main\n27204311\n27204311\n27204311\n31759689\n94142993\n94142993\n12678601\n94365540\n26517393\n26517393\n26517393\n68860936\n11375683\n81035362\n10802915\n10802915\n10802915\n48468330\n14558127\n14558127\n14558127\n24158464\n24158464\n24158464\n84211599\n84211599\n84211599\n24224830\n10045474\n10045474\n10045474\n20899496\n20899496\n20899496\n82956214\n82956214\n82956214\n99157310\n99157310\n99157310\n#extra\n";

const ydkBadPasscode = "#created by YDeck\n#main\n0\n#extra\n0\n!side\n0\n";

const badString =
	"Cuz we're gonna shout it loud, even if our words seem meaningless, like we're carrying the weight of the world";

const ygodata = new YgoData(cardOpts, transOpts, dataOpts, "./dbs", octokitToken);
let cardArray: CardArray;

// since we'll always have the ID, we don't need ygo-data's help to search by name

async function convertCard(card: DataCard): Promise<Card> {
	const status = await card.status;
	const scopeReg = /([a-zA-Z]+): (\d)/g;
	const statusMap: { [scope: number]: number } = {};
	let result = scopeReg.exec(status);
	while (result !== null) {
		const scope = result[1];
		const count = parseInt(result[2], 10);
		// 3 copies is the default fallback, and this lets us actually test that
		if (count < 3) {
			// TODO: Less hardcode
			if (scope === "OCG") {
				statusMap[0x1] = count;
			} else if (scope === "TCG") {
				statusMap[0x2] = count;
			}
		}
		result = scopeReg.exec(status);
	}
	return new Card(card.text.en.name, card.data.ot, card.data.type, card.data.setcode, statusMap);
}

before(async () => {
	const dataArray = await ygodata.getCardList();
	const promArray: { [code: number]: Promise<Card> } = {};
	for (const code in dataArray) {
		promArray[code] = convertCard(dataArray[code]);
	}
	await Promise.all(Object.values(promArray));
	const tempArray: CardArray = {};
	for (const code in promArray) {
		tempArray[code] = await promArray[code];
	}
	return (cardArray = tempArray);
});

describe("Construction", function () {
	it("Successful construction with URL", function () {
		expect(() => new Deck(url, cardArray)).to.not.throw();
	});
	it("Failed construction with URL", function () {
		expect(() => new Deck(badString, cardArray)).to.throw(UrlConstructionError);
	});
	it("Successful construction with full YDK", function () {
		expect(() => new Deck(Deck.ydkToUrl(ydk), cardArray)).to.not.throw();
	});
	it("Successful construction with YDK - main deck only", function () {
		expect(() => new Deck(Deck.ydkToUrl(ydkMainOnly), cardArray)).to.not.throw();
	});
	it("Failed construction with YDK - missing extra tag", function () {
		expect(() => new Deck(Deck.ydkToUrl(ydkMalformedExtra), cardArray)).to.throw(YdkConstructionError, "#extra");
	});
	it("Failed construction with YDK - missing side tag", function () {
		expect(() => new Deck(Deck.ydkToUrl(ydkMalformedSide), cardArray)).to.throw(YdkConstructionError, "!side");
	});
	it("Failed construction with YDK - non-YDK", function () {
		expect(() => new Deck(Deck.ydkToUrl(badString), cardArray)).to.throw(YdkConstructionError, "#main");
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
	it("Parsing with CRLF linebreaks", function () {
		expect(Deck.ydkToUrl(crlfYdk)).to.equal(url);
	});
});
describe("Deck information", function () {
	it("Deck sizes", function () {
		const deck = new Deck(url, cardArray);
		expect(deck.mainSize).to.equal(40);
		expect(deck.extraSize).to.equal(15);
		expect(deck.sideSize).to.equal(1);
	});
	it("Type counts", function () {
		const deck = new Deck(url, cardArray);
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
	it("Deck contents", function () {
		const deck = new Deck(url, cardArray);
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
	it("Normal usage", function () {
		const deck = new Deck(url, cardArray);
		expect(deck.ydk).to.equal(ydk);
		// go again to check memoisation
		expect(deck.ydk).to.equal(ydk);
	});
	it("Missing main deck", function () {
		const deck = new Deck(urlNoMain, cardArray);
		expect(deck.ydk).to.equal(ydkNoMain);
	});
	it("Only main deck", function () {
		const deck = new Deck(urlMainOnly, cardArray);
		expect(deck.ydk).to.equal(ydkMainOnly);
	});
});
describe("Misc edge case tests", function () {
	it("countNumbers", function () {
		const nums = [1, 1, 2];
		const counts = countNumbers(nums);
		expect(counts[0]).to.be.undefined;
		expect(counts[1]).to.equal(2);
		expect(counts[2]).to.equal(1);
	});
	it("Memoisation of deckVector", function () {
		const deck = new Deck(url, cardArray);
		const errors = deck.validationErrors;
		const themes = deck.themes;
		expect(errors.length).to.equal(0);
		expect(themes.length).to.equal(0);
	});
});
describe("Bad passcode tests", function () {
	it("No card types", function () {
		const badUrl = Deck.ydkToUrl(ydkBadPasscode);
		const deck = new Deck(badUrl, cardArray);
		expect(deck.mainSize).to.equal(1);
		expect(deck.mainTypeCounts).to.deep.equal({
			monster: 0,
			spell: 0,
			trap: 0
		});
		expect(deck.extraSize).to.equal(1);
		expect(deck.extraTypeCounts).to.deep.equal({
			fusion: 0,
			synchro: 0,
			xyz: 0,
			link: 0
		});
		expect(deck.sideSize).to.equal(1);
		expect(deck.sideTypeCounts).to.deep.equal({
			monster: 0,
			spell: 0,
			trap: 0
		});
	});
	it("No card names", function () {
		const badUrl = Deck.ydkToUrl(ydkBadPasscode);
		const deck = new Deck(badUrl, cardArray);
		expect(deck.mainText).to.equal("1 0");
		expect(deck.extraText).to.equal("1 0");
		expect(deck.sideText).to.equal("1 0");
	});
	it("No archetypes", function () {
		const badUrl = Deck.ydkToUrl(ydkBadPasscode);
		const deck = new Deck(badUrl, cardArray);
		expect(deck.themes.length).to.equal(0);
	});
});

// Deck validation
const urlSmallMain =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMD!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";
const urlLargeMain =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCjqVcFo6lXBaOpVwV6nbUFep21BXqdtQXwYV0C8GFdAvBhXQIt2PEBLdjxAS3Y8QGJZ2ADiWdgA4lnYAPSFVMC0hVTAtIVUwL2yVQC9slUAvbJVAKANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";
const urlLargeExtra =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATJX78D2iPrAw==!H1+SAg==!";
const urlLargeSide =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAqOpVwWjqVcFo6lXBXqdtQV6nbUFep21BfBhXQLwYV0C8GFdAi3Y8QEt2PEBLdjxAYlnYAOJZ2ADiWdgAw==!";
const urlOCGCard =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTA9hGRAE=!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";
const urlLimitedCard =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBPqRxAZ4TygSeE8oEnhPKBKUt9QOlLfUDpS31AyJImQAiSJkAIkiZAA==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";
const urlOCGCardTCGLimited =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBnhPKBJ4TygSeE8oEpS31A6Ut9QOlLfUDIkiZACJImQAiSJkAgDVTA4A1UwPYRkQB!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";
const urlOCGLegal =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBnhPKBJ4TygSeE8oEpS31AyJImQAiSJkAIkiZAIA1UwOANVMD2EZEAQ==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";
const urlTCGCard =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDIkiZACJImQAiSJkAgDVTA4A1UwPG+RkExvkZBA==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";
const urlTCGCardOCGLimited =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31AyJImQAiSJkAIkiZAIA1UwOANVMDxvkZBMb5GQQ=!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";

describe("Deck validation (default TCG)", function () {
	it("Legal deck", function () {
		const deck = new Deck(url, cardArray);
		let errors = deck.validationErrors;
		expect(errors.length).to.equal(0);
		// go again to test memoisation
		errors = deck.validationErrors;
		expect(errors.length).to.equal(0);
	});
	it("Small main deck", function () {
		const deck = new Deck(urlSmallMain, cardArray);
		const errors = deck.validationErrors;
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "size",
			target: "main",
			min: 40,
			max: 60,
			actual: 39
		}); //"Main Deck too small! Should be at least 40, is 39!"
	});
	it("Large main deck", function () {
		const deck = new Deck(urlLargeMain, cardArray);
		const errors = deck.validationErrors;
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "size",
			target: "main",
			max: 60,
			actual: 61
		}); //"Main Deck too large! Should be at most 60, is 61!"
	});
	it("Large extra deck", function () {
		const deck = new Deck(urlLargeExtra, cardArray);
		const errors = deck.validationErrors;
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "size",
			target: "extra",
			max: 15,
			actual: 16
		}); //"Extra Deck too large! Should be at most 15, is 16!"
	});
	it("Large side deck", function () {
		const deck = new Deck(urlLargeSide, cardArray);
		const errors = deck.validationErrors;
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "size",
			target: "side",
			max: 15,
			actual: 16
		}); //"Side Deck too large! Should be at most 15, is 16!"
	});
	it("Non-TCG card", function () {
		const deck = new Deck(urlOCGCard, cardArray);
		const errors = deck.validationErrors;
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "limit",
			name: "Light Bringer Lucifer",
			target: 21251800,
			max: 0,
			actual: 1
		}); //"Light Bringer Lucifer (21251800) not TCG-legal! Its scopes are OCG."
	});
	/* This test requires a custom DB to ensure reliable access to a card with these parameters
	it("Unreleased TCG card", function () {
		const deck = new Deck(
			"...",
			cardArray
		);
		const errors = deck.validationErrors;
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "limit",
			target: code,
			name: "Card Name",
			max: 0,
			actual: 1
		}); //"Card Name (code) not yet officially released!"
	});
	*/
	/* This test of the TCG banlist is temporarily broken due to a bad workaround on the
	   IGNIS side of the operation conflicting with a bad hardcode in ygo-data.
	it("Banlist", function () {
		const deck = new Deck(urlLimitedCard, cardArray);
		const errors = deck.validationErrors;
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "limit",
			target: 24224830,
			name: "Called by the Grave",
			max: 1,
			actual: 3
		}); //"Too many copies of Called by the Grave (24224830)! Should be at most 1, is 3."
	});*/
	// 4 copies of a card is also handled by the banlist system
});
describe("Validation with specified limiters", function () {
	it("Reject invalid entry", function () {
		expect(() => new Deck(url, cardArray, badString)).to.throw(LimiterConstructionError);
	});
	// TCG prerelease needs dummy database
	it("World-TCG pass", function () {
		const deck = new Deck(urlOCGCard, cardArray, "PrereleaseOnTCG");
		expect(deck.validationErrors.length).to.equal(0);
	});
	/* This test of the TCG banlist is temporarily broken due to a bad workaround on the
	   IGNIS side of the operation conflicting with a bad hardcode in ygo-data.
	it("World-TCG fail", function () {
		const deck = new Deck(urlOCGCardTCGLimited, cardArray, "PrereleaseOnTCG");
		expect(deck.validationErrors.length).to.equal(1);
		expect(deck.validationErrors[0]).to.deep.equal({
			type: "limit",
			target: 24224830,
			name: "Called by the Grave",
			max: 1,
			actual: 2
		});
	});*/
	it("OCG pass", function () {
		const deck = new Deck(urlOCGLegal, cardArray, "OCG");
		expect(deck.validationErrors.length).to.equal(0);
	});
	it("OCG fail - banlist", function () {
		const deck = new Deck(urlOCGCardTCGLimited, cardArray, "OCG");
		expect(deck.validationErrors.length).to.equal(1);
		expect(deck.validationErrors[0]).to.deep.equal({
			type: "limit",
			target: 66399653,
			name: "Union Hangar",
			max: 1,
			actual: 3
		});
	});
	it("OCG fail - region", function () {
		const deck = new Deck(urlTCGCard, cardArray, "OCG");
		expect(deck.validationErrors.length).to.equal(1);
		expect(deck.validationErrors[0]).to.deep.equal({
			type: "limit",
			target: 68811206,
			name: "Tyler the Great Warrior",
			max: 0,
			actual: 2
		});
	});
	// OCG fail - prereleases should to be safe use a dummy database
	// same for OCG prerelease testing
	it("World-OCG pass", function () {
		const deck = new Deck(urlTCGCard, cardArray, "PrereleaseOnOCG");
		expect(deck.validationErrors.length).to.equal(0);
	});
	it("World-OCG fail", function () {
		const deck = new Deck(urlTCGCardOCGLimited, cardArray, "PrereleaseOnOCG");
		expect(deck.validationErrors.length).to.equal(1);
		expect(deck.validationErrors[0]).to.deep.equal({
			type: "limit",
			target: 66399653,
			name: "Union Hangar",
			max: 1,
			actual: 2
		});
	});
});

// Archetype checks
const mekkKnight =
	"ydke://nIU0Aq58cwTXGp8B1xqfAdcanwHBiF4EwYheBMGIXgTi0bUB4tG1AeLRtQHn7H4FxzRIA8c0SAO3G+kEI9jAAQlfOQEJXzkB//HZBS8ZIgUvGSIFLxkiBa8j3gCvI94AUveKA1L3igPUJxwA2i1eAH32vwBDvt0AQ77dAEO+3QC8gzwCWXtjBLocagS6HGoEuwphBKy7GwK/idcCv4nXAr+J1wKoZ40E!Xch8BF3IfASqEUECFrDMBabNuwBLPMkD9KNHBcREIQX/JrsCyvbWBR2IkgNizvQEXL8xBM3gIQCNJ5gD!reIKAq3iCgKt4goCsEeyA7BHsgOwR7ID+9wUAYQlfgCEJX4AhCV+AF4eSgJeHkoCEWJxARFicQERYnEB!";
const mysticMine =
	"ydke://0cJ4BdHCeAXRwngFa507BGudOwRrnTsEiiPQBYoj0AWKI9AFOFHvAjhR7wI4Ue8CWXtjBLiEKAW4hCgFuIQoBaFKrgXjNuEF4zbhBeM24QVor+oCaK/qAmiv6gLaJW0A2iVtANolbQAboEwCG6BMAhugTAIX+5oCF/uaAhf7mgKoZ40EqGeNBKhnjQSVN1EF+wR4AvsEeAL7BHgCByWfBAclnwQHJZ8E!XGCMA1xgjANcYIwDa9TMBGvUzARr1MwEvw5JAqSaKwCkmisAZeUVAmXlFQJl5RUCaUzmBWlM5gVpTOYF!FAzrARQM6wEUDOsBQ77dAEO+3QBDvt0A+9wUASaQQgMmkEIDJpBCAyJImQAiSJkA2v6BA9r+gQPa/oED!";
const virtualWorld =
	"ydke://MjzsAvZs+gL2bPoC9mz6AjiiJwU4oicFOKInBZIJ7QKSCe0CkgntAjdQhQA3UIUAN1CFAOXTvwDl078A5dO/AK8j3gCvI94AHkRQAh5EUAIeRFACTvd1AU73dQFO93UBLiXjAC4l4wAuJeMAHjeCAR43ggEeN4IBPw0aAj8NGgI/DRoCrmAJBN8j/wLfI/8C3yP/AoHrywCB68sAgevLAA==!r7qDBY+8+QOuZTIFqqWOAJfnGQLKg4kC/gDeA5chZAX0o0cF9KNHBaQLewWYY0gBfgydARHqPQSZb2cF!txvpBK3iCgKt4goCreIKAv2JnAX9iZwF/YmcBUO+3QBDvt0AQ77dAPvcFAEmkEIDJpBCAyaQQgO0/F4B!";
const drytron =
	"ydke://j04pBHxfygV8X8oFfF/KBfw9uQX8PbkF/D25BeoaVgHqGlYB0tb/Ad8ZlAMViqkCFYqpAo6DmgSOg5oEjoOaBB0k7QXkdwcB5HcHAeR3BwFj2aQF3RexBVIQZQJaojUBHkRQAj6vnAM+r5wDPq+cA0YunQVGLp0FRi6dBQz6wwUM+sMFDPrDBcnGVQFG1aEBRtWhAZkdgQOZHYEDmR2BAw==!G+BbBZfnGQIf498FlyFkBaWmnwEctuUCVbdSBMREIQW/DkkCpJorALslcgDB6gMD+SzMArTbgAKxSZ4F!1xqfAdcanwHXGp8BreIKAq3iCgKt4goCryPeAK8j3gCvI94AJpBCAyaQQgMmkEIDb3bvAG927wBvdu8A!";
const infernoble =
	"ydke://4NIdBeDSHQXg0h0FtvsRASbLRQGVTXoDlU16A5VNegMnFGMDJxRjAycUYwPwKJMD8CiTA/AokwNXq4ECV6uBAlergQJ/F1EBZCypBbhCbwDh6aQFppv0ASh/EAMofxADKH8QA0PhOwJD4TsCQ+E7AoxxFQKMcRUCjHEVAn163wFkW80DHjeCAR43ggEeN4IBxzRIA8c0SAPHNEgDb74xBA==!u60kAIi3FAUdiJIDHYiSA8HqAwMa3qACxEQhBZEmyAC8VPwCteDgBM1nVAM1tL4EKDFmAidapAHd8qAE!reIKAq3iCgKt4goCTvd1AU73dQHXGp8B1xqfAdcanwGvI94AryPeAK8j3gAj1p0CI9adAvvcFAG0/F4B!";
const dLink =
	"ydke://nIU0Aq58cwQyPOwC1xqfAdcanwHXGp8BEtFCBZehVAOYwwkE1jUxBNY1MQSt4goCreIKAq3iCgLhibADPbqWAa2z6gCts+oArbPqAN4y6gXmrhQE5q4UBCUYWwCj4mMFGtQrAh5EUAIeRFACHkRQAn/amQV/2pkFf9qZBW7oiACf2uEC2i1eAB43ggEeN4IB7iX+BKyx6gWsseoFrLHqBRTK3wEUyt8BFMrfAUV3RgVrPDgFazw4BWs8OAXWgi8C1Ba2A8394wXyv4UB!qhFBAidapAGlvRgAZiH3AO1rFQWhTJcB7R9qAcyitgDYBr8BXL8xBJa6cwHrjMgA/R1iBP0dYgThhSIF!wYheBMGIXgS3G+kE/YmcBf2JnAX9iZwF+9wUAcLHcgHCx3IBwsdyASPWnQIj1p0CIkiZACJImQAiSJkA!";
const dino =
	"ydke://MjzsAtcanwHXGp8B1xqfAYwCIQGMAiEBtxvpBHD9yATrkkwC65JMAuuSTAKTgKQCk4CkApOApAIeRFACHkRQAh5EUAIU9SUCFPUlAh+r8QSistcFMZFGAkEh0gJBIdICQSHSAjhR7wI4Ue8COFHvAll7YwSOz94Ajs/eAMLHcgHCx3IBbOQGAWzkBgFs5AYB+7uoAvu7qAL7u6gC+wR4AvsEeAI=!lKVtBI1YjAKNWIwCjViMAp+QagBP4ewE3T/vA8JPQQCkmisAssVPBM3gIQDN4CEAiLcUBbTbgAK024AC!reIKAq3iCgKt4goCQ77dAEO+3QD63BQBwsdyAfiBrwT4ga8EqGeNBKhnjQSoZ40Eb3bvAG927wBvdu8A!";
const zooEld =
	"ydke://1xqfAdcanwHXGp8BMlCwBTJQsAWfOycEqfKzBbLJCQSyyQkEsskJBL83mQRIKZgDJIvkAeKjQgC8Qj8AryPeAK8j3gCvI94AOLFjBDixYwQ4sWMEakgeAGpIHgBqSB4AlaffAZWn3wGVp98B8dG+AmFWZwNhVmcDYVZnAwGEOgEBhDoBAYQ6AbbP8QSzLzoBsy86AbMvOgF5/o0Fef6NBQ==!Lk53AmvUzARr1MwEwRpyBNcV3wWXIWQFsKKvALCirwBDWHcCQ1h3AsE76gL8KG8E8sPuAqSaKwBpTOYF!MjzsAjKifQAyon0AMqJ9AB5EUAIeRFACHkRQAhiAQAAYgEAAGIBAAIQlfgCEJX4AhCV+AFEQgwOBFq4D!";
const invDog =
	"ydke://SCmYA0gpmANIKZgDqfKzBTixYwQ4sWMEOLFjBK8j3gCvI94AryPeAJ87JwSfOycELxkiBS8ZIgUvGSIFv4nXAr+J1wK/idcCuhxqBLocagTCx3IBwsdyAWpIHgBqSB4AakgeAB43ggEeN4IBHjeCAW++MQRZe2MEhCV+AIQlfgCEJX4Ats/xBLbP8QS2z/EEZJpAAajmPgGo5j4BqOY+AQ==!Xch8BF3IfASmzbsAFrDMBfU8qQXCwzYBNskIAy5OdwIuTncCa9TMBGvUzATXFd8FwRpyBM3gIQCNJ5gD!Tvd1AU73dQFO93UB/YmcBf2JnAX9iZwF1xqfAdcanwHXGp8B+twUAUO+3QBDvt0A+wR4AvsEeAL7BHgC!";
const phantKnights =
	"ydke://Ka+FASmvhQEpr4UBNdjNAzXYzQM12M0Do+JjBaPiYwWj4mMFGtQrAhrUKwIa1CsChhRHBePWpADj1qQA49akAENYMQA6upoCD//xBS7wZwNzwDwBryPeAK8j3gCvI94AU/eKA1P3igNT94oDnIU0Aq58cwTaLV4Appv0AcWp2gRFd0YFIkiZACJImQAiSJkAfPHdBfK/hQHyv4UB8r+FAQ==!qhFBApchZAUQydQDpb0YAGYh9wDLKbcB9928A/fdvAMRubgFEbm4BcREIQW/DkkCoUyXAeyufwNcvzEE!!";
const prankKids =
	"ydke://mli2BJpYtgSaWLYESUD4AElA+ABJQPgArrzfAa683wGuvN8BYkIWAWJCFgFiQhYBPUxSAz1MUgM9TFIDSMrVBEjK1QRIytUEPqRxAW5EmgJuRJoCbkSaAhf7mgIX+5oCF/uaAk73dQFO93UBTvd1AfvcFAGvI94AryPeAK8j3gBZe2MEw7brAMLHcgHCx3IBwsdyAdX21gDV9tYA1fbWAA==!rC3jBKwt4wRZKacCXYIaAV2CGgGOiYgBjomIAT0+CQE9PgkB+KWdAiZ6OQTERCEF9KNHBYi3FAW/DkkC!Q77dAEO+3QBDvt0AJpBCAyaQQgMmkEIDYHT3BGB09wRgdPcEsUeyA7FHsgOxR7IDb3bvAG927wBvdu8A!";
const dogBlader =
	"ydke://1xqfAdcanwGfOycEAfXQAOVONADlTjQASCmYA0gpmANIKZgDryPeAK8j3gCvI94A3D/4Atw/+ALcP/gCyf+KBGpIHgBqSB4AakgeAMWp2gSEJX4AhCV+AAH1fwIiSJkAIkiZACJImQCP/6QAj/+kAHBB5wBwQecAqOY+AajmPgHv3+kB79/pAX/S+wF/0vsBf9L7AQtCxgQLQsYEC0LGBLbP8QS2z/EE!TrLqBU9siQV37iMFd+4jBS5OdwJr1MwEa9TMBLiBCQPBGnIEFOizABToswDyw+4C+ZXPArTbgAKxSZ4F!MjzsAsc0SAPHNEgDreIKAq3iCgKt4goCHkRQAh5EUAIeRFACQ77dAEO+3QDCx3IBwsdyAfsEeAL7BHgC!";
const striker =
	"ydke://1xqfAdcanwHXGp8By+iNAcvojQHL6I0B3e45At3uOQKvI94AryPeAK8j3gBT94oDU/eKA7IyzAWyMswFsjLMBaab9AE/DRoCPw0aAj8NGgJvvjEEWXtjBKYF7wWmBe8FhCV+AIQlfgCEJX4A2qwNA9qsDQPcph4DaIXcBWiF3AVohdwFcV9uAeIE+wLiBPsCqGeNBCJImQAiSJkAIkiZAA==!xEQhBf8muwKw3ugCweoDAwmpegQskYEALJGBACyRgQA+ir0A/rTFA/60xQP+tMUDiJBnBYiQZwWIkGcF!reIKAq3iCgKt4goCU/eKAzmxYwQ5sWMEObFjBPvcFAGlDYwBqGeNBKhnjQSVN1EF+wR4AvsEeAL7BHgC!";
const geist =
	"ydke://MjzsAmybJwNa6SoDWukqA1rpKgO37IwCt+yMArfsjAKvI94AryPeADmxYwQeRFACHkRQAh5EUALpP1YF6T9WBcqchQHKnIUBypyFAZAGIwA4Ue8COFHvAjhR7wLjNuEF4zbhBYQlfgAiSJkAIkiZACJImQAjSRgCI0kYAjtApAE7QKQBjAA3A4wANwOMADcD25VrAtuVawL7BHgC+wR4Ag==!zrvlAWG7zAFhu8wBpJorACkFFwApBRcAKQUXAM8gkgTPIJIEtNuAArTbgAKNJ5gDtNuAArFJngXBGnIE!1xqfAcc0SAPHNEgDxzRIA7cb6QT63BQBhCV+AICpFASAqRQEgA9tAUEhlAJBIZQCQSGUAoEWrgP7BHgC!";

const themes: { [theme: string]: string[] } = {
	"Mekk-Knight": [mekkKnight],
	"Mystic Mine": [mysticMine],
	"Virtual World": [virtualWorld],
	Drytron: [drytron],
	"Infernoble Knight": [infernoble],
	"Dragon Link": [dLink],
	Dinosaur: [dino],
	Zoodiac: [zooEld],
	Eldlich: [zooEld],
	Invoked: [mekkKnight, invDog],
	Dogmatika: [invDog, dogBlader],
	"Phantom Knight": [phantKnights],
	"Prank-Kids": [prankKids],
	"Buster Blader": [dogBlader],
	"Sky Striker": [striker],
	Altergeist: [geist]
};

describe("Archetype checks", function () {
	for (const theme in themes) {
		it(theme, function () {
			for (const deck of themes[theme]) {
				const onThemeDeck = new Deck(deck, cardArray);
				expect(onThemeDeck.themes).to.include(theme);
			}
			for (const otherTheme in themes) {
				if (otherTheme !== theme) {
					for (const deck of themes[otherTheme]) {
						if (!themes[theme].includes(deck)) {
							const offThemeDeck = new Deck(deck, cardArray);
							expect(offThemeDeck.themes).to.not.include(theme);
						}
					}
				}
			}
		});
	}
});
