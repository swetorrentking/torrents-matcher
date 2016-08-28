import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {RootState} from "../root_reducer";
import {helloAction} from "../actions/root_actions";

interface RootComponentOwnProps {

}

interface RootComponentStateProps {

}

interface RootComponentDispatchProps {
    test: () => void
}

export type RootComponentProps = RootComponentOwnProps & RootComponentStateProps & RootComponentDispatchProps;

function rootComponent(props:RootComponentProps) {
    return (
        <h1 onClick={() => {props.test()}}>Hello World!</h1>
    );
}

function mapStateToProps(state:RootState, ownProps:RootComponentOwnProps):RootComponentStateProps {

    return {
    };

}

function mapDispatchToProps(dispatch:Dispatch<any>):RootComponentDispatchProps {

    return {
        test: () => dispatch(helloAction())
    };

}

export const RootComponent = connect(mapStateToProps, mapDispatchToProps)(rootComponent);