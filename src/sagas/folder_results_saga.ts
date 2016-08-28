import {take, select, put} from "redux-saga/effects";
import {saveNewFoldersPath} from "../screens/screen_actions";
import {Action} from "../action_utils/action_typings";
import {folderExists, getSubDirectoriesAsync} from "../fs/fs_utils";
import {saveFolderResult, refreshFolder, refreshAllFolders} from "../root/actions/root_actions";
import * as path from "path";
import {FolderData, FolderResultsState, FolderResult, ReleaseFolder} from "../root/types";
import {RootState} from "../root/root_reducer";

export function* folderResultsSaga() {
    while(true) {
        const action: Action<any> = yield take([
            saveNewFoldersPath.type,
            refreshFolder.type,
            refreshAllFolders.type
        ]);
        const folders:FolderData[] = yield select((state:RootState) => state.data.settings.folders);
        const folderResults:FolderResultsState = yield select((state:RootState) => state.data.folderResults);

        const newFolders:FolderData[] = folders.filter((folder:FolderData) => !folderResults[folder.id]);

        for(let folder of newFolders) {
            try {
                yield folderExists(folder.path);
                const dirResult = yield getSubDirectoriesAsync(folder.path);
                const releaseFolders = getReleaseFolders(dirResult);

                const result:FolderResult = {
                    folderId: folder.id,
                    releaseFolders: releaseFolders,
                    valid: true,
                };

                yield put(saveFolderResult(result))
            }
            catch (e) {
                const result:FolderResult = {
                    folderId: folder.id,
                    releaseFolders: [],
                    valid: false,
                    error: e
                };

                yield put(saveFolderResult(result))
            }
        }
    }
}

function getReleaseFolders(fullPaths:string[]):ReleaseFolder[] {
    const releaseRegex = /(\w+[-\._])\w+$/;
    const releasePaths = fullPaths.filter((folderPath:string) => releaseRegex.test(folderPath));
    const releaseFolders:ReleaseFolder[] = releasePaths.map((folderPath:string) => {
        const arr = folderPath.split(path.sep);
        const name = arr[arr.length-1];

        return {
            fullPath: folderPath,
            name
        }
    });

    return releaseFolders;
}