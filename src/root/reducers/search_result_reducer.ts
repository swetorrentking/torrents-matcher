import {
    trackerDataFetched,
    setChooseTrackerId,
    setSelectedMatchedTorrentId,
    setTorrentDownloaded,
    setTorrentsDownloaded,
    setAllTorrentsSelected
} from "../../screens/screen_actions";
import {isAction, Action} from "../../action_utils/action_typings";
import {SearchResultState, MatchedTorrent} from "../types";

export const searchResultsInitialState:SearchResultState = {
    torrents: [],
    matchedTorrents: [],
    hasSearched: false
};

export function searchResultReducer(state: SearchResultState = searchResultsInitialState, action: Action<any> = null) {

    if (isAction(action, trackerDataFetched)) {
        return action.payload;
    }

    if (isAction(action, setChooseTrackerId)) {
        return searchResultsInitialState;
    }

    if (isAction(action, setSelectedMatchedTorrentId)) {
        const torrent = state.matchedTorrents.find((torrent: MatchedTorrent) => torrent.matchId === action.payload);
        const newTorrent = Object.assign({}, torrent, {selected: !torrent.selected});
        const newMatchedTorrents = state.matchedTorrents
            .filter((torrent: MatchedTorrent) => torrent.matchId !== action.payload)
            .concat(newTorrent);

        return Object.assign({}, state, {matchedTorrents: newMatchedTorrents});
    }

    if (isAction(action, setTorrentDownloaded)) {
        const torrent = state.matchedTorrents.find((torrent: MatchedTorrent) => torrent.matchId === action.payload);
        const newTorrent = Object.assign({}, torrent, {downloaded: true});
        const newMatchedTorrents = state.matchedTorrents
            .filter((torrent: MatchedTorrent) => torrent.matchId !== action.payload)
            .concat(newTorrent);

        return Object.assign({}, state, {matchedTorrents: newMatchedTorrents});
    }

    if (isAction(action, setTorrentsDownloaded)) {
        const newMatchedTorrents = action.payload
            .reduce((accumulated:MatchedTorrent[], current:string) => {
                const torrent = accumulated.find((torrent: MatchedTorrent) => torrent.matchId === current);
                const newTorrent = Object.assign({}, torrent, {downloaded: true});
                const newMatchedTorrents = accumulated
                    .filter((torrent: MatchedTorrent) => torrent.matchId !== current)
                    .concat(newTorrent);

                return newMatchedTorrents;
            }, state.matchedTorrents);

        return Object.assign({}, state, {matchedTorrents: newMatchedTorrents});
    }

    if (isAction(action, setAllTorrentsSelected)) {
        const newMatchedTorrents: MatchedTorrent[] = state.matchedTorrents
            .map((torrent: MatchedTorrent) => Object.assign({}, torrent, {selected: (!torrent.seeding && !torrent.downloaded) && action.payload}))

        return Object.assign({}, state, {matchedTorrents: newMatchedTorrents});
    }

    return state;
}