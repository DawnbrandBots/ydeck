import { expect } from "chai";
import { describe } from "mocha";
import { Deck } from "../deck";

const url =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBPqRxAZ4TygSeE8oEnhPKBKUt9QOlLfUDpS31AyJImQAiSJkAIkiZAA==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";

const ydk =
	"#created by AlphaKretin\n#main\n99249638\n99249638\n46659709\n46659709\n46659709\n65367484\n65367484\n65367484\n43147039\n30012506\n30012506\n30012506\n77411244\n77411244\n77411244\n3405259\n3405259\n3405259\n89132148\n39890958\n14558127\n14558127\n14558127\n32807846\n73628505\n12524259\n12524259\n12524259\n24224830\n24224830\n24224830\n80352158\n80352158\n80352158\n66399653\n66399653\n66399653\n10045474\n10045474\n10045474\n#extra\n1561110\n10443957\n10443957\n58069384\n58069384\n73289035\n581014\n21887175\n4280258\n38342335\n2857636\n75452921\n50588353\n83152482\n65741786\n!side\n43147039\n";

const ydkMainOnly =
	"#created by AlphaKretin (Luna)\n#main\n27204311\n27204311\n27204311\n31759689\n94142993\n94142993\n12678601\n94365540\n26517393\n26517393\n26517393\n68860936\n11375683\n81035362\n10802915\n10802915\n10802915\n48468330\n14558127\n14558127\n14558127\n24158464\n24158464\n24158464\n84211599\n84211599\n84211599\n24224830\n10045474\n10045474\n10045474\n20899496\n20899496\n20899496\n82956214\n82956214\n82956214\n99157310\n99157310\n99157310\n#extra\n!side\n";

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
