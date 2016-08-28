import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {createIntlApi} from "../intl/intl";
import {HeaderComponentProps, HeaderComponent} from "../root/components/header_component";
import {deleteFolder, saveNewFoldersPath} from "./screen_actions";
import {refreshFolder} from "../root/actions/root_actions";
import {remote} from "electron";
import {FolderData, FolderResultsState, FolderId, FolderResult} from "../root/types";
import {RootState} from "../root/root_reducer";

interface FoldersContainerOwnProps {

}

interface FoldersContainerStateProps {
    getString: (textId: string) => string,
    folders: FolderData[],
    folderResultsState: FolderResultsState
}

interface FoldersContainerDispatchProps {
    onDeleteClicked: (folderId: FolderId) => void,
    onRefreshClicked: (folderId: FolderId) => void,
    onClickedAddFolder: (event: Event) => void
}

export type FoldersContainerProps = FoldersContainerOwnProps & FoldersContainerStateProps & FoldersContainerDispatchProps;
export const FoldersScreenId = "folders";

function foldersContainer(props: FoldersContainerProps) {
    return (
        <FoldersComponent {...props}/>
    );
}

function FoldersComponent(props: FoldersContainerProps) {

    const headerProps: HeaderComponentProps = {
        heading: props.getString("folders_main_heading")
    };

    return (
        <div className="folders-container">
            <HeaderComponent {...headerProps} />
            <FolderTable {...props}/>
            <form>
                <button type="button" onClick={props.onClickedAddFolder}
                        className="btn btn-primary">{props.getString("folders_add_path")}</button>
            </form>
        </div>
    );
}

interface FolderTableProps {
    getString: (textId: string) => string;
    folders: FolderData[],
    onDeleteClicked: (folderId: FolderId) => void,
    onRefreshClicked: (folderId: FolderId) => void,
    folderResultsState: FolderResultsState
}

function FolderTable(props: FolderTableProps) {
    return (
        <div className="table-responsive">
            <table className="table table-hover table-striped">
                <thead>
                <tr>
                    <th>{props.getString("folders_table_header_path")}</th>
                    <th>{props.getString("folders_table_header_releases")}</th>
                    <th>{props.getString("folders_table_header_actions")}</th>
                </tr>
                </thead>
                <tbody>
                {props.folders.map((folder: FolderData) => (<FolderRow
                    key={folder.id}
                    folder={folder}
                    folderResult={props.folderResultsState[folder.id]}
                    {...props} />))}
                </tbody>
            </table>
        </div>
    );
}

interface FolderRowProps {
    folder: FolderData,
    getString: (textId: string) => string,
    onDeleteClicked: (folderId: FolderId) => void,
    onRefreshClicked: (folderId: FolderId) => void,
    folderResult: FolderResult
}

function FolderRow(props: FolderRowProps) {

    const onDelete = (event: Event) => {
        event.preventDefault();
        props.onDeleteClicked(props.folder.id);
    };

    const onRefresh = (event: Event) => {
        event.preventDefault();
        props.onRefreshClicked(props.folder.id);
    };

    const numberOfResult = props.folderResult && props.folderResult.releaseFolders.length;
    const hasError = props.folderResult && !props.folderResult.valid;

    return (
        <tr className={hasError ? "danger" : ""}>
            <td>
                {props.folder.path}
                <br />
                {hasError ? <span className="alert-danger">{props.folderResult.error.message}</span> : undefined}
            </td>
            <td>{numberOfResult || hasError || (<i className="fa fa-spinner fa-pulse fa-1x fa-fw vertical-align-middle"></i>)}</td>
            <td>
                <button type="button" onClick={onRefresh} className="btn btn-success btn-xs">
                    <i className="fa fa-refresh" aria-hidden="true"></i>
                </button>
                <button type="button" onClick={onDelete} className="btn btn-danger btn-xs">
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </td>
        </tr>
    );
}


function mapStateToProps(state: RootState, ownProps: FoldersContainerOwnProps): FoldersContainerStateProps {
    const userLanguage = state.data.settings.language;
    const getString = createIntlApi(userLanguage);

    return {
        folders: state.data.settings.folders,
        getString,
        folderResultsState: state.data.folderResults
    };

}

function mapDispatchToProps(dispatch: Dispatch<any>): FoldersContainerDispatchProps {

    return {
        onDeleteClicked: (folderId: FolderId) => dispatch(deleteFolder(folderId)),
        onRefreshClicked: (folderId: FolderId) => dispatch(refreshFolder(folderId)),
        onClickedAddFolder: (event: Event) => {
            event.preventDefault();
            const folders = remote.dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']});
            if (folders) {
                dispatch(saveNewFoldersPath(folders));
            }
        }
    };

}

export const FoldersContainer = connect(mapStateToProps, mapDispatchToProps)(foldersContainer);