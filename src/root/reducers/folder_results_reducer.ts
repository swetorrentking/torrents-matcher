import {saveFolderResult, refreshFolder, refreshAllFolders} from "../actions/root_actions";
import {isAction, Action} from "../../action_utils/action_typings";
import {deleteFolder} from "../../screens/screen_actions";
import {FolderResultsState} from "../types";

export const folderResultsInitialState:FolderResultsState = {};

export function folderResultsReducer(state: FolderResultsState = folderResultsInitialState, action: Action<any> = null) {
    if (isAction(action, saveFolderResult)) {
        const obj: any = {};
        obj[action.payload.folderId] = action.payload;

        return Object.assign({}, state, obj);
    }

    if (isAction(action, refreshFolder)) {
        const newState = Object.assign({}, state);
        delete newState[action.payload];

        return newState;
    }

    if (isAction(action, refreshAllFolders)) {
        return {};
    }

    if (isAction(action, deleteFolder)) {
        const newState = Object.assign({}, state);
        delete newState[action.payload];
        return newState;
    }

    return state;
}