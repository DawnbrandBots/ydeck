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

export function cardLimiterFor(scopeCheck: (scope: number) => boolean, statusRegex?: RegExp): CardLimiter {
	return async function (card) {
		if (scopeCheck(card.scope)) {
			if (statusRegex) {
				const result = statusRegex.exec(card.status);
				return result ? parseInt(result[1], 10) : /* istanbul ignore next */ -1;
			} else {
				return 3;
			}
		}
		return 0;
	};
}

const SCOPE_OCG = 0x1;
const SCOPE_TCG = 0x2;
const SCOPE_PRERELEASE = 0x100;

export const TCG: CardLimiter = cardLimiterFor(
	scope => (scope & (SCOPE_TCG | SCOPE_PRERELEASE)) == SCOPE_TCG,
	/TCG: (\d)/
);

export const TCGPrerelease: CardLimiter = cardLimiterFor(scope => (scope & SCOPE_TCG) == SCOPE_TCG, /TCG: (\d)/);

export const PrereleaseOnTCG: CardLimiter = cardLimiterFor(scope => !!(scope & (SCOPE_TCG | SCOPE_OCG)), /TCG: (\d)/);

export const OCG: CardLimiter = cardLimiterFor(
	scope => (scope & (SCOPE_OCG | SCOPE_PRERELEASE)) == SCOPE_OCG,
	/OCG: (\d)/
);

export const OCGPrerelease: CardLimiter = cardLimiterFor(scope => (scope & SCOPE_OCG) == SCOPE_OCG, /OCG: (\d)/);

export const PrereleaseOnOCG: CardLimiter = cardLimiterFor(scope => !!(scope & (SCOPE_TCG | SCOPE_OCG)), /OCG: (\d)/);
