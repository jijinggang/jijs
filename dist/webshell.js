#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(require("http"));
var url = __importStar(require("url"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var tpl_1 = require("./tpl");
var shell_1 = require("./shell");
var ws = __importStar(require("ws"));
var TPL_FILELIST = "\n<html>\n<head>\n<script type=\"text/javascript\">\nvar path;\nvar ws;\nfunction run(file) {\n   if (ws != null) {\n     ws.close();\n     ws = null;\n   }\n   var div = document.getElementById(\"msg\");\n   var host = window.location.host;\n   div.innerText =  \"\"; \n   ws = new WebSocket(\"ws://\" + host + \"/exec?name=\"+file);\n   ws.binaryType =\"string\";\n   ws.onopen = function () {\n    div.innerText =  \"\"; \n    //div.innerText = \"opened \" + div.innerText;\n\t//ws.send(\"ok\");\n   };\n   ws.onmessage = function (e) {\n      div.innerText = div.innerText + e.data;\n   };\n   ws.onclose = function (e) {\n      div.innerText = div.innerText + \"closed\";\n   };\n   //div.innerText = \"init \" + div.innerText;\n};\n</script>\n</head>\n<body>\n<table border=\"0\" cellspacing=\"8\">\n<% for(let file of data){ %>\n<tr>\n    <td>{{file.name}}</td>\n    <td align=\"right\"> <button onclick='run(\"{{file.name}}\");'>Run</button></td>\n</tr>\n\n<% } %>\n</table>\n<hr>\n<div id=\"msg\"></div>\n\n</body>\n\n</html>\n";
var Status = /** @class */ (function () {
    function Status() {
        this.shell = null;
        this.outputs = [];
    }
    return Status;
}());
var _runStatus = new Map();
function readAndSetStatus(file) {
    var value = _runStatus.get(file);
    if (value)
        return value;
    var status = new Status();
    _runStatus.set(file, status);
    return status;
}
function runShell(file, ws1) {
    var status = readAndSetStatus(file);
    var isRunning = status.shell != null;
    if (status.shell == null) {
        var sh = new shell_1.Shell(file);
        status.shell = sh;
        sh.OnExit.add(function () {
            status.shell = null;
            ws1.close();
        });
        status.outputs = [];
        sh.OnData.add(function (data) {
            ws1.send(data);
            status.outputs.push(data);
        });
        console.log("exec:", file);
        sh.Exec();
    }
    else {
        var data = status.outputs.join('');
        console.log(data);
        ws1.send(data);
        status.shell.OnData.add(function (data) {
            ws1.send(data);
        });
    }
}
var HttpShell = /** @class */ (function () {
    function HttpShell(root, port, exts) {
        this.root = root;
        this.port = port;
        this.exts = exts;
        this.tplFilelist = new tpl_1.JTpl(TPL_FILELIST);
    }
    HttpShell.prototype.Start = function () {
        var _this = this;
        var httpServer = http.createServer(function (req, res) {
            var url1 = req.url ? req.url : "";
            var uri = url.parse(url1).pathname;
            console.log("http:", uri);
            uri = uri ? uri : "";
            var filename = path.join(_this.root, uri);
            if (!fs.existsSync(filename)) {
                //console.log("not exists: " + filename);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found\n');
                res.end();
                return;
            }
            var stat = fs.statSync(filename);
            if (stat.isDirectory()) {
                var datas = _this.genFilelistDatas(filename);
                console.log(datas);
                res.write(_this.tplFilelist.Deal(datas));
                res.end();
                return;
            }
            else if (stat.isFile()) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found\n');
            }
        });
        console.log("starting  ", this.root, this.port);
        var wsServer = new ws.Server({ noServer: true });
        httpServer.on('upgrade', function (request, socket, head) {
            var URL = url.parse(request.url, true);
            var pathname = URL.pathname;
            var file = URL.query["name"].toString();
            if (!file)
                return;
            if (pathname === '/exec') {
                wsServer.handleUpgrade(request, socket, head, function done(ws1) {
                    wsServer.emit('connection', ws1, request);
                    ws1.on('message', function (msg) {
                        console.log("on_ws_msg", msg);
                    });
                    runShell(file, ws1);
                });
            }
        });
        httpServer.listen(this.port);
    };
    HttpShell.prototype.genFilelistDatas = function (dir) {
        var datas = [];
        var files = fs.readdirSync(dir);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var name = files_1[_i];
            var url_1 = path.join(dir, name);
            var fi = fs.statSync(url_1);
            if (fi.isFile() || fi.isDirectory()) {
                if (fi.isFile) {
                    var ext = path.extname(url_1).split(".")[1];
                    if (this.exts.indexOf(ext) < 0) {
                        console.log("skip:" + url_1);
                        continue;
                    }
                }
                datas.push({ name: name, url: url_1, size: fi.size });
            }
        }
        return datas;
    };
    return HttpShell;
}());
exports.HttpShell = HttpShell;
function main() {
    console.log("Useage: node myjs.httpshell.js . 80 cmd/bat/sh");
    var argv = process.argv;
    var dir = ".";
    var port = 80;
    var exts = ["cmd", "bat", "sh"];
    if (argv.length > 2)
        dir = argv[2];
    if (argv.length > 3)
        port = parseInt(argv[3]);
    if (argv.length > 4)
        exts = argv[4].split('/');
    new HttpShell(dir, port, exts).Start();
}
function test() {
    new HttpShell(".", 80, ["cmd", "bat", "sh"]).Start();
}
//test();
main();
//# sourceMappingURL=webshell.js.map