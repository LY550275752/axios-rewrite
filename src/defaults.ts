import { AxiosRequestConfig } from './type';
import { processHeader } from './helpers/headers';
import { transformRequest } from './helpers/data';

const defaults: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },
    transformRequest: [
        function (data: any, headers: any): any {
            processHeader(headers, data);
            return transformRequest(data);
        }
    ]
}

const methodsNoData = ['delete', 'get', 'head', 'options'];

const methodsWithData = ['post', 'put', 'patch'];

methodsNoData.forEach(method => {
    defaults.headers[method] = {}
})

methodsWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-type': 'application/x-www-form-urlencoded'
    }
})

export default defaults;