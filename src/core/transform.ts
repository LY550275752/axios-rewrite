import { AxiosTransformer } from '../type';

export default function transformer(
    data: any,
    headers: any,
    fns?: AxiosTransformer | AxiosTransformer[]
): any {
    if (!fns) {
        return data;
    }

    if (!Array.isArray(fns)) {
        fns = [fns];
    }

    fns.forEach(fn => {
        data = fn(data, headers);
    });

    return data
}