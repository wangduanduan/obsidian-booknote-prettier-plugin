interface Item {
	createAt: Date;
	comment: string;
	quote: string;
}

interface Note {
	title: string;
	author: string[];
	notesCountDesc: string;
	item: Item[];
}

enum ItemType {
	Header,
	CreateTime,
	Quote,
	Comment,
}

const CreateTimeReg = /^\d{4}\/\d{2}\/\d{2}/;

function getType(line: string): ItemType {
	if (line.startsWith("◆")) {
		return ItemType.Header;
	}

	if (line.startsWith(">>")) {
		return ItemType.Quote;
	}

	if (CreateTimeReg.test(line)) {
		return ItemType.CreateTime;
	}

	return ItemType.Comment;
}

function parseAuthor(author: string) {
	return author
		.split(" ")
		.map((v) => `#${v}`)
		.join(" ");
}

export function formatWeChatReader(input: string): string[] {
	if (!input) {
		return ["", ""];
	}

	const lines = input.split("\n").filter((item) => item.length > 0);
	const newFile: string[] = [];
	let bookName = "";

	for (let i = 0; i < lines.length; i++) {
		if (i === 0) {
			// parse Title
			//newFile.push(`# ${lines[i]}`);
			bookName = lines[i].substring(1, lines[i].length - 1);
			continue;
		}

		if (i === 1) {
			// parse author
			newFile.push(parseAuthor(lines[i]));
			continue;
		}

		if (i === 2) {
			// parse notesCountDesc
			newFile.push(`*${lines[i]}*`);
			continue;
		}

		console.log(lines[i]);

		switch (getType(lines[i])) {
			case ItemType.Comment:
				newFile.push(`📝 **${lines[i]}**`);
				break;
			case ItemType.CreateTime:
				newFile.push(`*${lines[i]}*`);
				break;
			case ItemType.Header:
				newFile.push("\n---");
				newFile.push(`##### ${lines[i].substring(1)}`);
				break;
			case ItemType.Quote:
				newFile.push(`${lines[i].substring(1)}\n`);
				break;
		}
	}

	return [bookName, newFile.join("\n")];
}

export function getBookName(name: string) {}
