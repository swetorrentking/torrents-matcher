import {SearchScreenState} from "../types";
import {Action, isAction} from "../../action_utils/action_typings";
import {setChooseTrackerId, startSearch, trackerDataFetched, toggleShowSeed} from "../../screens/screen_actions";

export const searchScreenInitialState:SearchScreenState = {
    choosenTrackerId: "",
    searching: false,
    showSeed: false,
    allSelectedForDownload: false
};

export function searchScreenReducer(state: SearchScreenState = searchScreenInitialState, action: Action<any> = null) {

    if (isAction(action, setChooseTrackerId)) {
        return Object.assign({}, state, {choosenTrackerId: action.payload})
    }

    if (isAction(action, startSearch)) {
        return Object.assign({}, state, {searching: true});
    }

    if (isAction(action, trackerDataFetched)) {
        return Object.assign({}, state, {searching: false});
    }

    if (isAction(action, toggleShowSeed)) {
        return Object.assign({}, state, {showSeed: !state.showSeed})
    }

    return state;
}