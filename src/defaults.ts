import { AxiosRequestConfig } from './type';

const defaults: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    }
}

const methodsNoData = ['delete', 'get', 'head', 'options']