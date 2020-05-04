export type Method = 'get' | 'GET'
    | 'delete' | 'Delete'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'

export interface Axios {
    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

    getUri(config?: AxiosRequestConfig): string
}

export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosClassStatic {
    new (config: AxiosRequestConfig): Axios
}

export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance

    CancelToken: CancelTokenStatic

    Cancel: CancelStatic

    isCancel: (value: any) => boolean

    all<T>(promises: Array< T | Promise<T>>): Promise<T[]>

    spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R

    Axios: AxiosClassStatic
}

export interface AxiosRequestConfig {
    url?: string,
    method?: Method,
    data?: any,
    params?: any,
    headers?: any,
    responseType?: XMLHttpRequestResponseType  // "" | "arraybuffer" | "blob" | "document" | "json" | "text"
    timeout?: number,
    transformRequest?: AxiosTransformer | AxiosTransformer[],
    transformResponse?: AxiosTransformer | AxiosTransformer[],
    cancelToken?: CancelToken,
    withCredential?: boolean,                       // 跨域是否携带请求域下cookie
    xsrfCookieName?: string,                        // 获取cookie的key
    xsrfHeaderName?: string,                        // header中cookie的Name
    onDownloadProgress?: (e: ProgressEvent) => void,    // 下载进度监听
    onUploadProgress?: (e: ProgressEvent) => void,      // 上传进度监听
    auth?: AxiosBasicCredentials,                       // HTTP协议用户代理身份验证
    validateStatus?: (status: number) => boolean,       // 自定义状态校验
    paramsSerializer?: (params: any) => string,         // 自定义序列化参数
    baseURL?: string,                                   // URL前缀拼接
    [propName: string]: any
}

export interface AxiosResponse< T = any> {
    data: T,
    status: number,
    statusText: string,
    headers: any,
    config: AxiosRequestConfig,
    request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
}

export interface AxiosError extends Error {
    config: AxiosRequestConfig,
    code?: number,
    request?: any,
    response?: AxiosResponse,
    isAxiosError: boolean
}

export interface AxiosInterceptorManager<T> {
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

    eject(id: number): void
}

export interface ResolvedFn<T=any> {
    (val: T): T | Promise<T>
}


export interface RejectedFn {
    (error: any): any
}

export interface PromiseChain {
    resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

export interface AxiosTransformer {
    (data: any, headers?: any): any
}

/**
 * cancel
 */

export interface CancelToken {
    promise: Promise<Cancel>,
    reason?: Cancel
    throwIfRequested(): void
}

export interface Canceler {
    (message?: string): void
}

export interface CancelExecutor {
    (cancel: Canceler): void
}

export interface CancelTokenSource {
    token: CancelToken,
    cancel: Canceler
}

export interface CancelTokenStatic {
    new(executor: CancelExecutor): CancelToken

    source(): CancelTokenSource
}

export interface Cancel {
    message?: string
}

export interface CancelStatic {
    new(message?: string): Cancel
}


export interface AxiosBasicCredentials {
    username: string,
    password: string
}