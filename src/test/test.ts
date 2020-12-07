import { expect } from "chai";
import { describe } from "mocha";
import { Card, CardArray, Deck } from "../deck";
import { Card as DataCard, YgoData } from "ygopro-data";
import cardOpts from "./config/cardOpts.json";
import dataOpts from "./config/dataOpts.json";
import transOpts from "./config/transOpts.json";
import { octokitToken } from "./config/env";
import { countNumbers } from "../counts";
import { UrlConstructionError, YdkConstructionError } from "../errors";

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
		// TODO: Less hardcode
		if (scope === "OCG") {
			statusMap[0x1] = count;
		} else if (scope === "TCG") {
			statusMap[0x2] = count;
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
describe("Deck validation", function () {
	it("Legal deck", async function () {
		const deck = new Deck(url, cardArray);
		let errors = await deck.validate();
		expect(errors.length).to.equal(0);
		// go again to test memoisation
		errors = await deck.validate();
		expect(errors.length).to.equal(0);
	});
	it("Small main deck", async function () {
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMD!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!",
			cardArray
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "size",
			target: "main",
			min: 40,
			max: 60,
			actual: 39
		}); //"Main Deck too small! Should be at least 40, is 39!"
	});
	it("Large main deck", async function () {
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCjqVcFo6lXBaOpVwV6nbUFep21BXqdtQXwYV0C8GFdAvBhXQIt2PEBLdjxAS3Y8QGJZ2ADiWdgA4lnYAPSFVMC0hVTAtIVUwL2yVQC9slUAvbJVAKANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!",
			cardArray
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "size",
			target: "main",
			max: 60,
			actual: 61
		}); //"Main Deck too large! Should be at most 60, is 61!"
	});
	it("Large extra deck", async function () {
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATJX78D2iPrAw==!H1+SAg==!",
			cardArray
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "size",
			target: "extra",
			max: 15,
			actual: 16
		}); //"Extra Deck too large! Should be at most 15, is 16!"
	});
	it("Large side deck", async function () {
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTAw==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAqOpVwWjqVcFo6lXBXqdtQV6nbUFep21BfBhXQLwYV0C8GFdAi3Y8QEt2PEBLdjxAYlnYAOJZ2ADiWdgAw==!",
			cardArray
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "size",
			target: "side",
			max: 15,
			actual: 16
		}); //"Side Deck too large! Should be at most 15, is 16!"
	});
	it("Non-TCG card", async function () {
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQGeE8oEnhPKBJ4TygSlLfUDpS31A6Ut9QMiSJkAIkiZACJImQCANVMDgDVTA9hGRAE=!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!",
			cardArray
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "limit",
			target: 21251800,
			max: 0,
			actual: 1
		}); //"Light Bringer Lucifer (21251800) not TCG-legal! Its scopes are OCG."
	});
	/* This test requires a custom DB to ensure reliable access to a card with these parameters
	it("Unreleased TCG card", async function () {
		const deck = new Deck(
			"...",
			cardArray
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "limit",
			target: code,
			max: 0,
			actual: 1
		}); //"Card Name (code) not yet officially released!"
	});
	*/
	it("Banlist", async function () {
		const deck = new Deck(
			"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBPqRxAZ4TygSeE8oEnhPKBKUt9QOlLfUDpS31AyJImQAiSJkAIkiZAA==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!",
			cardArray
		);
		const errors = await deck.validate();
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "limit",
			target: 24224830,
			max: 1,
			actual: 3
		}); //"Too many copies of Called by the Grave (24224830)! Should be at most 1, is 3."
	});
	// 4 copies of a card is also handled by the banlist system
});
describe("Misc edge case tests", function () {
	it("countNumbers", function () {
		const nums = [1, 1, 2];
		const counts = countNumbers(nums);
		expect(counts[0]).to.be.undefined;
		expect(counts[1]).to.equal(2);
		expect(counts[2]).to.equal(1);
	});
	it("Memoisation of deckVector", async function () {
		const deck = new Deck(url, cardArray);
		const errors = await deck.validate();
		const themes = deck.themes;
		expect(errors.length).to.equal(0);
		expect(themes.length).to.equal(0);
	});
});

// Archetype checks
const blackwing =
	"ydke://pSPbBKUj2wSlI9sEdIIKAXSCCgF0ggoBHkRQAh5EUAIeRFACMjzsAsS86wLEvOsCxLzrAjSR1QQ0kdUE5ZzhALAj3gCwI94AGtQrAqPiYwUNqB4AHkGZBPHYYwTx2GMEmIhVBJiIVQSYiFUESulxBUrpcQVK6XEF74IWAO+CFgDvghYAPw0aAj8NGgI/DRoCb74xBJAGIwDyv4UBzf3jBQ==!xqcuA8anLgPXMqoFqPjiBAXu9ADdOjkDwRpyBCdapAEHMF8Eh98rAsHqAwPaI+sDs8zmBaFMlwHH+E0B!JpBCAyaQQgMmkEIDaIi1AWiItQFoiLUBwYheBMGIXgTBiF4EEAN/AxADfwMQA38DsCPeAO1rFQWxSZ4F!";
const mekkKnight =
	"ydke://nIU0Aq58cwTXGp8B1xqfAdcanwHBiF4EwYheBMGIXgTi0bUB4tG1AeLRtQHn7H4FxzRIA8c0SAO3G+kEI9jAAQlfOQEJXzkB//HZBS8ZIgUvGSIFLxkiBa8j3gCvI94AUveKA1L3igPUJxwA2i1eAH32vwBDvt0AQ77dAEO+3QC8gzwCWXtjBLocagS6HGoEuwphBKy7GwK/idcCv4nXAr+J1wKoZ40E!Xch8BF3IfASqEUECFrDMBabNuwBLPMkD9KNHBcREIQX/JrsCyvbWBR2IkgNizvQEXL8xBM3gIQCNJ5gD!reIKAq3iCgKt4goCsEeyA7BHsgOwR7ID+9wUAYQlfgCEJX4AhCV+AF4eSgJeHkoCEWJxARFicQERYnEB!";
const mysticMine =
	"ydke://0cJ4BdHCeAXRwngFa507BGudOwRrnTsEiiPQBYoj0AWKI9AFOFHvAjhR7wI4Ue8CWXtjBLiEKAW4hCgFuIQoBaFKrgXjNuEF4zbhBeM24QVor+oCaK/qAmiv6gLaJW0A2iVtANolbQAboEwCG6BMAhugTAIX+5oCF/uaAhf7mgKoZ40EqGeNBKhnjQSVN1EF+wR4AvsEeAL7BHgCByWfBAclnwQHJZ8E!XGCMA1xgjANcYIwDa9TMBGvUzARr1MwEvw5JAqSaKwCkmisAZeUVAmXlFQJl5RUCaUzmBWlM5gVpTOYF!FAzrARQM6wEUDOsBQ77dAEO+3QBDvt0A+9wUASaQQgMmkEIDJpBCAyJImQAiSJkA2v6BA9r+gQPa/oED!";
describe("Archetype checks", function () {
	it("Blackwing", function () {
		const bwDeck = new Deck(blackwing, cardArray);
		const mkDeck = new Deck(mekkKnight, cardArray);
		expect(bwDeck.themes).to.include("Blackwing");
		// repeat for memoisation
		expect(bwDeck.themes).to.include("Blackwing");
		expect(mkDeck.themes).to.not.include("Blackwing");
	});
	it("Mekk-Knight", function () {
		const mkDeck = new Deck(mekkKnight, cardArray);
		const bwDeck = new Deck(blackwing, cardArray);
		expect(mkDeck.themes).to.include("Mekk-Knight");
		expect(bwDeck.themes).to.not.include("Mekk-Knight");
	});
	it("Mystic Mine", function () {
		const mineDeck = new Deck(mysticMine, cardArray);
		const mkDeck = new Deck(mekkKnight, cardArray);
		expect(mineDeck.themes).to.include("Mystic Mine");
		expect(mkDeck.themes).to.not.include("Mystic Mine");
	});
});
