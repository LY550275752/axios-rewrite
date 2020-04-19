import { parseHeaders } from '../../src/helpers/headers';

describe('helpers:headers', () => {
    describe('parseHeaders', () => {
        test('should parse headers', () => {
            const parsed = parseHeaders(
                'Content-Type: application/json\r\n' +
                'Connection: keep-alive\r\n' +
                'Transfer-Encoding: chunked\r\n' +
                'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
                ':aa\r\n' +
                'key:'
            )

            expect(parsed['Content-Type']).toBe('application/json');
            expect(parsed['Connection']).toBe('keep-alive');
            expect(parsed['Transfer-Encoding']).toBe('chunked');
            expect(parsed['Date']).toBe('Tue, 21 May 2019 09:23:44 GMT');
        })
    })
})