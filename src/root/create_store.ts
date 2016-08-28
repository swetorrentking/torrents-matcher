import {createStore as _createStore, applyMiddleware, compose} from "redux";
import {createRootReducer} from "./root_reducer";
import createSagaMiddleware from 'redux-saga'
import createLogger = require('redux-logger');
import {rootSaga} from "../sagas/root_saga";

export function createStore() {

    const actionLogger = (<any>createLogger)({collapsed: true});

    const rootReducer = createRootReducer();
    const sagaMiddleware = createSagaMiddleware();
    const store = _createStore(rootReducer, applyMiddleware(actionLogger, sagaMiddleware));
    sagaMiddleware.run(rootSaga)
    return store;
}