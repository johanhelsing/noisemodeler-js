var compile = require('./compile');
require('chai').should();

describe('compile', () => {

    describe('basics', () => {

        it('should return a function', () => {
            compile({}).should.be.a('function');
        });

        it('can compile a very simple module without errors', () => {
            var meaningOfLife = {moduleTypes: [{
                name: 'meaningOfLife',
                description: 'outputs the value 42',
                inputs: [],
                outputs: [{ name: 'meaning', source: 'c1.value' }],
                modules: [{
                    name: 'c1',
                    type: 'constant1',
                    inputs: { value: [ 42 ] }
                }]
            }]};

            compile(meaningOfLife);
        });

    });

    describe('constants', () => {

        it('creates a function which returns the expected results', () => {
            var meaningOfLife = {moduleTypes: [{
                name: 'meaningOfLife',
                description: 'outputs the value 42',
                inputs: [],
                outputs: [
                    { name: 'meaning', source: 'c1.value' }
                ],
                modules: [{
                    name: 'c1',
                    type: 'constant1',
                    inputs: { value: [ 42 ] }
                }]
            }]};
            var f = compile(meaningOfLife);
            f().should.deep.equal({meaning: 42});

        });

        it('handles negative constants', () => {
            var cold = {moduleTypes: [{
                name: 'cold',
                description: '0 kelvin in celsius',
                inputs: [],
                outputs: [{ name: 'temperature', source: 'c1.value' }],
                modules: [{
                    name: 'c1',
                    type: 'constant1',
                    inputs: { value: [ -273 ] }
                }]
            }]};
            var f = compile(cold);
            f().should.deep.equal({temperature: -273});
        });

        it('supports modules with multiple outputs.', () => {
            var multipleOutputs = {moduleTypes: [{
                name: 'multipleOutputs',
                description: '',
                inputs: [],
                outputs: [
                    { name: 'out1', source: 'c1.value' },
                    { name: 'out2', source: 'c2.value' }
                ],
                modules: [
                    {
                        name: 'c1',
                        type: 'constant1',
                        inputs: { value: [ 1 ] }
                    },
                    {
                        name: 'c2',
                        type: 'constant1',
                        inputs: { value: [ 2 ] }
                    }
                ]
            }]};
            var f = compile(multipleOutputs);
            f().should.deep.equal({out1: 1, out2: 2});
        });

    });

    describe('inputs', () => {

        it('can pass a single input to an output', () => {
            var m = {moduleTypes: [{
                name: 'passthrough',
                description: 'a single input is mapped to as single output',
                inputs: [{ name: 'in1', type: '1f' }],
                outputs: [{ name: 'out1', source: 'inputs.in1'}],
                modules: []
            }]};
            var f = compile(m);
            f({in1: 1}).should.deep.equal({out1: 1});
            f({in1: 2}).should.deep.equal({out1: 2});
            f({in1: -10}).should.deep.equal({out1: -10});
        });

        it('can pass multiple inputs to outputs', () => {
            var m = {moduleTypes: [{
                name: 'passthrough multiple',
                description: 'two inputs are mapped to two outputs',
                inputs: [
                    { name: 'in1', type: '1f' },
                    { name: 'in2', type: '1f' }
                ],
                outputs: [
                    { name: 'out1', source: 'inputs.in1'},
                    { name: 'out2', source: 'inputs.in2'}
                ],
                modules: []
            }]};
            var f = compile(m);
            f({in1: 1, in2: 2}).should.deep.equal({out1: 1, out2: 2});
            f({in1: 2, in2: 3}).should.deep.equal({out1: 2, out2: 3});
            f({in1: -10, in2: -20}).should.deep.equal({out1: -10, out2: -20});
        });

        it('can pass inputs through one internal module', () => {
            var m = {moduleTypes: [{
                name: 'passthrough multiple',
                description: 'two inputs are mapped to two outputs',
                inputs: [{ name: 'in1', type: '1f' }],
                outputs: [{ name: 'out1', source: 'c1.value'}],
                modules: [{
                    name: 'c1',
                    type: 'constant1',
                    inputs: { value: 'inputs.in1' }
                }]
            }]};
            var f = compile(m);
            f({in1: 1}).should.deep.equal({out1: 1});
        });

    });

    describe('vectors', () => {

        it('outputs vectors when it should', () => {
            var m = {moduleTypes: [{
                name: 'm',
                description: 'has an output that is a two dimensional vector',
                inputs: [],
                outputs: [{ name: 'out1', source: 'c1.value' }],
                modules: [{
                    name: 'c1',
                    type: 'constant2',
                    inputs: { value: [ 42, 12 ] }
                }]
            }]};
            var f = compile(m);
            f({}).should.deep.equal({out1: [42, 12]});
        });

        it('handles input vectors', () => {
            var m = {moduleTypes: [{
                name: 'passthrough',
                description: 'passes through a two-dimensional signal',
                inputs: [{ name: 'in', type: '2f' }],
                outputs: [{ name: 'out', source: 'internal.value' }],
                modules: [{
                    name: 'internal',
                    type: 'constant2',
                    inputs: { value: 'inputs.in' }
                }]
            }]};
            var f = compile(m);
            f({in: [42,12]}).should.deep.equal({out: [42, 12]});
        });

    });

    describe('functions', () => {
        it('supports the 1d absolute value function', () => {
            var m = {moduleTypes: [{
                name: 'absolute value',
                description: '',
                inputs: [{ name: 'in', type: '2f' }],
                outputs: [{ name: 'out', source: 'a1.value' }],
                modules: [{
                    name: 'a1',
                    type: 'abs',
                    inputs: { value: 'inputs.in' }
                }]
            }]};
            var f = compile(m);
            f({in: -1}).should.deep.equal({out: 1});
            f({in: 1}).should.deep.equal({out: 1});
            f({in: -10}).should.deep.equal({out: 10});
        });
    });

});

