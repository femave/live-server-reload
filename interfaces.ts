export interface Options {
    xamppDirServer: string;
    xamppStart: string;
    xamppStop: string;
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

export interface Changes {
    path: string,
    event: FileEvent
}