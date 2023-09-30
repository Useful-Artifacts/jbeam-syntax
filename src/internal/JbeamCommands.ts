import * as vscode from 'vscode';

export function dumpInternalData(context: vscode.ExtensionContext, outChannel: vscode.OutputChannel){
    outChannel.append(context.extension.exports.cleanData);
}