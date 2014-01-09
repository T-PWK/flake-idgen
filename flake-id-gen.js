/**
 * Constructor accepts any of the following argument types:
 *
 * new FlakeId()
 */
var FlakeId = module.exports = function (options) {
	this.options = options || {};
	
	if (typeof this.options.id !== 'undefined') {
		this.id = this.options.id & 0x3FF;
	} else {
		this.id = ((this.options.datacenter || 0) & 0x1F) << 5 | ((this.options.worker || 0) & 0x1F)
	}
	this.id <<= 12;
	this.epoch = +this.options.epoch || 0;
	this.seq = 0;
	this.lastTime = 0;
	this.overflow = false;
};

FlakeId.POW10 = Math.pow(2, 10);
FlakeId.POW26 = Math.pow(2, 26);

FlakeId.prototype = {
	next: function (cb) {
		var id = new Buffer(8), time = Date.now() - this.epoch;
		id.fill(0);

		if(time === this.lastTime) {
			if(this.overflow) {
				if(cb) {
					setTimeout(this.next.bind(this, cb), 1);
					return;
				}
				else throw new Error('Sequence exceeded its maximum value. Provide callback function to handle sequence overflow');
			}

			this.seq = (this.seq + 1) & 0xFFF;

			// sequence exceeded its max value (4095)
			if(this.seq === 0) {
				this.overflow = true;
				if(cb) {
					setTimeout(this.next.bind(this, cb), 1);
					return;
				}
				else throw new Error('Sequence exceeded its maximum value. Provide callback function to handle sequence overflow');
			}
		} else {
			this.overflow = false;
			this.seq = 0;
		}
		this.lastTime = time;

		id.writeUInt32BE(((time & 0x3) << 22) | this.id | this.seq, 4);
		id.writeUInt8(Math.floor(time / 4) & 0xFF, 4);
		id.writeUInt16BE(Math.floor(time / FlakeId.POW10) & 0xFFFF, 2)
		id.writeUInt16BE(Math.floor(time / FlakeId.POW26) & 0xFFFF, 0)

		if(cb) process.nextTick(cb.bind(null, null, id));
		else return id;
	}
};