import * as vscode from "vscode";

import { JbeamCodeLensProvider } from "./internal/JbeamCodeLensProvider";
import { jbeamDocChangeHandler } from "./internal/JbeamDocChange";
import { dumpInternalData } from "./internal/JbeamCommands";
import { populateCleanData } from "./internal/utils";

let diagnostics: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection("jbeam");
let cleanData: any = {};

function initSubscriptions(context: vscode.ExtensionContext, cleanData:any) {
	let sel = { scheme: "file", language: "jbeam" };
	const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
		sel,
		new JbeamCodeLensProvider(cleanData),
	);

	context.subscriptions.push(codeLensProviderDisposable);
	context.subscriptions.push(diagnostics);
}

export function activate(context: vscode.ExtensionContext) {
	populateCleanData(cleanData);
	let outChannel = vscode.window.createOutputChannel("Jbeam Syntax", "jbeam");
	initSubscriptions(context, cleanData);
	
	vscode.workspace.onDidChangeTextDocument((e) => jbeamDocChangeHandler(e, outChannel, diagnostics, cleanData));
	vscode.window.showInformationMessage("Jbeam Syntax active");
	vscode.commands.registerCommand("jbeam-syntax.dumpInternalData", () => dumpInternalData(context, outChannel));
	return {outChannel, diagnostics, cleanData};
}

export function deactivate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("Jbeam Syntax deactivated");
}
