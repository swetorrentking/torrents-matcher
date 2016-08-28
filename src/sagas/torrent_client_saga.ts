import {take, select, put} from "redux-saga/effects";
import {refreshTorrentClientToken, addToTorrentClient, setTorrentClientPath} from "../screens/screen_actions";
import {Action, isAction} from "../action_utils/action_typings";
import {availableClients} from "../torrent_clients/available_clients";
import {isURL} from "../validation/validation";
import {TorrentClientApi} from "../torrent_clients/torrent_client_api";
import {settingsLoaded, updateTorrentClientStatus} from "../root/actions/root_actions";
import {TorrentClientSettingsState} from "../root/types";
import {RootState} from "../root/root_reducer";

export function* torrentClientSaga() {
    while (true) {
        const action: Action<any> = yield take([
            refreshTorrentClientToken.type,
            addToTorrentClient.type,
            settingsLoaded.type,
            setTorrentClientPath.type
        ]);

        if(isAction(action, setTorrentClientPath)) {
            yield put(updateTorrentClientStatus({
                connectable: true
            }));
        }

        const torrentClientSettings: TorrentClientSettingsState = yield select((state: RootState) => state.data.settings.torrentClientSettings);
        if (!isTorrentClientSettingsValid(torrentClientSettings)) {
            continue;
        }

        if (isAction(action, settingsLoaded) || isAction(action, refreshTorrentClientToken)) {
            if(!torrentClientSettings.clientId) {
                continue;
            }
            const torrentClientApi: TorrentClientApi = availableClients[torrentClientSettings.clientId].api;

            try {
                const connectable = yield torrentClientApi.getStatus(torrentClientSettings);
                yield put(updateTorrentClientStatus({
                    connectable
                }));
            } catch (error) {
                yield put(updateTorrentClientStatus({
                    connectable: false,
                    error
                }));
            }
        }

        if (isAction(action, addToTorrentClient)) {
            const torrentClientApi: TorrentClientApi = availableClients[torrentClientSettings.clientId].api;

            for (let torrent of action.payload) {
                yield torrentClientApi.addTorrent(torrentClientSettings, torrent.torrentUrl, torrent.downloadLocation);
            }
        }
    }
}

function isTorrentClientSettingsValid(torrentClientSettings: TorrentClientSettingsState) {
    if (!availableClients[torrentClientSettings.clientId]) {
        return false;
    }

    return (
        (torrentClientSettings.pathToClient && torrentClientSettings.pathToClient.length)
        || isURL(torrentClientSettings.url));
}