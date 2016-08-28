import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {RootState} from "../root/root_reducer";
import {createIntlApi, availableLanguages, Language} from "../intl/intl";
import {HeaderComponentProps, HeaderComponent} from "../root/components/header_component";
import {
    setLanguageValue,
    setTorrentClientId,
    setTorrentClientUrl,
    setTorrentClientPassword,
    setTorrentClientUserName,
    refreshTorrentClientToken
} from "./screen_actions";
import {
    availableClients,
    torrentSettingsRenderers,
    AvailableClient,
    PLATFORMS
} from "../torrent_clients/available_clients";

interface SettingsContainerOwnProps {

}

interface SettingsContainerStateProps {
    getString: (textId: string) => string,
    language: Language,
    torrentClientConnectable: boolean,
    torrentClientStatusIsLoading: boolean,
    torrentClientError: any,
    torrentClientId: string,
    torrentClientUrl: string,
    torrentClientUserName: string,
    torrentClientPassword: string,
}

interface SettingsContainerDispatchProps {
    onLanguageChange: (event: Event) => void,
    onTorrentClientChange: (event: Event) => void,
    onTorrentClientUrlChange: (event: Event) => void,
    onTorrentClientUserNameChange: (event: Event) => void,
    onTorrentClientPasswordChange: (event: Event) => void,
    onTorrentClientSubmitClicked: (event: Event) => void
}

export type SettingsContainerProps = SettingsContainerOwnProps & SettingsContainerStateProps & SettingsContainerDispatchProps;
export const SettingsScreenId = "settings";

function settingsContainer(props: SettingsContainerProps) {
    return (
        <SettingsComponent {...props}/>
    );
}

function SettingsComponent(props: SettingsContainerProps) {
    const headerProps: HeaderComponentProps = {
        heading: props.getString("settings_main_heading")
    };
    const TorrentClientSettingsRenderer = torrentSettingsRenderers[props.torrentClientId];
    return (
        <div className="settings-container">
            <HeaderComponent {...headerProps} />
            <form>
                <div className="form-group">
                    <label htmlFor="language-text" className="control-label">{props.getString("language")}</label>
                    <select id="language-text" className="form-control" onChange={props.onLanguageChange}
                            value={props.language}>
                        {availableLanguages.map((language: Language) => <option key={language}
                                                                                value={language}>{props.getString(language)}</option>)}
                    </select>
                </div>
                <h2>{props.getString("settings_torrent_client_heading")}</h2>
                <div className="form-group">
                    <label htmlFor="torrent-client"
                           className="control-label">{props.getString("settings_torrent_client_heading")}</label>
                    {<select id="torrent-client" className="form-control" onChange={props.onTorrentClientChange}
                             value={props.torrentClientId}>
                        <option value="">{props.getString("settings_torrent_client_no_choice")}</option>
                        {
                            getAvailableClients()
                                .map((client: AvailableClient) => (
                                    <option
                                        key={client.name.toLocaleLowerCase()}
                                        value={client.name.toLocaleLowerCase()}>
                                        {client.name}
                                    </option>)
                                )
                        }
                    </select>}
                    {
                        props.torrentClientId && TorrentClientSettingsRenderer
                            ? <TorrentClientSettingsRenderer {...props} />
                            : null
                    }
                </div>
            </form>
        </div>
    );
}

function getAvailableClients() {
    const clients = Object.keys(availableClients)
        .map((clientId: string) => availableClients[clientId])
        .filter((client: AvailableClient) => {
            if (!isOsx()) {
                return true;
            }

            if(isDev()) {
                return true;
            }

            return client.platform !== PLATFORMS.WINDOWS;
        });

    return clients;
}

function isDev() {
    return process.env.DEV_ENV;
}

function isOsx() {
    return process.platform === 'darwin';
}

function mapStateToProps(state: RootState, ownProps: SettingsContainerOwnProps): SettingsContainerStateProps {
    const userLanguage = state.data.settings.language;
    const getString = createIntlApi(userLanguage);
    return {
        language: state.data.settings.language,
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

function mapDispatchToProps(dispatch: Dispatch<any>): SettingsContainerDispatchProps {

    return {
        onLanguageChange: (event: Event) => dispatch(setLanguageValue((event.target as HTMLInputElement).value)),
        onTorrentClientChange: (event: Event) => dispatch(setTorrentClientId((event.target as HTMLInputElement).value)),
        onTorrentClientUrlChange: (event: Event) => dispatch(setTorrentClientUrl((event.target as HTMLInputElement).value)),
        onTorrentClientUserNameChange: (event: Event) => dispatch(setTorrentClientUserName((event.target as HTMLInputElement).value)),
        onTorrentClientPasswordChange: (event: Event) => dispatch(setTorrentClientPassword((event.target as HTMLInputElement).value)),
        onTorrentClientSubmitClicked: (event: Event) => {
            event.preventDefault();
            dispatch(refreshTorrentClientToken());
        }
    };

}

export const SettingsContainer = connect(mapStateToProps, mapDispatchToProps)(settingsContainer);