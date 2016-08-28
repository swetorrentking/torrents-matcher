import {isAction, Action} from "../../action_utils/action_typings";
import {settingsLoaded} from "../actions/root_actions";
import {
    saveNewTracker,
    deleteTracker,
    saveNewFoldersPath,
    deleteFolder,
    setLanguageValue,
    setTorrentClientId,
    setTorrentClientPath,
    setTorrentClientUrl,
    setTorrentClientUserName,
    setTorrentClientPassword
} from "../../screens/screen_actions";
import * as uuid from "node-uuid";
import {FolderData, SettingsState, TrackerData} from "../types";

export const settingsInitialState: SettingsState = {
    language: "english",
    trackers: [],
    folders: [],
    torrentClientSettings: {
        clientId: "",
        url: "http://localhost:8080",
        pathToClient: "",
        userName: "",
        password: ""
    }
};

export function settingsReducer(state: SettingsState = settingsInitialState, action: Action<any> = null) {

    if (isAction(action, settingsLoaded)) {
        return Object.assign({}, state, action.payload);
    }

    if (isAction(action, saveNewTracker)) {
        const newTracker: TrackerData = {
            id: uuid.v4(),
            name: action.payload.name,
            url: action.payload.url,
            passkey: action.payload.passkey
        };

        return Object.assign({}, state, {
            trackers: state.trackers.concat(newTracker)
        });
    }

    if (isAction(action, deleteTracker)) {

        return Object.assign({}, state, {
            trackers: state.trackers.filter((tracker: TrackerData) => tracker.id !== action.payload)
        });
    }

    if (isAction(action, saveNewFoldersPath)) {

        const newFolders: FolderData[] = action.payload.map((folderPath: string) => ({
            id: uuid.v4(),
            path: folderPath
        }));

        return Object.assign({}, state, {
            folders: state.folders.concat(newFolders)
        });
    }

    if (isAction(action, deleteFolder)) {
        return Object.assign({}, state, {
            folders: state.folders.filter((folder: FolderData) => folder.id !== action.payload)
        });
    }

    if (isAction(action, setLanguageValue)) {
        return Object.assign({}, state, {language: action.payload});
    }

    if (isAction(action, setTorrentClientId)) {
        const torrentClientSettings = Object.assign(settingsInitialState.torrentClientSettings, {
            clientId: action.payload,
            pathToClient: ""
        });

        return Object.assign({}, state, {
            torrentClientSettings: torrentClientSettings
        });
    }

    if (isAction(action, setTorrentClientPath)) {
        const torrentClientSettings = Object.assign(state.torrentClientSettings, {
            pathToClient: action.payload
        });

        return Object.assign({}, state, {
            torrentClientSettings: torrentClientSettings
        });
    }

    if (isAction(action, setTorrentClientUrl)) {
        const torrentClientSettings = Object.assign(state.torrentClientSettings, {
            url: action.payload
        });

        return Object.assign({}, state, {
            torrentClientSettings: torrentClientSettings
        });
    }

    if (isAction(action, setTorrentClientUserName)) {
        const torrentClientSettings = Object.assign(state.torrentClientSettings, {
            userName: action.payload
        });

        return Object.assign({}, state, {
            torrentClientSettings: torrentClientSettings
        });
    }

    if (isAction(action, setTorrentClientPassword)) {
        const torrentClientSettings = Object.assign(state.torrentClientSettings, {
            password: action.payload
        });
        return Object.assign({}, state, {
            torrentClientSettings: torrentClientSettings
        });
    }

    return state;
}