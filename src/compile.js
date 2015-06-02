var _ = require('lodash');

module.exports = function(definition) {
    var results;
    if(definition.moduleTypes){
        var moduleType = definition.moduleTypes[0];
        var modules = _.indexBy(moduleType.modules, 'name');
        results = _.chain(moduleType.outputs)
            .indexBy('name')
            .mapValues(o => {
                var sourceModule = o.source.split('.')[0];
                return modules[sourceModule].inputs.value[0];
            })
            .value();
    }
    return () => results;
};
