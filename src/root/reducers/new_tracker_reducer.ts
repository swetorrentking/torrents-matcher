import {NewTrackerState} from "../types";
import {Action, isAction} from "../../action_utils/action_typings";
import {
    setNewTrackerNameValue,
    setNewTrackerUrlValue,
    setNewTrackerPasskeyValue,
    setNewTrackerError, saveNewTracker
} from "../../screens/screen_actions";

export const newTrackerInitialState:NewTrackerState = {
    name: "",
    url: "",
    passkey: "",
};

export function newTrackerReducer(state: NewTrackerState = newTrackerInitialState, action: Action<any> = null) {
    if (isAction(action, setNewTrackerNameValue)) {
        return Object.assign({}, state, {name: action.payload});
    }

    if (isAction(action, setNewTrackerUrlValue)) {
        return Object.assign({}, state, {url: action.payload});
    }

    if (isAction(action, setNewTrackerPasskeyValue)) {
        return Object.assign({}, state, {passkey: action.payload});
    }

    if (isAction(action, setNewTrackerError)) {
        return Object.assign({}, state, {error: action.payload});
    }

    if (isAction(action, saveNewTracker)) {
        return Object.assign({}, state, {
            name: "",
            url: "",
            passkey: "",
            error: ""
        });
    }

    return state;
}