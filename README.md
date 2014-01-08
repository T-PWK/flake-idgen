Flake ID Generator
===========

Flake ID generator yields k-ordered, conflict-free ids in a distributed environment

## Flake Numbers ##

The Flake ID is made up of: `timestamp`, `datacenter`, `worker` and `counter`. Examples in the following table
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
- `timestamp` - 42 bits
- `datacenter` - 5 bits - 32 unique datacenter ids
- `worker` - 5 bits - 32 unique workers 
- `counter` - 12 bits - unique 4096 ids per millisecond 

Please note that composition of `datacenter id` and `worker id` makes 1024 unique service identifiers.

## Usage ##

## Author ##
Writen by Tom Pawlak - [Blog](http://tompawlak.blogspot.co.uk)

## License ##

Copyright (c) 2014 Tom Pawlak

MIT License : http://tompawlak.blogspot.com/p/mit.html
