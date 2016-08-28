import {TorrentClientLoginResult, TorrentClientAddedTorrentResult, TorrentClientApi} from "./torrent_client_api";
import {R_OK, access, X_OK} from "fs";
import {exec} from "child_process";
import {saveTorrentFile, removeTorrentFile} from "../fs/fs_utils";
import {TorrentClientSettingsState} from "../root/types";

export class UTorrentClientApi implements TorrentClientApi {
    getStatus(torrentClientSettings: TorrentClientSettingsState): Promise<boolean> {
        return new Promise((resolve, reject) => {
            access(torrentClientSettings.pathToClient, R_OK | X_OK, (error) => {
                if (error) {
                    reject(error.message);
                }
                resolve(true);
            });
        });
    }

    login(torrentClientSettings: TorrentClientSettingsState): Promise<TorrentClientLoginResult> {
        return new Promise((resolve, reject) => {
        });
    }

    addTorrent(torrentClientSettings: TorrentClientSettingsState, torrentUrl: string, downloadLocation: string, authToken?: string): Promise<TorrentClientAddedTorrentResult> {
        return new Promise((resolve, reject) => {
            const fileSavedPromise = fetch(torrentUrl, {
                method: "GET",
            })
                .then((response) => {
                    if (!response.ok) {
                        reject(`Couldn't fetch torrent: ${response.statusText}`);
                        return;
                    }
                    return response.arrayBuffer();
                })
                .then((data) => {
                    return saveTorrentFile(data);
                })
                .catch((error) => {
                    reject(error.message);
                });

            const utorrentAddedPromise: Promise<string> = fileSavedPromise
                .then((torrentFileName: string) => {
                    return addToUtorrent(torrentClientSettings.pathToClient, downloadLocation, torrentFileName);
                });

            const torrentFileRemovedPromise = utorrentAddedPromise
                .then((fileName: string) => {
                    return removeTorrentFile(fileName);
                });

            torrentFileRemovedPromise
                .then((res: boolean) => {
                    resolve(res);
                });
        });
    }
}

function addToUtorrent(pathToClient: string, downloadLocation: string, torrentFileName: string) {
    return new Promise((resolve, reject) => {
        exec(`"${pathToClient}" /DIRECTORY "${downloadLocation}" "${torrentFileName}"`, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error}`);
                return;
            }
            resolve(torrentFileName);
        });
    });
}