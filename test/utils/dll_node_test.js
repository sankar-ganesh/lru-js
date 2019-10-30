var assert = require('assert');

import DLLNode from '../../utils/dll_node';
import sinon from 'sinon';

let clock;

module.exports = function DLLNodeTest() {
  it('dll node should empty object', function() {
    let dllNode = new DLLNode();
    assert.equal(typeof dllNode, 'object');
    assert.equal(typeof dllNode.value, 'function');
    assert.equal(typeof dllNode.setValue, 'function');
    assert.equal(dllNode.constructor.name, 'DLLNode');
  });

  it('dll node should return value 0', function() {
    assert.equal(new DLLNode({key: 'one', value: 0}).value(), 0);
  });

  it('dll node should return value null', function() {
    assert.equal(new DLLNode({key: 'one', value: null}).value(), null);
  });

  it('dll node should return value empty string', function() {
    assert.equal(new DLLNode({key: 'one', value: ''}).value(), '');
  });

  it('dll node should return value 1', function() {
    assert.equal(new DLLNode({key: 'one', value: 1}).value(), 1);
  });

  it('dll node should return value valid string', function() {
    assert.equal(new DLLNode({key: 'one', value: 'one'}).value(), 'one');
  });

  it('dll node should return value valid object', function() {
    let dllValue = {'one': 1},
        dllNode = new DLLNode({key: 'one', value: dllValue});
    assert.equal(dllNode.value(), dllValue);
  });

  it('should return node with two pointers with default values on create', function() {
  	let dllNode = new DLLNode();
    assert.equal(dllNode.value(), null);
    assert.equal(dllNode.left(), null);
    assert.equal(dllNode.right(), null);
  });

  it('should return node with two pointers and given values on create', function() {
  	let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right'
    });
    assert.equal(dllNode.value(), 'test');
    assert.equal(dllNode.left(), 'left');
    assert.equal(dllNode.right(), 'right');
    assert.equal(dllNode.tti(), 0);
    assert.equal(dllNode.createdAt(), 0);
  });

  it('should return node with two pointers and given values on update', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right'
    });
    dllNode.setValue('test one');
    assert.equal(dllNode.value(), 'test one');
    dllNode.setLeft('left one');
    assert.equal(dllNode.left(), 'left one');
    dllNode.setRight('right one');
    assert.equal(dllNode.right(), 'right one');
  });

  it('should allow only possible updates', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right'
    });
    dllNode.setValue();
    assert.equal(dllNode.value(), 'test');
    dllNode.setLeft();
    assert.equal(dllNode.left(), null);
    dllNode.setRight();
    assert.equal(dllNode.right(), null);
  });

  it('should return default tti and createdAt', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right',
      tti: 0
    });
    assert.equal(dllNode.tti(), 0);
    assert.equal(dllNode.createdAt(), 0);
    
    dllNode.setTTI(null);
    assert.equal(dllNode.tti(), 0);
    assert.equal(dllNode.createdAt(), 0);

    dllNode.setTTI('');
    assert.equal(dllNode.tti(), 0);
    assert.equal(dllNode.createdAt(), 0);

    dllNode.setTTI('0');
    assert.equal(dllNode.tti(), 0);
    assert.equal(dllNode.createdAt(), 0);

    dllNode.setTTI(0);
    assert.equal(dllNode.tti(), 0);
    assert.equal(dllNode.createdAt(), 0);

    dllNode.setTTI('one');
    assert.equal(dllNode.tti(), 0);
    assert.equal(dllNode.createdAt(), 0);
  });

  it('should return valid tti and createdAt', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      tti: 1
    });
    assert.equal(dllNode.tti(), 1);
    assert.notEqual(dllNode.createdAt(), 0);
    assert.equal(dllNode.value(), 'test');

    dllNode.setTTI('one');
    assert.equal(dllNode.tti(), 0);
    assert.equal(dllNode.createdAt(), 0);

    dllNode.setTTI(1000);
    assert.equal(dllNode.tti(), 1000);
    assert.notEqual(dllNode.createdAt(), 0);
  });

  it('should return void if tti has expired', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right',
      tti: 1000
    });
    assert.equal(dllNode.tti(), 1000);
    assert.notEqual(dllNode.createdAt(), 0);
    assert.equal(dllNode.value(), 'test');

    clock = sinon.useFakeTimers();
    clock.tick(dllNode.createdAt() + 1001);
    assert.equal(dllNode.value(), void 0);
  });

  it('should return default value after reset', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right',
      tti: 1000
    });
    dllNode.reset();
    assert.equal(dllNode.tti(), 0);
    assert.equal(dllNode.createdAt(), 0);
    assert.equal(dllNode.value(), void 0);
    assert.equal(dllNode.left(), null);
    assert.equal(dllNode.right(), null);
  });

  it('should reset createdAt when value is updated', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right',
      tti: 1
    });
    assert.equal(dllNode.tti(), 1);
    assert.notEqual(dllNode.createdAt(), 0);
    assert.equal(dllNode.value(), 'test');

    clock = sinon.useFakeTimers();
    clock.tick(dllNode.createdAt() + 1000);
    
    // Reset value and assert
    dllNode.setValue('test one');
    assert.equal(dllNode.value(), 'test one');
  });

  it('should return true if tte has reached', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right',
      ttl: 1000
    });
    assert.equal(dllNode.ttl(), 1000);
    assert.notEqual(dllNode.bornAt(), 0);
    assert.equal(dllNode.tte(), false);

    clock = sinon.useFakeTimers();
    clock.tick(dllNode.bornAt() + 1001);
    assert.equal(dllNode.tte(), true);
  });

  it('should return false for tte and reset bornAt if ttl is not set', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right'
    });
    assert.equal(dllNode.tte(), false);
    assert.equal(dllNode.bornAt(), 0);
  });

  it('should return tte and bornAt if ttl is set', function() {
    let dllNode = new DLLNode({
      key: 'test',
      value: 'test',
      left: 'left',
      right: 'right'
    });
    dllNode.setTTL();
    assert.equal(dllNode.tte(), false);
    assert.equal(dllNode.bornAt(), 0);
    dllNode.setTTL(1000);
    assert.equal(dllNode.ttl(), 1000);
    assert.notEqual(dllNode.bornAt(), 0);
    assert.equal(dllNode.tte(), false);
    clock = sinon.useFakeTimers();
    clock.tick(dllNode.bornAt() + 1001);
    assert.equal(dllNode.tte(), true);
  });
};