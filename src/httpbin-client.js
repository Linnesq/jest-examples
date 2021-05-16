const fetch = require('node-fetch');
const UrlValidator = require('./url-validator');

class HttpBinClient {
    // https://coryrylan.com/blog/javascript-es6-class-syntax
    constructor(baseUrl) {
        this._baseUrl = baseUrl;
    }

    // getter
    get baseUrl() {
        return this._baseUrl;
    }

    set baseUrl(baseUrl) {
        this._baseUrl = baseUrl;
    }

    // method
    async simpleGet() {
        const url = `${this.baseUrl}/get`
         return await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Request Failed')
            }
            return response.json();
        })

    }

    async safeUuidGet() {
        const url = `${this.baseUrl}/uuid`
        const validator = new UrlValidator(url);
        if (!validator.validate()){
            throw new Error('Invalid URL');
        }
        return await fetch(url)
        .then(res => {
            if(!res.ok){
                throw new Error('Request Failed');
            }
            return res.json();
        });
    }
}

module.exports = HttpBinClient