#!/usr/bin/env node

import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { JTpl } from './tpl';
import { Shell } from "./shell"
import * as ws from "ws";
import {GetFileList} from './file'
import commander = require('commander')


const TPL_FILELIST = `
<html>
<head>
<script type="text/javascript">
var path;
var ws;
function run(file) {
   if (ws != null) {
     ws.close();
     ws = null;
   }
   var div = document.getElementById("msg");
   var host = window.location.host;
   div.innerText =  ""; 
   ws = new WebSocket("ws://" + host + "/exec?name="+file);
   ws.binaryType ="string";
   ws.onopen = function () {
    div.innerText =  ""; 
    //div.innerText = "opened " + div.innerText;
	//ws.send("ok");
   };
   ws.onmessage = function (e) {
      div.innerText = div.innerText + e.data;
   };
   ws.onclose = function (e) {
      div.innerText = div.innerText + "closed";
   };
   //div.innerText = "init " + div.innerText;
};
</script>
</head>
<body>
<table border="0" cellspacing="8">
<% for(let file of data){ %>
<tr>
    <td>{{file.name}}</td>
    <td align="right"> <button onclick='run(\"{{file.name}}\");'>Run</button></td>
</tr>

<% } %>
</table>
<hr>
<div id="msg"></div>

</body>

</html>
`

class Status {
    shell: Shell | null = null;
    outputs: string[] = [];
}

let _runStatus = new Map<string, Status>();

function readAndSetStatus(file: string): Status {
    let value = _runStatus.get(file)
    if (value)
        return value;
    let status = new Status();
    _runStatus.set(file, status)
    return status;
}

function runShell(file: string, ws1: any) {
    let status = readAndSetStatus(file);
    let isRunning = status.shell != null;
    if (status.shell == null) {
        let sh = new Shell(file);
        status.shell = sh;

        sh.OnExit.add(() => {
            status.shell = null;
            ws1.close();
        })

        status.outputs = [];
        sh.OnData.add((data: string) => {
            ws1.send(data);
            status.outputs.push(data);
        });

        console.log("exec:", file);
        sh.Exec();

    } else {
        let data = status.outputs.join('');
        console.log(data);
        ws1.send(data);
        status.shell.OnData.add((data: string) => {
            ws1.send(data);
        });

    }

}

export class HttpShell {
    private root: string;
    private port: number;
    private exts: string[];
    private tplFilelist: JTpl;
    constructor(root: string, port: number, exts: string[]) {
        this.root = root;
        this.port = port;
        this.exts = exts;
        this.tplFilelist = new JTpl(TPL_FILELIST);
    }

    Start() {
        const httpServer = http.createServer((req, res) => {
            let url1 = req.url ? req.url : "";
            let uri = url.parse(url1).pathname
            console.log("http:", uri)

            uri = uri ? uri : "";
            let filename = path.join(this.root, uri);
            if (!fs.existsSync(filename)) {
                //console.log("not exists: " + filename);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found\n');
                res.end();
                return;
            }
            let stat = fs.statSync(filename);
            if (stat.isDirectory()) {
                let datas = this.genFilelistDatas(filename);
                console.log(datas);
                res.write(this.tplFilelist.Deal(datas));
                res.end();
                return;
            } else if (stat.isFile()) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found\n');
            }

        });
        console.log("starting  ", this.root, this.port);

        const root = this.root;
        const wsServer = new ws.Server({ noServer: true });
        httpServer.on('upgrade', (request, socket, head) => {
            const URL = url.parse(request.url, true);
            const pathname = URL.pathname;
            const file = URL.query["name"].toString();
            if (!file)
                return;
            if (pathname === '/exec') {
                wsServer.handleUpgrade(request, socket, head, function done(ws1) {
                    wsServer.emit('connection', ws1, request);
                    ws1.on('message', (msg) => {
                        console.log("on_ws_msg", msg);
                    });
                    runShell(root + file, ws1);

                });
            }
        });

        httpServer.listen(this.port);
    }
    private genFilelistDatas(dir: string) {
        let datas: object[] = [];
        let files = GetFileList(dir);
        for (let name of files) {
            let ext = path.extname(name).split(".")[1];
            if (this.exts.indexOf(ext) < 0) {
                console.log(`skip:${name}`)
                continue;
            }
            datas.push({ name: name });
        }
        return datas;
    }


}

function main(){
    let args = commander
        .option('-r, --root [v]','shell files\' root directory','.')
        .option('-p, --port [n]','http server\'s port', 80)
        .option('-e, --ext [v]','file extension which includes', 'cmd/bat/sh')
        .parse(process.argv)
    //console.log(args)
    let exts = args.ext.split('/')
    new HttpShell(args.root, args.port, exts).Start();
}

function test() {
    new HttpShell("d:/", 80, ["cmd", "bat", "sh"]).Start();
}

//test();
main();