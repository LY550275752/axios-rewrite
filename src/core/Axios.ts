
import { AxiosRequestConfig, AxiosPromise, AxiosResponse, Method, PromiseChain } from '../type';
import dispatchRequest, { transformUrl } from './dispatchRequest';
import InterceptorManagers from './interceptorManagers';
import mergeConfig from './mergeConfig';
import defaults from '../defaults';

interface Interceptors {
    request: InterceptorManagers<AxiosRequestConfig>,
    response: InterceptorManagers<AxiosResponse>
}

export default class Axios {
    interceptors: Interceptors

    defaults: AxiosRequestConfig

    constructor(initConfig: AxiosRequestConfig) {
        this.defaults = initConfig;
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

        config = mergeConfig(defaults, config);

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

        return promise;
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

    gerUri(config: AxiosRequestConfig): string {
        config = mergeConfig(defaults, config);
        return transformUrl(config);
    }
}