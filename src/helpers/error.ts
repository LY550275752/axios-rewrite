import { AxiosRequestConfig, AxiosResponse } from '../type';

export class AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any
    response?: AxiosResponse

    constructor(
        message: string,
        config: AxiosRequestConfig,
        code?: string | null,
        request?: any,
        response?: AxiosResponse
    ){
        super(message);

        // 对象赋值
        this.isAxiosError = true;
        this.config = config;
        this.code = code;
        this.request = request;
        this.response = response;
        this.isAxiosError = true;

        // 解决TypeScript继承一些内置对象的坑
        Object.setPrototypeOf(this, AxiosError.prototype);
    }
}

export function createError(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
): AxiosError {
    const error = new AxiosError(message, config, code, request, response);
    return error
}