import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';
 
export default function xhr(config: AxiosRequestConfig ): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url = '', method = 'get', headers, responseType, timeout, cancelToken } = config;

        const request = new XMLHttpRequest();

        if (responseType) {
            request.responseType = responseType;
        }
        if (timeout) {
            request.timeout = timeout;
        }

        if (cancelToken) {
            cancelToken.promise.then(reason => {
                request.abort();
                reject(reason);
            })
        }

        request.open(method.toUpperCase(), url, true);

        // request状态监听
        request.onreadystatechange = function (){
            if (request.readyState !== 4) {
                return;
            }

            const responseHeaders = parseHeaders(request.getAllResponseHeaders());
            const responseData = responseType && responseType !== 'text' ? request.response : request.responseText;

            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }

            handleResponse(response);
        }

        // 错误监听
        request.onerror = function() {
            reject(createError(
                'Network Error',
                config,
                null,
                request
            ));
        }

        // 超时监听
        request.ontimeout = function() {
            reject(createError(
                `Timeout of ${timeout} ms exceeded`,
                config,
                'ECONNABORTED',
                request
            ));
        }

        // body为null时，设置headers没有意义
        Object.keys(headers).forEach(name => {
            if (data === null && name === 'Content-Type') {
                delete headers['Content-Type'];
            } else {
                request.setRequestHeader(name, headers[name]);
            }
        })

        request.send(data);

        // 状态码判断过滤
        function handleResponse(response: AxiosResponse) {
            if (response.status >= 200 && response.status <= 300) {
                resolve(response);
            } else {
                reject(createError(
                    `Request failed with status code ${response.status}`,
                    config,
                    null,
                    request,
                    response
                ))
            }
        }
    })
}