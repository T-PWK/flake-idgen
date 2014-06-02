(function () {
    "use strict";

    var assert  = require('assert'),
        FlakeId = require('./flake-id-gen'),
        idGen1  = new FlakeId();

    test(idGen1);

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

}());