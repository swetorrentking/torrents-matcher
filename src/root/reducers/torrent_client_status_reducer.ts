import {TorrentClientStatusState} from "../types";
import {Action, isAction} from "../../action_utils/action_typings";
import {updateTorrentClientStatus} from "../actions/root_actions";
import {setTorrentClientId} from "../../screens/screen_actions";

export const torrentClientStatusInitialState:TorrentClientStatusState = {
    connectable: false
};

export function torrentClientStatusReducer(state: TorrentClientStatusState = torrentClientStatusInitialState, action: Action<any> = null) {
    if (isAction(action, updateTorrentClientStatus)) {
        return action.payload
    }

    if(isAction(action, setTorrentClientId)) {
        return {
            connectable: false
        };
    }

    return state;
}