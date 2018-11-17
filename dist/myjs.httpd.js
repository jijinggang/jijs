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
var TMPL_HTML = "<html>\n<head></head>\n<body>\n<table border=\"0\" cellspacing=\"8\">\n{Files}\n</body>\n</html>\n";
var TEMPL_TR = "\n    <tr>\n        <td><a href=\"{Url}\">{Name}</a></td>\n        <td align=\"right\">{Size} B</td>\n    </tr>\n";
function genTr(fi, name, url) {
    var str = TEMPL_TR.replace("{Url}", url);
    str = str.replace("{Name}", name);
    str = str.replace("{Size}", fi.size.toString());
    return str;
}
function genTrs(dir) {
    var files = fs.readdirSync(dir);
    var ary = [];
    files.forEach(function (file, index) {
        var url = path.join(dir, file);
        var fi = fs.statSync(url);
        if (fi.isFile() || fi.isDirectory()) {
            ary = ary.concat(genTr(fi, file, url));
        }
    });
    return ary.join("");
}
function genHtml(dir) {
    var trs = genTrs(dir);
    return TMPL_HTML.replace("{Files}", trs);
}
function Start(dir, port) {
    var mimeTypes = {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "js": "text/javascript",
        "css": "text/css",
        "md": "text/html"
    };
    http.createServer(function (req, res) {
        var url1 = req.url ? req.url : "";
        var uri = url.parse(url1).pathname;
        uri = uri ? uri : "";
        var filename = path.join(dir, uri);
        fs.exists(filename, function (exists) {
            if (!exists) {
                //console.log("not exists: " + filename);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found\n');
                res.end();
                return;
            }
            var stat = fs.statSync(filename);
            if (stat.isDirectory()) {
                res.write(genHtml(filename));
                res.end();
                return;
            }
            else if (stat.isFile()) {
                var key = path.extname(filename).split(".")[1];
                var mimeType = mimeTypes[key];
                res.writeHead(200, mimeType);
                var fileStream = fs.createReadStream(filename);
                fileStream.pipe(res);
            }
        });
    }).listen(port);
    console.log("starting  ", dir, port);
}
function main() {
    var argv = process.argv;
    var dir = ".";
    var port = 80;
    if (argv.length > 2)
        dir = argv[2];
    if (argv.length > 3)
        port = parseInt(argv[3]);
    Start(dir, port);
}
main();
//node dist/myjs.httpd.js . 80
//# sourceMappingURL=myjs.httpd.js.map