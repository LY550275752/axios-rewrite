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
}

export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance
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