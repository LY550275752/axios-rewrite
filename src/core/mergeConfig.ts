import { AxiosRequestConfig } from '../type';
const strats = Object.create(null);

function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== undefined ? val2 : val1;
}

// 与接口业务强相关字段，只能采用自定义配置
function formValStrat(val1: any, val2: any): any {
    if (typeof val2 !== undefined) {
        return val2;
    }
}

const stratKeysFormVal2 = ['url', 'param', 'data'];

stratKeysFormVal2.forEach(key => {
    strats[key] = formValStrat;
})

export default function mergeConfig(
    config1: AxiosRequestConfig,
    config2?: AxiosRequestConfig
): AxiosRequestConfig {
    if (!config2) {
        config2 = {}
    }

    const config = Object.create(null);

    for(let key in config2) {
        mergeField(key);
    }

    for(let key in config1) {
        if (!config2[key]) {
            mergeField(key);
        }
    }

    function mergeField(key: string) {
        const strat = strats[key] || defaultStrat;
        config[key] = strat(config1[key], config2![key]);
    }

    return config;
}