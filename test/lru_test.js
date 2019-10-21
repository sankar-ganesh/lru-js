var assert = require('assert');

import lru from '../lru';

module.exports = function DLLNodeTest() {
  beforeEach(function() {
    lru.clear();
    lru.limit(5);
  });

  it('check empty lru', function() {
    assert.equal(lru.get('one'), void 0);
  });

  it('check empty lru get', function() {
    assert.equal(lru.get(), void 0);
  });

  it('check empty lru set', function() {
    lru.set();
    assert.equal(lru.get('one'), void 0);
  });

  it('check lru for exist', function() {
  	lru.set({
      key: 'one',
      value: 'one'
    });
  	let one = lru.get('one');
    assert.equal(one, 'one');
  });

  it('check lru for not exist', function() {
  	lru.set({
      key: 'one',
      value: 'one'
    });
  	let one = lru.get('two');
    assert.equal(one, void 0);
  });

  it('check lru clear all', function() {
  	lru.set({
      key: 'one',
      value: 'one'
    });
    lru.set({
      key: 'two',
      value: 'two'
    });
  	lru.clear();
    lru.clear(null);
    lru.clear('');
    lru.clear('three');
    assert.equal(lru.get('one'), void 0);
    assert.equal(lru.get('two'), void 0);

    // Check for allowing set after clear
    lru.set({
      key: 'one',
      value: 'one'
    });
    assert.equal(lru.get('one'), 'one');
  });

  it('check lru clear head node', function() {
    lru.set({
      key: 'one',
      value: 'one'
    });
    lru.set({
      key: 'two',
      value: 'two'
    });
    lru.clear('one');
    assert.equal(lru.get('one'), void 0);
    assert.equal(lru.get('two'), 'two');
    
    // Check for allowing set after clear
    lru.set({
      key: 'one',
      value: 'one'
    });
    assert.equal(lru.get('one'), 'one');
  });

  it('check lru clear in-between node', function() {
    lru.set({
      key: 'one',
      value: 'one'
    });
    lru.set({
      key: 'two',
      value: 'two'
    });
    lru.set({
      key: 'three',
      value: 'three'
    });
    lru.clear('two');
    assert.equal(lru.get('one'), 'one');
    assert.equal(lru.get('two'), void 0);
    assert.equal(lru.get('three'), 'three');

    // Check for allowing set after clear
    lru.set({
      key: 'two',
      value: 'two'
    });
    assert.equal(lru.get('two'), 'two');
  });

  it('check lru clear tail node', function() {
    lru.set({
      key: 'one',
      value: 'one'
    });
    lru.set({
      key: 'two',
      value: 'two'
    });
    lru.clear('two');
    assert.equal(lru.get('one'), 'one');
    assert.equal(lru.get('two'), void 0);

    // Check for allowing set after clear
    lru.set({
      key: 'two',
      value: 'two'
    });
    assert.equal(lru.get('two'), 'two');
  });

  it('check lru clear multiple nodes', function() {
    lru.set({
      key: 'one',
      value: 'one'
    });
    lru.set({
      key: 'two',
      value: 'two'
    });
    lru.set({
      key: 'three',
      value: 'three'
    });
    lru.set({
      key: 'four',
      value: 'four'
    });
    lru.set({
      key: 'five',
      value: 'five'
    });
    lru.clear(['two', 'four']);
    assert.equal(lru.get('one'), 'one');
    assert.equal(lru.get('two'), void 0);
    assert.equal(lru.get('three'), 'three');
    assert.equal(lru.get('four'), void 0);

    // Check for allowing multiple set after clear
    lru.set({
      key: 'two',
      value: 'two'
    });
    lru.set({
      key: 'four',
      value: 'four'
    });
    assert.equal(lru.get('one'), 'one');
    assert.equal(lru.get('two'), 'two');
    assert.equal(lru.get('three'), 'three');
    assert.equal(lru.get('four'), 'four');
    assert.equal(lru.get('five'), 'five');
  });

  it('check lru rotate', function() {
    lru.set({
      key: 'one',
      value: 'one'
    });
    lru.set({
      key: 'two',
      value: 'two'
    });
    lru.set({
      key: 'three',
      value: 'three'
    });
    lru.set({
      key: 'four',
      value: 'four'
    });
    lru.set({
      key: 'five',
      value: 'five'
    });
    lru.set({
      key: 'six',
      value: 'six'
    });
    assert.equal(lru.get('one'), void 0);
    assert.equal(lru.get('three'), 'three');
		lru.set({
      key: 'seven',
      value: 'seven'
    });
  });

  it('check lru size limit', function() {
    lru.limit(3);
    lru.set({
      key: 'one',
      value: 'one'
    });
    lru.set({
      key: 'two',
      value: 'two'
    });
    lru.set({
      key: 'three',
      value: 'three'
    });
    lru.set({
      key: 'four',
      value: 'four'
    });
    assert.equal(lru.get('one'), void 0);
    assert.equal(lru.length(), 3);

    // Setting lower limit won't update cache size
    lru.limit(2);

    lru.set({
      key: 'five',
      value: 'five'
    });
    lru.set({
      key: 'six',
      value: 'six'
    });
    lru.set({
      key: 'seven',
      value: 'seven'
    });
    assert.equal(lru.get('five'), 'five');
    assert.equal(lru.length(), 3);

    // Setting higher limit allow update cache size
    lru.limit(5);
    lru.set({
      key: 'one',
      value: 'one'
    });
    lru.set({
      key: 'two',
      value: 'two'
    });
    lru.set({
      key: 'three',
      value: 'three'
    });
    assert.equal(lru.get('six'), void 0);
    assert.equal(lru.get('five'), 'five');

    // Setting empty limit dis-allow update cache size
    lru.limit();
  });

  it('check lru for key value overriding', function() {
    lru.set({
      key: 'one',
      value: 'one'
    });
    lru.set({
      key: 'one',
      value: 'two'
    });
    assert.equal(lru.get('one'), 'two');
    assert.equal(lru.length(), 1);
  });

  it('check lru for key value overriding with tti', function() {
    lru.set({
      key: 'one',
      value: 'one',
      timeToIdle: 1
    });
    lru.set({
      key: 'one',
      value: 'two'
    });
    assert.equal(lru.get('one'), 'two');
    assert.equal(lru.length(), 1);
  });

  it('check lru for key value overriding with tti', function() {
    lru.set({
      key: 'one',
      value: 'one',
      timeToLive: 1
    });
    lru.set({
      key: 'one',
      value: 'two'
    });
    assert.equal(lru.get('one'), 'two');
    assert.equal(lru.length(), 1);
  });
};