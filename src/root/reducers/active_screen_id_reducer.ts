import {ActiveScreenState} from "../types";
import {Action, isAction} from "../../action_utils/action_typings";
import {changeMainScreen} from "../../menu/actions";

export const activeScreenInitialState:ActiveScreenState = {
    id: "settings"
};

export function activeScreenReducer(state: ActiveScreenState = activeScreenInitialState, action: Action<any> = null) {
    if (isAction(action, changeMainScreen)) {
        return Object.assign({}, state, {id: action.payload});
    }
    return state;
}