import {TorrentClientLoginResult, TorrentClientAddedTorrentResult, TorrentClientApi} from "./torrent_client_api";
import {TorrentClientSettingsState} from "../root/types";

const LOGIN_URL = "/login";
const ADD_TORRENT_URL = "/command/download";
const STATUS_URL = "/query/torrents";

export class QBittorrentClientApi implements TorrentClientApi {
    getStatus(torrentClientSettings: TorrentClientSettingsState): Promise<boolean> {
        const url = `${getBaseUrl(torrentClientSettings)}${STATUS_URL}`;
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "GET",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }

                    resolve(true);
                })
                .catch((error) => {
                    reject(error.message);
                });
        });
    }

    login(torrentClientSettings: TorrentClientSettingsState): Promise<TorrentClientLoginResult> {
        const url = `${getBaseUrl(torrentClientSettings)}${LOGIN_URL}`;
        const headers = new Headers();
        headers.append("Content-type", "application/x-www-form-urlencoded");
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers,
                body: `username=${torrentClientSettings.userName}&password=${torrentClientSettings.password}`
            })
                .then((response) => {
                    if (response.ok) {
                        const cookie = response.headers.get("Set-Cookie");
                        resolve({
                            authToken: cookie
                        });
                    }

                    throw new Error(`Error: ${response.statusText}`);
                })
                .catch((error) => {
                    reject({
                        authToken: null,
                        error
                    });
                });
        });
    }

    addTorrent(torrentClientSettings: TorrentClientSettingsState, torrentUrl: string, downloadLocation: string, authToken?: string): Promise<TorrentClientAddedTorrentResult> {
        const url = `${getBaseUrl(torrentClientSettings)}${ADD_TORRENT_URL}`;

        const form = new FormData();

        if (authToken) {
            form.append("cookie", authToken);
        }

        form.append("urls", encodeURIComponent(torrentUrl));
        form.append("savepath", downloadLocation);

        const headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers,
                body: `urls=${encodeURIComponent(torrentUrl)}&savepath=${downloadLocation}`
            })
                .then((response) => {
                    if (response.ok) {
                        resolve({});
                    }

                    throw new Error(`Error: ${response.statusText}`);
                })
                .catch((error) => {
                    reject({
                        authToken: null,
                        error
                    });
                });
        });
    }
}

function getBaseUrl(torrentClientSettings: TorrentClientSettingsState) {
    return stripLastSlash(torrentClientSettings.url);
}

function stripLastSlash(url: string) {
    return url.endsWith("/")
        ? url.substr(0, url.length - 1)
        : url;
}
