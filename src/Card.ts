interface StatusMap {
	[status: number]: number;
}

export class Card {
	public name: string;
	public scope: number;
	public type: number;
	public setcode: number;
	public status: StatusMap;
	constructor(name: string, scope: number, type: number, setcode: number, status: StatusMap) {
		this.name = name;
		this.scope = scope;
		this.type = type;
		this.setcode = setcode;
		this.status = status;
	}
	public isType(type: number): boolean {
		return (this.type & type) === type;
	}
	public isSetcode(code: number): boolean {
		let tempCode = this.setcode;
		const codes: number[] = [];
		while (tempCode > 0) {
			codes.push(tempCode & 0xffff);
			tempCode = tempCode >> 16;
		}
		for (const c of codes) {
			// 4th digit is for extensions
			if (code === c || code === (c & 0xfff)) {
				return true;
			}
		}
		return false;
	}
}
