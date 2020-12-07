import { Card } from "./Card";
import { CardVector } from "./check";
import { CardArray } from "./deck";

export type CardLimiter = (card: Card) => Promise<number>;

export async function banlistCardVector(cards: CardArray, allowed: CardLimiter): Promise<CardVector> {
	const vector: CardVector = {};
	for (const passcode in cards) {
		vector[passcode] = await allowed(cards[passcode]);
	}
	return vector;
}

export function cardLimiterFor(scopeCheck: (scope: number) => boolean, banlistScope: scopes): CardLimiter {
	return async function (card) {
		if (scopeCheck(card.scope)) {
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

export const TCG: CardLimiter = cardLimiterFor(
	scope => (scope & (scopes.SCOPE_TCG | scopes.SCOPE_PRERELEASE)) == scopes.SCOPE_TCG,
	scopes.SCOPE_TCG
);

export const TCGPrerelease: CardLimiter = cardLimiterFor(
	scope => (scope & scopes.SCOPE_TCG) == scopes.SCOPE_TCG,
	scopes.SCOPE_TCG
);

export const PrereleaseOnTCG: CardLimiter = cardLimiterFor(
	scope => !!(scope & (scopes.SCOPE_TCG | scopes.SCOPE_OCG)),
	scopes.SCOPE_TCG
);

export const OCG: CardLimiter = cardLimiterFor(
	scope => (scope & (scopes.SCOPE_OCG | scopes.SCOPE_PRERELEASE)) == scopes.SCOPE_OCG,
	scopes.SCOPE_OCG
);

export const OCGPrerelease: CardLimiter = cardLimiterFor(
	scope => (scope & scopes.SCOPE_OCG) == scopes.SCOPE_OCG,
	scopes.SCOPE_OCG
);

export const PrereleaseOnOCG: CardLimiter = cardLimiterFor(
	scope => !!(scope & (scopes.SCOPE_TCG | scopes.SCOPE_OCG)),
	scopes.SCOPE_OCG
);
