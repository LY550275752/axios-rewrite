import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type';
import { parseHeaders, processHeader } from '../helpers/headers';
import { createError } from '../helpers/error';
import { isURLSameOrigin } from '../helpers/url';
import { isFormData } from '../helpers/util';
import cookie from '../helpers/cookie';
 
export default function xhr(config: AxiosRequestConfig ): AxiosPromise {
    return new Promise((resolve, reject) => {
        const {
            data = null,
            url = '',
            method = 'get',
            headers,
            responseType,
            timeout,
            cancelToken,
            withCredentials,
            xsrfCookieName,
            xsrfHeaderName,
            onDownloadProgress,
            onUploadProgress
        } = config;

        const request = new XMLHttpRequest();
        request.open(method.toUpperCase(), url, true);

        configureRequest();
        addEvent();
        processHeaders();
        processCancel();
        
        request.send(data);

        // request属性设置
        function configureRequest(): void {
            if (responseType) {
                request.responseType = responseType;
            }
            if (timeout) {
                request.timeout = timeout;
            }

            // 设置携带请求域下cookie信息，非跨域默认携带
            if (withCredentials) {
                request.withCredentials = true
            }
        }

        // 添加监听事件
        function addEvent(): void {
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

            // 上传与下载进度监听
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress;
            }
        }

        // headers内容处理
        function processHeaders(): void {
            // 同域或设置withCredential，则header中设置token
            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName);
                if (xsrfValue) {
                    headers[xsrfHeaderName!] = xsrfValue;
                }
            }

            // body为null时，设置headers没有意义
            Object.keys(headers).forEach(name => {
                if (data === null && name === 'Content-Type') {
                    delete headers['Content-Type'];
                } else {
                    request.setRequestHeader(name, headers[name]);
                }
            })

            // 请求数据为FormData类型，应主动删除headers中的Content-Type字段
            // 浏览器根据请求数据自动设置
            if (isFormData(data)) {
                delete headers['Content-Type'];
            }
        }

        // cancel事件处理
        function processCancel(): void {
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    request.abort();
                    reject(reason);
                })
            }
        }

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