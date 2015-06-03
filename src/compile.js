var _ = require('lodash');

module.exports = function(definition) {
    var outputFuncs;
    if(definition.moduleTypes){
        var moduleType = definition.moduleTypes[0];
        var modules = _.indexBy(moduleType.modules, 'name');
        outputFuncs = _.chain(moduleType.outputs)
            .indexBy('name')
            .mapValues(o => {
                var sourceModuleId = o.source.split('.')[0];
                if(sourceModuleId === 'inputs') {
                    return v => v.in1;
                }
                return () => modules[sourceModuleId].inputs.value[0];
            })
            .value();
    }
    return input => _.mapValues(outputFuncs, f => f(input));
};
