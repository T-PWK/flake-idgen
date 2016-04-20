'use strict';

const FlakeId = require('../');
const sinon = require('sinon');
const biguintformat = require('biguint-format');

describe('flake-idgen-63', function () {
  let clock;

  beforeEach(function () {
    const date = new Date(2013, 3, 1);
    clock = sinon.useFakeTimers(date.getTime());
  });

  afterEach(function () {
    clock.restore();
  });

  describe('next', function () {
    it('should generate the proper ID', function () {
      const flakeIdGen = new FlakeId({datacenter : 0x0F, worker : 0x1F});

      const expected = '0010 0111 1011 1000 1000 1100 1010 0110 1011 0000 0001 1111 1111 0000 0000 0000';
      const actual = biguintformat(flakeIdGen.next(), 'bin', {groupsize : 4});

      expect(actual).to.be.equal(expected);
    });

    it('should generate sequential IDs', function () {
      const flakeIdGen = new FlakeId({datacenter : 0x0F, worker : 0x1F});

      const expectedFirst = '0010 0111 1011 1000 1000 1100 1010 0110 1011 0000 0001 1111 1111 0000 0000 0000';
      const expectedSecond = '0010 0111 1011 1000 1000 1100 1010 0110 1011 0000 0001 1111 1111 0000 0000 0001';
      const actualFirst = biguintformat(flakeIdGen.next(), 'bin', {groupsize : 4});
      const actualSecond = biguintformat(flakeIdGen.next(), 'bin', {groupsize : 4});

      expect(actualFirst).to.be.equal(expectedFirst);
      expect(actualSecond).to.be.equal(expectedSecond);
    });
  });
});