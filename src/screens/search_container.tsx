import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {createIntlApi} from "../intl/intl";
import {HeaderComponentProps, HeaderComponent} from "../root/components/header_component";
import {
    setChooseTrackerId,
    startSearch,
    addToTorrentClient,
    setSelectedMatchedTorrentId,
    toggleShowSeed,
    setAllTorrentsSelected,
    setTorrentDownloaded,
    setTorrentsDownloaded
} from "./screen_actions";
import {shell} from "electron";
import {AddToTorrentClientData} from "../torrent_clients/torrent_client_api";
import {
    TrackerData,
    TrackerId,
    SearchResultState,
    MatchedTorrent,
    TrackerStatusState,
    TrackerStatus
} from "../root/types";
import {RootState} from "../root/root_reducer";


interface SearchContainerOwnProps {

}

interface SearchContainerStateProps {
    getString: (textId: string, ...parameters: string[]) => string,
    trackers: TrackerData[],
    choosenTrackerId: TrackerId,
    showSeed: boolean,
    hasTorrentClientSet: boolean,
    searchResult: SearchResultState,
    filteredTorrents: MatchedTorrent[],
    searching: boolean,
    trackerStatus: TrackerStatusState,
    allSelectedForDownload: boolean
}

interface SearchContainerDispatchProps {
    onTrackerSelectChange: (event: Event) => void,
    onSearchButtonClicked: (event: Event) => void,
    onAddAllCheckedTorrentsClicked: (torrents: MatchedTorrent[]) => (event: Event) => void
    onTorrentChecked: (matchedTorrentId: string) => (event: Event) => void,
    onSelectAllTorrentsChecked: (event: Event) => void,
    onShowSeedClicked: (event: Event) => void,
    onDownloadSingleTorrent: (torrent: MatchedTorrent) => (event: Event) => void,
    onAddToTorrentClientSingle: (torrent: MatchedTorrent) => (event: Event) => void
}

export type SearchContainerProps = SearchContainerOwnProps & SearchContainerStateProps & SearchContainerDispatchProps;
export const SearchScreenId = "search";

function searchContainer(props: SearchContainerProps) {
    return (
        <SearchComponent {...props}/>
    );
}

function SearchComponent(props: SearchContainerProps) {
    const headerProps: HeaderComponentProps = {
        heading: props.getString("search_main_heading")
    };

    const searchButtonDisabled = !props.choosenTrackerId.length || props.searching;
    const downloadAllButtonDisabled = !props.filteredTorrents.filter((torrent: MatchedTorrent) => torrent.selected).length;

    return (
        <div className="search-container">
            <HeaderComponent {...headerProps} />
            <form className="form-inline">
                <div className="form-group">
                    <label htmlFor="tracker">{props.getString("search_form_tracker_select")}</label>
                    <select className="form-control" id="tracker-select" value={props.choosenTrackerId}
                            onChange={props.onTrackerSelectChange}>
                        {getValidTrackers(props.trackers, props.trackerStatus)
                            .map((tracker: TrackerData) => (
                                <option key={tracker.id} value={tracker.id}>{tracker.name}</option>))}
                    </select>
                    <input id="show-seed" type="checkbox" checked={props.showSeed} onChange={props.onShowSeedClicked}/>
                    <label htmlFor="show-seed">{props.getString("search_form_tracker_show_seed")}</label>
                    <button onClick={props.onSearchButtonClicked} type="submit" className="btn btn-primary"
                            disabled={searchButtonDisabled}>
                        <i className="fa fa-search" aria-hidden="true"></i> {props.getString("search_form_submit")}
                    </button>
                    { props.searching
                        ? (<i className="fa fa-spinner fa-pulse fa-2x fa-fw vertical-align-middle"></i>)
                        : null
                    }
                </div>
            </form>
            <ResultInfo {...props}/>
            { (props.searchResult.hasSearched && props.hasTorrentClientSet)
                ?<button type="button" disabled={downloadAllButtonDisabled}
                         onClick={props.onAddAllCheckedTorrentsClicked(props.filteredTorrents)}
                         className="btn btn-default">
                <i className="fa fa-share"
                   aria-hidden="true"></i> {props.getString("search_table_add_marked_torrents_to_client")}
            </button>
                : null
            }
            { props.searchResult.hasSearched
                ? (
                <SearchTable {...props} />)
                : null
            }
        </div>
    );
}

function getValidTrackers(trackers: TrackerData[], trackerStatus: TrackerStatusState) {
    if (!trackerStatus.length) {
        return [];
    }

    return trackers
        .filter((tracker: TrackerData) => {
            const status = trackerStatus.find((status: TrackerStatus) => status.trackerId === tracker.id);

            return status && status.functional;
        });
}

interface SearchTableProps {
    getString: (textId: string) => string,
    searchResult: SearchResultState,
    filteredTorrents: MatchedTorrent[],
    trackerStatus: TrackerStatusState,
    showSeed: boolean,
    choosenTrackerId: TrackerId,
    hasTorrentClientSet: boolean,
    onTorrentChecked: (matchedTorrentId: string) => (event: Event) => void,
    onSelectAllTorrentsChecked: (event: Event) => void,
    allSelectedForDownload: boolean,
    onDownloadSingleTorrent: (torrent: MatchedTorrent) => (event: Event) => void,
    onAddToTorrentClientSingle: (torrent: MatchedTorrent) => (event: Event) => void
}

interface ResultInfoProps {
    searchResult: SearchResultState,
    filteredTorrents: MatchedTorrent[],
    getString: (textId: string, ...parameters: string[]) => string
}
function ResultInfo(props: ResultInfoProps) {

    if (!props.searchResult.hasSearched) {
        return null;
    }

    if (props.searchResult.error) {
        return (
            <div className="alert alert-danger search-result-message" role="alert">
                {props.searchResult.error.message}
            </div>
        );
    }

    const numberOfMatches = props.filteredTorrents.length;
    return (
        <div className="alert alert-success search-result-message" role="alert">
            {(props.getString("search_result_success", numberOfMatches.toString()) + (numberOfMatches === 1 ? "" : "s"))}
        </div>
    );
}

function SearchTable(props: SearchTableProps) {
    const newArray = props.filteredTorrents.concat([]);
    newArray.sort(sortByName);
    return (
        <div className="table-responsive">
            <table className="table table-hover table-striped">
                <thead>
                <tr>
                    {props.hasTorrentClientSet ?
                        <th><input type="checkbox" onChange={props.onSelectAllTorrentsChecked}/></th> : null}
                    <th>{props.getString("search_table_header_release")}</th>
                    {props.showSeed ? <th>{props.getString("search_table_header_seeding")}</th> : null}
                    <th>{props.getString("search_table_header_actions")}</th>
                </tr>
                </thead>
                <tbody>
                { newArray
                    .map((torrent: MatchedTorrent) => (
                            <tr key={torrent.matchId}>
                                {props.hasTorrentClientSet
                                    ?<td><input type="checkbox" checked={torrent.selected}
                                                disabled={torrent.downloaded || torrent.seeding}
                                                onChange={props.onTorrentChecked(torrent.matchId)}/></td>
                                    : null
                                }
                                <td>{torrent.name}</td>
                                <td className="vertical-align-middle">
                                    {props.showSeed
                                        ? torrent.seeding ? props.getString("search_table_seeding_yes") : props.getString("search_table_seeding_no")
                                        : null
                                    }
                                </td>
                                <td className="actions-container">
                                    <button type="button"
                                            onClick={props.onDownloadSingleTorrent(torrent)}
                                            className="btn btn-default"><i className="fa fa-download"
                                                                           aria-hidden="true"></i>
                                    </button>
                                    <button type="button"
                                            disabled={torrent.downloaded}
                                            onClick={props.onAddToTorrentClientSingle(torrent)}
                                            className="btn btn-default"><i className="fa fa-share" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        )
                    )
                }
                </tbody>
            </table>
        </div>
    );
}

function displayName(name: string) {
    if (name.length < 90) {
        return name;
    }

    return `${name.substr(0, 90)}...`;
}

function sortByName(a: MatchedTorrent, b: MatchedTorrent) {
    const x = a.name.toLowerCase();
    const y = b.name.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
};

function mapStateToProps(state: RootState, ownProps: SearchContainerOwnProps): SearchContainerStateProps {
    const userLanguage = state.data.settings.language;
    const getString = createIntlApi(userLanguage);
    const searchResult = state.data.searchResult;
    const choosenTrackerId = state.ui.searchScreen.choosenTrackerId;
    const showSeed = state.ui.searchScreen.showSeed;
    const hasTorrentClientSet: boolean = !!state.data.settings.torrentClientSettings.clientId;
    const filter = (torrent: MatchedTorrent) => {
        if (showSeed) {
            return true;
        }

        return !torrent.seeding;
    }
    const filteredTorrents = searchResult.matchedTorrents.filter(filter);

    return {
        trackers: state.data.settings.trackers,
        getString,
        choosenTrackerId,
        showSeed,
        hasTorrentClientSet,
        searchResult,
        filteredTorrents,
        searching: state.ui.searchScreen.searching,
        trackerStatus: state.data.trackerStatus,
        allSelectedForDownload: state.ui.searchScreen.allSelectedForDownload
    };

}

function mapDispatchToProps(dispatch: Dispatch<any>): SearchContainerDispatchProps {

    return {
        onTrackerSelectChange: (event: Event) => {
            event.preventDefault();
            dispatch(setChooseTrackerId((event.target as HTMLSelectElement).value));
        },
        onSearchButtonClicked: (event: Event) => {
            event.preventDefault();
            dispatch(startSearch());
        },
        onTorrentChecked: (matchedTorrentId: string) => {
            return (event: Event) => {
                dispatch(setSelectedMatchedTorrentId(matchedTorrentId));
            }
        },
        onAddAllCheckedTorrentsClicked: (torrents: MatchedTorrent[]) => {
            return (event: Event) => {
                event.preventDefault();
                const selectedTorrents: AddToTorrentClientData[] = torrents
                    .filter((torrent: MatchedTorrent) => torrent.selected)
                    .map((torrent: MatchedTorrent) => ({
                        matchId: torrent.matchId,
                        torrentUrl: torrent.downloadUrl,
                        downloadLocation: torrent.localPath
                    }));
                dispatch(setTorrentsDownloaded(selectedTorrents.map((torrent:AddToTorrentClientData) => torrent.matchId)));
                dispatch(addToTorrentClient(selectedTorrents));
            }
        },
        onShowSeedClicked: (event: Event) => dispatch(toggleShowSeed()),
        onSelectAllTorrentsChecked: (event: Event) => {
            const checked = (event.target as HTMLInputElement).checked;
            dispatch(setAllTorrentsSelected(checked))
        },
        onDownloadSingleTorrent: (torrent: MatchedTorrent) => {
            return (event: Event) => {
                event.preventDefault();
                shell.openExternal(torrent.downloadUrl)
            }
        },
        onAddToTorrentClientSingle: (torrent: MatchedTorrent) => {
            return (event: Event) => {
                event.preventDefault();
                dispatch(setTorrentDownloaded(torrent.matchId));
                dispatch(addToTorrentClient([{
                    matchId: torrent.matchId,
                    torrentUrl: torrent.downloadUrl,
                    downloadLocation: torrent.localPath
                }]));
            }
        }
    };

}

export const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(searchContainer);