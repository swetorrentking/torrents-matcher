import {Language} from "../intl/intl";

export type FolderId = string;

export interface FolderData {
    id: FolderId,
    path: string,
}

export interface SettingsState {
    language: Language,
    trackers: TrackerData[],
    folders: FolderData[],
    torrentClientSettings: TorrentClientSettingsState
}

export interface FolderResult {
    folderId: FolderId,
    releaseFolders: ReleaseFolder[],
    valid: boolean,
    error?: any
}

export interface ReleaseFolder {
    fullPath: string,
    name: string
}

export interface FolderResultsState {
    [id: string]: FolderResult
}

export type Passkey = string;
export type TrackerId = string;

export interface TrackerData {
    id: TrackerId,
    name: string,
    url: string,
    passkey: Passkey,
}

export interface ActiveScreenState {
    id: string
}

export interface NewTrackerState {
    name: string,
    url: string,
    passkey: Passkey,
    error?: any
}

export interface SearchResultState {
    torrents: Torrent[],
    matchedTorrents: MatchedTorrent[],
    hasSearched: boolean,
    error?: any
}

export interface Torrent {
    id: number,
    name: string,
    seeding: boolean,
}

export interface MatchedTorrent extends Torrent {
    matchId: string,
    localPath: string,
    downloadUrl: string,
    selected: boolean,
    downloaded: boolean
}

export interface TorrentClientStatusState {
    connectable: boolean,
    error?: any
}

export interface SettingsScreenState {
    isLoadingStatus: boolean
}

export interface SearchScreenState {
    choosenTrackerId: TrackerId,
    searching: boolean,
    showSeed: boolean,
    allSelectedForDownload: boolean
}

export interface TorrentClientSettingsState {
    clientId: string,
    url: string,
    pathToClient: string,
    userName: string,
    password: string,
}

export type TrackerStatusState = TrackerStatus[]

export interface TrackerStatus {
    trackerId: TrackerId,
    downloadUrl?: string,
    functional: boolean,
    error?: any
}