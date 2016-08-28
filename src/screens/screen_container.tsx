import * as React from "react";
import {RootState} from "../root/root_reducer";
import {connect} from "react-redux";
import {SettingsScreenId, SettingsContainer} from "./settings_container";
import {TrackersContainerId, TrackersContainer} from "./trackers_container";
import {FoldersScreenId, FoldersContainer} from "./folders_container";
import {SearchScreenId, SearchContainer} from "./search_container";

export interface screenContainerProps {
    activeScreenId: string,
}

function screenContainer(props: screenContainerProps) {

    switch (props.activeScreenId) {
        case SettingsScreenId:
            return <SettingsContainer />;
        case TrackersContainerId:
            return <TrackersContainer />;
        case FoldersScreenId:
            return <FoldersContainer />;
        case SearchScreenId:
            return <SearchContainer />;
        default:
            return <SettingsContainer />;
    }
}

function mapStateToProps(state: RootState): screenContainerProps {
    const activeScreenId = state.ui.activeScreen.id;
    return {
        activeScreenId,
    };
}

export const ScreenContainer = connect(mapStateToProps)(screenContainer);