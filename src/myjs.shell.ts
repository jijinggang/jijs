import { spawn } from 'child_process';
import * as  path from 'path';

export function RunBat(file: string, on_data?:((data:string)=>void ) | null , on_error?: ((data:string)=>void) | null, on_exit?: ((data:number|null)=>void) | null) {
	const bat = spawn('cmd.exe', ['/c', file], { cwd: path.dirname(file) });
	if(on_data){
		bat.stdout.on('data', (data) => {
			on_data(data.toString());
		});
	}
	if(on_error){
	bat.stderr.on('data', (data) => {
		on_error(data.toString());
	});
}
	if(on_exit){
	bat.on('exit', (code) => {
		on_exit(code);
	});
}
}
function main(){
	let argv = process.argv;
	if(argv.length > 2)
	{
		RunBat(argv[2]);		
	}
}

function test(){
	RunBat("ping 127.0.0.1", (data)=>{console.log(data)}, null, (code) => {console.log(`exit ${code}`)} );
}
//main();
//node dist/myjs.shell.js "e:/1.bat"
//test();