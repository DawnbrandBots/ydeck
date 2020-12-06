import { getCardList } from "./data";

export async function generateText(deck: Uint32Array): Promise<string> {
	const list = await getCardList();
	const names = [...deck].map(code => list[code].text.en.name);
	const counts = names.reduce<{ [element: string]: number }>((acc, curr) => {
		acc[curr] = (acc[curr] || 0) + 1;
		return acc;
	}, {});
	return Object.keys(counts)
		.map(name => `${counts[name]} ${name}`)
		.join("\n");
}
