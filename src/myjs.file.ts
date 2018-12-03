import fs from 'fs';
export type FormatFunc = (content: string) => string;
export function ReplaceByFunction(src: string, formatFunc: FormatFunc, dest: string = src) {
    let content: string = fs.readFileSync(src).toString();
    let newContent = formatFunc(content);
    if (src == dest && newContent == content) {
        return;
    }
    fs.writeFileSync(dest, newContent);
}
/**
 * 保留文件内容中搜索出的部分
 * @param src 
 * @param regExp 
 * @param separatorChars 
 * @param dest 
 */
export function Remain(src: string, regExp: string,separatorChars:string="\n", dest = src) {
    let re = new RegExp(regExp, "mg");
    ReplaceByFunction(src, function (content: string) {
        let results = content.match(re)
        return results ? results.join(separatorChars) : content;
    }, dest)
}

/**
 * 替代文件中搜索出的文本内容
 * @param file 原始文件
 * @param searchValue 搜索的字符串或正则
 * @param replaceValue 替换的内容
 * @param destFile 替换后存储的文件位置,默认是源文件
 */
export function Replace(file:string, searchValue:string|RegExp, replaceValue:string,destFile = file){
    ReplaceByFunction(file, function(content:string){
        return content.replace(searchValue, replaceValue);
    })
}

const TAIL_TOKEN=399246574;
 /**
  * 合并两个文件
  * @param file1 
  * @param file2 
  * @param destFile 合并后文件的存储位置,默认是文件1
  * @param withTail 写入额外长度信息,方便分离合并后的文件
  */
export function Merge(file1 :string, file2:string, destFile:string = file1,withTail:boolean = true):boolean{
    if(destFile == file2){
        return false;
    }
    if(destFile != file1){
        fs.copyFileSync(file1, destFile);
    }
    let data = fs.readFileSync(file2);
    fs.appendFileSync(destFile,data);
    if(withTail){
        let tail = new Int32Array(2);
        tail[0]= TAIL_TOKEN;
        tail[1] = Size(file1);
        fs.appendFileSync(destFile,tail);
    }
    return true;
}


export function UnMerge(file:string, file1:string, file2:string):number{
    if(file == file1 || file == file2)
        return -1;
    let fd = fs.openSync(file,"r");
    let sizes = getUnMergeSize(fd);
    let ret = 0;
    if(sizes.length == 2){
        copyFd(fd,0,sizes[0],file1);
        copyFd(fd,sizes[0], sizes[1], file2);
    }else{
        ret = -2;
    }
    fs.closeSync(fd);
    return ret;

}
function getUnMergeSize(fd:number):number[]{
    let sizes:number[] = [];
    let size = fs.fstatSync(fd).size;
    if(size < 2*4){
        return sizes;
    }
    let buff = new Int32Array(2);
    fs.readSync(fd, buff, 0, 2*4,size -2*4)
    if(buff[0] != TAIL_TOKEN){
        return sizes;
    }
    let file1Len = buff[1];
    if(file1Len < 0 || file1Len > size-2*4)
    {
        return sizes;
    }
    return [file1Len, size - 2 * 4 - file1Len];
}
function copyFd(fd:number, offset:number, length:number, file:string){
    let buff = new Uint8Array(length);
    fs.readSync(fd, buff, 0, length,offset);
    fs.writeFileSync(file, buff);
}

/**
 * 获取文件的字节数大小
 * @param file 
 */
export function Size(file:string):number{
    return fs.statSync(file).size;
}




//RemainFileByRegExp("e:/1.txt","^module (A1|B1){[\\s\\S]*?^}$" ,"e:/2.txt");
//Append("e:/1.txt","e:/2.txt","e:/3.txt");

//Merge("e:/1.txt","e:/2.txt","e:/3.m");
//UnMerge("e:/3.m","e:/1_.txt","e:/2_.txt");