export function isURL(str: string) {
    var urlRegex = "^(https?)://.+";
    var url = new RegExp(urlRegex, 'i');

    if(!str) {
        return false;
    }

    return str.length < 2083 && url.test(str);
}

export function isPath(str: string) {
    var urlRegex = /^([a-zA-Z]:)?(\\[^<>:"/\\|?*]+)+\\?.*\.exe$/;

    if(!str) {
        return false;
    }

    return urlRegex.test(str);
}

export function isValidPasskey(str: string) {
    var urlRegex = "[0-fA-F]{32}";
    var url = new RegExp(urlRegex, 'i');
    return url.test(str);
}

export function validateString(str: string) {

    return str && !!str.length;
}
