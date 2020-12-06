import { expect } from "chai";
import { describe } from "mocha";
import { Deck } from "../deck";

const url =
	"ydke://5m3qBeZt6gV9+McCffjHAn34xwK8beUDvG3lA7xt5QMfX5ICWvTJAVr0yQFa9MkBrDOdBKwznQSsM50Ey/UzAMv1MwDL9TMAdAxQBQ6wYAKvI94AryPeAK8j3gCmm/QBWXtjBOMavwDjGr8A4xq/AD6kcQE+pHEBPqRxAZ4TygSeE8oEnhPKBKUt9QOlLfUDpS31AyJImQAiSJkAIkiZAA==!FtIXALVcnwC1XJ8AiBF2A4gRdgNLTV4Elt0IAMf4TQHCT0EAvw5JAqSaKwD5UX8EweoDA2LO9ATaI+sD!H1+SAg==!";

const badUrl =
	"Cuz we're gonna shout it loud, even if our words seem meaningless, like we're carrying the weight of the world";

describe("Basic test", function () {
	it("Successful construction", function () {
		expect(Deck.bind(Deck, url)).to.not.throw;
	});
	it("Failed construction", function () {
		expect(Deck.bind(Deck, badUrl)).to.throw;
	});
});
