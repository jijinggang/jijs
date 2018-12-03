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
var myjs_tpl_1 = require("./myjs.tpl");
var TPL_FILELIST = "\n<html>\n    <head></head>\n    <body>\n    <table border=\"0\" cellspacing=\"8\">\n    <% for(let file of data){ %>\n    <tr>\n        <td><a href=\"{{file.url}}\">{{file.name}}</a></td>\n        <td align=\"right\">{{file.size}} B</td>\n    </tr>\n    <% } %>\n    </body>\n</html>\n";
var Httpd = /** @class */ (function () {
    function Httpd(root, port) {
        if (root === void 0) { root = "."; }
        if (port === void 0) { port = 80; }
        this.root = root;
        this.port = port;
        this.tplFilelist = new myjs_tpl_1.JTpl(TPL_FILELIST);
    }
    Httpd.prototype.Start = function () {
        var _this = this;
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
                res.write(_this.tplFilelist.Deal(datas));
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
        }).listen(this.port);
        console.log("starting  ", this.root, this.port);
    };
    Httpd.prototype.genFilelistDatas = function (dir) {
        var datas = [];
        var files = fs.readdirSync(dir);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var name = files_1[_i];
            var url_1 = path.join(dir, name);
            var fi = fs.statSync(url_1);
            if (fi.isFile() || fi.isDirectory()) {
                datas.push({ name: name, url: url_1, size: fi.size });
            }
        }
        return datas;
    };
    return Httpd;
}());
exports.Httpd = Httpd;
function main() {
    var argv = process.argv;
    var dir = ".";
    var port = 80;
    if (argv.length > 2)
        dir = argv[2];
    if (argv.length > 3)
        port = parseInt(argv[3]);
    new Httpd(dir, port).Start();
}
function test() {
    new Httpd().Start();
}
//test();
//main();
//# sourceMappingURL=myjs.httpd.js.map