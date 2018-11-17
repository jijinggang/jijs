import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

const KEY_Url='{Url}'
const KEY_Name='{Name}'
const KEY_Size='{Size}'
const KEY_Files='{Files}'

const TMPL_HTML = `
<html>
<head></head>
<body>
<table border="0" cellspacing="8">
${KEY_Files}
</body>
</html>
`
const TMPL_TR = `
    <tr>
        <td><a href="${KEY_Url}">${KEY_Name}</a></td>
        <td align="right">${KEY_Size} B</td>
    </tr>
`
export type KeyValue={[key:string]:string};
function dealTemplate(tmpl:string, data:KeyValue){
    let str = tmpl;
    for(let key in data){
        let value = data[key];
        str = str.replace(new RegExp(key,'g'),value);
    }
    return str;
}

function genTrData(fi: fs.Stats, name: string, url: string) {
    let data :KeyValue = {};
    data[KEY_Name] = name;
    data[KEY_Url] = url;
    data[KEY_Size] = fi.size.toString();
    return data;
}
function genTrDatas(dir: string) {
    let datas : KeyValue[] = [];
    let files = fs.readdirSync(dir)
    files.forEach((file, index) => {
        let url = path.join(dir, file);
        let fi = fs.statSync(url);
        if (fi.isFile() || fi.isDirectory()) {
            let trData = genTrData(fi, file, url);
            datas = datas.concat(trData);
        }
    })
    return datas;
}

function genHtml(files:KeyValue[]):string{
    let str = "";
    for(let file of files){
        str = str.concat(dealTemplate(TMPL_TR,file));
    }
    let htmlData:KeyValue = {};
    htmlData[KEY_Files] = str;
    return dealTemplate(TMPL_HTML,htmlData);
}


function Start(dir: string, port: number) {
    let mimeTypes: { [key: string]: string } = {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "js": "text/javascript",
        "css": "text/css",
        "md": "text/html"
    };

    http.createServer(async function (req, res) {
        let url1 = req.url ? req.url : "";
        let uri = url.parse(url1).pathname
        uri = uri ? uri : "";
        let filename = path.join(dir, uri);
        if (!fs.existsSync(filename)) {
            //console.log("not exists: " + filename);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('404 Not Found\n');
            res.end();
            return;
        }
        let stat = fs.statSync(filename);
        if (stat.isDirectory()) {
            let datas = genTrDatas(filename);
            res.write(genHtml(datas));
            res.end();
            return;
        } else if (stat.isFile()) {
            var key: string = path.extname(filename).split(".")[1];
            var mimeType: string = mimeTypes[key];
            res.writeHead(200, mimeType);
            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);
        }
    }).listen(port);
    console.log("starting  ", dir, port);
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
//模板