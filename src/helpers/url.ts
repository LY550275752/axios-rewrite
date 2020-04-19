import { isDate, isObject } from './util';

function encode(val: string): string {
    // 替换一些特殊字符
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
    if(!params) {
        return url;
    }

    const parts: string[] = [];
    let values: string[];

    Object.keys(params).forEach((key) => {
        let val = params[key];

        // 没有值则不处理到url中
        if (val === null || val === undefined) {
            return;
        }

        // 将值处理为数组
        if (Array.isArray(val)) {
            values = val;
            key += '[]'
        } else {
            values = [val]
        }
        values.forEach((val) => {
            if (isDate(val)) {
                val = val.toISOString();
            } else if (isObject(val)) {
                val = JSON.stringify(val);
            }

            parts.push(`${encode(key)}=${encode(val)}`);
        });

        let serializedParams = parts.join('&');

        // 拼接生成新url
        if (serializedParams) {
            let markIndex = serializedParams.indexOf('#');
            if (markIndex !== -1) {
                url = url.slice(0, markIndex);
            }
            url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }
    })

    return url;
}