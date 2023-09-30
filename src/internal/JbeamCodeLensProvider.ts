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
  window
} from "vscode";
import { linePreProcess, uncomment } from "./utils";

export class JbeamCodeLensProvider implements CodeLensProvider {
  document?: TextDocument;
  
  provideCodeLenses(
    document: TextDocument,
    token: CancellationToken
  ): ProviderResult<CodeLens[]> {
    this.document = document;
    const lenses: CodeLens[] = [];
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      let result = this.analyzeLine(line.text, i);
      if (result !== null) {
        lenses.push(result);
      }
    };
    return lenses;
  }
  analyzeLine(line: string, lineNumber: number): CodeLens | null {
    if (line.trim().startsWith("//")) {
      return null;
    }
    if (line.search("//") !== -1) {
      line = line.slice(0, line.search("//"));
      if (line.trim() === "") {
        return null;
      }
    }
    if (line.trim().startsWith('"slotType"')) {
      return this.slotTypeReferencesLens(lineNumber, line);
    }
    return null;
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
}
