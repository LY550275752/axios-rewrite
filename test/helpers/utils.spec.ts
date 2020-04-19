import {
    isDate,
    isObject,
    isPlainObject,
    extend
} from '../../src/helpers/util';

describe('helpers/util', () => {
    describe('isXX', () => {
        test('should validate Date', () => {
            expect(isDate(new Date())).toBeTruthy();
            expect(isDate(Date.now())).toBeFalsy();
        })

        test('should validate Object', () => {
            expect(isObject({})).toBeTruthy();
            expect(isObject(Date.now())).toBeFalsy();
        })

        test('should validate isPlainObject', () => {
            expect(isPlainObject({})).toBeTruthy();
            expect(isPlainObject(Date.now())).toBeFalsy();
        })
    })

    describe('extend', () => {
        test('should be mutable', () => {
            const a = Object.create(null);
            const b = {foo: 123};
            extend(a, b);
            expect(a.foo).toBe(123);
        })

        test('should extend properties', () => {
            const a = {foo: 123, bar: 456};
            const b = {bar: 789}
            extend(a, b);
            expect(a.foo).toBe(123);
            expect(a.bar).toBe(789);
        })
    })
})