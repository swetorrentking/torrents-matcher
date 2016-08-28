import {TorrentClientApi} from "./torrent_client_api";
import {QBittorrentClientApi} from "./qbittorrent_client";
import {UTorrentClientApi} from "./uTorrent_client";
import {QBittorrentClientSettingsContainer} from "./qbittorrent_client_settings_container";
import * as React from "react";
import {UTorrentClientSettingsContainer} from "./utorrent_client_settings_container";

export const PLATFORMS = {
    ALL: "all",
    OSX: "darwin",
    WINDOWS: "win32"
};

const qBittorrent: AvailableClient = {
    api: new QBittorrentClientApi(),
    name: "qBittorrent",
    platform: PLATFORMS.ALL
};

const uTorrent: AvailableClient = {
    api: new UTorrentClientApi(),
    name: "uTorrent",
    platform: PLATFORMS.WINDOWS,
};
export const availableClients: AvailableClients = {
    "qbittorrent": qBittorrent,
    "utorrent": uTorrent
};

export const torrentSettingsRenderers:TorrentRenderers = {
    "qbittorrent": QBittorrentClientSettingsContainer,
    "utorrent": UTorrentClientSettingsContainer
};

export interface TorrentRenderers {
    [id: string]: React.ComponentClass<any>
}

export interface AvailableClients {
    [id: string]: AvailableClient
}

export interface AvailableClient {
    api: TorrentClientApi,
    name: string,
    platform: string,
}