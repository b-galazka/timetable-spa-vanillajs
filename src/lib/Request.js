import { apiBaseUrl } from '../config';

export class Request {

    constructor({ baseUrl = '', headers = {} }) {

        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    get(url, headers) {

        return Request.get(
            this._baseUrl + url,
            this._concatHeaders(headers)
        );
    }

    delete(url, headers) {

        return Request.delete(
            this._baseUrl + url,
            this._concatHeaders(headers)
        );
    }

    post(url, data, headers) {

        return Request.post(
            this._baseUrl + url,
            data,
            this._concatHeaders(headers)
        );
    }

    put(url, data, headers) {

        return Request.put(
            this._baseUrl + url,
            data,
            this._concatHeaders(headers)
        );
    }

    _concatHeaders(headers) {

        return Object.assign({}, this._headers, headers);
    }

    static get(url, headers) {

        return Request.send({
            method: 'GET',
            url,
            headers
        });
    }

    static delete(url, headers) {

        return Request.send({
            method: 'DELETE',
            url,
            headers
        });
    }

    static post(url, data, headers) {

        const baseHeaders = {
            'Content-Type': Request._generateContentTypeHeader(data)
        };

        return Request.send({
            method: 'POST',
            url,
            data: Request._stringifyRequestBody(data),
            headers: Object.assign({}, baseHeaders, headers)
        });
    }

    static put(url, data, headers) {

        const baseHeaders = {
            'Content-Type': Request._generateContentTypeHeader(data)
        };

        return Request.send({
            method: 'PUT',
            url,
            data: Request._stringifyRequestBody(data),
            headers: Object.assign({}, baseHeaders, headers)
        });
    }

    static _generateContentTypeHeader(data) {

        if (data instanceof FormData) {

            return {};
        }

        if (typeof data === 'object' && data !== null) {

            return 'application/json;charset=UTF-8';
        }

        return 'text/plain;charset=UTF-8';
    }

    static _stringifyRequestBody(data) {

        if (typeof data === 'object' && data !== null) {

            return JSON.stringify(data);
        }

        return data;
    }

    static send({ method, url, data, headers = {} }) {

        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();

            xhr.open(method, url, true);

            xhr.addEventListener('load', ({ target }) => {

                const response = Request._formatResponse(target);

                if (response.status >= 400) {

                    return reject(response);
                }

                resolve(response);
            });

            xhr.addEventListener('error', ({ target }) => {

                const response = Request._formatResponse(target);

                reject(response);
            });

            Request._setHeaders(xhr, headers);
            xhr.send(data);
        });
    }

    static _formatResponse(xhr) {

        let data;

        try {

            data = JSON.parse(xhr.response);
        } catch (error) {

            data = xhr.response;
        }

        return {
            request: xhr,
            headers: Request._formatHeaders(xhr.getAllResponseHeaders()),
            status: xhr.status,
            statusText: xhr.statusText,
            data
        };
    }

    static _formatHeaders(headersString) {

        const headersArray = headersString.split('\n').filter(header => header.trim() !== '');

        const headersObject = headersArray.reduce((headers, header) => {

            const [headerName, headerValue] = header.split(':');

            headers[headerName.trim().toLowerCase()] = headerValue.trim();

            return headers;
        }, {});

        return headersObject;
    }

    static _setHeaders(xhr, headers) {

        Object.keys(headers).forEach((header) => {

            const headerValue = headers[header];

            xhr.setRequestHeader(header, headerValue);
        });
    }
}

export const timetableApiRequest = new Request({ baseUrl: apiBaseUrl });