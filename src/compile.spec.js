var compile = require('./compile');
require('chai').should();

var meaningOfLife = {
    moduleTypes: [
        {
            name: "meaningOfLife",
            description: "outputs the value 42",
            inputs: [],
            outputs: [
                { name: "meaning", source: "c1.value" }
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

    it('creates a function which returns the expected results', function() {
        var f = compile(meaningOfLife);
        f().should.deep.equal({meaning: 42});
    });

});

