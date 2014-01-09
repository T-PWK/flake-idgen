Flake ID Generator
===========

Flake ID generator yields k-ordered, conflict-free ids in a distributed environment

## Flake Numbers ##

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
- `timestamp` (42 bits) - number of milliseconds elapsed since 1 January 1970 00:00:00 UTC 
- `datacenter` (5 bits) - 32 unique datacenter ids
- `worker` (5 bits) - 32 unique workers in a single datacenter
- `counter` (12 bits) - 4096 unique ids per millisecond 

Note that composition of `datacenter id` and `worker id` makes 1024 unique service identifiers. By modifying datacenter and worker id we can get up to 1024 id generators on a single machine (e.g. each running in a separate process) or have 1024 machines with a single id generator on each. ???????

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
- `datacenter` - a 5 bit long datacenter identifier. It can have values from 0 to 31.
- `worker` - a 5 bit long worker identifier. It can have values from 0 to 31.
- `id` - a 10 bit long gnerator identifier. It can have values from 0 to 1023. It can be provided instead of `datacenter` and `worker` identifiers.
- `epoch` - number used to reduce value of a generated timestamp. Note that this number should not exceed number of milliseconds elapsed since 1 January 1970 00:00:00 UTC. It can be used to generate _smaller_ ids.

Example of using `datacenter` and `worker` identifiers:
```js
var FlakeId = require('flake-idgen')

var flakeIdGen1 = new FlakeId();
var flakeIdGen2 = new FlakeId({datacenter:9, worker:7});

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
var FlakeId = require('../flake-idgen')

var flakeIdGen1 = new FlakeId();
var flakeIdGen2 = new FlakeId({epoch:1300000000000});

console.info(flakeIdGen1.next());
console.info(flakeIdGen2.next());
```

It would give something like:
```
<Buffer 50 dd db 00 d1 c0 00 00>
<Buffer 05 32 58 8e d2 40 00 00>
```

Note that Flake Id generator returns node Buffer representing 64 bit number for the sake of future extensions or returned buffer modifications. Node Buffer can also be very easy converted to the string format. There is a NPM [biguint-format](https://npmjs.org/package/biguint-format) Node.js module which provides Buffer to string conversion means e.g.

```js
var biguint = require('biguint-format')
var FlakeId = require('flake-idgen')

var flakeIdGen1 = new FlakeId();
var flakeIdGen2 = new FlakeId({epoch:1300000000000});

console.info(biguint.format(flakeIdGen1.next(), 'dec'));
console.info(biguint.format(flakeIdGen1.next(), 'hex'));

console.info(biguint.format(flakeIdGen2.next(), 'dec'));
console.info(biguint.format(flakeIdGen2.next(), 'hex'));
```

It would something like:
```js
5827056208820830208 // flakeIdGen1 decimal format
50dddcbfb5c00001    // flakeIdGen1 hex format

374461008833413120 // flakeIdGen2 decimal format
5325a4db6000002    // flakeIdGen2 hex format
```

## Author ##
Writen by Tom Pawlak - [Blog](http://tompawlak.blogspot.co.uk)

## License ##

Copyright (c) 2014 Tom Pawlak

MIT License : http://tompawlak.blogspot.com/p/mit.html
