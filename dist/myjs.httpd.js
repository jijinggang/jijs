"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var KEY_Url = '{Url}';
var KEY_Name = '{Name}';
var KEY_Size = '{Size}';
var KEY_Files = '{Files}';
var TMPL_HTML = "\n<html>\n<head></head>\n<body>\n<table border=\"0\" cellspacing=\"8\">\n" + KEY_Files + "\n</body>\n</html>\n";
var TMPL_TR = "\n    <tr>\n        <td><a href=\"" + KEY_Url + "\">" + KEY_Name + "</a></td>\n        <td align=\"right\">" + KEY_Size + " B</td>\n    </tr>\n";
function dealTemplate(tmpl, data) {
    var str = tmpl;
    for (var key in data) {
        var value = data[key];
        str = str.replace(new RegExp(key, 'g'), value);
    }
    return str;
}
function genTrData(fi, name, url) {
    var data = {};
    data[KEY_Name] = name;
    data[KEY_Url] = url;
    data[KEY_Size] = fi.size.toString();
    return data;
}
function genTrDatas(dir) {
    var datas = [];
    var files = fs.readdirSync(dir);
    files.forEach(function (file, index) {
        var url = path.join(dir, file);
        var fi = fs.statSync(url);
        if (fi.isFile() || fi.isDirectory()) {
            var trData = genTrData(fi, file, url);
            datas = datas.concat(trData);
        }
    });
    return datas;
}
function genHtml(files) {
    var str = "";
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        str = str.concat(dealTemplate(TMPL_TR, file));
    }
    var htmlData = {};
    htmlData[KEY_Files] = str;
    return dealTemplate(TMPL_HTML, htmlData);
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
        return __awaiter(this, void 0, void 0, function () {
            var url1, uri, filename, stat, datas, key, mimeType, fileStream;
            return __generator(this, function (_a) {
                url1 = req.url ? req.url : "";
                uri = url.parse(url1).pathname;
                uri = uri ? uri : "";
                filename = path.join(dir, uri);
                if (!fs.existsSync(filename)) {
                    //console.log("not exists: " + filename);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.write('404 Not Found\n');
                    res.end();
                    return [2 /*return*/];
                }
                stat = fs.statSync(filename);
                if (stat.isDirectory()) {
                    datas = genTrDatas(filename);
                    res.write(genHtml(datas));
                    res.end();
                    return [2 /*return*/];
                }
                else if (stat.isFile()) {
                    key = path.extname(filename).split(".")[1];
                    mimeType = mimeTypes[key];
                    res.writeHead(200, mimeType);
                    fileStream = fs.createReadStream(filename);
                    fileStream.pipe(res);
                }
                return [2 /*return*/];
            });
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
//模板
//# sourceMappingURL=myjs.httpd.js.map