'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const ldjs = require("lambda-designer-js");
const net = require("net");
const parsedops = require("./parsedjs.json");
const path = require("path");
const diff = require("diff");
const fp_ts_1 = require("fp-ts");
const pipeable_1 = require("fp-ts/lib/pipeable");
let config = vscode.workspace.getConfiguration('ldjs');
let replcache = [];
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
;
class Socket {
    constructor() {
        this.SERVER_URL = config.get('server_url');
        this.SERVER_PORT = config.get('server_port');
        this.timeout = 1000;
        this.connected = false;
        this.socket = new net.Socket();
        this.socket.on('connect', this.connectHandler.bind(this));
        this.socket.on('timeout', this.timeoutHandler.bind(this));
        this.socket.on('close', this.closeHandler.bind(this));
        this.socket.on('error', () => { });
    }
    connectHandler() {
        this.connected = true;
    }
    closeHandler() {
        this.connected = false;
        this.timeoutHandler();
    }
    timeoutHandler() {
        return;
        setTimeout(this.makeConnection.bind(this), this.timeout);
    }
    makeConnection() {
        return new Promise((resolve, reject) => this.socket.connect(config.get('server_port'), config.get('server_url'), resolve));
    }
    send(message) {
        if (this.connected) {
            this.socket.write(message + "\n");
        }
    }
    dispose() {
        this.socket.destroy();
    }
}
class LDJSBridge {
    constructor(fileUri) {
        this.socket = new Socket();
        this.previousText = "";
        this.run = (obj) => {
            let replaced = obj.replace(/\n/g, "\\n").replace(/"/g, "\\\'");
            obj = obj.replace("CommandCode", '`""' + replaced + '""`');
            return Function("c", "v", "require", "return Promise.resolve((function() { " + obj + " })()).then(v)")(ldjs, (ns) => pipeable_1.pipe(ns, ldjs.validateNodes, fp_ts_1.either.map(n => ldjs.nodesToJSON(ns))), (v) => {
                let docuri = vscode.window.activeTextEditor.document.uri.fsPath;
                let pathp = path.join(path.dirname(docuri), v);
                pathp = path.normalize(pathp);
                if (replcache.indexOf(pathp) == -1) {
                    replcache.push(pathp);
                }
                return require(pathp);
            });
        };
        this._outputChannel = vscode.window.createOutputChannel("ldjs");
        this.fileUri = fileUri;
        this._outputChannel.show();
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            let text = vscode.window.activeTextEditor.document.getText();
            let textDiff = diff.diffTrimmedLines(this.previousText, text);
            this.previousText = text;
            textDiff = textDiff
                .filter(d => d.removed || d.added)
                .flatMap(d => d.value.split('\n').filter(l => /\S/.test(l)).filter(l => !l.startsWith("//")).map(v => (Object.assign(Object.assign({}, d), { value: v }))))
                .map(d => (d.removed ? "removed" : d.added ? "added" : "unknown") + "\t" + d.value)
                .map(d => d.replace(/`/g, "\\`")).join("\\n");
            text = text.replace(/Changes/g, textDiff);
            this._outputChannel.clear();
            (this.socket.connected ? Promise.resolve() : this.socket.makeConnection())
                .then(() => this.runForStatus(text)())
                .then(l => this._outputChannel.appendLine(l))
                .catch(e => this._outputChannel.appendLine([e.message].concat(e.stack.split('\n')).join("\n")));
        });
    }
    runForStatus(text) {
        return pipeable_1.pipe(fp_ts_1.taskEither.tryCatch(() => this.run(text), (e) => [e.message].concat(e.stack.split('\n')).join("\n")), fp_ts_1.task.map(fp_ts_1.either.flatten), fp_ts_1.taskEither.chain(r => fp_ts_1.taskEither.tryCatch(() => Promise.resolve(this.socket.send(r)), e => "Problem sending")), fp_ts_1.taskEither.fold(e => fp_ts_1.task.of(e), () => fp_ts_1.task.of("Correct")));
        // if(result.isRight()) {
        //     this.socket.send(result.value);
        //     return ["Correct"];
        // } else {
        //     return result.value;
        // }
    }
    dispose() {
        this.socket.dispose();
        this._outputChannel.dispose();
    }
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
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
        bridge = new LDJSBridge(vscode.window.activeTextEditor.document.uri);
        bridgeupdate = debounce(bridge.update.bind(bridge), 200, false);
        startcmd = vscode.window.onDidChangeTextEditorSelection((e) => {
            if (bridgeupdate != undefined) {
                bridgeupdate();
            }
        });
        context.subscriptions.push(startcmd);
    });
    let run = vscode.commands.registerCommand('extension.ldjsrun', () => {
        bridgeupdate = undefined;
        if (startcmd != undefined) {
            startcmd.dispose();
            startcmd = undefined;
        }
        bridge = bridge !== undefined ? bridge : new LDJSBridge(vscode.window.activeTextEditor.document.uri);
        bridge.update();
    });
    let end = vscode.commands.registerCommand('extension.ldjsend', () => {
        if (bridge != undefined) {
            bridge.dispose();
            bridge = undefined;
        }
        if (startcmd != undefined) {
            startcmd.dispose();
            startcmd = undefined;
        }
        bridgeupdate = undefined;
    });
    let clearRequire = vscode.commands.registerCommand('extension.ldjsclearrequire', () => {
        for (let path of replcache) {
            delete require.cache[path];
        }
        replcache = [];
    });
    let lookupparam = vscode.commands.registerCommand('extension.ldjslookupparam', () => __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        let linenum = editor.selection.start.line;
        let op = undefined;
        while (linenum > 0 && (op == null || op == undefined)) {
            console.log(op);
            let line = editor.document.lineAt(linenum);
            console.log("finding...");
            let matches = /(top|chop|dat|comp|sop)\(\"([a-z]*)\"/.exec(line.text);
            op = matches && matches.length == 3 ? matches[2] + matches[1].toUpperCase() : op;
            linenum -= 1;
        }
        if (op === undefined)
            op = yield vscode.window.showQuickPick(Object.keys(parsedops), { placeHolder: "Op" });
        if (!op)
            return;
        let param = yield vscode.window.showQuickPick(Object.keys(parsedops[op].pars), { placeHolder: "Op" });
        if (!param)
            return;
        let replacement = param + ": ";
        if (parsedops[op].pars[param].type === "menu") {
            let menuitems = parsedops[op].pars[param].menuitems;
            let menuitem = yield vscode.window.showQuickPick(menuitems, { placeHolder: "Op" });
            if (menuitem)
                replacement += "c.mp(" + menuitems.indexOf(menuitem) + "),";
        }
        else {
            replacement += " ,";
        }
        editor.edit(edit => editor.selections.forEach((selection, idx) => {
            edit.delete(selection);
            let indent = editor.document.lineAt(selection.start.line > 0 ? selection.start.line - 1 : 0).firstNonWhitespaceCharacterIndex;
            indent = editor.document.lineAt(selection.start.line).isEmptyOrWhitespace ? indent : 1;
            replacement = new Array(indent + 1).join(" ") + replacement;
            edit.insert(selection.start, replacement);
        }));
    }));
    let opCompletionProvider = {
        provideCompletionItems(document, position, token, context) {
            let range = document.getWordRangeAtPosition(position, /(top|chop|dat|comp|sop)\(\"\"\)/);
            let text = document.getText(range);
            let type = text.substr(0, text.indexOf('('));
            let completions = Object.keys(parsedops)
                .filter(op => op.includes(type.toUpperCase()))
                .map(op => op.substring(0, op.length - type.length))
                .map(op => ({ label: op, insertText: op }));
            return completions;
        }
    };
    let opCompletionProviderDisposable = vscode.languages.registerCompletionItemProvider({ scheme: 'file', pattern: '**/*.ldjs.js' }, opCompletionProvider, '"');
    context.subscriptions.push(start);
    context.subscriptions.push(run);
    context.subscriptions.push(end);
    context.subscriptions.push(clearRequire);
    context.subscriptions.push(lookupparam);
    context.subscriptions.push(opCompletionProviderDisposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map