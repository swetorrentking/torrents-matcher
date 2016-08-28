import {actionCreatorFactory} from "../action_utils/action_typings";
import {Language} from "../intl/intl";
import {AddToTorrentClientData} from "../torrent_clients/torrent_client_api";
import {NewTrackerState, TrackerId, FolderId, SearchResultState} from "../root/types";

export const setSettingsPrefix = "SETTINGS_SET";
export const setLanguageValue = actionCreatorFactory<Language>(setSettingsPrefix + "_LANGUAGE_VALUE");
export const setTorrentClientId = actionCreatorFactory<string>(setSettingsPrefix + "_TORRENT_CLIENT_ID_VALUE");
export const setTorrentClientUrl = actionCreatorFactory<string>(setSettingsPrefix + "_TORRENT_CLIENT_URL_VALUE");
export const setTorrentClientUserName = actionCreatorFactory<string>(setSettingsPrefix + "_TORRENT_CLIENT_USER_NAME_VALUE");
export const setTorrentClientPassword = actionCreatorFactory<string>(setSettingsPrefix + "_TORRENT_CLIENT_PASSWORD_VALUE");
export const setTorrentClientPath = actionCreatorFactory<string>(setSettingsPrefix + "_TORRENT_CLIENT_PATH");
export const refreshTorrentClientToken = actionCreatorFactory<void>("REFRESH_TORRENT_CLIENT_TOKEN");
export const addToTorrentClient = actionCreatorFactory<AddToTorrentClientData[]>("ADD_TO_TORRENT_CLIENT");
export const setAllTorrentsSelected = actionCreatorFactory<boolean>("SET_ALL_TORRENTS_SELECTED");

export const setNewTrackerNameValue = actionCreatorFactory<string>("SET_NEW_TRACKER_NAME_VALUE");
export const setNewTrackerUrlValue = actionCreatorFactory<string>("SET_NEW_TRACKER_URL_VALUE");
export const setNewTrackerPasskeyValue = actionCreatorFactory<string>("SET_NEW_TRACKER_PASSKEY_VALUE");
export const setNewTrackerError = actionCreatorFactory<string>("SET_NEW_TRACKER_PASSKEY_ERROR");
export const verifyNewTracker = actionCreatorFactory<NewTrackerState>("VERIFY_NEW_TRACKER");
export const saveNewTracker = actionCreatorFactory<NewTrackerState>(setSettingsPrefix + "_SAVE_NEW_TRACKER");
export const deleteTracker = actionCreatorFactory<TrackerId>(setSettingsPrefix + "_DELETE_TRACKER");

export const saveNewFoldersPath = actionCreatorFactory<string[]>(setSettingsPrefix + "_SAVE_NEW_FOLDERS_PATH");
export const deleteFolder = actionCreatorFactory<FolderId>(setSettingsPrefix + "_DELETE_FOLDER");

export const setChooseTrackerId = actionCreatorFactory<TrackerId>("SET_CHOOSEN_TRACKER_ID");
export const toggleShowSeed = actionCreatorFactory<void>("TOGGLE_SHOW_SEED");
export const setSelectedMatchedTorrentId = actionCreatorFactory<string>("SET_SELECTED_MATCHED_TORRENT_ID");
export const setTorrentsDownloaded = actionCreatorFactory<string[]>("SET_TORRENTS_DOWNLOADED");
export const setTorrentDownloaded = actionCreatorFactory<string>("SET_TORRENT_DOWNLOADED");
export const startSearch = actionCreatorFactory<void>("START_SEARCH");
export const trackerDataFetched = actionCreatorFactory<SearchResultState>("TRACKER_TORRENTS_FETCHED");