import { ResolvedFn, RejectedFn } from '../type';

interface Interceptor<T> {
    resolved: ResolvedFn<T>
    rejected?: RejectedFn
}

export default class InterceptorManagers<T> {
    private interceptor: Array<Interceptor<T> | null>

    constructor() {
        this.interceptor = [];
    }
}