import * as vscode from "vscode";

import { JbeamCodeLensProvider } from "./internal/JbeamCodeLensProvider";

import { jbeamDocChangeHandler } from "./internal/JbeamDocChange";

let diagnostics: vscode.DiagnosticCollection =
    vscode.languages.createDiagnosticCollection("jbeam");

function initSubscriptions(
  context: vscode.ExtensionContext,
  outChannel: vscode.OutputChannel
) {
  let sel = { scheme: "file", language: "jbeam" };
  const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
    sel,
    new JbeamCodeLensProvider()
  );

  context.subscriptions.push(codeLensProviderDisposable);
  context.subscriptions.push(diagnostics);
}

export function activate(context: vscode.ExtensionContext) {
  let outChannel = vscode.window.createOutputChannel("Jbeam Syntax", "jbeam");
  initSubscriptions(context, outChannel);

  vscode.workspace.onDidChangeTextDocument((e) =>
    jbeamDocChangeHandler(e, outChannel, diagnostics)
  );
  vscode.window.showInformationMessage("Jbeam Syntax active");
}

// This method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("Jbeam Syntax deactivated");
}
