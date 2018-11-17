import fs from 'fs';
export type FormatFunc = (content: string) => string;
function FormatFile(src: string, formatFunc: FormatFunc, dest: string = src) {
    let content: string = fs.readFileSync(src).toString();
    let newContent = formatFunc(content);
    if (src == dest && newContent == content) {
        return;
    }
    fs.writeFileSync(dest, newContent);
}

function FormatByRegExp(src: string, regExp: string, dest = src) {
    let argv = process.argv;
    let re = new RegExp(regExp, "g");
    FormatFile(src, function (content: string) {
        let results = content.match(re)
        return results ? results.join('') : content;
    }, dest)
}

function main() {
    let argv = process.argv;
    if (argv.length > 4) {
        FormatByRegExp(argv[2], argv[3], argv[4]);
    } else if (argv.length > 3) {
        FormatByRegExp(argv[2], argv[3]);
    }
}
main();
//node dist/myjs.formatfile.js  e:/1.txt "module (A1|B1){[\s\S]*?\n}[\r\n]*" e:/2.txt