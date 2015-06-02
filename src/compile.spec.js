var compile = require('./compile');
require('chai').should();

describe('compile', function() {

    it('should return a function', function() {
        compile({}).should.be.a('function');
    });

    it('can compile a very simple module without errors', function() {
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

        compile(meaningOfLife);
    });

    it('creates a function which returns the expected results', function() {
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
        var f = compile(meaningOfLife);
        f().should.deep.equal({meaning: 42});

    });

    it('handles negative constants', function() {
        var cold = {
            moduleTypes: [
                {
                    name: "cold",
                    description: "0 kelvin in celsius",
                    inputs: [],
                    outputs: [
                        { name: "temperature", source: "c1.value" }
                    ],
                    modules: [
                        {
                            name: "c1",
                            type: "constant1",
                            inputs: { value: [ -273 ] }
                        }
                    ]
                }
            ]
        };
        var f = compile(cold);
        f().should.deep.equal({temperature: -273});
    });

});

