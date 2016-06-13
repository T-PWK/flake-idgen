Flake ID Generator 
===========
[![Build Status](https://travis-ci.org/T-PWK/flake-idgen.svg?branch=master)](https://travis-ci.org/T-PWK/flake-idgen) 
[![npm version](https://badge.fury.io/js/flake-idgen.svg)](http://badge.fury.io/js/flake-idgen)
[![Dependency Status](https://gemnasium.com/T-PWK/biguint-format.svg)](https://gemnasium.com/T-PWK/biguint-format)
[![npm downloads](https://img.shields.io/npm/dm/flake-idgen.svg)](https://www.npmjs.com/package/flake-idgen)
[![Code Climate](https://codeclimate.com/github/T-PWK/flake-idgen/badges/gpa.svg)](https://codeclimate.com/github/T-PWK/flake-idgen)
[![Test Coverage](https://codeclimate.com/github/T-PWK/flake-idgen/badges/coverage.svg)](https://codeclimate.com/github/T-PWK/flake-idgen)
[![GitHub issues](https://img.shields.io/github/issues/T-PWK/flake-idgen.svg)](https://github.com/T-PWK/flake-idgen/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](http://blog.tompawlak.org/mit-license)
[![Gratipay User](https://img.shields.io/gratipay/user/T-PWK.svg?maxAge=2592000)](https://gratipay.com/~T-PWK/)

Flake ID generator yields k-ordered, conflict-free ids in a distributed environment.

## Installation ##
$ npm install --save flake-idgen ⏎

## Flake Numbers Format ##

The Flake ID is made up of: `timestamp`, `datacenter`, `worker` and `counter`. Examples in the following table: 
```
+-------------+------------+--------+---------+--------------------+
|  Timestamp  | Datacenter | Worker | Counter | Flake ID           |
+-------------+------------+--------+---------+--------------------+
| 0x8c20543b0 |   00000b   | 00000b |  0x000  | 0x02308150ec000000 |
+-------------+------------+--------+---------+--------------------+
| 0x8c20543b1 |   00000b   | 00000b |  0x000  | 0x02308150ec400000 |
+-------------+------------+--------+---------+--------------------+
| 0x8c20543b1 |   00000b   | 00000b |  0x001  | 0x02308150ec400001 |
+-------------+------------+--------+---------+--------------------+
| 0x8c20543b1 |   00000b   | 00000b |  0x002  | 0x02308150ec400002 |
+-------------+------------+--------+---------+--------------------+
| 0x8c20543b1 |   00000b   | 00000b |  0x003  | 0x02308150ec400003 |
+-------------+------------+--------+---------+--------------------+
| 0x8c20c0335 |   00011b   | 00001b |  0x000  | 0x02308300cd461000 |
+-------------+------------+--------+---------+--------------------+
| 0x8c20c0335 |   00011b   | 00001b |  0x001  | 0x02308300cd461001 |
+-------------+------------+--------+---------+--------------------+
```

As you can see, each Flake ID is 64 bits long, consisting of:
* `timestamp`, a 42 bit long number of milliseconds elapsed since 1 January 1970 00:00:00 UTC 
* `datacenter`, a 5 bit long datacenter identifier. It can take up to 32 unique values (including 0)
* `worker`, a 5 bit long worker indentifier. It can take up to 32 unique values (including 0)
* `counter`, a 12 bit long counter of ids in the same millisecond. It can take up to 4096 unique values. 

Breakdown of bits for an id e.g. `5828128208445124608` (counter is `0`, datacenter is `7` and worker `3`) is as follows:
```
 010100001110000110101011101110100001000111 00111 00011 000000000000
                                                       |------------| 12 bit counter
                                                 |-----|               5 bit worker
                                           |-----|                     5 bit datacenter
                                           |----- -----|              10 bit generator identifier
|------------------------------------------|                          42 bit timestamp
```

Note that composition of `datacenter id` and `worker id` makes 1024 unique generator identifiers. By modifying datacenter and worker id we can get up to 1024 id generators on a single machine (e.g. each running in a separate process) or have 1024 machines with a single id generator on each. It is also possible to provide a single 10 bit long identifier (up to 1024 values). That id is internally split into `datacenter` (the most significant 5 bits) and `worker` (the least significant 5 bits).

## Usage ##

Flake ID Generator returns 8 byte long node [Buffer](http://nodejs.org/api/buffer.html) objects with its bytes representing 64 bit long id. Note that the number is stored in Big Endian format i.e. the most significant byte of the number is stored in the smallest address given and the least significant byte is stored in the largest.

Flake id generator instace has one method `next(cb)` returning generated id (if a callback function is not provided) or calling provided callback function with two arguments: `error` and `generated id`.

The following example uses `next` with no callback function:

```js
var FlakeId = require('flake-idgen');
var flakeIdGen = new FlakeId();

console.log(flakeIdGen.next());
console.log(flakeIdGen.next());
console.log(flakeIdGen.next());
```

It would give something like:
```
<Buffer 50 dd d5 99 01 c0 00 00>
<Buffer 50 dd d5 99 02 80 00 00>
<Buffer 50 dd d5 99 02 80 00 01>
```

The following example uses `next` with callback function:
```js
var FlakeId = require('flake-idgen');
var flakeIdGen = new FlakeId();

flakeIdGen.next(function (err, id) {
     console.info(id);
})

flakeIdGen.next(function (err, id) {
     console.info(id);
})
```

It would give something like:
```
<Buffer 50 dd d6 49 ef c0 00 00>
<Buffer 50 dd d6 49 f0 00 00 00>
```

Flake Id generator constructor takes optional parameter (generator configuration options) with the following properties:
* `datacenter` (5 bit) - datacenter identifier. It can have values from 0 to 31.
* `worker` (5 bit) - worker identifier. It can have values from 0 to 31.
* `id` (10 bit) - gnerator identifier. It can have values from 0 to 1023. It can be provided instead of `datacenter` and `worker` identifiers.
* `epoch` - number used to reduce value of a generated timestamp. Note that this number should not exceed number of milliseconds elapsed since 1 January 1970 00:00:00 UTC. It can be used to generate _smaller_ ids.

Example of using `datacenter` and `worker` identifiers:
```js
var FlakeId = require('flake-idgen')

var flakeIdGen1 = new FlakeId();
var flakeIdGen2 = new FlakeId({ datacenter: 9, worker: 7 });

console.info(flakeIdGen1.next());
console.info(flakeIdGen2.next());
```

It would give something like:
```
<Buffer 50 dd da 8f 43 40 00 00>
<Buffer 50 dd da 8f 43 d2 70 00>
```

Example of using `epoch` parameter:
```js
var FlakeId = require('flake-idgen')

var flakeIdGen1 = new FlakeId();
var flakeIdGen2 = new FlakeId({ epoch: 1300000000000 });

console.info(flakeIdGen1.next());
console.info(flakeIdGen2.next());
```

It would give something like:
```
<Buffer 50 dd db 00 d1 c0 00 00>
<Buffer 05 32 58 8e d2 40 00 00>
```

### Formatting ###

Flake Id generator returns node Buffer representing 64-bit number for the sake of future extensions or returned buffer modifications. Node Buffer can also be very easily converted to string format. There is a NPM [biguint-format](https://npmjs.org/package/biguint-format) module which provides Buffer to string conversion functionality e.g.

```js
var intformat = require('biguint-format')
    , FlakeId = require('flake-idgen')

var flakeIdGen1 = new FlakeId();
var flakeIdGen2 = new FlakeId({ epoch: 1300000000000 });

console.info(intformat(flakeIdGen1.next(), 'dec'));
console.info(intformat(flakeIdGen1.next(), 'hex', { prefix: '0x' }));

console.info(intformat(flakeIdGen2.next(), 'dec'));
console.info(intformat(flakeIdGen2.next(), 'hex', { prefix: '0x' }));
```

It would give something like:
```js
5827056208820830208 // flakeIdGen1 decimal format
0x50dddcbfb5c00001  // flakeIdGen1 hex format

374461008833413120 // flakeIdGen2 decimal format
0x5325a4db6000002  // flakeIdGen2 hex format
```

Generated id could also be converted to binary string format, split into 4 digit groups of 0's and 1's e.g.
```js
var foramt = require('biguint-format')
    , idGen = new (require('flake-idgen'))

for (var i = 0; i < 5; i++) {
	console.info(format(idGen.next(), 'bin', { groupsize: 4 }));
};
```

It would give something like:
```js
0101 0000 1101 1111 1011 0110 0001 0101 1100 0001 0100 0000 0000 0000 0000 0000 // 0x50 df b6 15 c1 40 00 00
0101 0000 1101 1111 1011 0110 0001 0101 1100 0101 0000 0000 0000 0000 0000 0000 // 0x50 df b6 15 c5 00 00 00
0101 0000 1101 1111 1011 0110 0001 0101 1100 0101 0000 0000 0000 0000 0000 0001 // 0x50 df b6 15 c5 00 00 01
0101 0000 1101 1111 1011 0110 0001 0101 1100 0101 0100 0000 0000 0000 0000 0000 // 0x50 df b6 15 c5 40 00 00
0101 0000 1101 1111 1011 0110 0001 0101 1100 0101 0100 0000 0000 0000 0000 0001 // 0x50 df b6 15 c5 40 00 01
```

## Author ##
Writen by Tom Pawlak - [Blog](http://blog.tompawlak.org)

## License ##

Copyright (c) 2014 Tom Pawlak

MIT License : http://blog.tompawlak.org/mit-license
