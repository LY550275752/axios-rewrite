import { isPlainObject, deepMerge } from './util';
import { Method } from '../type';

function normalizeHeaderName(headers: any, normalizeName: string) {
    if (!headers) {
        return;
    }

    Object.keys(headers).forEach(name => {
        if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
            headers[normalizeName] = headers[name];
            delete headers[name];
        }
    })
}

export function processHeader(headers: any, data: any) {
    normalizeHeaderName(headers, 'Content-Type');

    if (isPlainObject(data)) {
        if (headers && !headers['Content-type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}

export function parseHeaders(headers: string): any {
    let parsed = Object.create(null);
    if (!headers) {
        return parsed;
    }

    headers.split('\r\n').forEach(s => {
        let [key, val] = s.split(':');
        if (!key) {
            return;
        }
        if (val) {
            val = val.trim();
        }

        parsed[key] = val;
    });

    return parsed;
}

export function flattenHeaders(headers: any, method: Method): any {
    if (!headers) {
        return headers;
    }

    headers = deepMerge(headers.common || {}, headers[method] || {}, headers);

    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

    methodsToDelete.forEach(method => {
        delete headers[method];
    })

    return headers;
}