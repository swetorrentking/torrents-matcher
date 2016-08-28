import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {createIntlApi} from "../intl/intl";
import {HeaderComponentProps, HeaderComponent} from "../root/components/header_component";
import {
    setNewTrackerNameValue,
    setNewTrackerUrlValue,
    deleteTracker,
    setNewTrackerPasskeyValue,
    verifyNewTracker
} from "./screen_actions";
import {isURL, isValidPasskey} from "../validation/validation";
import {TrackerData, TrackerStatusState, NewTrackerState, TrackerId, TrackerStatus} from "../root/types";
import {RootState} from "../root/root_reducer";

interface TrackersContainerOwnProps {

}

interface TrackersContainerStateProps {
    trackers: TrackerData[],
    getString: (textId: string) => string,
    newTrackerNameValue: string,
    newTrackerUrlValue: string,
    newTrackerPasskeyValue: string,
    newTrackerError: any,
    trackerStatus: TrackerStatusState
}

interface TrackersContainerDispatchProps {
    setNewTrackerNameValue: (name: string) => void,
    setNewTrackerUrlValue: (url: string) => void,
    setNewTrackerPasskeyValue: (passkey: string) => void,
    saveNewTracker: (newTracker: NewTrackerState) => void,
    deleteTracker: (id: TrackerId) => void
}

export interface TrackersContainerProps extends TrackersContainerOwnProps, TrackersContainerStateProps, TrackersContainerDispatchProps {

}

export const TrackersContainerId = "trackers";

function trackersContainer(props: TrackersContainerProps) {
    return (
        <TrackersComponent {...props}/>
    );
}

function TrackersComponent(props: TrackersContainerProps) {
    const headerProps: HeaderComponentProps = {
        heading: props.getString("trackers_main_heading")
    };

    const newTrackerState: NewTrackerState = {
        name: "", // Populated throu
        url: props.newTrackerUrlValue,
        passkey: props.newTrackerPasskeyValue
    };

    const urlValid = isURL(props.newTrackerUrlValue);
    const urlGroupCss = "form-group " + (urlValid ? "has-success" : "has-error");

    const validPasskey = isValidPasskey(props.newTrackerPasskeyValue);
    const passkeyGroupCss = "form-group " + (validPasskey ? "has-success" : "has-error");

    const submitDisabled = !(urlValid && validPasskey);

    const onSave = (event: Event) => {
        event.preventDefault();
        props.saveNewTracker(newTrackerState);
    };

    return (
        <div className="trackers-container">
            <HeaderComponent {...headerProps} />
            <TrackerTable {...props}/>
            { props.newTrackerError
                ? <div className="alert alert-danger" role="alert">{props.newTrackerError}</div>
                : null
            }
            <form>
                <div className={urlGroupCss}>
                    <label htmlFor="new-tracker-url"
                           className="control-label">{props.getString("trackers_add_url")}</label>
                    <input type="text" className="form-control" id="new-tracker-url"
                           onChange={(event:Event) => props.setNewTrackerUrlValue((event.target as HTMLInputElement).value)}
                           value={props.newTrackerUrlValue} placeholder={props.getString("trackers_add_url")}/>
                </div>
                <div className={passkeyGroupCss}>
                    <label htmlFor="passkey" className="control-label">Passkey</label>
                    <input type="text" className="form-control" id="passkey"
                           onChange={(event:Event) => props.setNewTrackerPasskeyValue((event.target as HTMLInputElement).value)}
                           value={props.newTrackerPasskeyValue} placeholder="Passkey"/>
                </div>
                <button type="submit" disabled={submitDisabled} onClick={onSave}
                        className="btn btn-primary">{props.getString("trackers_add_save")}</button>
            </form>
        </div>
    );
}

function TrackerTable(props: TrackersContainerProps) {
    return (
        <div className="table-responsive">
            <table className="table table-hover table-striped">
                <thead>
                <tr>
                    <th>{props.getString("trackers_table_heading_status")}</th>
                    <th>{props.getString("trackers_table_heading_name")}</th>
                    <th>{props.getString("trackers_table_heading_url")}</th>
                    <th>{props.getString("trackers_table_heading_passkey")}</th>
                    <th>{props.getString("trackers_table_heading_actions")}</th>
                </tr>
                </thead>
                <tbody>
                {props.trackers.map((tracker: TrackerData) => (
                    <TrackerRow key={tracker.id} tracker={tracker} {...props} />))}
                </tbody>
            </table>
        </div>
    );
}

interface TrackerRowProps {
    tracker: TrackerData,
    getString: (textId: string) => string,
    deleteTracker: (id: TrackerId) => void,
    trackerStatus: TrackerStatusState
}

function TrackerRow(props: TrackerRowProps) {
    const trackerStatus = props.trackerStatus.find((trackerStatus: TrackerStatus) => trackerStatus.trackerId === props.tracker.id);
    const onDelete = (event: Event) => {
        event.preventDefault();
        props.deleteTracker(props.tracker.id);
    };

    return (
        <tr>
            <td>{ getTrackerStatusIcon(trackerStatus)}</td>
            <td>{props.tracker.name}</td>
            <td>{props.tracker.url}</td>
            <td>{props.tracker.passkey}</td>
            <td>
                <button type="button" onClick={onDelete} className="btn btn-danger btn-xs">
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </td>
        </tr>
    );
}

function getTrackerStatusIcon(trackerStatus: TrackerStatus) {

    if (trackerStatus && trackerStatus.functional) {
        return (
            <i className="fa fa-check status" aria-hidden="true"></i>
        );
    }

    return (
        <i className="fa fa-times status" aria-hidden="true"></i>
    );
}

function mapStateToProps(state: RootState): TrackersContainerStateProps {
    const userLanguage = state.data.settings.language;
    const getString = createIntlApi(userLanguage);
    return {
        newTrackerNameValue: state.ui.newTracker.name,
        newTrackerUrlValue: state.ui.newTracker.url,
        newTrackerPasskeyValue: state.ui.newTracker.passkey,
        newTrackerError: state.ui.newTracker.error,
        trackers: state.data.settings.trackers,
        getString,
        trackerStatus: state.data.trackerStatus
    };

}

function mapDispatchToProps(dispatch: Dispatch<any>): TrackersContainerDispatchProps {

    return {
        setNewTrackerNameValue: (name: string) => dispatch(setNewTrackerNameValue(name)),
        setNewTrackerUrlValue: (url: string) => dispatch(setNewTrackerUrlValue(url.trim())),
        setNewTrackerPasskeyValue: (passkey: string) => dispatch(setNewTrackerPasskeyValue(passkey.trim())),
        saveNewTracker: (newTracker: NewTrackerState) => dispatch(verifyNewTracker(newTracker)),
        deleteTracker: (id: TrackerId)=> dispatch(deleteTracker(id))
    };
}

export const TrackersContainer = connect(mapStateToProps, mapDispatchToProps)(trackersContainer);