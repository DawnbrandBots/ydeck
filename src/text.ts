import { CardIndex } from ".";

export function generateText(deck: Uint32Array, data: CardIndex): string {
	const names = [...deck].map(code => data.get(code)?.name || code.toString());
	const counts = names.reduce<{ [element: string]: number }>((acc, curr) => {
		acc[curr] = (acc[curr] || 0) + 1;
		return acc;
	}, {});
	return Object.keys(counts)
		.map(name => `${counts[name]} ${name}`)
		.join("\n");
}
