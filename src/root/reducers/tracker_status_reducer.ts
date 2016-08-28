import {TrackerStatusState, TrackerStatus} from "../types";
import {Action, isAction} from "../../action_utils/action_typings";
import {addTrackerStatus} from "../actions/root_actions";

export const trackerStatusInitialState:TrackerStatusState = [];

export function trackerStatusReducer(state: TrackerStatusState = trackerStatusInitialState, action: Action<any> = null) {

    if (isAction(action, addTrackerStatus)) {
        const newTrackerStatusState = state
            .filter((trackerStatus: TrackerStatus) => trackerStatus.trackerId !== action.payload.trackerId)
            .concat(action.payload);

        return newTrackerStatusState;
    }
    return state;
}