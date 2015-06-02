module.exports = function(definition) {
    if(definition.moduleTypes){
        var outputName = definition.moduleTypes[0].outputs[0].name;
        var constant = definition.moduleTypes[0].modules[0].inputs.value[0];
    }
    return function(){
        var result = {};
        result[outputName] = constant;
        return result;
    };
};
