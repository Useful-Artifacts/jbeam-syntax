import * as vscode from 'vscode';

export function jbeamDocPreprocess(doc: vscode.TextDocument): string{
  let outText = "";
  let text = doc.getText();
  let lines = text.split("\n");
  let lineCount = lines.length;
  for (let i = 0; i < lineCount-1; i++) {
      let line = lines[i];
      outText += uncomment(line) + "\n";
  }
  return outText;
}

export function linePreProcess(line:string): string {
    if (line.trim().startsWith("//")) {
      return "";
    }
    if (line.search("//") !== -1) {
      line = line.slice(0, line.search("//"));
    }
    return line.trim();
  }

export function uncomment(line: string): string {
    let commentStart = line.search("//");
    if (commentStart === -1) {
      return line;
    }
    return line.slice(0, commentStart);
  }