import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type';
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url';
import { processHeader, flattenHeaders } from '../helpers/headers';
import transformer from '../core/transform';
import xhr from './xhr';

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr(config).then((res) => {
        return transformResponseData(res);
    })
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformUrl(config);
    // config.headers = transformHeaders(config);
    config.data = transformer(config.data, config.headers, config.transformRequest);
    config.headers = flattenHeaders(config.headers, config.method!);
}

function transformUrl(config: AxiosRequestConfig): string {
    let { url = '', params, paramsSerializer, baseURL } = config;
    if (baseURL && !isAbsoluteURL(url)) {
        url = combineURL(baseURL, url);
    }
    return buildURL(url, params, paramsSerializer);
}

function transformRequestData(config: AxiosRequestConfig) {
    const { data } = config;
    return transformer(data, config.headers);
}

function transformHeaders(config: AxiosRequestConfig) {
    const { headers = {}, data} = config;
    return processHeader(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transformer(res.data, res.headers, res.config.transformResponse);
    return res;
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}

export default dispatchRequest;