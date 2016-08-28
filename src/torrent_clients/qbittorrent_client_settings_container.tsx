import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {RootState} from "../root/root_reducer";
import {isURL} from "../validation/validation";
import {
    setLanguageValue,
    setTorrentClientId,
    setTorrentClientUrl,
    setTorrentClientUserName,
    setTorrentClientPassword,
    refreshTorrentClientToken
} from "../screens/screen_actions";
import {createIntlApi} from "../intl/intl";

interface QBittorrentSettingsContainerOwnProps {

}

interface QBittorrentSettingsContainerStateProps {
    getString: (textId: string) => string,
    torrentClientConnectable: boolean,
    torrentClientStatusIsLoading: boolean,
    torrentClientError: any,
    torrentClientId: string,
    torrentClientUrl: string,
    torrentClientUserName: string,
    torrentClientPassword: string,
}

interface QBittorrentSettingsContainerDispatchProps {
    onLanguageChange: (event: Event) => void,
    onTorrentClientChange: (event: Event) => void,
    onTorrentClientUrlChange: (event: Event) => void,
    onTorrentClientUserNameChange: (event: Event) => void,
    onTorrentClientPasswordChange: (event: Event) => void,
    onTorrentClientSubmitClicked: (event: Event) => void
}

export type QBittorrentSettingsContainerProps = QBittorrentSettingsContainerOwnProps & QBittorrentSettingsContainerStateProps & QBittorrentSettingsContainerDispatchProps;

function qBittorentClientSettingsContainer(props:QBittorrentSettingsContainerProps) {
    const urlValid = isURL(props.torrentClientUrl);
    const urlGroupCss = "form-group " + (urlValid ? "has-success" : "has-error");

    const submitDisabled = (!urlValid || props.torrentClientStatusIsLoading);

    return (
        <div>
            <div className={urlGroupCss}>
                <label htmlFor="torrent-client-url" className="control-label">{props.getString("settings_torrent_client_url")}</label>
                <input type="text" id="torrent-client-url" className="form-control" onChange={props.onTorrentClientUrlChange}
                       value={props.torrentClientUrl}/>
            </div>
            {(props.torrentClientConnectable)
                ? <div className="alert alert-success" role="alert">{props.getString("settings_torrent_client_sucess")}</div>
                : (props.torrentClientError)
                ? <div className="alert alert-danger" role="alert">{props.torrentClientError}</div>
                : null
            }
            {<button type="submit" disabled={submitDisabled} onClick={props.onTorrentClientSubmitClicked}
                     className="btn btn-primary">{props.getString("settings_torrent_client_get_token")}</button>}
            {
                props.torrentClientStatusIsLoading
                    ? (<i className="fa fa-spinner fa-pulse fa-2x fa-fw vertical-align-middle"></i>)
                    : null
            }
        </div>
    );
}

function mapStateToProps(state: RootState, ownProps: QBittorrentSettingsContainerOwnProps): QBittorrentSettingsContainerStateProps {
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
        torrentClientUrl: state.data.settings.torrentClientSettings.url,
        torrentClientUserName: state.data.settings.torrentClientSettings.userName,
        torrentClientPassword: state.data.settings.torrentClientSettings.password
    };

}

function mapDispatchToProps(dispatch: Dispatch<any>): QBittorrentSettingsContainerDispatchProps {

    return {
        onLanguageChange: (event: Event) => dispatch(setLanguageValue((event.target as HTMLInputElement).value)),
        onTorrentClientChange: (event: Event) => dispatch(setTorrentClientId((event.target as HTMLInputElement).value)),
        onTorrentClientUrlChange: (event: Event) => dispatch(setTorrentClientUrl((event.target as HTMLInputElement).value.trim())),
        onTorrentClientUserNameChange: (event: Event) => dispatch(setTorrentClientUserName((event.target as HTMLInputElement).value)),
        onTorrentClientPasswordChange: (event: Event) => dispatch(setTorrentClientPassword((event.target as HTMLInputElement).value)),
        onTorrentClientSubmitClicked: (event: Event) => {
            event.preventDefault();
            dispatch(refreshTorrentClientToken());
        }
    };

}


export const QBittorrentClientSettingsContainer = connect(mapStateToProps, mapDispatchToProps)(qBittorentClientSettingsContainer);