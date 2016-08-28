import {Action, isAction} from "../../action_utils/action_typings";
import {SettingsScreenState} from "../types";
import {refreshTorrentClientToken} from "../../screens/screen_actions";
import {updateTorrentClientStatus} from "../actions/root_actions";

export const settingsScreenInitialState:SettingsScreenState = {
    isLoadingStatus: false
};

export function settingsScreenReducer(state: SettingsScreenState = settingsScreenInitialState, action: Action<any> = null) {

    if (isAction(action, refreshTorrentClientToken)) {
        return Object.assign({}, state, {
            isLoadingStatus: true
        })
    }

    if (isAction(action, updateTorrentClientStatus)) {
        return Object.assign({}, state, {
            isLoadingStatus: false
        })
    }

    return state;
}