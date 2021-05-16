/*
This is a bit of a nonsense class!
It's only purpose is to use a class from a class.
*/

class UrlValidator {
    constructor(url){
        this._url = url;
    }
    get url(){
        return this._url;
    }

    set url(url) {
        this._url = url
    }

    validate(){
        return true;
    }
}

module.exports = UrlValidator;