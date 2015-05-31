var compile = require('./compile');
require('chai').should();

describe('compile', function() {
    it('should return a function', function() {
        compile({}).should.be.a('function');
    });
});
