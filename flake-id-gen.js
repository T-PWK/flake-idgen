/**
 * Flake ID generator yields k-ordered, conflict-free ids in a distributed environment.
 */
(function () {
    "use strict";

    var FlakeId = module.exports = function (options) {
        this.options = options || {};

        // Set generator id from 'id' option or combination of 'datacenter' and 'worker'
        if (typeof this.options.id !== 'undefined') {
            this.id = this.options.id & 0x3FF;
        } else {
            this.id = ((this.options.datacenter || 0) & 0x1F) << 5 | ((this.options.worker || 0) & 0x1F)
        }
        this.id <<= 12;  // id generator identifier - will not change while generating ids
        this.epoch = +this.options.epoch || 0;
        this.seq = 0;
        this.lastTime = 0;
        this.overflow = false;
        this.seqMask = this.options.seqMask || 0xFFF;
    };

    FlakeId.POW10 = Math.pow(2, 10); // 2 ^ 10
    FlakeId.POW26 = Math.pow(2, 26); // 2 ^ 26

    FlakeId.prototype = {
        next: function (cb) {
            var id = new Buffer(8), time = Date.now() - this.epoch;
            id.fill(0);

            // Generates id in the same millisecond as the previous id
            if (time === this.lastTime) {

                // If all sequence values (4096 unique values including 0) have been used
                // to generate ids in the current millisecond (overflow is true) wait till next millisecond
                if (this.overflow) {
                    overflowCond(this, cb);
                    return;
                }

                // Increase sequence counter
                this.seq = (this.seq + 1) & this.seqMask;

                // sequence counter exceeded its max value (4095)
                // - set overflow flag and wait till next millisecond
                if (this.seq === 0) {
                    this.overflow = true;
                    overflowCond(this, cb);
                    return;
                }
            } else {
                this.overflow = false;
                this.seq = 0;
            }
            this.lastTime = time;

            id.writeUInt32BE(((time & 0x3) << 22) | this.id | this.seq, 4);
            id.writeUInt8(Math.floor(time / 4) & 0xFF, 4);
            id.writeUInt16BE(Math.floor(time / FlakeId.POW10) & 0xFFFF, 2);
            id.writeUInt16BE(Math.floor(time / FlakeId.POW26) & 0xFFFF, 0);

            if (cb) {
                process.nextTick(cb.bind(null, null, id));
            }
            else {
                return id;
            }
        }
    };

  function overflowCond(self, cb) {
    if (cb) {
        setTimeout(self.next.bind(self, cb), 1);
    }
    else {
        throw new Error('Sequence exceeded its maximum value. Provide callback function to handle sequence overflow');
    }
  }


}());
