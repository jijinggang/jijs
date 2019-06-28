import { spawn } from 'child_process';
import * as  path from 'path';
import { openSync, symlinkSync } from 'fs';
import * as os from 'os';
import { Action1, Action0 } from './myjs.action'

export class Shell {
	private _running = false;
	private _file:string;
	constructor(file:string){
		this._file = file;
	}
	public OnData = new Action1<string>();
	public OnError = new Action1<string>();
	public OnExit = new Action0();

	IsRunning():boolean {
		return this._running;
	}
	Exec() {
		this._running = true;
		let file = this._file;
		let program;
		if (os.platform() == 'win32') {
			program = spawn('cmd.exe', ['/c', "chcp 65001 & " + file], { cwd: path.dirname(file) });
		} else {
			program = spawn(file, { cwd: path.dirname(file) });
		}
		program.stdout.setEncoding("utf8");
		program.stdout.on('data', (data) => {
			this.OnData.invoke(data.toString());
		});
		program.stderr.on('data', (data) => {
			this.OnError.invoke(data.toString());
		});
		program.on('exit', (code) => {
			this.OnExit.invoke();
			this.OnData.removeAll();
			this.OnExit.removeAll();
			this.OnError.removeAll();
			this._running = false;
		});

	}

}

function main() {
	let argv = process.argv;
	if (argv.length > 2) {
		new Shell(argv[2]).Exec();
	}
}

function test() {
	let sh = new Shell("ping 127.0.0.1");
	sh.OnData.add((data) => { console.log(data) });
}
//main();
//node dist/myjs.shell.js "e:/1.bat"
test();