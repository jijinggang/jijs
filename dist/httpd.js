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
var file_1 = require("./file");
var commander = require("commander");
var TPL_FILELIST = "\n<html>\n    <head></head>\n    <body>\n    <table border=\"0\" cellspacing=\"8\">\n    <% for(let file of data){ %>\n    <tr>\n        <td><a href=\"{{file.name}}\">{{file.name}}</a></td>\n    </tr>\n    <% } %>\n    </body>\n</html>\n";
var Httpd = /** @class */ (function () {
    function Httpd(root, port) {
        if (root === void 0) { root = "."; }
        if (port === void 0) { port = 80; }
        this.root = root;
        this.port = port;
        this.tplFilelist = new tpl_1.JTpl(TPL_FILELIST);
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
        console.log("httpd starting  ", this.root, this.port);
    };
    Httpd.prototype.genFilelistDatas = function (dir) {
        var datas = [];
        var files = file_1.GetFileList(dir);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            datas.push({ name: file });
        }
        return datas;
    };
    return Httpd;
}());
exports.Httpd = Httpd;
function main() {
    var args = commander
        .option('-r, --root [v]', 'http root directory', '.')
        .option('-p, --port [n]', 'http server\'s port', 80)
        .parse(process.argv);
    new Httpd(args.root, args.port).Start();
}
function test() {
    new Httpd().Start();
}
//test();
main();
//# sourceMappingURL=httpd.js.map