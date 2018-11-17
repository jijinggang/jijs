import fs from 'fs';
import { stringify } from 'querystring';
export type FormatFunc = (content: string) => string;
function FormatFile(src: string, formatFunc: FormatFunc, dest: string = src) {
    let content: string = fs.readFileSync(src).toString();
    let newContent = formatFunc(content);
    if(src == dest && newContent == content){
        return;
    }
    fs.writeFileSync(dest, newContent);
}





function FormatByRegExp(src:string, regExp:string,dest=src){
    let argv = process.argv;
    let re = new RegExp(regExp,"g");
    FormatFile(src, function(content:string){
        let results = content.match(re);
        if(results != null){
            let str:string ="";
            for(let i = 0; i < results.length;i++){
                str = str.concat(results[i]);
            }
            return str;
        }
        return content;
    },dest)    
}



function test() {
    let argv = process.argv;
    FormatByRegExp(argv[2],argv[3],argv[4]);
}
test();
//node dist/myjs.file.js  e:/1.txt "module (A1|B1){[\s\S]*?\n}[\r\n]*" e:/2.txt