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
exports.FormatFile = FormatFile;
function RemainFileByRegExp(src, regExp, separatorChars, dest) {
    if (separatorChars === void 0) { separatorChars = "\n"; }
    if (dest === void 0) { dest = src; }
    var re = new RegExp(regExp, "mg");
    FormatFile(src, function (content) {
        var results = content.match(re);
        return results ? results.join(separatorChars) : content;
    }, dest);
}
exports.RemainFileByRegExp = RemainFileByRegExp;
function ReplaceFileByRegExp(src, regExp, replaceValue, dest) {
    if (dest === void 0) { dest = src; }
    var re = new RegExp(regExp, "mg");
    FormatFile(src, function (content) {
        return content.replace(re, replaceValue);
    }, dest);
}
exports.ReplaceFileByRegExp = ReplaceFileByRegExp;
function main() {
    var argv = process.argv;
    if (argv.length > 5) {
        ReplaceFileByRegExp(argv[2], argv[3], argv[4], argv[5]);
    }
    else if (argv.length > 4) {
        ReplaceFileByRegExp(argv[2], argv[3], argv[4]);
    }
}
function test() {
}
exports.test = test;
//main();
//RemainFileByRegExp("e:/1.txt","^module (A1|B1){[\\s\\S]*?^}$" ,"e:/2.txt");
//# sourceMappingURL=myjs.formatfile.js.map