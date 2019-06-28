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
var os = __importStar(require("os"));
var myjs_action_1 = require("./myjs.action");
var Shell = /** @class */ (function () {
    function Shell(file) {
        this._running = false;
        this.OnData = new myjs_action_1.Action1();
        this.OnError = new myjs_action_1.Action1();
        this.OnExit = new myjs_action_1.Action0();
        this._file = file;
    }
    Shell.prototype.IsRunning = function () {
        return this._running;
    };
    Shell.prototype.Exec = function () {
        var _this = this;
        this._running = true;
        var file = this._file;
        var program;
        if (os.platform() == 'win32') {
            program = child_process_1.spawn('cmd.exe', ['/c', "chcp 65001 & " + file], { cwd: path.dirname(file) });
        }
        else {
            program = child_process_1.spawn(file, { cwd: path.dirname(file) });
        }
        program.stdout.setEncoding("utf8");
        program.stdout.on('data', function (data) {
            _this.OnData.invoke(data.toString());
        });
        program.stderr.on('data', function (data) {
            _this.OnError.invoke(data.toString());
        });
        program.on('exit', function (code) {
            _this.OnExit.invoke();
            _this.OnData.removeAll();
            _this.OnExit.removeAll();
            _this.OnError.removeAll();
            _this._running = false;
        });
    };
    return Shell;
}());
exports.Shell = Shell;
function main() {
    var argv = process.argv;
    if (argv.length > 2) {
        new Shell(argv[2]).Exec();
    }
}
function test() {
    var sh = new Shell("ping 127.0.0.1");
    sh.OnData.add(function (data) { console.log(data); });
}
//main();
//node dist/myjs.shell.js "e:/1.bat"
test();
//# sourceMappingURL=myjs.shell.js.map