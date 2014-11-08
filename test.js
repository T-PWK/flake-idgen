(function () {
    "use strict";

    var assert  = require('assert'),
        FlakeId = require('./flake-id-gen'),
        idGen1  = new FlakeId(),
        idGen2  = new FlakeId({id:0x100}),
        idGen3  = new FlakeId({seqMask:0x0F});

    test(idGen1);
    test(idGen2);

    testWithFn(idGen1);
    testWithFn(idGen2);
    testWithFn(idGen3);

    testAsync(idGen1);
    testAsync(idGen2);


    function testAsync(generator) {
      var ids = [];
      generator.next(function (err, id) {
        assert.ifError(err);
        ids.push(id.toString('hex'));

        generator.next(function (err, id) {
          assert.ifError(err);
          ids.push(id.toString('hex'));

          assert.ok(ids[0] < ids[1]);
        });

      });
    }

    function test(generator) {
        var ids = new Array(1000), i;

        for(i = 0; i < ids.length; i++) {
            ids[i] = generator.next().toString('hex');
        }

        for(i = 0; i < ids.length - 1; i++) {
            assert.notEqual(ids[i], ids[i+1]);      // Two sibling ids are not equal
            assert.ok(ids[i] < ids[i+1]);           // Each id is greater than an id generated before
        }
    }

    function testWithFn(generator) {
        var ids = new Array(1000), i, index = 0;

        for(i = 0; i < ids.length; i++) {
            generator.next(function (err, id) {
              assert.ifError(err);
              ids[index++] = id.toString('hex');

              if(index == ids.length) {
                for(i = 0; i < ids.length - 1; i++) {
                    assert.notEqual(ids[i], ids[i+1]);      // Two sibling ids are not equal
                    assert.ok(ids[i] < ids[i+1]);           // Each id is greater than an id generated before
                }
              }
            });
        }
    }

}());
