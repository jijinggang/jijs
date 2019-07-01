#!/usr/bin/env node

import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { JTpl } from './tpl';
import {GetFileList} from './file'
import commander = require('commander')

const TPL_FILELIST = `
<html>
    <head></head>
    <body>
    <table border="0" cellspacing="8">
    <% for(let file of data){ %>
    <tr>
        <td><a href="{{file.name}}">{{file.name}}</a></td>
    </tr>
    <% } %>
    </body>
</html>
`

export class Httpd {
    private root: string;
    private port: number;
    private tplFilelist: JTpl;
    constructor(root: string = ".", port: number = 80) {
        this.root = root;
        this.port = port;
        this.tplFilelist = new JTpl(TPL_FILELIST);
    }

    Start() {
        let mimeTypes: { [key: string]: string } = {
            "html": "text/html",
            "jpeg": "image/jpeg",
            "jpg": "image/jpeg",
            "png": "image/png",
            "js": "text/javascript",
            "css": "text/css",
            "md": "text/html"
        };

        http.createServer((req, res) => {
            let url1 = req.url ? req.url : "";
            let uri = url.parse(url1).pathname
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
                res.write(this.tplFilelist.Deal(datas));
                res.end();
                return;
            } else if (stat.isFile()) {
                var key: string = path.extname(filename).split(".")[1];
                var mimeType: string = mimeTypes[key];
                res.writeHead(200, mimeType);
                var fileStream = fs.createReadStream(filename);
                fileStream.pipe(res);
            }
        }).listen(this.port);
        console.log("httpd starting  ", this.root, this.port);
    }
    private genFilelistDatas(dir: string) {
        let datas = [];
        let files = GetFileList(dir);
        for(let file of files){
            datas.push({ name:file});
        }
        return datas;
    }
}

function main() {
    let args = commander
        .option('-r, --root [v]','http root directory','.')
        .option('-p, --port [n]','http server\'s port', 80)
        .parse(process.argv)
    new Httpd(args.root, args.port).Start();
}

function test(){
    new Httpd().Start();
}

//test();
main();