var compile = require('./compile');
require('chai').should();

describe('compile', function() {

    describe('basics', function() {

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

    });

    describe('constants', function() {

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

        it('supports modules with multiple outputs.', function() {
            var multipleOutputs = {
                moduleTypes: [
                    {
                        name: "multipleOutputs",
                        description: "",
                        inputs: [],
                        outputs: [
                            { name: "out1", source: "c1.value" },
                            { name: "out2", source: "c2.value" }
                        ],
                        modules: [
                            {
                                name: "c1",
                                type: "constant1",
                                inputs: { value: [ 1 ] }
                            },
                            {
                                name: "c2",
                                type: "constant1",
                                inputs: { value: [ 2 ] }
                            }
                        ]
                    }
                ]
            };
            var f = compile(multipleOutputs);
            f().should.deep.equal({out1: 1, out2: 2});
        });

    });

    describe('inputs', () => {
        it('can pass a single input to an output', () => {
            var m = {
                moduleTypes: [{
                    name: "passthrough",
                    description: "a single input is mapped to as single output",
                    inputs: [{ name: 'in1', type: '1f' }],
                    outputs: [{ name: 'out1', source: 'inputs.in1'}],
                    modules: []
                }]
            };
            var f = compile(m);
            f({in1: 1}).should.deep.equal({out1: 1});
            f({in1: 2}).should.deep.equal({out1: 2});
            f({in1: -10}).should.deep.equal({out1: -10});
        });
    });

});

