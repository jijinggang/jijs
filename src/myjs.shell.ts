import { spawn } from 'child_process';
import * as  path from 'path';
export function RunBat(file: string) {
	const bat = spawn('cmd.exe', ['/c', file], { cwd: path.dirname(file) });
	bat.stdout.on('data', (data) => {
		console.log(data.toString());
	});

	bat.stderr.on('data', (data) => {
		console.error(data.toString());
	});

	bat.on('exit', (code) => {
		console.log(`child process exit：${code}`);
	});
}
function main(){
	let argv = process.argv;
	if(argv.length > 2)
	{
		RunBat(argv[2]);		
	}
}
//main();
//node dist/myjs.shell.js "e:/1.bat"
//单例