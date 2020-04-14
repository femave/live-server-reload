import { copy } from "https://deno.land/std/fs/mod.ts";
import { emptyDir } from "https://deno.land/std/fs/mod.ts";
import { mux } from "https://denolib.com/kt3k/mux-async-iterator/mod.ts";
import watch from "./watcher.ts";
import { Options } from "./interfaces.ts";

export default async function copyDir(options: Options, path: string): Promise<void> {

    const watchers = [];
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
            const extensionFile = files.path.split('.')[1];
            if(extensionFile === 'php') {
                hasServerFile = true;
            }
        }

        if(hasServerFile) {
            Deno.run({cmd: [options.xamppStop]});
            Deno.run({cmd: [options.xamppStart]});
        }

        await emptyDir(options.xamppDirServer);
        await copy(path, options.xamppDirServer, { overwrite: true });
        hasServerFile = false;

    }
    
}
