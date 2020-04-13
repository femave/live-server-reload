import { copy } from "https://deno.land/std/fs/mod.ts";
import { emptyDir } from "https://deno.land/std/fs/mod.ts";
import { mux } from "https://denolib.com/kt3k/mux-async-iterator/mod.ts";
import watch from "./watcher.ts";


const options = {
    xamppDirServer: 'C:\\xampp\\htdocs',
    xamppStart: 'C:\\xampp\\xampp_start.exe',
    xamppStop: 'C:\\xampp\\xampp_stop.exe',
}

const args = Deno.args;
const watchers = [];
let pathToSave: string;
let path = args[0] || Deno.cwd();

if(args.length >= 2) {
    pathToSave = args[1];
}

// START SERVER
console.log('===== STARTING SERVER =====')
Deno.run({args: [options.xamppStart]});

watchers.push(watch(path));
const multiplexer = mux(...watchers);
let hasServerFile = false;

for await (const changes of multiplexer) {

    console.log(
        `Detected ${changes.length} change${
            changes.length > 1 ? "s" : ""
        }. Rerunning...`
    );

    for await (const files of changes) {
        console.log(changes);
        const extensionFile = files.path.split('.')[1];
        if(extensionFile === 'php') {
            hasServerFile = true;
        }
    }

    if(hasServerFile) {
        Deno.run({args: [options.xamppStop]});
        Deno.run({args: [options.xamppStart]});
    }

    await emptyDir(options.xamppDirServer);
    await copy(path, options.xamppDirServer, { overwrite: true });
    hasServerFile = false;

}
