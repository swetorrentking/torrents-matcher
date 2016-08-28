import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore} from "./root/create_store";
import {Provider} from "react-redux";
import {MenuContainer} from "./menu/menu_container";
import {ScreenContainer} from "./screens/screen_container";
import {appStarted, refreshAllFolders} from "./root/actions/root_actions";
// import "bootstrap-sass/assets/stylesheets/_bootstrap-sprockets.scss";
// import "bootstrap-sass/assets/stylesheets/_bootstrap.scss";
import 'font-awesome/scss/font-awesome.scss';
require("./scss/main");
declare var VERSION:any;

const store = createStore();
document.title += ` ${VERSION}`;
ReactDOM.render(
    <Provider store={store}>
        <div className="container-fluid">
            <div className="row">
                <div className="col-xs-2 menu">
                    <MenuContainer />
                </div>
                <div className="col-xs-10 main">
                    <ScreenContainer />
                </div>
            </div>
        </div>
    </Provider>,
    document.getElementById("root")
);

store.dispatch(appStarted());