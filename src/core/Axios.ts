
import { AxiosRequestConfig, AxiosPromise, AxiosResponse, Method, PromiseChain } from '../type';
import dispatchRequest from './dispatchRequest';
import InterceptorManagers from './interceptorManagers';

interface Interceptors {
    request: InterceptorManagers<AxiosRequestConfig>,
    response: InterceptorManagers<AxiosResponse>
}

export default class Axios {
    interceptors: Interceptors

    constructor() {
        this.interceptors = {
            request: new InterceptorManagers<AxiosRequestConfig>(),
            response: new InterceptorManagers<AxiosResponse>()
        }
    }

    request(url: any, config?: any): AxiosPromise {
        if (typeof url === 'string') {
            if (!config) {
                config = {}
            }
            config.url = url;
        } else {
            // 重载
            config = url;
        }

        const chain: PromiseChain[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]

        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor);
        })

        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor);
        })

        let promise = Promise.resolve(config);

        while (chain.length) {
            const { resolved, rejected } = chain.shift()!;
            promise = promise.then(resolved, rejected);
        }

        return dispatchRequest(config);
    }
    
    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithoutData('get', url, config);
    }

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithoutData('delete', url, config);
    }

    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithoutData('head', url, config);
    }

    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithoutData('options', url, config);
    }

    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithData('post', url, data, config);
    }

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithData('put', url, data, config);
    }

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithData('patch', url, data, config);
    }

    _requestWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(
            Object.assign(config || {}, {
                method,
                url
            })
        )
    }

    _requestWithData(method: Method, url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(
            Object.assign(config || {}, {
                method,
                url,
                data
            })
        )
    }
}