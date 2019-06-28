import * as shell from './shell'
import * as httpd from './httpd'
import * as tpl from './tpl'
import * as formatfile from "./file"


function getMem(): number[] {
    let info = process.memoryUsage();
    return [info.heapUsed, info.external, info.heapTotal, info.rss];
}
function Run(f:Function, ...args:any[]){
    let memOld = getMem();
    let timeOld = new Date().getTime();
    //console.log("\ncurr:" + memOld);
    f.call(f,args);
    let memCurr = getMem();
    let timeDiff = new Date().getTime() - timeOld;
    console.log("\nMemory diff:" + (memCurr[0] - memOld[0]) + "," + (memCurr[1] - memOld[1]) + "," + (memCurr[2] - memOld[2]) + "," + (memCurr[3] - memOld[3]));
    console.log("Cost Time(ms):"+timeDiff);
}


//console.log("start testing...")
//shell.test();
//httpd.test();
//tpl.test();
//formatfile.test();
//console.log("end testing...")