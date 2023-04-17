function foo(configValue /* (key: string) => string */) {
    const makeDynamicConfig = (options) => {
        const dynamicOptions = {};
        for (const key in options) {
            const value = options[key];
            if (typeof value === 'object' && value !== null) {
                dynamicOptions[key] = makeDynamicConfig(value);
            } else if (Array.isArray(value)) {
                dynamicOptions[key] = value.map((v) => (typeof v === 'object' && v !== null) ? makeDynamicConfig(v) : dynamicConfigValue(v));
            } else {
                dynamicOptions[key] = dynamicConfigValue(value);
            }
        }

        return dynamicOptions;
    };

    const dynamicConfigValue = (key) => {
        const getConfigValue = () => configValue(key);
        const proxyHandler = {
            get(target, prop) {
                if (prop === 'toString') {
                    return getConfigValue;
                } else {
                    return dynamicConfigValue(`${key}:${prop}`);
                }
            },
        };

        return new Proxy(getConfigValue, proxyHandler);
    };

    return {
        makeDynamicConfig,
        dynamicConfigValue,
    };
};


const { makeDynamicConfig, dynamicConfigValue } = require('./solution');

const config = {
    keyl: 'first',
    key2: 'second',
    key3: 'third',
};

const { changeConfig } = require('configs');
const dynamicConfigs = makeDynamicConfig({
    key1: dynamicConfigValue('keyl'),
    key2: dynamicConfigValue('key2'),
    key3: dynamicConfigValue('key3'),
});

console.log(dynamicConfigs.key1.toString()); // Выводит first:keyl
changeConfig('second');
console.log(dynamicConfigs.key1.toString()); // Выводит second:keyl
