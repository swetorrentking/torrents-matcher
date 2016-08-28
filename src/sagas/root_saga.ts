import {fork} from "redux-saga/effects";
import {settingsSaga} from "./settings_saga";
import {folderResultsSaga} from "./folder_results_saga";
import {searchSaga} from "./search_saga";
import {trackersSaga} from "./trackers_saga";
import {torrentClientSaga} from "./torrent_client_saga";

export function* rootSaga() {
    yield [
        fork(settingsSaga),
        fork(folderResultsSaga),
        fork(searchSaga),
        fork(trackersSaga),
        fork(torrentClientSaga)

    ];
}