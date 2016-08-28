import {actionCreatorFactory} from "../../action_utils/action_typings";
import {SettingsState, FolderResult, FolderId, TorrentClientStatusState, TrackerStatus} from "../types";

export const appStarted = actionCreatorFactory<void>("APP_STARTED");
export const settingsLoaded = actionCreatorFactory<SettingsState>("SETTINGS_LOADED");
export const settingsPersisted = actionCreatorFactory<void>("SETTINGS_PERSISTED");
export const saveFolderResult = actionCreatorFactory<FolderResult>("SAVE_FOLDER_RESULTS");
export const refreshFolder = actionCreatorFactory<FolderId>("REFRESH_FOLDER");
export const refreshAllFolders = actionCreatorFactory<void>("REFRESH_ALL_FOLDERS");

export const updateTorrentClientStatus = actionCreatorFactory<TorrentClientStatusState>("UPDATE_TORRENT_CLIENT_CONNECTABLE");
export const addTrackerStatus = actionCreatorFactory<TrackerStatus>("ADD_TRACKER_STATUS");