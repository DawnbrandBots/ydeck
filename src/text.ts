import { countStrings } from "./counts";
import { CardArray } from "./deck";

export function generateText(deck: Uint32Array, data: CardArray): string {
	const names = [...deck].map(code => data[code].name);
	const counts = countStrings(names);
	return Object.keys(counts)
		.map(name => `${counts[name]} ${name}`)
		.join("\n");
}
