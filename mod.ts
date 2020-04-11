import { copy } from "https://deno.land/std/fs/mod.ts";
import { emptyDirSync } from "https://deno.land/std/fs/mod.ts";
import { walk  } from "https://deno.land/std/fs/mod.ts";
import { mux } from "https://denolib.com/kt3k/mux-async-iterator/mod.ts";


const options = {
    xamppDirServer: 'C:\\xampp\\htdocs',
    xamppStart: 'C:\\xampp\\xampp_start.exe',
    xamppStop: 'C:\\xampp\\xampp_stop.exe',
}

/** All of the types of changes that a file can have */
export enum FileEvent {
    /** The file was changed */
    Changed,
    /** The file was created */
    Created,
    /** The file was remove */
    Removed
}
const args = Deno.args;
const watchers = [];
let pathToSave

if(args.length >= 2) {
    pathToSave = args[1];
}

// START SERVER
Deno.run({args: [options.xamppStart]});

async function* watch(target: string) {
    let prevFiles: { [filename: string]: number | null } = {};

    for await (const { filename, info } of walk(target)) {
      prevFiles[filename] = info.modified;
    }

    while (true) {
        const currFiles: { [filename: string]: number | null } = {};
        const changes = [];
        const start = Date.now();

        // Walk the target path and put all of the files into an array
        for await (const { filename, info } of walk(target)) {
            currFiles[filename] = info.modified;
        }

        for (const file in prevFiles) {
            // Check if a file has been removed else check if has been changed
            if (prevFiles[file] && !currFiles[file]) {
                changes.push({
                    path: file,
                    event: FileEvent.Removed
                });
            } else if (
                prevFiles[file] &&
                currFiles[file] &&
                prevFiles[file] !== currFiles[file]
            ) {
                changes.push({
                    path: file,
                    event: FileEvent.Changed
                });
            }
        }

        for (const file in currFiles) {
            // Check if a file has been created
            if (!prevFiles[file] && currFiles[file]) {
                changes.push({
                    path: file,
                    event: FileEvent.Created
                });
            }
        }

        prevFiles = currFiles;

        const end = Date.now();
        const wait = 1000 - (end - start);

        // Wait to make sure it runs the whole interval time
        if (wait > 0) await new Promise(r => setTimeout(r, wait));

        // If there was no changes continue to look for them else yield the changes
        if (changes.length === 0) {
            continue;
        } else {
            yield changes;
        }

    }
  }

  watchers.push(watch(args[0]));
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
        Deno.run({args: [options.xamppStop]});
        Deno.run({args: [options.xamppStart]});
    }

    emptyDirSync(options.xamppDirServer); // returns a promise
    copy(args[0], options.xamppDirServer, { overwrite: true }); // returns a promise


}
