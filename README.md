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

As you can see, each Flake ID is 64 bits long, consisting of a 42 bit timestamp, a 5 bit datacenter id (32 unique datacenters), a 5 bit worker id (32 unique workers) and a 12 bit counter. Please note that composition of datacenter id and worker id makes 1024 unique identifiers.

## Usage ##

## Author ##
Writen by Tom Pawlak - [Blog](http://tompawlak.blogspot.co.uk)

## License ##

Copyright (c) 2014 Tom Pawlak

MIT License : https://github.com/T-PWK/flake-idgen/blob/master/LICENSE
