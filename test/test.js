"use strict";

var assert  = require('assert'),
    FlakeId = require('../flake-id-gen');

describe('FlakeId', function () {

    var idGen = new FlakeId();

    describe('next', function () {
        it('should return unique id when callback is not present', function () {
            testSynch(idGen, 1000);
        });
        
        it('should return unique ids when callback is present', function () {
            this.slow(200);
            testWithCallback(idGen, 5000);
        });
    });
});

describe('FlakeId({id:0x100})', function () {

    var idGen = new FlakeId({id:0x100});

    describe('next', function () {
        it('should return unique id when callback is not present', function () {
            testSynch(idGen, 1000);
        });
        
        it('should return unique ids when callback is present', function () {
            this.slow(200);
            testWithCallback(idGen, 5000);
        });
    });
});

describe('FlakeId({seqMask:0x0F})', function () {

    var idGen = new FlakeId({seqMask:0x0F});

    describe('next', function () {
        it('should return unique id when callback is not present', function () {
            // Maximum unique ids depends on seqMask - 16 in this case
            testSynch(idGen, 16);
        });
        
        it('should return unique ids when callback is present', function () {
            this.slow(200);
            testWithCallback(idGen, 1000);
        });

        it('should throw an exception if counter has been exceeded and callback is not present', function () {
            assert.throws(function () {
                testSynch(idGen, 100);
            });
        });
    });
});

function testSynch(generator, howMany) {
    var ids = new Array(howMany), i;

    for(i = 0; i < ids.length; i++) {
        ids[i] = generator.next().toString('hex');
    }

    for(i = 0; i < ids.length - 1; i++) {
        assert.notEqual(ids[i], ids[i+1]);      // Two sibling ids are not equal
        assert.ok(ids[i] < ids[i+1]);           // Each id is greater than an id generated before
    }
}

function testWithCallback(generator, howMany) {
    var ids = new Array(howMany), i, index = 0;

    for(i = 0; i < ids.length; i++) {
        generator.next(function (err, id) {
          assert.ifError(err);
          ids[index++] = id.toString('hex');

          if(index === ids.length) {
            for(i = 0; i < ids.length - 1; i++) {
                assert.notEqual(ids[i], ids[i+1]);      // Two sibling ids are not equal
                assert.ok(ids[i] < ids[i+1]);           // Each id is greater than an id generated before
            }
          }
        });
    }
}