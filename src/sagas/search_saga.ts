import {take, select, put} from "redux-saga/effects";
import {startSearch, trackerDataFetched} from "../screens/screen_actions";
import {isAction, Action} from "../action_utils/action_typings";
import * as uuid from "node-uuid";
import {RootState} from "../root/root_reducer";
import {
    TrackerId,
    TrackerData,
    TrackerStatus,
    SearchResultState,
    Passkey,
    ReleaseFolder,
    Torrent,
    MatchedTorrent,
    FolderResultsState,
    FolderResult
} from "../root/types";

export function* searchSaga() {
    while (true) {
        const action: Action<any> = yield take([
            startSearch.type
        ]);

        if (isAction(action, startSearch)) {
            const state: RootState = yield select();
            const selectedTrackerId: TrackerId = state.ui.searchScreen.choosenTrackerId;
            const tracker: TrackerData = state.data.settings.trackers.find((tracker: TrackerData) => tracker.id === selectedTrackerId);
            const releaseFolders = getAllReleaseFolders(state.data.folderResults);
            const trackerStatus:TrackerStatus = state.data.trackerStatus.find((trackerStatus:TrackerStatus) => trackerStatus.trackerId === selectedTrackerId);

            try {
                const data = yield getTrackerData(tracker.url, tracker.passkey);
                const result: SearchResultState = {
                    torrents: data,
                    matchedTorrents: getMatches(trackerStatus.downloadUrl, tracker.passkey, releaseFolders, data),
                    hasSearched: true,
                };
                yield put(trackerDataFetched(result));
            } catch (error) {
                const result: SearchResultState = {
                    torrents: [],
                    matchedTorrents: [],
                    hasSearched: true,
                    error
                };
                yield put(trackerDataFetched(result));
            }

        }

    }
}

function getTrackerData(trackerUrl: string, passkey: string): Promise<any> {
    const completeUrl = `${trackerUrl}/torrents?passkey=${passkey}`;
    return new Promise((resolve, reject) => {
        fetch(completeUrl)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(`Error: ${response.statusText}`);
            })
            .then((data: any) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function getMatches(baseUrl: string, passkey: Passkey, releaseFolders: ReleaseFolder[], torrents: Torrent[]): MatchedTorrent[] {
    const getDownloadUrl = createDownloadUrlFunction(baseUrl);
    const userTorrents: MatchedTorrent[] = releaseFolders
        .reduce((prev: MatchedTorrent[], current: ReleaseFolder) => {
            const match = torrents.find((torrent: Torrent) => torrent.name === current.name);
            if (match) {
                return prev.concat(Object.assign({}, match, {
                    matchId: uuid.v4(),
                    localPath: current.fullPath.replace(current.name, ""),
                    downloadUrl: getDownloadUrl(match.id, passkey),
                    selected: false,
                    downloaded: false
                }));
            }

            return prev;
        }, []);
    return userTorrents;
}

function createDownloadUrlFunction(baseUrl: string) {
    return (torrentId: number, passkey: Passkey) => {
        const torrentIdString = torrentId.toString();
        return baseUrl
            .replace("{id}", torrentIdString)
            .replace("{passkey}", passkey);
    }
}

function getAllReleaseFolders(folderResultsState: FolderResultsState): ReleaseFolder[] {
    const folders = Object.keys(folderResultsState)
        .map((key: string) => folderResultsState[key])
        .reduce((prev: ReleaseFolder[], current: FolderResult) => {
            return prev.concat(...current.releaseFolders);
        }, []);
    return folders;
}
