import {writeFile, stat, readFile, access, R_OK, readdir} from "fs";
import * as path from "path";
import {remote} from "electron";
import * as uuid from "node-uuid";
import {sep} from "path";
import {unlink} from "fs";
import {SettingsState} from "../root/types";

const userDataPath = remote.app.getPath("userData");
const fileName = "torrent_matcher.json";
const fullPath = path.join(userDataPath, fileName);

export function saveTorrentFile(arrayBuffer: any): Promise<string> {
    return new Promise((resolve, reject) => {
        const uniqueId = uuid.v4();
        const torrentFullPath = `${userDataPath}${sep}${uniqueId}.torrent`;

        const buffer = Buffer.from(arrayBuffer);
        writeFile(torrentFullPath, buffer, {
            flag: "w"
        }, function (err) {
            if (err) {
                reject(`Error saving torrent: ${err.message}`);
            } else {
                resolve(torrentFullPath);
            }
        })
    });
}

export function removeTorrentFile(fileName:string) {
    return new Promise((resolve, reject) => {
        unlink(fileName, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}
export function writeSettings(settings: SettingsState) {

    return new Promise((resolve, reject) => {
        writeFile(fullPath, JSON.stringify(settings), (err) => {
            if (err) {
                reject(err)

            } else {
                resolve();
            }


        });
    });
}

export function settingsFileExists(): Promise<boolean> {
    return new Promise((resolve) => {
        stat(fullPath, (err, stats) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Check that file exists and is acessible before calling
 * @returns {Promise<SettingsState>}
 */
export function readSettingsFile(): Promise<SettingsState> {
    return new Promise((resolve) => {
        readFile(fullPath, 'utf8', (err, data) => {
            const settings: SettingsState = JSON.parse(data);
            resolve(settings);
        });
    });
}

export function folderExists(folderPath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        access(folderPath, R_OK, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

export function getSubDirectoriesAsync(currentPath: string): Promise<string[]> {
    return new Promise((resolve) => {
        const promises: Promise<string[]>[] = [];

        readdir(currentPath, (error, paths) => {
            for (let filePath of paths) {
                const fullPath = path.resolve(currentPath, filePath);
                promises.push(handlePath(fullPath));
            }

            Promise.all(promises)
                .then((results: any) => {
                    const items: string[] = results.reduce((accumulated: string[], current: string[]) => {
                        return accumulated.concat(current);
                    }, []);

                    resolve(items);
                });
        });
    });
}

function handlePath(fullPath: string): Promise<string[]> {
    return hasAccess(fullPath)
        .then((hasAccess: boolean) => {
            if (!hasAccess) {
                return [];
            }

            return isDirectory(fullPath)
                .then((isDirectory) => {
                    if (!isDirectory) {
                        return [];
                    }

                    return getSubDirectoriesAsync(fullPath)
                        .then((subPaths) => {
                            return subPaths.concat(fullPath);
                        });
                });
        });
}

function hasAccess(fullPath: string): Promise<boolean> {
    return new Promise((resolve) => {
        access(fullPath, R_OK, (error) => {

            if (error) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

function isDirectory(fullPath: string): Promise<boolean> {
    return new Promise((resolve) => {
        stat(fullPath, (error, stats) => {
            if (error || !stats.isDirectory()) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}