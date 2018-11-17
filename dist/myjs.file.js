"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
function FormatFile(src, formatFunc, dest) {
    if (dest === void 0) { dest = src; }
    var content = fs_1.default.readFileSync(src).toString();
    var newContent = formatFunc(content);
    if (src == dest && newContent == content) {
        return;
    }
    fs_1.default.writeFileSync(dest, newContent);
}
function FormatByRegExp(src, regExp, dest) {
    if (dest === void 0) { dest = src; }
    var argv = process.argv;
    var re = new RegExp(regExp, "g");
    FormatFile(src, function (content) {
        var results = content.match(re);
        if (results != null) {
            var str = "";
            for (var i = 0; i < results.length; i++) {
                str = str.concat(results[i]);
            }
            return str;
        }
        return content;
    }, dest);
}
function test() {
    var argv = process.argv;
    FormatByRegExp(argv[2], argv[3], argv[4]);
    //FormatByRegExp("e:/1.txt","module (A1|B1){[\s\S]*?\n}","e:/2.txt")
}
test();
//# sourceMappingURL=myjs.file.js.map