import { isDate, isObject, isURLSearchParams } from './util';

// url中协议与域
interface URLOrigin {
    protocol: string,
    host: string
}

// 利用a标签DOM获取protocol, host
const urlParsingNode = document.createElement('a');
const currentOrigin = resolveUrl(window.location.href);

// 获取href的protocol, host
export function resolveUrl(href: string): URLOrigin {
    urlParsingNode.setAttribute('href', href);
    const { protocol, host } = urlParsingNode;
    return {
        protocol,
        host
    }
}

// 请求域与当前域是否一致
export function isURLSameOrigin(requestUrl: string): boolean {
    const requestOrigin = resolveUrl(requestUrl);
    return requestOrigin.protocol === currentOrigin.protocol
        && requestOrigin.host === currentOrigin.host
}

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

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
    if(!params) {
        return url;
    }

    let values: string[];
    let serializedParams;

    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    } else if (isURLSearchParams(params)) {
        serializedParams = params.toString();
    } else {
        const parts: string[] = [];

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
        });

        serializedParams = parts.join('&');
    }

    // 拼接生成新url
    if (serializedParams) {
        let markIndex = serializedParams.indexOf('#');
        if (markIndex !== -1) {
            url = url.slice(0, markIndex);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
}

export function isAbsoluteURL(url: string): boolean {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}