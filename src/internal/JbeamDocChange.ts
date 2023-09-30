import { TextDocumentChangeEvent } from "vscode";
import * as vscode from "vscode";

import { jbeamDocPreprocess, uncomment } from "./utils";

export function jbeamDocChangeHandler(
  textDoc: vscode.TextDocumentChangeEvent,
  outChannel: any,
  diagnosticCollection: vscode.DiagnosticCollection
) {
  if (!textDoc.document.uri.fsPath.endsWith(".jbeam")) return;
  if (textDoc.contentChanges.length < 1) return;
  
  diagnosticCollection.clear();
  let diagnosticsArray: vscode.Diagnostic[] = [];
  let text = jbeamDocPreprocess(textDoc.document);
  let lines = text.split("\n");
  let lineCount = lines.length;
  for (let i = 0; i < lineCount-1; i++) {
    let line = lines[i];
    lineEndingDiagnostic(textDoc.document.fileName, i, line, diagnosticsArray);
  }
  diagnosticCollection.set(textDoc.document.uri, diagnosticsArray);
}

function lineEndingDiagnostic(
  filename: string,
  lineNum: number,
  line: string,
  diagnosticsArray: vscode.Diagnostic[]
): void {
  if (line.trim().length == 0) return;
  let shouldAbort = false;
  
  const acceptableLastChars = ["[", "{", ","];
  acceptableLastChars.forEach((char) => {
    if (lineEndingComparison(line, char)) {
      shouldAbort = true;
    }
  });
  if (shouldAbort) return;

  let location = new vscode.Location(
    vscode.Uri.file(filename),
    new vscode.Range(
      lineNum,
      Math.max(line.length - 1, 0),
      lineNum,
      Math.max(line.length, 0)
    )
  );
  let diagnostic = makeDiagnostic(location, "Missing comma");
  diagnostic.code = "jbeam-syntax-missing-comma";
  diagnostic.relatedInformation = [
    new vscode.DiagnosticRelatedInformation(location, "Possible missing comma"),
  ];
  diagnosticsArray.push(diagnostic);
}

function makeDiagnostic(
  location: vscode.Location,
  message: string,
  severity: vscode.DiagnosticSeverity = vscode.DiagnosticSeverity.Warning
): vscode.Diagnostic {
  let diagnostic = new vscode.Diagnostic(location.range, message, severity);
  return diagnostic;
}

function lineEndingComparison(line: string, containing: string): boolean {
  return line.trim().endsWith(containing);
}
