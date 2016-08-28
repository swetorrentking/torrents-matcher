import * as React from "react";
import {RootState} from "../root/root_reducer";
import {createIntlApi} from "../intl/intl";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {changeMainScreen} from "./actions";

export interface MenuContainerStateProps {
    activeScreenId: string,
    getString: (textId: string) => string
}

export interface MenuContainerDispatchProps {
    onClick: (screenId:string) => void
}

interface MenuContainerProps extends MenuContainerStateProps, MenuContainerDispatchProps {

}

export interface MenuComponentProps {
    menuItems: MenuItem[],
    itemClicked: (screenId:string) => void
}

interface MenuItem {
    id: string,
    text: string,
    isActive: boolean
}

const menuIds: string[] = [
    "settings",
    "trackers",
    "folders",
    "search"
];

function menuContainer(props:MenuContainerProps) {
    const menuItems: MenuItem[] = menuIds.map((menuId:string) => {
        return {
            id: menuId,
            text: props.getString(`menu_item_${menuId}`),
            isActive: props.activeScreenId === menuId
        }
    });

    return (
        <MenuComponent menuItems={menuItems} itemClicked={props.onClick}/>
    );
}

function MenuComponent(props: MenuComponentProps) {
    return (
        <ul className="nav nav-pills nav-stacked">
            {props.menuItems.map((item: MenuItem) => createMenuItem(item, () => props.itemClicked(item.id)))}
        </ul>
    );
}

function createMenuItem(menuItem: MenuItem, itemClicked:() => void) {
    const cssClass = menuItem.isActive ? "active" : undefined;
    return (
        <li key={menuItem.id} role="presentation" className={cssClass}><a href="#" onClick={itemClicked}>{menuItem.text}</a></li>
    );
}

function mapStateToProps(state: RootState): MenuContainerStateProps {
    const activeScreenId = state.ui.activeScreen.id;
    const getString = createIntlApi(state.data.settings.language);
    return {
        activeScreenId,
        getString
    }
}

function mapDispatchToProps(dispatch: Dispatch<any>):MenuContainerDispatchProps {
    return {
        onClick: (screenId:string) => dispatch(changeMainScreen(screenId))
    };
}


export const MenuContainer = connect(mapStateToProps, mapDispatchToProps)(menuContainer);