import {take, select, put} from "redux-saga/effects";
import {setSettingsPrefix} from "../screens/screen_actions";
import {isAction, Action} from "../action_utils/action_typings";
import {RootState} from "../root/root_reducer";
import {writeSettings, settingsFileExists, readSettingsFile} from "../fs/fs_utils";
import {appStarted, settingsLoaded, settingsPersisted, refreshAllFolders} from "../root/actions/root_actions";
import {SettingsState} from "../root/types";

export function* settingsSaga() {
    while(true) {
        const action: Action<any> = yield take("*"); // Match all

        if(isAction(action, appStarted)) {
            const exists = yield settingsFileExists();
            if(exists) {
                const settings:SettingsState = yield readSettingsFile();
                yield put(settingsLoaded(settings));
                yield put(refreshAllFolders());
            }
        }

        if(action.type.startsWith(setSettingsPrefix)) {
            const settingsState:SettingsState =  yield select((state:RootState) => state.data.settings);
            yield writeSettings(settingsState);
            yield put(settingsPersisted());
        }
    }
}