import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

const TMPL_HTML = `<html>
<head></head>
<body>
<table border="0" cellspacing="8">
{Files}
</body>
</html>
`

const TEMPL_TR = `
    <tr>
        <td><a href="{Url}">{Name}</a></td>
        <td align="right">{Size} B</td>
    </tr>
`
function genTr(fi: fs.Stats, name: string, url:string) {

    let str = TEMPL_TR.replace("{Url}", url);
    str = str.replace("{Name}",name)
    str = str.replace("{Size}", fi.size.toString());
    return str;
}
function genTrs(dir: string): string {
    let files = fs.readdirSync(dir)
    let ary: string[] = [];
    files.forEach((file, index) => {
        let url = path.join(dir, file);
        let fi = fs.statSync(url);
        if (fi.isFile() || fi.isDirectory()) {
            ary = ary.concat(genTr(fi, file, url));
        }
    })
    return ary.join("");
}
function genHtml(dir: string):string {
    let trs = genTrs(dir);
    return TMPL_HTML.replace("{Files}", trs);
}


function Start(dir: string, port: number) {
    let mimeTypes: { [key: string]: string } = {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "js": "text/javascript",
        "css": "text/css",
        "md":"text/html"
    };

    http.createServer(function (req, res) {
        let url1 = req.url ? req.url : "";
        let uri = url.parse(url1).pathname
        uri = uri ? uri : "";
        let filename = path.join(dir, uri);
        fs.exists(filename, function (exists) {
            if (!exists) {
                //console.log("not exists: " + filename);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found\n');
                res.end();
                return;
            }
            let stat = fs.statSync(filename);
            if (stat.isDirectory()) {
                res.write(genHtml(filename));
                res.end();
                return;
            } else if (stat.isFile()) {
                var key: string = path.extname(filename).split(".")[1];
                var mimeType: string = mimeTypes[key];
                res.writeHead(200, mimeType);
                var fileStream = fs.createReadStream(filename);
                fileStream.pipe(res);
            }
        });
    }).listen(port);
    console.log("starting  ",dir, port);
}

function main() {
    let argv = process.argv;
    let dir = ".";
    let port = 80;
    if (argv.length > 2)
        dir = argv[2];
    if (argv.length > 3)
        port = parseInt(argv[3]);
    Start(dir, port);
}
main()
//node dist/myjs.httpd.js . 80