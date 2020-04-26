function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== undefined ? val2 : val1;
}