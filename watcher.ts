
import { walk  } from "https://deno.land/std/fs/mod.ts";

/** All of the types of changes that a file can have */
export enum FileEvent {
    /** The file was changed */
    Changed,
    /** The file was created */
    Created,
    /** The file was remove */
    Removed
}

export default async function* watch(target: string) {
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