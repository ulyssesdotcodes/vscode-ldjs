'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ldjs from 'lambda-designer-js';
import * as net from 'net';
import * as path from 'path';
import { Either, tryCatch, isLeft } from 'fp-ts/lib/Either';
import * as parsedops from './parsedjs.json'

let config = vscode.workspace.getConfiguration('ldjs')

let replcache = []

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


class Socket {
	readonly SERVER_URL = config.get<string>('server_url');
	readonly SERVER_PORT = config.get<number>('server_port');
	timeout: number = 1000;
	socket: net.Socket;
	connected: boolean = false;

	constructor() {
		this.socket = new net.Socket();
		this.socket.on('connect', this.connectHandler.bind(this));
		this.socket.on('timeout', this.timeoutHandler.bind(this));
		this.socket.on('close', this.closeHandler.bind(this));
		this.socket.on('error', () => {});
	}

	connectHandler() {
		this.connected = true;
	}

	closeHandler() {
		this.connected = false;
		setTimeout(this.makeConnection.bind(this), this.timeout);
	}

	timeoutHandler() {
		setTimeout(this.makeConnection.bind(this), this.timeout);
	}

	makeConnection() {
		this.socket.connect(config.get<number>('server_port'), config.get<string>('server_url'));
	}

	send(message: string) {
		if(this.connected) {
			this.socket.write(message + "\n");
		}
    }
    
    dispose() {
        this.socket.destroy()
    }
}

class LDJSBridge {
    private _outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel("ldjs")
    private socket = new Socket();
    private lastText;
    private fileUri;

    public constructor(fileUri){
        this.socket.makeConnection();
        this.fileUri = fileUri
        this._outputChannel.show();
    }

    public update(){
        if(vscode.window.activeTextEditor.document.uri.fsPath !== this.fileUri.fsPath) { return; }
        let text = vscode.window.activeTextEditor.document.getText();
        if(text != this.lastText) {
            this.lastText = text;
            this._outputChannel.clear()
            this.runForStatus(text).slice(0, 8).map(l => this._outputChannel.appendLine(l))
        }
    }

    run(obj: string) {
        let replaced = obj.replace(/\n/g, "\\n").replace(/"/g, "\\\'");
        obj = obj.replace("CommandCode", '`""' + replaced + '""`')
        return Function("return (function(c, v, require) { return v((function() { " + obj + " })())})")()(ldjs, (ns) => ldjs.validateNodes(ns).map(n => ldjs.nodesToJSON(ns)), (v) => {
            let docuri = vscode.window.activeTextEditor.document.uri.fsPath
            let lastIndex = docuri.lastIndexOf('/')
            lastIndex = lastIndex == -1 ? docuri.lastIndexOf('\\') : lastIndex;
            let docpath = path.normalize(docuri.substr(0, lastIndex + 1) + v)
            if(replcache.indexOf(docpath) == -1) {
                replcache.push(docpath);
            }
            return require(docpath);
        })
    }

    runForStatus(text) {
        let result: Either<string[], string> = tryCatch<Either<string[], string>>(() => {
            return this.run(text) as Either<string[], string>
        }).mapLeft(e => {
            return [e.message].concat(e.stack.split('\n'))
        }).chain(r => r)
        if(result.isRight()) {
            this.socket.send(result.value);
            return ["Correct"];
        } else {
            return result.value;
        }
    }

    dispose() {
        this.socket.dispose();
        this._outputChannel.dispose();
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Activated ldjs');
    var bridge = undefined;

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let bridgeupdate;
    let startcmd;
    let start = vscode.commands.registerCommand('extension.ldjsstart', () => {
        bridge = new LDJSBridge(vscode.window.activeTextEditor.document.uri)
        bridgeupdate = debounce(bridge.update.bind(bridge), 200, false)
        startcmd = vscode.window.onDidChangeTextEditorSelection((e) => {
            if (bridgeupdate != undefined) {
                bridgeupdate();
            }
        })
        context.subscriptions.push(startcmd);
    });

    let run = vscode.commands.registerCommand('extension.ldjsrun', () => {
        bridgeupdate = undefined
        if(startcmd != undefined) {
            startcmd.dispose();
            startcmd = undefined;
        }
        bridge = bridge !== undefined ? bridge : new LDJSBridge(vscode.window.activeTextEditor.document.uri)
        bridge.update()
    });


    let end = vscode.commands.registerCommand('extension.ldjsend', () => {
        if(bridge != undefined) {
            bridge.dispose();
            bridge = undefined;
        }
        if(startcmd != undefined) {
            startcmd.dispose();
            startcmd = undefined
        }
        bridgeupdate = undefined;
    });

    let clearRequire = vscode.commands.registerCommand('extension.ldjsclearrequire', () => {
        for(let path of replcache) {
            delete require.cache[path]
        }
        replcache = []
    });

    let lookupparam = vscode.commands.registerCommand('extension.ldjslookupparam', async () => {
        let editor = vscode.window.activeTextEditor;
        let linenum = editor.selection.start.line;
        let op = undefined;
        while (linenum > 0 && (op == null || op == undefined)) {
            console.log(op)
            let line = editor.document.lineAt(linenum);
            console.log("finding...")
            let matches = /(top|chop|dat|comp|sop)\(\"([a-z]*)\"/.exec(line.text)
            op = matches && matches.length == 3 ? matches[2] + matches[1].toUpperCase() : op
            linenum -= 1;
        }

        if(op === undefined) op = await vscode.window.showQuickPick(Object.keys(parsedops), {placeHolder: "Op"})
        if (!op) return

        let param = await vscode.window.showQuickPick(Object.keys(parsedops[op].pars), {placeHolder: "Op"})
        if (!param) return

        let replacement = param + ": "

        if(parsedops[op].pars[param].type === "menu") {
            let menuitems = parsedops[op].pars[param].menuitems
            let menuitem = await vscode.window.showQuickPick(menuitems, {placeHolder: "Op"})
            if(menuitem) replacement += "c.mp(" + menuitems.indexOf(menuitem) + "),"
        }  else {
            replacement += " ,"
        }

        editor.edit(edit => editor.selections.forEach(
            (selection, idx) => {
                edit.delete(selection);
                let indent = editor.document.lineAt(selection.start.line > 0 ? selection.start.line - 1 : 0).firstNonWhitespaceCharacterIndex
                indent = editor.document.lineAt(selection.start.line).isEmptyOrWhitespace ? indent : 1
                replacement = new Array(indent + 1).join(" ") + replacement
                edit.insert(selection.start, replacement);
            })
        )
    });

    let opCompletionProvider = {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>{
            let range = document.getWordRangeAtPosition(position, /(top|chop|dat|comp|sop)\(\"\"\)/)
            let text = document.getText(range)
            let type = text.substr(0, text.indexOf('('))
            let completions =
                Object.keys(parsedops)
                    .filter(op => op.includes(type.toUpperCase()))
                    .map(op => op.substring(0, op.length - type.length))
                    .map(op => ({ label: op, insertText: op }))
            return completions
        }
    }

    let opCompletionProviderDisposable = vscode.languages.registerCompletionItemProvider({ scheme: 'file', pattern: '**/*.ldjs.js' }, opCompletionProvider, '"')
    
    context.subscriptions.push(start);
    context.subscriptions.push(run);
    context.subscriptions.push(end);
    context.subscriptions.push(clearRequire);
    context.subscriptions.push(lookupparam);
    context.subscriptions.push(opCompletionProviderDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}