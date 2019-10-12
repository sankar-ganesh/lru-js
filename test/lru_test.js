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

  it('check lru clear', function() {
  	lru.set('one', 'one');
  	lru.clear();
    assert.equal(lru.get('one'), void 0);
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
    lru.limit(5);
    lru.set('five', 'five');
    lru.set('six', 'six');
    lru.set('seven', 'sevent');
    assert.equal(lru.get('one'), void 0);
    assert.equal(lru.get('three'), 'three');
  });
};