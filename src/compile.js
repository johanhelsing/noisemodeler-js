var _ = require('lodash');

module.exports = function(definition) {
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
            return () => modules[sourceModuleId].inputs.value[0];
        };

        outputFuncs = _.chain(moduleType.outputs)
            .indexBy('name')
            .mapValues(o => {
                return createFunctionForSource(o.source);
            })
            .value();
    }
    return input => _.mapValues(outputFuncs, f => f(input));
};
