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
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfAQ==!yV+/A8lfvwPJX78D!sdjfAbHY3wE=!";

const ydk =
	"#created by YDeck\n#main\n89631139\n89631139\n89631139\n95788410\n95788410\n95788410\n39674352\n39674352\n39674352\n32626733\n32626733\n32626733\n56649609\n56649609\n56649609\n38999506\n38999506\n38999506\n39111158\n39111158\n39111158\n92176681\n92176681\n92176681\n65957473\n65957473\n65957473\n76232340\n76232340\n76232340\n38955728\n38955728\n38955728\n13140300\n13140300\n13140300\n89189982\n89189982\n89189982\n31447217\n#extra\n62873545\n62873545\n62873545\n!side\n31447217\n31447217\n";

const crlfYdk =
	"#created by YDeck\r\n#main\r\n89631139\r\n89631139\r\n89631139\r\n95788410\r\n95788410\r\n95788410\r\n39674352\r\n39674352\r\n39674352\r\n32626733\r\n32626733\r\n32626733\r\n56649609\r\n56649609\r\n56649609\r\n38999506\r\n38999506\r\n38999506\r\n39111158\r\n39111158\r\n39111158\r\n92176681\r\n92176681\r\n92176681\r\n65957473\r\n65957473\r\n65957473\r\n76232340\r\n76232340\r\n76232340\r\n38955728\r\n38955728\r\n38955728\r\n13140300\r\n13140300\r\n13140300\r\n89189982\r\n89189982\r\n89189982\r\n31447217\r\n#extra\r\n62873545\r\n62873545\r\n62873545\r\n!side\r\n31447217\r\n31447217\r\n";

const urlMainOnly =
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfAQ==!!!";

const ydkMainOnly =
	"#created by YDeck\n#main\n89631139\n89631139\n89631139\n95788410\n95788410\n95788410\n39674352\n39674352\n39674352\n32626733\n32626733\n32626733\n56649609\n56649609\n56649609\n38999506\n38999506\n38999506\n39111158\n39111158\n39111158\n92176681\n92176681\n92176681\n65957473\n65957473\n65957473\n76232340\n76232340\n76232340\n38955728\n38955728\n38955728\n13140300\n13140300\n13140300\n89189982\n89189982\n89189982\n31447217\n#extra\n!side\n";

const urlNoMain = "ydke://!yV+/A8lfvwPJX78D!sdjfAbHY3wE=!";

const ydkNoMain = "#created by YDeck\n#main\n#extra\n62873545\n62873545\n62873545\n!side\n31447217\n31447217\n";

const ydkMalformedExtra =
	"#created by YDeck\n#main\n89631139\n89631139\n89631139\n95788410\n95788410\n95788410\n39674352\n39674352\n39674352\n32626733\n32626733\n32626733\n56649609\n56649609\n56649609\n38999506\n38999506\n38999506\n39111158\n39111158\n39111158\n92176681\n92176681\n92176681\n65957473\n65957473\n65957473\n76232340\n76232340\n76232340\n38955728\n38955728\n38955728\n13140300\n13140300\n13140300\n89189982\n89189982\n89189982\n31447217\n";

const ydkMalformedSide =
	"#created by YDeck\n#main\n89631139\n89631139\n89631139\n95788410\n95788410\n95788410\n39674352\n39674352\n39674352\n32626733\n32626733\n32626733\n56649609\n56649609\n56649609\n38999506\n38999506\n38999506\n39111158\n39111158\n39111158\n92176681\n92176681\n92176681\n65957473\n65957473\n65957473\n76232340\n76232340\n76232340\n38955728\n38955728\n38955728\n13140300\n13140300\n13140300\n89189982\n89189982\n89189982\n31447217\n#extra";

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
	it("Parsing with blank lines", function () {
		expect(Deck.ydkToUrl("#main\n27204311\n\n#extra\n1561110\n\n!side\n27204311\n")).to.equal(
			"ydke://1xqfAQ==!FtIXAA==!1xqfAQ==!"
		);
	});
	it("Parsing with zeros", function () {
		expect(Deck.ydkToUrl("#main\n0\n#extra\n\n\n!side\n")).to.equal("ydke://AAAAAA==!!!");
	});
	it("Rejects literal garbage", function () {
		const examples = ["Trickstar", "Blackwing", "Blue-Eyes"];
		for (const example of examples) {
			expect(() => Deck.ydkToUrl(`#main\n${example}\n#extra\n!side\n`))
				.to.throw(YdkConstructionError)
				.with.property("ydkError", `Unexpected value on line 2; ${example}`);
		}
	});
	// Only apply to strict mode
	it.skip("Rejects leading zeros", function () {
		const examples = ["00", "08", "0090"];
		for (const example of examples) {
			expect(() => Deck.ydkToUrl(`#main\n${example}\n#extra\n!side\n`))
				.to.throw(YdkConstructionError)
				.with.property("ydkError", `Unexpected value on line 2; ${example}`);
		}
	});
	it.skip("Rejects hexadecimal", function () {
		expect(() => Deck.ydkToUrl("#main\n0xa\n#extra\n!side\n"))
			.to.throw(YdkConstructionError)
			.with.property("ydkError", "Unexpected value on line 2; 0xa");
	});
	it.skip("Rejects text", function () {
		expect(() => Deck.ydkToUrl("#main\n27204311\n#extra\n1561110\n!side\nI wish that some way, somehow\n"))
			.to.throw(YdkConstructionError)
			.with.property("ydkError", "Unexpected value on line 6; I wish that some way, somehow");
	});
	it.skip("Rejects decimals", function () {
		expect(() => Deck.ydkToUrl("#main\n27204311.0\n#extra\n1561110\n!side\nThat I could save every one of us\n"))
			.to.throw(YdkConstructionError)
			.with.property("ydkError", "Unexpected value on line 2; 27204311.0");
	});
	it.skip("Rejects trailing non-numeric characters", function () {
		expect(() => Deck.ydkToUrl("#main\n27204311\n#extra\n1561110,But the truth is that I'm only one girl\n!side\n"))
			.to.throw(YdkConstructionError)
			.with.property("ydkError", "Unexpected value on line 4; 1561110,But the truth is that I'm only one girl");
	});
});
describe("Deck information", function () {
	it("Deck sizes", function () {
		const deck = new Deck(url, cardArray);
		expect(deck.mainSize).to.equal(40);
		expect(deck.extraSize).to.equal(3);
		expect(deck.sideSize).to.equal(2);
	});
	it("Type counts", function () {
		const deck = new Deck(url, cardArray);
		let mainCounts = deck.mainTypeCounts;
		let extraCounts = deck.extraTypeCounts;
		let sideCounts = deck.sideTypeCounts;
		expect(mainCounts.monster).to.equal(40);
		expect(mainCounts.spell).to.equal(0);
		expect(mainCounts.trap).to.equal(0);
		expect(extraCounts.fusion).to.equal(3);
		expect(extraCounts.synchro).to.equal(0);
		expect(extraCounts.xyz).to.equal(0);
		expect(extraCounts.link).to.equal(0);
		expect(sideCounts.monster).to.equal(2);
		expect(sideCounts.spell).to.equal(0);
		expect(sideCounts.trap).to.equal(0);
		// go again to check memoisation
		mainCounts = deck.mainTypeCounts;
		extraCounts = deck.extraTypeCounts;
		sideCounts = deck.sideTypeCounts;
		expect(mainCounts.monster).to.equal(40);
		expect(extraCounts.fusion).to.equal(3);
		expect(sideCounts.monster).to.equal(2);
	});
	it("Deck contents", function () {
		const deck = new Deck(url, cardArray);
		let mainText = deck.mainText;
		let extraText = deck.extraText;
		let sideText = deck.sideText;
		expect(mainText).to.equal(
			"3 Blue-Eyes White Dragon\n3 Rabidragon\n3 Gogiga Gagagigo\n3 Spiral Serpent\n3 Phantasm Spiral Dragon\n3 Cosmo Queen\n3 Tri-Horned Dragon\n3 Suppression Collider\n3 Metal Armored Bug\n3 Sengenjin\n3 Dragon Core Hexer\n3 Hieratic Seal of the Sun Dragon Overlord\n3 Metaphys Armed Dragon\n1 Wingweaver"
		);
		expect(extraText).to.equal("3 Dragon Master Knight");
		expect(sideText).to.equal("2 Wingweaver");
		// go again to check memoisation
		mainText = deck.mainText;
		extraText = deck.extraText;
		sideText = deck.sideText;
		expect(mainText).to.equal(
			"3 Blue-Eyes White Dragon\n3 Rabidragon\n3 Gogiga Gagagigo\n3 Spiral Serpent\n3 Phantasm Spiral Dragon\n3 Cosmo Queen\n3 Tri-Horned Dragon\n3 Suppression Collider\n3 Metal Armored Bug\n3 Sengenjin\n3 Dragon Core Hexer\n3 Hieratic Seal of the Sun Dragon Overlord\n3 Metaphys Armed Dragon\n1 Wingweaver"
		);
		expect(extraText).to.equal("3 Dragon Master Knight");
		expect(sideText).to.equal("2 Wingweaver");
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
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAF!yV+/A8lfvwPJX78D!sdjfAbHY3wE=!";
const urlLargeMain =
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfAbHY3wGx2N8BFzzXABc81wAXPNcAaNiCAmjYggJo2IICTPZyAUz2cgFM9nIB8NpmAPDaZgDw2mYAnIU0ApyFNAKchTQCq25cBatuXAWrblwFoIeVBA==!yV+/A8lfvwPJX78D!!";
const urlLargeExtra =
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfAQ==!yV+/A8lfvwPJX78DTrLqBU6y6gVOsuoFj1kIBY9ZCAWPWQgF0iNuAdIjbgHSI24Bd5uTAnebkwJ3m5MCgZ1eAw==!sdjfAbHY3wE=!";
const urlLargeSide =
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfAQ==!yV+/A8lfvwPJX78D!sdjfAbHY3wEXPNcAFzzXABc81wBo2IICaNiCAmjYggJM9nIBTPZyAUz2cgHw2mYA8NpmAPDaZgCchTQCnIU0Ag==!";
const urlOCGCard =
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfATuR5QU=!yV+/A8lfvwPJX78D!sdjfAbHY3wE=!";
const urlLimitedCard =
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfAY2UeACNlHgA!yV+/A8lfvwPJX78D!sdjfAbHY3wE=!";
const urlOCGCardTCGLimited =
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfATuR5QWNlHgAjZR4AA==!yV+/A8lfvwPJX78D!sdjfAbHY3wE=!";
const urlTCGCard =
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfAcb5GQQ=!yV+/A8lfvwPJX78D!sdjfAbHY3wE=!";
const urlTCGCardOCGLimited =
	"ydke://o6lXBaOpVwWjqVcFep21BXqdtQV6nbUF8GFdAvBhXQLwYV0CLdjxAS3Y8QEt2PEBiWdgA4lnYAOJZ2AD0hVTAtIVUwLSFVMC9slUAvbJVAL2yVQCKYF+BSmBfgUpgX4FYW7uA2Fu7gNhbu4DlDaLBJQ2iwSUNosE0GpSAtBqUgLQalICTIHIAEyByABMgcgAXu5QBV7uUAVe7lAFsdjfAcb5GQSNlHgAjZR4AA==!yV+/A8lfvwPJX78D!sdjfAbHY3wE=!";

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
			name: "Nanana",
			target: 98931003,
			max: 0,
			actual: 1
		}); //"Nanana (98931003) not TCG-legal! Its scopes are OCG."
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
	it("Banlist", function () {
		const deck = new Deck(urlLimitedCard, cardArray);
		const errors = deck.validationErrors;
		expect(errors.length).to.equal(1);
		expect(errors[0]).to.deep.equal({
			type: "limit",
			target: 7902349,
			name: "Left Arm of the Forbidden One",
			max: 1,
			actual: 2
		}); //"Too many copies of Left Arm of the Forbidden One" (7902349)! Should be at most 1, is 2."
	});
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
	it("World-TCG fail", function () {
		const deck = new Deck(urlOCGCardTCGLimited, cardArray, "PrereleaseOnTCG");
		expect(deck.validationErrors.length).to.equal(1);
		expect(deck.validationErrors[0]).to.deep.equal({
			type: "limit",
			target: 7902349,
			name: "Left Arm of the Forbidden One",
			max: 1,
			actual: 2
		});
	});
	it("OCG pass", function () {
		const deck = new Deck(urlOCGCard, cardArray, "OCG");
		expect(deck.validationErrors.length).to.equal(0);
	});
	it("OCG fail - banlist", function () {
		const deck = new Deck(urlOCGCardTCGLimited, cardArray, "OCG");
		expect(deck.validationErrors.length).to.equal(1);
		expect(deck.validationErrors[0]).to.deep.equal({
			type: "limit",
			target: 7902349,
			name: "Left Arm of the Forbidden One",
			max: 1,
			actual: 2
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
			actual: 1
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
			target: 7902349,
			name: "Left Arm of the Forbidden One",
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
	"ydke://HkRQAh5EUAIeRFACMjzsAv2JnAX9iZwF/YmcBa3iCgKt4goCreIKAthv8QHYb/EB2G/xAa2z6gCts+oA5q4UBOauFATmrhQEn9rhAp/a4QKYwwkEJRhbANY1MQTWNTEEbuiIAOGJsAPeMuoFl6FUA9QWtgPWgi8CFMrfARTK3wEUyt8Bazw4BWs8OAVrPDgFrLHqBayx6gWsseoF9xlsA/cZbAM=!/R1iBP0dYgT9HWIE64zIAOGFIgWzzOYFlrpzAZa6cwHYBr8BzKK2AMHqAwPtaxUFJ1qkAfBkLgBs1ZQA!ryPeAK8j3gCvI94A1xqfAdcanwHXGp8BsskJBLLJCQS0/F4BQ77dAEO+3QCEJX4AHjeCAR43ggEeN4IB!";
const dino =
	"ydke://MjzsAtcanwHXGp8B1xqfAYwCIQGMAiEBtxvpBHD9yATrkkwC65JMAuuSTAKTgKQCk4CkApOApAIeRFACHkRQAh5EUAIU9SUCFPUlAh+r8QSistcFMZFGAkEh0gJBIdICQSHSAjhR7wI4Ue8COFHvAll7YwSOz94Ajs/eAMLHcgHCx3IBbOQGAWzkBgFs5AYB+7uoAvu7qAL7u6gC+wR4AvsEeAI=!lKVtBI1YjAKNWIwCjViMAp+QagBP4ewE3T/vA8JPQQCkmisAssVPBM3gIQDN4CEAiLcUBbTbgAK024AC!reIKAq3iCgKt4goCQ77dAEO+3QD63BQBwsdyAfiBrwT4ga8EqGeNBKhnjQSoZ40Eb3bvAG927wBvdu8A!";
const zooEldDog =
	"ydke://1xqfAdcanwHXGp8BMlCwBTJQsAWfOycEqfKzBbLJCQSyyQkEsskJBL83mQRIKZgDJIvkAeKjQgC8Qj8AryPeAK8j3gCvI94AOLFjBDixYwQ4sWMEakgeAGpIHgBqSB4AlaffAZWn3wGVp98B8dG+AmFWZwNhVmcDYVZnAwGEOgEBhDoBAYQ6AbbP8QSzLzoBsy86AbMvOgF5/o0Fef6NBQ==!Lk53AmvUzARr1MwEwRpyBNcV3wWXIWQFsKKvALCirwBDWHcCQ1h3AsE76gL8KG8E8sPuAqSaKwBpTOYF!MjzsAjKifQAyon0AMqJ9AB5EUAIeRFACHkRQAhiAQAAYgEAAGIBAAIQlfgCEJX4AhCV+AFEQgwOBFq4D!";
const invDogShad =
	"ydke://LxkiBS8ZIgUvGSIFryPeAK8j3gCvI94A1xqfAdcanwHXGp8BNALQBUgpmAOwjAoDsIwKA7zGzgG8xs4BhLg4APv3oQRyYEsAsHxzBLH0zAJZe2MEv4nXAr+J1wK/idcCakgeAGpIHgBqSB4AuhxqBLocagTaLV4AN2elAjdnpQI3Z6UCIkiZACJImQAiSJkAts/xBLbP8QRkmkABheFsAQ==!a9TMBDbJCAM2yQgDw8M2AcPDNgH2PKkF9jypBRawzAXMgvMCXch8BF3IfASqEUECXL8xBJpVEgLc+GgB!reIKAq3iCgKt4goC+9wUAcLHcgHCx3IBXWneAl1p3gJdad4ChCV+AIQlfgCEJX4AH9ZmAR/WZgEf1mYB!";
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
const birdUp =
	"ydke://7ZXWBe2V1gXtldYFSTQPAkk0DwK8F6IDWRbiAFkW4gBZFuIAIX1ZAyF9WQNXTgcDV04HA1dOBwPItDIFyLQyBci0MgUZesMB11RfBJcI4wCXCOMAMjzsAq8j3gCvI94AryPeAE73dQFO93UBTvd1AR5EUAIeRFACHkRQAmFWZwNhVmcDYVZnA4/3BAWP9wQFzZ2+Be4l/gTGqdoEkAYjAD6kcQFOCyYF!tNuAAsat6gPqqpkB6qqZAQSCHgMJoRsFdkvtAo6uTwTCT0EAHbXxBR218QW5k4EAHLblApchZAXBGnIE!reIKAq3iCgL9iZwF/YmcBdcanwHXGp8BhCV+AIQlfgD73BQBtPxeAYEWrgNvdu8Ab3bvAPsEeAL7BHgC!";
const maju =
	"ydke://dT0uAnU9LgJ1PS4CimE+BIphPgSKYT4EbjPOA24zzgMO9JQCDvSUAg70lAKfm2kFn5tpBZ+baQXHNEgDxzRIA8c0SANg6TMCYOkzAmDpMwK6jy4Fuo8uBbqPLgXBiF4EwYheBMGIXgS3G+kEFanrBRWp6wUVqesF7yX+BD8NGgI/DRoCPw0aAoSqRQKEqkUChKpFAl1p3gJdad4CXWneAg==!fFuxAc4CzQPujWoDrRyYBco/YAEWOpUBlyFkBflRfwSkmisA4890An6JQwO1TCsENbl2BH6vtQVc+KsA!bjPOA9HCeAXRwngF0cJ4BSPWnQIj1p0CI9adAvrcFAG0/F4BEWJxARFicQERYnEBH9ZmAR/WZgEf1mYB!";
const ba =
	"ydke://49akAOPWpADj1qQAYoDUBGKA1ARigNQEFKWiA3PAPAFzwDwBc8A8AYZlDQWGZQ0FLvBnAy7wZwNnwi0CZ8ItAnCnwANkSNgCNiZdBBsb4wSufHMErvTMAtotXgA+pHEBj/cEBY/3BAWP9wQFC0LGBAtCxgQLQsYEi+CeA4vgngOL4J4DqOY+AajmPgGo5j4B25VrAtuVawLblWsC+5oxA/uaMQP7mjEDtHVPArR1TwK0dU8CxlZEBMZWRAReHkoCXh5KAg==!sZb6BLGW+gT4aqQB3Rn4AHcwTQSXIWQFaUzmBeyufwNcvzEE2iPrA78OSQJVt1IExEQhBfqMGAGqEUEC!0cJ4BdHCeAXRwngF2kawBNpGsATaRrAEtxvpBPvcFAGBFq4Db3bvAG927wBvdu8A+wR4AvsEeAL7BHgC!";
const salad =
	"ydke://SdTQBEnU0ARJ1NAE2J0/BNidPwTYnT8ExkuaAS+yHQMvsh0DssmjBbLJowXEjFYDxIxWA2GbOgHBI1gFryPeAK8j3gCvI94AOLFjBDixYwQ4sWMEIkiZACJImQAiSJkAB8MTAFPTGwP4SNMD+EjTA8gxaAPIMWgDyDFoAz8NGgI/DRoCdWEPA3VhDwOK4+MAiuPjANuVawLblWsC25VrAg==!NwXiADcF4gA3BeIAlc48BZXOPAWVzjwFja14Ao2teAKkmisAjmCRA4FdzAIKNEAFxEQhBV9MZgXSG0EB!1xqfAdcanwHXGp8B/YmcBf2JnAX9iZwF+9wUAYQlfgCEJX4AtxvpBK3iCgKt4goCb3bvAG927wBvdu8A!";
const guru =
	"ydke://r/TMAq58cwTRwngF0cJ4BdHCeAXirfoA4q36AOKt+gAG9lsCVsl0BFbJdARWyXQE2i1eANotXgDaLV4AHjeCAR43ggGP9wQFj/cEBY/3BAXjNuEF4zbhBdX21gDV9tYAHZ4NBFl7YwQW8FYAFvBWABbwVgBi7nIEYu5yBB/WZgEf1mYBH9ZmARFicQERYnEB25VrAtuVawL7BHgC+wR4AvsEeAI=!qhFBAqoRQQKqEUECTMchBWvUzARr1MwEviOnAr4jpwKtoyMFraMjBbTbgAJcvzEEXL8xBO1rFQV/+B0E!1xqfAdcanwHXGp8BQ77dAEO+3QD73BQBj/+kAI//pACP/6QAqOY+AajmPgF12HYDddh2AzTjwgE048IB!";
const adaPrank =
	"ydke://D3esAA93rAAPd6wAu1rkArta5AK7WuQCwvMeBcLzHgXC8x4FPTu+AIyB0QSMgdEEjIHRBFBHrwJQR68CUEevAqXQNAXYnT8E2J0/BMfznACuvN8BrrzfAa683wE9TFIDWw2DAlsNgwIeRFACHkRQAh5EUAIyPOwCryPeAK8j3gCvI94APT1ZBD09WQQ9PVkE7iX+BKfrowKn66MCzf3jBQ==!J1qkAbiBCQN5apAAHBxbBHte8AHSG0EBxEQhBcJPQQC/DkkCPT4JAc5QhgDB6gMD2iPrA46JiAGNJ5gD!1xqfAdcanwHXGp8BJpBCAyaQQgMmkEID2J0/BIAQcQAu8/0BcnXXAjW0vgSkmisA+9wUAR43ggE+pHEB!";
const dolche =
	"ydke://ryPeAK8j3gCt4goCreIKAq3iCgLkdwcB5HcHAeR3BwHooB8D6KAfAzsatQA7GrUAOxq1AKIuEQKiLhECoi4RAqTgowSk4KMEpOCjBJXucgQP53EFD+dxBZUQxgCVEMYAj/cEBY/3BAWP9wQFwsdyAcLHcgHCx3IBPqRxAbm1mgNlskAEZbJABGWyQAQWpdUASggQBEoIEAQHCMEEN2PhAQ==!lSOkApUjpAJVFTcCVRU3As5qNgHOajYBzmo2AZgluwWYJbsFi0cbA5chZAUJWmMA0htBAZ+QagARubgF!1xqfAdcanwHXGp8BryPeAP2JnAX9iZwF/YmcBR43ggEeN4IBHjeCAYQlfgCEJX4AhCV+APvcFAG0/F4B!";
const numer =
	"ydke://reIKAq3iCgKvI94AryPeAGDpMwJg6TMC7I8BAOyPAQCYhMIEq25cBTI87ALbPYYC2z2GAts9hgKKI9AFiiPQBYoj0AUeRFACHkRQAlATnQRQE50EwsdyAcLHcgHCx3IBQ77dAEO+3QBW5QwFVuUMBVblDAWb+tYAm/rWAJv61gBkAHgCZAB4AmQAeAIeN4IBHjeCAVl7YwT73BQBPqRxAbT8XgE=!wRpyBJOLJQXpbugA6W7oALFihAKxYoQCqLqvBKi6rwTRUz0A0VM9APVeeATCT0EAweoDA3/4HQS/DkkC!WqI1Af2JnAX9iZwF/YmcBZzhvQCc4b0AkvrlAZL65QFgdPcEYHT3BPsEeAL7BHgC25VrAtuVawLblWsC!";

const themes: { [theme: string]: string[] } = {
	"Mekk-Knight": [mekkKnight],
	"Mystic Mine": [mysticMine],
	"Virtual World": [virtualWorld],
	Drytron: [drytron],
	"Infernoble Knight": [infernoble],
	"Dragon Link": [dLink],
	Dinosaur: [dino],
	Zoodiac: [zooEldDog],
	Eldlich: [zooEldDog],
	Invoked: [mekkKnight, invDogShad],
	Dogmatika: [invDogShad, dogBlader, zooEldDog],
	"Phantom Knight": [phantKnights],
	"Prank-Kids": [prankKids, adaPrank],
	"Buster Blader": [dogBlader],
	"Sky Striker": [striker],
	Altergeist: [geist],
	Shaddoll: [invDogShad],
	"Tri-Brigade": [birdUp],
	Lyrilusc: [birdUp],
	"Gren Maju": [maju],
	"Burning Abyss": [ba],
	Salamangreat: [salad],
	Subterror: [guru],
	Adamancipator: [adaPrank],
	Madolche: [dolche],
	Numeron: [numer]
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
