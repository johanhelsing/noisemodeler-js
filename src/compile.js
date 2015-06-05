var _ = require('lodash');

module.exports = definition => {
    var outputFuncs;
    if(definition.moduleTypes){
        var moduleType = definition.moduleTypes[0];
        var modules = _.indexBy(moduleType.modules, 'name');

        var createFunctionForSource = sourceString => {
            var sourceInfo = sourceString.split('.');
            var sourceModuleId = sourceInfo[0];
            var outputId = sourceInfo[1];
            if(sourceModuleId === 'inputs') {
                return v => v[outputId];
            }

            var inputValue = modules[sourceModuleId].inputs.value;
            var valueFunction = _.isString(inputValue) ?
                createFunctionForSource(inputValue) :
                () => inputValue;

            var moduleType = modules[sourceModuleId].type;
            return moduleType === 'abs' ?
                v => Math.abs(valueFunction(v)) :
                valueFunction;
        };

        outputFuncs = _.chain(moduleType.outputs)
            .indexBy('name')
            .mapValues(o => {
                return createFunctionForSource(o.source);
            })
            .value();
    }

    var unwrapIfScalar = v => v.length === 1 ? v[0] : v;
    return input => _.mapValues(outputFuncs, f => unwrapIfScalar(f(input)));
};
