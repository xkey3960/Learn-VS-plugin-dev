// The module 'vscode' contains the VS Code extensibility API

const vscode = require('vscode');
const testView = require('./testTree');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "learning-tree-view" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('projMnger.editEntry', function (node) {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage(node.tooltip);

		let rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 
					? vscode.workspace.workspaceFolders[0].uri.fsPath
					: undefined

		let fullPath = path.join(rootPath, "tasks", node.tooltip);
		try {
			const document = vscode.workspace.openTextDocument(fullPath);
			vscode.window.showTextDocument(document);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to open file: ${error.message}`);
		}

	});
	context.subscriptions.push(disposable);

	const nodeTasksProvider = new testView.TestNodeTasksProvider(rootPath);
	vscode.window.registerTreeDataProvider('projMnger', nodeTasksProvider);
	vscode.commands.registerCommand('projMnger.refreshEntry', () => nodeTasksProvider.refresh())
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
