import { createError } from '../../src/helpers/error';
import { AxiosRequestConfig, AxiosResponse } from '../../src/type';

describe('helpers:error', () => {
    describe('createError', () => {
        test('should create an Error with message, config, code, request, response an is AxiosError', () => {
            const request = new XMLHttpRequest();
            const config: AxiosRequestConfig = { method: 'post'};
            const response: AxiosResponse = {
                status: 200,
                statusText: 'SUCCESS',
                headers: null,
                config,
                request,
                data: {a: 1}
            }

            const error = createError('Boom!', config, '0000', request, response);

            expect(error instanceof Error).toBeTruthy();
            expect(error.message).toBe('Boom!');
            expect(error.config).toBe(config);
            expect(error.request).toBe(request);
            expect(error.code).toBe('0000');
            expect(error.response).toBe(response);
            expect(error.isAxiosError).toBeTruthy();
        })
    })
})