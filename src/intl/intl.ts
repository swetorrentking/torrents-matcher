interface Languages {
    [id:string]: any
}

const languages:Languages = {
    english: {
        "english": "English",
        "swedish": "Swedish",
        "language": "Language",
        "menu_item_settings": "Settings",
        "menu_item_trackers": "Trackers",
        "menu_item_folders": "Folders",
        "menu_item_search": "Search",
        "settings_main_heading": "Settings",
        "settings_torrent_client_heading": "Torrent client",
        "settings_torrent_client_no_choice": "None",
        "settings_torrent_client_url": "Url",
        "settings_torrent_client_path": "Path",
        "settings_torrent_client_user_name": "User name",
        "settings_torrent_client_password": "Password",
        "settings_torrent_client_get_token": "Get token",
        "settings_torrent_client_browse": "Browse",
        "settings_torrent_client_sucess": "Success!",
        "trackers_main_heading": "Setup trackers",
        "trackers_add_name": "Tracker name",
        "trackers_add_url": "Tracker url",
        "trackers_add_save": "Add",
        "trackers_table_heading_status": "Status",
        "trackers_table_heading_name": "Name",
        "trackers_table_heading_url": "Url",
        "trackers_table_heading_passkey": "Passkey",
        "trackers_table_heading_actions": "#",
        "trackers_table_row_remove": "Remove",
        "folders_main_heading": "Folders",
        "folders_add_path": "Add new folders",
        "folders_add_save": "Add",
        "folders_table_header_path": "Path",
        "folders_table_header_releases": "Nr. releases",
        "folders_table_header_actions": "#",
        "search_main_heading": "Search",
        "search_form_tracker_select": "Tracker:",
        "search_form_select_default": "Choose tracker",
        "search_form_tracker_show_seed": "Show torrents i'm seeding",
        "search_form_submit": "Search",
        "search_result_success": "Found %s torrent",
        "search_table_add_marked_torrents_to_client": "Add selected torrents to torrent client",
        "search_table_header_select": "Select",
        "search_table_header_release": "Release",
        "search_table_header_seeding": "Seeding",
        "search_table_header_actions": "#",
        "search_table_seeding_yes": "Yes",
        "search_table_seeding_no": "No",
        "search_table_add_to_torrent_client": "Torrent client"
    },
    swedish: {
        "english": "Engelska",
        "swedish": "Svenska",
        "language": "Språk",
        "menu_item_settings": "Inställningar",
        "menu_item_trackers": "Trackers",
        "menu_item_folders": "Sökvägar",
        "menu_item_search": "Sök",
        "settings_main_heading": "Inställningar",
        "settings_torrent_client_heading": "Torrentklient",
        "settings_torrent_client_no_choice": "Ingen",
        "settings_torrent_client_url": "Url",
        "settings_torrent_client_path": "Sökväg",
        "settings_torrent_client_user_name": "Användarnamn",
        "settings_torrent_client_password": "Lösenord",
        "settings_torrent_client_get_token": "Hämta token",
        "settings_torrent_client_browse": "Bläddra",
        "settings_torrent_client_sucess": "OK!",
        "trackers_main_heading": "Trackerinställningar",
        "trackers_add_name": "Namn",
        "trackers_add_url": "Url",
        "trackers_add_save": "Lägg till",
        "trackers_table_heading_status": "Status",
        "trackers_table_heading_name": "Namn",
        "trackers_table_heading_url": "Url",
        "trackers_table_heading_passkey": "Passkey",
        "trackers_table_heading_actions": "#",
        "trackers_table_row_remove": "Ta bort",
        "folders_main_heading": "Sökvägar",
        "folders_add_path": "Lägg till nya sökvägar",
        "folders_add_save": "Lägg till",
        "folders_table_header_path": "Sökväg",
        "folders_table_header_releases": "Antal releaser",
        "folders_table_header_actions": "#",
        "search_main_heading": "Sök",
        "search_form_tracker_select": "Tracker:",
        "search_form_select_default": "Välj tracker",
        "search_form_tracker_show_seed": "Visa torrents jag seedar",
        "search_form_submit": "Sök",
        "search_result_success": "Hittade %s torrent",
        "search_table_add_marked_torrents_to_client": "Ladda ner markerade till torrentklient",
        "search_table_header_select": "Markera",
        "search_table_header_release": "Release",
        "search_table_header_seeding": "Seedar",
        "search_table_header_actions": "#",
        "search_table_seeding_yes": "Ja",
        "search_table_seeding_no": "Nej",
        "search_table_add_to_torrent_client": "Torrentklient"
    }
};

export const availableLanguages:Language[] = [
    "english",
    "swedish",
];

export type Language = string;

export function createIntlApi(language:Language) {
    return (textId:string, ...parameters:string[]) => {
          return getString(language, textId, ...parameters);
    };
}

export function getString(language:Language, textId:string, ...parameters:string[]):string {
    const languageTexts = languages[language];

    if(!languageTexts) {
        return `Language: ${language} is not available`;
    }

    if(!languageTexts[textId]) {
        return `Could no find string with id: ${textId}`;
    }

    let text = languageTexts[textId];

    if(parameters.length) {
        text = parameters.reduce((accumulated:string, currentValue:string) => {
            return text.replace(/%s/g, currentValue);
        }, text);
    }

    return text;
}