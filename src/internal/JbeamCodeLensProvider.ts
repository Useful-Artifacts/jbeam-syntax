import {
  CodeLensProvider,
  TextDocument,
  CodeLens,
  CancellationToken,
  Range,
  Position,
  workspace,
  Uri,
  ProviderResult,
  window,
  extensions
} from "vscode";
import { linePreProcess, populateCleanData } from "./utils";

export class JbeamCodeLensProvider implements CodeLensProvider {
  document?: TextDocument;
  cleanData: any;

  constructor(cleanData: any) {
    this.cleanData = cleanData;
  }

  provideCodeLenses(
    document: TextDocument,
    token: CancellationToken
  ): ProviderResult<CodeLens[]> {
    return [];
    
    if (token.isCancellationRequested) return;
    this.document = document;

    const lenses: CodeLens[] = [];
    let cleanDoc = this.cleanData.get(document.uri);
    if (!cleanDoc) populateCleanData(this.cleanData);
    cleanDoc = this.cleanData.get(document.uri);
    cleanDoc.keys.forEach((key: string) => {
      if (key.startsWith("slotType")) {
        let slotType = cleanDoc.get(key);
        if (slotType) {
          let lens = this.slotTypeReferencesLens(slotType.line, slotType.value);
          if (lens) lenses.push(lens);
        }
      }
    });
    return lenses;
  }

  slotTypeReferencesLens(lineNumber: number, line: string): CodeLens {
    let slotType = line
      .slice(line.search(':')+1)
      .replace(",", "")
      .replace(/\u0022/g, "")
      .trim();
      
    let refCount = this.findReferencesCount(slotType);
    let result: CodeLens = new CodeLens(
      new Range(new Position(lineNumber, 0), new Position(lineNumber, line.length)),
      {
        command: "jbeam.showSlotTypeReferences",
        title: `${slotType} (${refCount} reference${refCount > 1 ? "s" : ""})`,
        arguments: [lineNumber],
      }
    );
    return result;
  }

  findReferencesCount(slotType: string): number {
    let count = 0;
    workspace.textDocuments.forEach((doc) => {
      if (doc.fileName.endsWith(".jbeam") && !(doc.uri == this.document?.uri)) {
        let textContent = doc.getText();
        let lines = textContent.split("\n");
        lines.forEach((line) => {
          line = linePreProcess(line);
          if (line.trim().startsWith('["')) {
            let typeInFile = line.trim()
              .slice(2, line.slice(2).search('"'))
              .trim();
            if (typeInFile === slotType) {
              count++;
            }
          }
        });
      }});
    return count;
  }
  findLineContaining(s: string): number {
    let textContent = this.document?.getText();
    if (!textContent) return -1;
    let lines = textContent.split("\n");
    let lineCount = lines.length;
    for (let i = 0; i < lineCount; i++) {
      let line = lines[i];
      if (line.includes(s)) {
        return i;
      }
    }
    return -1;
  }
}
