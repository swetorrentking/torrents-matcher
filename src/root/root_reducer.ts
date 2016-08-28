import {combineReducers} from "redux";
import {settingsReducer} from "./reducers/settings_reducer";
import {folderResultsReducer} from "./reducers/folder_results_reducer";
import {
    SearchResultState,
    TorrentClientStatusState,
    ActiveScreenState,
    NewTrackerState,
    SettingsScreenState,
    SearchScreenState,
    SettingsState,
    FolderResultsState,
    TrackerStatusState
} from "./types";
import {searchResultReducer} from "./reducers/search_result_reducer";
import {trackerStatusReducer} from "./reducers/tracker_status_reducer";
import {torrentClientStatusReducer} from "./reducers/torrent_client_status_reducer";
import {activeScreenReducer} from "./reducers/active_screen_id_reducer";
import {newTrackerReducer} from "./reducers/new_tracker_reducer";
import {searchScreenReducer} from "./reducers/search_screen_reducer";
import {settingsScreenReducer} from "./reducers/settings_screen_reducer";

export interface RootState {
    data: {
        settings: SettingsState,
        folderResults: FolderResultsState,
        searchResult: SearchResultState,
        trackerStatus: TrackerStatusState,
        torrentClientStatus: TorrentClientStatusState
    },
    ui: {
        activeScreen: ActiveScreenState,
        newTracker: NewTrackerState,
        searchScreen: SearchScreenState,
        settingsScreen: SettingsScreenState
    }
}

export function createRootReducer() {
    return combineReducers({
        data: combineReducers({
            settings: settingsReducer,
            folderResults: folderResultsReducer,
            searchResult: searchResultReducer,
            trackerStatus: trackerStatusReducer,
            torrentClientStatus: torrentClientStatusReducer
        }),
        ui: combineReducers({
            activeScreen: activeScreenReducer,
            newTracker: newTrackerReducer,
            searchScreen: searchScreenReducer,
            settingsScreen: settingsScreenReducer
        })
    });
}