var assert = require('assert');
import lru from '../lru';

module.exports = function DLLNodeTest() {
  beforeEach(function() {
    lru.clear();
  });

  it('check empty lru', function() {
    assert.equal(lru.get('one'), void 0);
  });

  it('check lru for exist', function() {
  	lru.set('one', 'one');
  	let one = lru.get('one');
    assert.equal(one, 'one');
  });

  it('check lru for not exist', function() {
  	lru.set('one', 'one');
  	let one = lru.get('two');
    assert.equal(one, void 0);
  });

  it('check lru clear all', function() {
  	lru.set('one', 'one');
    lru.set('two', 'two');
  	lru.clear();
    assert.equal(lru.get('one'), void 0);
    assert.equal(lru.get('two'), void 0);

    // Check for allowing set after clear
    lru.set('one', 'one');
    assert.equal(lru.get('one'), 'one');
  });

  it('check lru clear head node', function() {
    lru.set('one', 'one');
    lru.set('two', 'two');
    lru.clear('one');
    assert.equal(lru.get('one'), void 0);
    assert.equal(lru.get('two'), 'two');
    
    // Check for allowing set after clear
    lru.set('one', 'one');
    assert.equal(lru.get('one'), 'one');
  });

  it('check lru clear in-between node', function() {
    lru.set('one', 'one');
    lru.set('two', 'two');
    lru.set('three', 'three');
    lru.clear('two');
    assert.equal(lru.get('one'), 'one');
    assert.equal(lru.get('two'), void 0);
    assert.equal(lru.get('three'), 'three');

    // Check for allowing set after clear
    lru.set('two', 'two');
    assert.equal(lru.get('two'), 'two');
  });

  it('check lru clear tail node', function() {
    lru.set('one', 'one');
    lru.set('two', 'two');
    lru.clear('two');
    assert.equal(lru.get('one'), 'one');
    assert.equal(lru.get('two'), void 0);

    // Check for allowing set after clear
    lru.set('two', 'two');
    assert.equal(lru.get('two'), 'two');
  });

  it('check lru clear multiple nodes', function() {
    lru.set('one', 'one');
    lru.set('two', 'two');
    lru.set('three', 'three');
    lru.set('four', 'four');
    lru.set('five', 'five');
    lru.clear(['two', 'four']);
    assert.equal(lru.get('one'), 'one');
    assert.equal(lru.get('two'), void 0);
    assert.equal(lru.get('three'), 'three');
    assert.equal(lru.get('four'), void 0);

    // Check for allowing multiple set after clear
    lru.set('two', 'two');
    lru.set('four', 'four');
    assert.equal(lru.get('one'), 'one');
    assert.equal(lru.get('two'), 'two');
    assert.equal(lru.get('three'), 'three');
    assert.equal(lru.get('four'), 'four');
    assert.equal(lru.get('five'), 'five');
  });

  it('check lru rotate', function() {
  	lru.set('one', 'one');
  	lru.set('two', 'two');
  	lru.set('three', 'three');
  	lru.set('four', 'four');
  	lru.set('five', 'five');
  	lru.set('six', 'six');
    assert.equal(lru.get('one'), void 0);
    assert.equal(lru.get('three'), 'three');
		lru.set('seven', 'seven');
  });

  it('check lru size limit', function() {
    lru.limit(3);
    lru.set('one', 'one');
    lru.set('two', 'two');
    lru.set('three', 'three');
    lru.set('four', 'four');
    assert.equal(lru.get('one'), void 0);

    // Setting lower limit won't update cache size
    lru.limit(2);
    lru.set('five', 'five');
    lru.set('six', 'six');
    lru.set('seven', 'seven');
    assert.equal(lru.get('one'), void 0);
    assert.equal(lru.get('three'), void 0);
    assert.equal(lru.get('five'), 'five');

    // Setting higher limit allow update cache size
    lru.limit(5);
    lru.set('one', 'one');
    lru.set('two', 'two');
    lru.set('three', 'three');
    assert.equal(lru.get('six'), void 0);
    assert.equal(lru.get('five'), 'five');
  });
};