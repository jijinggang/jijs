import fs from 'fs';
export type FormatFunc = (content: string) => string;
export function FormatFile(src: string, formatFunc: FormatFunc, dest: string = src) {
    let content: string = fs.readFileSync(src).toString();
    let newContent = formatFunc(content);
    if (src == dest && newContent == content) {
        return;
    }
    fs.writeFileSync(dest, newContent);
}

export function RemainFileByRegExp(src: string, regExp: string,separatorChars:string="\n", dest = src) {
    let re = new RegExp(regExp, "mg");
    FormatFile(src, function (content: string) {
        let results = content.match(re)
        return results ? results.join(separatorChars) : content;
    }, dest)
}

export function ReplaceFileByRegExp(src: string, regExp: string, replaceValue: string, dest = src) {
    let re = new RegExp(regExp, "mg");
    FormatFile(src, function (content: string) {
        return content.replace(re, replaceValue);
    }, dest)
}
function main() {
    let argv = process.argv;
    if (argv.length > 5) {
        ReplaceFileByRegExp(argv[2], argv[3], argv[4], argv[5]);
    } else if (argv.length > 4) {
        ReplaceFileByRegExp(argv[2], argv[3], argv[4]);
    }
}
//main();
//RemainFileByRegExp("e:/1.txt","^module (A1|B1){[\\s\\S]*?^}$" ,"e:/2.txt");