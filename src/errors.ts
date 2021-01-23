export class ConstructionError extends Error {}

export class UrlConstructionError extends ConstructionError {
	constructor() {
		super("Invalid input to Deck constructor: Could not parse a YDKE URL.");
	}
}

export class LimiterConstructionError extends ConstructionError {
	constructor() {
		super("Invalid limiter selection. Leave blank to default to TCG.");
	}
}

export class YdkConstructionError extends ConstructionError {
	constructor(readonly ydkError: string) {
		super(`Error in YDK format: ${ydkError}.`);
	}
}
