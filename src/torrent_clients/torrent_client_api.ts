import {TorrentClientSettingsState} from "../root/types";

export interface TorrentClientApi {
    login: (torrentClientSettings:TorrentClientSettingsState) => Promise<TorrentClientLoginResult>,
    addTorrent: (torrentClientSettings:TorrentClientSettingsState, torrentUrl:string, downloadLocation:string, authToken?:string) => Promise<TorrentClientAddedTorrentResult>,
    getStatus: (torrentClientSettings: TorrentClientSettingsState) => Promise<boolean>
}

export interface TorrentClientLoginResult {
    authToken: string
    error?:any
}

export interface TorrentClientAddedTorrentResult {
    error?:any
}

export interface AddToTorrentClientData {
    matchId: string,
    downloadLocation: string,
    torrentUrl: string
}