"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMem() {
    var info = process.memoryUsage();
    return [info.heapUsed, info.external, info.heapTotal, info.rss];
}
function Run(f) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var memOld = getMem();
    var timeOld = new Date().getTime();
    //console.log("\ncurr:" + memOld);
    f.call(f, args);
    var memCurr = getMem();
    var timeDiff = new Date().getTime() - timeOld;
    console.log("\nMemory diff:" + (memCurr[0] - memOld[0]) + "," + (memCurr[1] - memOld[1]) + "," + (memCurr[2] - memOld[2]) + "," + (memCurr[3] - memOld[3]));
    console.log("Cost Time(ms):" + timeDiff);
}
//console.log("start testing...")
//shell.test();
//httpd.test();
//tpl.test();
//formatfile.test();
//console.log("end testing...")
//# sourceMappingURL=test.js.map