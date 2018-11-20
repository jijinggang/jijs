import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { LiteTmplate } from './myjs.tpl';

const TPL_FILELIST = `
<html>
    <head></head>
    <body>
    <table border="0" cellspacing="8">
    <% for(let file of data){ %>
    <tr>
        <td><a href="{{file.url}}">{{file.name}}</a></td>
        <td align="right">{{file.size}} B</td>
    </tr>
    <% } %>
    </body>
</html>
`

export class Httpd {
    private root: string;
    private port: number;
    private tplFilelist: LiteTmplate;
    constructor(root: string = ".", port: number = 80) {
        this.root = root;
        this.port = port;
        this.tplFilelist = new LiteTmplate(TPL_FILELIST);
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
        console.log("starting  ", this.root, this.port);
    }
    private genFilelistDatas(dir: string) {
        let datas: object[] = [];
        let files = fs.readdirSync(dir)
        for (let name of files) {
            let url = path.join(dir, name);
            let fi = fs.statSync(url);
            if (fi.isFile() || fi.isDirectory()) {
                datas.push({ name: name, url: url, size: fi.size });
            }
        }
        return datas;
    }
}

function main() {
    let argv = process.argv;
    let dir = ".";
    let port = 80;
    if (argv.length > 2)
        dir = argv[2];
    if (argv.length > 3)
        port = parseInt(argv[3]);
    new Httpd(dir, port).Start();
}
//main()
//node dist/myjs.httpd.js . 80
//模板