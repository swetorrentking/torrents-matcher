import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {RootState} from "../root/root_reducer";
import {setTorrentClientPath} from "../screens/screen_actions";
import {createIntlApi} from "../intl/intl";
import {remote} from "electron";

interface UTorrentSettingsContainerOwnProps {

}

interface UTorrentSettingsContainerStateProps {
    getString: (textId: string) => string,
    torrentClientConnectable: boolean,
    torrentClientStatusIsLoading: boolean,
    torrentClientError: any,
    torrentClientId: string,
    torrentClientPath: string,
}

interface UTorrentSettingsContainerDispatchProps {
    onTorrentClientBrowseClicked: (event: Event) => void
}

export type UTorrentSettingsContainerProps = UTorrentSettingsContainerOwnProps & UTorrentSettingsContainerStateProps & UTorrentSettingsContainerDispatchProps;

function uTorrentClientSettingsContainer(props:UTorrentSettingsContainerProps) {
    const pathValid = !!props.torrentClientPath.length;
    const pathGroupCss = "form-group " + (pathValid ? "has-success" : "has-error");

    return (
        <div>
            <div className={pathGroupCss}>
                <label htmlFor="torrent-path-url" className="control-label">{props.getString("settings_torrent_client_path")}</label>
                <input disabled="disabled" type="text" id="torrent-path-url" className="form-control"
                       value={props.torrentClientPath}/>
            </div>
            {(props.torrentClientConnectable)
                ? <div className="alert alert-success" role="alert">{props.getString("settings_torrent_client_sucess")}</div>
                : (props.torrentClientError)
                ? <div className="alert alert-danger" role="alert">{props.torrentClientError}</div>
                : null
            }
            {<button type="submit" onClick={props.onTorrentClientBrowseClicked}
                     className="btn btn-primary">{props.getString("settings_torrent_client_browse")}</button>}
            {
                props.torrentClientStatusIsLoading
                    ? (<i className="fa fa-spinner fa-pulse fa-2x fa-fw vertical-align-middle"></i>)
                    : null
            }
        </div>
    );
}

function mapStateToProps(state: RootState, ownProps: UTorrentSettingsContainerOwnProps): UTorrentSettingsContainerStateProps {
    const userLanguage = state.data.settings.language;
    const getString = createIntlApi(userLanguage);
    return {
        getString,
        torrentClientId: state.data.settings.torrentClientSettings ?
            state.data.settings.torrentClientSettings.clientId
            : "",
        torrentClientConnectable: state.data.torrentClientStatus.connectable,
        torrentClientStatusIsLoading: state.ui.settingsScreen.isLoadingStatus,
        torrentClientError: state.data.torrentClientStatus.error,
        torrentClientPath: state.data.settings.torrentClientSettings.pathToClient
    };

}

function mapDispatchToProps(dispatch: Dispatch<any>): UTorrentSettingsContainerDispatchProps {

    return {
        onTorrentClientBrowseClicked: (event: Event) => {
            event.preventDefault();
            const files = remote.dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections'],
                filters: [
                    {name: 'uTorrent', extensions: ['exe']},
                ]
            });
            if (files) {
                dispatch(setTorrentClientPath(files[0]));
            }
        }
    };

}


export const UTorrentClientSettingsContainer = connect(mapStateToProps, mapDispatchToProps)(uTorrentClientSettingsContainer);