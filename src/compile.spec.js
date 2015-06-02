var compile = require('./compile');
require('chai').should();

var meaningOfLife = {
    moduleTypes: [
        {
            name: "meaningOfLife",
            description: "outputs the value 42",
            inputs: [],
            outputs: [
                { name: "constant", source: "c1.value" }
            ],
            modules: [
                {
                    name: "c1",
                    type: "constant1",
                    inputs: { value: [ 42 ] }
                }
            ]
        }
    ]
};

describe('compile', function() {

    it('should return a function', function() {
        compile({}).should.be.a('function');
    });

    it('can compile a very simple module without errors', function() {
        compile(meaningOfLife);
    });

});

