import { expect } from "chai";
import { describe } from "mocha";
import { Deck } from "../deck";

const url =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBPqRxAZ4TygSeE8oEnhPKBKUt9QOlLfUDpS31AyJImQAiSJkAIkiZAA==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";

const ydk =
	"#created by the YGO Deck Manager\n#main\n99249638\n99249638\n46659709\n46659709\n46659709\n65367484\n65367484\n65367484\n43147039\n30012506\n30012506\n30012506\n77411244\n77411244\n77411244\n3405259\n3405259\n3405259\n89132148\n39890958\n14558127\n14558127\n14558127\n32807846\n73628505\n12524259\n12524259\n12524259\n24224830\n24224830\n24224830\n80352158\n80352158\n80352158\n66399653\n66399653\n66399653\n10045474\n10045474\n10045474\n#extra\n1561110\n10443957\n10443957\n58069384\n58069384\n73289035\n581014\n21887175\n4280258\n38342335\n2857636\n75452921\n50588353\n83152482\n65741786\n!side\n43147039\n";

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

describe("Construction", function () {
	it("Successful construction with URL", function () {
		expect(() => new Deck(url)).to.not.throw();
	});
	it("Failed construction with URL", function () {
		expect(() => new Deck(badString)).to.throw();
	});
	it("Successful construction with full YDK", function () {
		expect(() => new Deck(Deck.YdkToUrl(ydk))).to.not.throw();
	});
	it("Successful construction with YDK - main deck only", function () {
		expect(() => new Deck(Deck.YdkToUrl(ydkMainOnly))).to.not.throw();
	});
	it("Failed construction with YDK - missing extra tag", function () {
		expect(() => new Deck(Deck.YdkToUrl(ydkMalformedExtra))).to.throw();
	});
	it("Failed construction with YDK - missing side tag", function () {
		expect(() => new Deck(Deck.YdkToUrl(ydkMalformedSide))).to.throw();
	});
	it("Failed construction with YDK - non-YDK", function () {
		expect(() => new Deck(Deck.YdkToUrl(badString))).to.throw();
	});
});
describe("Validate YDK parser", function () {
	it("Parsing full deck", function () {
		expect(Deck.YdkToUrl(ydk)).to.equal(url);
	});
	it("Parsing with no main deck", function () {
		expect(Deck.YdkToUrl(ydkNoMain)).to.equal(urlNoMain);
	});
	it("Parsing with only main deck", function () {
		expect(Deck.YdkToUrl(ydkMainOnly)).to.equal(urlMainOnly);
	});
});
describe("Deck information", function () {
	it("Deck sizes", function () {
		const deck = new Deck(url);
		expect(deck.mainSize).to.equal(40);
		expect(deck.extraSize).to.equal(15);
		expect(deck.sideSize).to.equal(1);
	});
	it("Type counts", async function () {
		const deck = new Deck(url);
		let mainCounts = await deck.getMainTypeCounts();
		let extraCounts = await deck.getExtraTypeCounts();
		let sideCounts = await deck.getSideTypeCounts();
		expect(mainCounts.monster).to.equal(23);
		expect(mainCounts.spell).to.equal(14);
		expect(mainCounts.trap).to.equal(3);
		expect(extraCounts.fusion).to.equal(1);
		expect(extraCounts.synchro).to.equal(0);
		expect(extraCounts.xyz).to.equal(6);
		expect(extraCounts.link).to.equal(8);
		expect(sideCounts.monster).to.equal(1);
		expect(sideCounts.spell).to.equal(0);
		expect(sideCounts.trap).to.equal(0);
		// go again to check memoisation
		mainCounts = await deck.getMainTypeCounts();
		extraCounts = await deck.getExtraTypeCounts();
		sideCounts = await deck.getSideTypeCounts();
		expect(mainCounts.monster).to.equal(23);
		expect(extraCounts.fusion).to.equal(1);
		expect(sideCounts.monster).to.equal(1);
	});
	it("Deck contents", async function () {
		const deck = new Deck(url);
		let mainText = await deck.getMainText();
		let extraText = await deck.getExtraText();
		let sideText = await deck.getSideText();
		expect(mainText).to.equal(
			"2 Union Driver\n3 Galaxy Soldier\n3 Photon Thrasher\n1 Photon Vanisher\n3 A-Assault Core\n3 B-Buster Drake\n3 C-Crush Wyvern\n1 Photon Orbital\n1 Heavy Mech Support Armor\n3 Ash Blossom & Joyous Spring\n1 Reinforcement of the Army\n1 Terraforming\n3 Unauthorized Reactivation\n3 Called by the Grave\n3 Magnet Reverse\n3 Union Hangar\n3 Infinite Impermanence"
		);
		expect(extraText).to.equal(
			"1 ABC-Dragon Buster\n2 Cyber Dragon Infinity\n2 Cyber Dragon Nova\n1 Bujintei Tsukuyomi\n1 Daigusto Emeral\n1 Mekk-Knight Crusadia Avramax\n1 Apollousa, Bow of the Goddess\n1 Knightmare Unicorn\n1 Knightmare Phoenix\n1 Knightmare Cerberus\n1 Crystron Halqifibrax\n1 Union Carrier\n1 I:P Masquerena"
		);
		expect(sideText).to.equal("1 Photon Vanisher");
		// go again to check memoisation
		mainText = await deck.getMainText();
		extraText = await deck.getExtraText();
		sideText = await deck.getSideText();
		expect(mainText).to.equal(
			"2 Union Driver\n3 Galaxy Soldier\n3 Photon Thrasher\n1 Photon Vanisher\n3 A-Assault Core\n3 B-Buster Drake\n3 C-Crush Wyvern\n1 Photon Orbital\n1 Heavy Mech Support Armor\n3 Ash Blossom & Joyous Spring\n1 Reinforcement of the Army\n1 Terraforming\n3 Unauthorized Reactivation\n3 Called by the Grave\n3 Magnet Reverse\n3 Union Hangar\n3 Infinite Impermanence"
		);
		expect(extraText).to.equal(
			"1 ABC-Dragon Buster\n2 Cyber Dragon Infinity\n2 Cyber Dragon Nova\n1 Bujintei Tsukuyomi\n1 Daigusto Emeral\n1 Mekk-Knight Crusadia Avramax\n1 Apollousa, Bow of the Goddess\n1 Knightmare Unicorn\n1 Knightmare Phoenix\n1 Knightmare Cerberus\n1 Crystron Halqifibrax\n1 Union Carrier\n1 I:P Masquerena"
		);
		expect(sideText).to.equal("1 Photon Vanisher");
	});
});
describe("YDK format output", function () {
	it("Normal usage", function () {
		const deck = new Deck(url);
		expect(deck.ydk).to.equal(ydk);
		// go again to check memoisation
		expect(deck.ydk).to.equal(ydk);
	});
	it("Missing main deck", function () {
		const deck = new Deck(urlNoMain);
		expect(deck.ydk).to.equal(ydkNoMain);
	});
	it("Only main deck", function () {
		const deck = new Deck(urlMainOnly);
		expect(deck.ydk).to.equal(ydkMainOnly);
	});
});
