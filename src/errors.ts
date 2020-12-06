export class ConstructionError extends Error {}

export class UrlConstructionError extends ConstructionError {
	constructor() {
		super("Invalid input to Deck constructor: Could not parse a YDKE URL.");
	}
}

export class YdkConstructionError extends ConstructionError {
	missingSection: string;

	constructor(missingSection: string) {
		super(`Error in YDK format: Missing section ${missingSection}.`);
		this.missingSection = missingSection;
	}
}
