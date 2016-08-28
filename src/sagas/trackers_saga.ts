import {take, select, put} from "redux-saga/effects";
import {Action, isAction} from "../action_utils/action_typings";
import {settingsLoaded, addTrackerStatus} from "../root/actions/root_actions";
import {saveNewTracker, setChooseTrackerId, verifyNewTracker, setNewTrackerError} from "../screens/screen_actions";
import {TrackerData, TrackerStatus, Passkey} from "../root/types";
import {RootState} from "../root/root_reducer";

export function* trackersSaga() {
    while (true) {
        const action: Action<any> = yield take([
                settingsLoaded.type,
                verifyNewTracker.type
            ]
        );

        if(isAction(action, verifyNewTracker)) {
            const {url, passkey} = action.payload;
            try {
                const data: any = yield getTrackerConfig(url, passkey);
                yield put(saveNewTracker(Object.assign({}, action.payload, {
                    name: data["tracker-name"]
                })));
            } catch (error) {
                yield put(setNewTrackerError(error.message));
            }

        }

        const trackers: TrackerData[] = yield select((state: RootState) => state.data.settings.trackers);
        for (let tracker of trackers) {
            try {
                const data: any = yield getTrackerConfig(tracker.url, tracker.passkey);
                const trackerStatus: TrackerStatus = {
                    trackerId: tracker.id,
                    downloadUrl: data["download-uri"],
                    functional: true
                }

                yield put(addTrackerStatus(trackerStatus));

            } catch (error) {
                const trackerStatus: TrackerStatus = {
                    trackerId: tracker.id,
                    functional: false,
                    error
                };
                yield put(addTrackerStatus(trackerStatus));
            }

        }

        if(trackers.length) {
            yield put(setChooseTrackerId(trackers[0].id));
        }
    }
}

function getTrackerConfig(url: string, passkey:Passkey) {
    const trackerUrl = `${url}/configs?passkey=${passkey}`;
    return new Promise((resolve, reject) => {
        fetch(trackerUrl)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(`Error: ${response.statusText}`);
            })
            .then((data: any) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}