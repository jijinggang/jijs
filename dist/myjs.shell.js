"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var path = __importStar(require("path"));
function RunBat(file, on_data, on_error, on_exit) {
    var bat = child_process_1.spawn('cmd.exe', ['/c', file], { cwd: path.dirname(file) });
    if (on_data) {
        bat.stdout.on('data', function (data) {
            on_data(data.toString());
        });
    }
    if (on_error) {
        bat.stderr.on('data', function (data) {
            on_error(data.toString());
        });
    }
    if (on_exit) {
        bat.on('exit', function (code) {
            on_exit(code);
        });
    }
}
exports.RunBat = RunBat;
function main() {
    var argv = process.argv;
    if (argv.length > 2) {
        RunBat(argv[2]);
    }
}
function test() {
    RunBat("ping 127.0.0.1", function (data) { console.log(data); }, null, function (code) { console.log("exit " + code); });
}
//main();
//node dist/myjs.shell.js "e:/1.bat"
//test();
//# sourceMappingURL=myjs.shell.js.map