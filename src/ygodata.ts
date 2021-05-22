import { CardArray } from ".";
import { Card } from "./Card";
import { CardVector } from "./check";

export type CardLimiter = (card?: Card) => number;

export function banlistCardVector(cards: CardArray, allowed: CardLimiter): CardVector {
	const vector: CardVector = {};
	for (const passcode in cards) {
		vector[passcode] = allowed(cards[passcode]);
	}
	return vector;
}

export function cardLimiterFor(scopeCheck: (scope: number) => boolean, banlistScope: scopes): CardLimiter {
	return function (card) {
		if (card && scopeCheck(card.scope)) {
			if (banlistScope in card.status) {
				return card.status[banlistScope];
			} else {
				return 3;
			}
		}
		return 0;
	};
}

export enum scopes {
	SCOPE_OCG = 0x1,
	SCOPE_TCG = 0x2,
	SCOPE_PRERELEASE = 0x100
}

// TCG cards, no prereleases, TCG banlist
const TCG: CardLimiter = cardLimiterFor(
	scope => (scope & (scopes.SCOPE_TCG | scopes.SCOPE_PRERELEASE)) == scopes.SCOPE_TCG,
	scopes.SCOPE_TCG
);

// TCG cards, prereleases, TCG banlist
const TCGPrerelease: CardLimiter = cardLimiterFor(
	scope => (scope & scopes.SCOPE_TCG) == scopes.SCOPE_TCG,
	scopes.SCOPE_TCG
);

// TCG or OCG cards, prereleases, TCG banlist
const PrereleaseOnTCG: CardLimiter = cardLimiterFor(
	scope => !!(scope & (scopes.SCOPE_TCG | scopes.SCOPE_OCG)),
	scopes.SCOPE_TCG
);

// OCG cards, no prereleases, OCG banlist
const OCG: CardLimiter = cardLimiterFor(
	scope => (scope & (scopes.SCOPE_OCG | scopes.SCOPE_PRERELEASE)) == scopes.SCOPE_OCG,
	scopes.SCOPE_OCG
);

// OCG cards, prereleases, OCG banlist
const OCGPrerelease: CardLimiter = cardLimiterFor(
	scope => (scope & scopes.SCOPE_OCG) == scopes.SCOPE_OCG,
	scopes.SCOPE_OCG
);

// TCG or OCG cards, prereleases, OCG banlist
const PrereleaseOnOCG: CardLimiter = cardLimiterFor(
	scope => !!(scope & (scopes.SCOPE_TCG | scopes.SCOPE_OCG)),
	scopes.SCOPE_OCG
);

export const cardLimiters: { [name: string]: CardLimiter } = {
	TCG,
	TCGPrerelease,
	PrereleaseOnTCG,
	OCG,
	OCGPrerelease,
	PrereleaseOnOCG
};
