import { Editor, MarkdownView, Plugin, Notice } from "obsidian";
import { formatWeChatReader } from "src/format";

function getStartAndEndPos(editor: Editor) {
	const startPosition = { line: -1, ch: 0 };
	const endPosition = {
		line: editor.lastLine(),
		ch: editor.getLine(editor.lastLine()).length,
	};
	return [startPosition, endPosition];
}

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

function getNewFileName(oldPath: string, bookName: string) {
	let items = oldPath.split("/");
	items[items.length - 1] = `${bookName}.md`;
	return items.join("/");
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "wechat-read-format",
			name: "微信读书",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const oldFile = editor.getValue();
				const [bookName, newFile] = formatWeChatReader(oldFile);

				if (!bookName) {
					new Notice("格式化失败，无法获取书名!");
					return;
				}

				const [start, end] = getStartAndEndPos(editor);

				editor.replaceRange(newFile, start, end);

				const currentFile =
					this.app.workspace.getActiveViewOfType(MarkdownView)?.file; // 获取当前 Markdown 文件

				if (currentFile) {
					console.log(currentFile.path);
					let newName = getNewFileName(currentFile.path, bookName);
					console.log(newName);
					this.app.vault.rename(currentFile, newName);
				}
			},
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
