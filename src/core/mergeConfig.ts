function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== undefined ? val2 : val1;
}

// 与接口业务强相关字段，只能采用自定义配置
function formValStrat(val1: any, val2: any): any {
    if (typeof val2 !== undefined) {
        return val2;
    }
}