var assert = require('assert');

import DLL from '../../utils/dll';
import sinon from 'sinon';

var clock,
    dll = new DLL('dllTest');

module.exports = function DLLTest() {
  beforeEach(function() {
    dll.deregisterEventCallback();
    dll.flush();
  });

  it('doubly linked list create', function() {
    assert.equal(dll.getId(), 'dllTest');
    assert.equal(dll.headNode(), null);
    assert.equal(dll.tailNode(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list create null', function() {
    let emptyDLL = new DLL();
    assert.equal(emptyDLL.getId(), 'dll');
    assert.equal(emptyDLL.headNode(), null);
    assert.equal(emptyDLL.tailNode(), null);
    assert.equal(emptyDLL.length(), 0);
  });

  it('doubly linked list enqueue', function() {
    dll.enqueue({key: 'one', value: 'one'});
    assert.notEqual(dll.headNode(), null);
    assert.notEqual(dll.tailNode(), null);
    assert.equal(dll.length(), 1);
    assert.equal(dll.headNode().value(), 'one');
    assert.equal(dll.tailNode().value(), 'one');
    assert.equal(dll.headNode(), dll.tailNode());
  });

  it('doubly linked list enqueue null', function() {
    dll.enqueue();
    assert.equal(dll.headNode(), null);
    assert.equal(dll.tailNode(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list enqueue multiple elements', function() {
    dll.enqueue({key: 'one', value: 'one'});
    dll.enqueue({key: 'two', value: 'two'});
    dll.enqueue({key: 'three', value: 'three'});
    dll.enqueue({key: 'four', value: 'four'});
    dll.enqueue({key: 'five', value: 'five'});
    assert.equal(dll.length(), 5);
    assert.equal(dll.headNode().value(), 'five');
    assert.equal(dll.tailNode().value(), 'one');
  });

  it('doubly linked list dequeue null', function() {
    dll.dequeue();
    assert.equal(dll.headNode(), null);
    assert.equal(dll.tailNode(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list dequeue single and check empty', function() {
    dll.enqueue({key: 'one', value: 'one'});
    dll.dequeue();
    assert.equal(dll.headNode(), null);
    assert.equal(dll.tailNode(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list dequeue multiple and check empty', function() {
    dll.enqueue({key: 'one', value: 'one'});
    dll.enqueue({key: 'two', value: 'two'});
    dll.enqueue({key: 'three', value: 'three'});
    dll.dequeue();
    dll.dequeue();
    dll.dequeue();
    assert.equal(dll.headNode(), null);
    assert.equal(dll.tailNode(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list dequeue from multiple and check non-empty', function() {
    dll.enqueue({key: 'one', value: 'one'});
    dll.enqueue({key: 'two', value: 'two'});
    dll.enqueue({key: 'three', value: 'three'});
    dll.dequeue();
    assert.equal(dll.headNode().value(), 'three');
    assert.equal(dll.tailNode().value(), 'two');
    assert.notEqual(dll.headNode(), dll.tailNode());
    assert.equal(dll.length(), 2);
  });

  it('doubly linked list delete single and check empty', function() {
    let one = dll.enqueue({key: 'one', value: 'one'});
    dll.delete(one);
    assert.equal(dll.headNode(), null);
    assert.equal(dll.tailNode(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list delete nothing', function() {
    dll.delete();
    assert.equal(dll.headNode(), null);
    assert.equal(dll.tailNode(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list delete empty object', function() {
    let one = {};
    dll.delete(one);
    assert.equal(dll.headNode(), null);
    assert.equal(dll.tailNode(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list delete multiple in-between and check non-empty', function() {
    let one = dll.enqueue({key: 'one', value: 'one'});
    dll.enqueue({key: 'two', value: 'two'});
    dll.enqueue({key: 'three', value: 'three'});
    let four = dll.enqueue({key: 'four', value: 'four'});
    dll.enqueue({key: 'five', value: 'five'});
    dll.delete(one);
    dll.delete(four);
    assert.equal(dll.headNode().value(), 'five');
    assert.equal(dll.tailNode().value(), 'two');
    assert.equal(dll.length(), 3);
  });

  it('doubly linked list checking upper limit', function() {
    dll.limit(3);
    dll.enqueue({key: 'one', value: 'one'});
    dll.enqueue({key: 'two', value: 'two'});
    dll.enqueue({key: 'three', value: 'three'});
    dll.enqueue({key: 'four', value: 'four'});
    assert.equal(dll.headNode().value(), 'four');
    assert.equal(dll.tailNode().value(), 'two');
    assert.equal(dll.length(), 3);
  });

  it('doubly linked list checking lower limit', function() {
    dll.limit(5);
    dll.enqueue({key: 'one', value: 'one'});
    dll.enqueue({key: 'two', value: 'two'});
    dll.limit(3);
    dll.enqueue({key: 'three', value: 'three'});
    assert.equal(dll.headNode().value(), 'three');
    assert.equal(dll.tailNode().value(), 'one');
    assert.equal(dll.length(), 3);
    dll.limit(2);
    dll.enqueue({key: 'four', value: 'four'});
    assert.equal(dll.headNode().value(), 'four');
    assert.equal(dll.tailNode().value(), 'two');
    assert.equal(dll.length(), 3);
  });

  it('doubly linked list checking limit', function() {
    dll.limit(4);
    dll.enqueue({key: 'one', value: 'one'});
    let two = dll.enqueue({key: 'two', value: 'two', timeToIdle: 1000});
    dll.enqueue({key: 'three', value: 'three'});
    dll.limit();
    dll.enqueue({key: 'four', value: 'four'});

    clock = sinon.useFakeTimers();
    clock.tick(two.createdAt() + 1001);

    dll.enqueue({key: 'five', value: 'five'});
    dll.enqueue({key: 'six', value: 'six'});
    assert.equal(dll.headNode().value(), 'six');
    assert.equal(dll.tailNode().value(), 'three');
    assert.equal(dll.length(), 4);
  });

  it('doubly linked list checking limit within tti', function() {
    dll.limit(4);
    dll.enqueue({key: 'one', value: 'one'});
    dll.enqueue({key: 'two', value: 'two'});
    let three = dll.enqueue({key: 'three', value: 'three', timeToIdle: 10000});
    dll.limit();
    dll.enqueue({key: 'four', value: 'four'});

    clock = sinon.useFakeTimers();
    clock.tick(three.createdAt() + 1000);

    dll.enqueue({key: 'five', value: 'five'});
    dll.enqueue({key: 'six', value: 'six'});
    assert.equal(dll.headNode().value(), 'six');
    assert.equal(dll.tailNode().value(), 'three');
    assert.equal(dll.length(), 4);
  });

  it('doubly linked list checking outside ttl', function() {
    dll.limit(5);
    dll.enqueue({key: 'one', value: 'one'});
    dll.enqueue({key: 'two', value: 'two', timeToIdle: 1000});
    let three = dll.enqueue({key: 'three', value: 'three', timeToLive: 1000});
    assert.equal(dll.length(), 3);
    assert.equal(dll.headNode().value(), 'three');
    clock = sinon.useFakeTimers();
    clock.tick(three.bornAt() + 1001);
    assert.equal(dll.length(), 2);
    assert.equal(dll.headNode().value(), void 0);
    let four = dll.enqueue({key: 'four', value: 'four', timeToLive: 1000});
    clock = sinon.useFakeTimers();
    clock.tick(four.bornAt() + 1001);
    dll.enqueue({key: 'five', value: 'five'});
    assert.equal(dll.length(), 3);
    assert.equal(dll.headNode().value(), 'five');
    assert.equal(dll.tailNode().value(), 'one');
  });

  it('doubly linked list checking within ttl', function() {
    dll.limit(5);
    dll.enqueue({key: 'one', value: 'one'});
    let two = dll.enqueue({key: 'two', value: 'two', timeToLive: 10000});
    assert.equal(dll.length(), 2);
    clock = sinon.useFakeTimers();
    clock.tick(two.bornAt() + 1000);
    assert.equal(dll.length(), 2);
  });

  it('check if dll received created event', function() {
    dll.registerEventCallback(function() {
      // console.log(`DLL Event Triggered`);
      assert(true);
    });
    dll.enqueue({key: 'one', value: 'one'});
    dll.dequeue({key: 'one'});
  });

  // it('doubly linked list check display', function() {
  //   dll.limit(5);
  //   dll.enqueue({key: 'one', value: 'one'});
  //   dll.enqueue({key: 'two', value: 'two'});
  //   dll.enqueue({key: 'three', value: 'three'});
  //   dll.enqueue({key: 'four', value: 'four'});
  //   dll.enqueue({key: 'five', value: 'five'});
  //   dll.enqueue({key: 'six', value: 'six'});
  //   assert.equal(dll.display(), 'six five four three two ');
  // });

  // it('doubly linked list add empty object', function() {
  //   let one = {};
  //   dll.add('two', one);
  //   assert.equal(dll.headNode().value(), 'two');
  //   assert.equal(dll.tailNode().value(), 'two');
  //   assert.equal(dll.length(), 1);
  // });

  // it('doubly linked list add after node', function() {
  //   let four = dll.enqueue('four');
  //   let two = dll.enqueue('two');
  //   assert.equal(dll.headNode().value(), 'two');
  //   assert.equal(dll.tailNode().value(), 'four');
    
  //   // Adding as first node
  //   let one = dll.add('one');
  //   assert.equal(dll.headNode().value(), 'one');
  //   assert.equal(one.left(), null);
  //   assert.equal(one.right().value(), 'two');
  //   assert.equal(two.left().value(), 'one');

  //   // Adding in middle
  //   let three = dll.add('three', two);
  //   assert.equal(two.right().value(), 'three');
  //   assert.equal(four.left().value(), 'three');
  //   assert.equal(three.left().value(), 'two');
  //   assert.equal(three.right().value(), 'four');

  //   let five = dll.add('five', four);
  //   assert.equal(dll.tailNode().value(), 'five');
  //   assert.equal(five.right(), null);
  //   assert.equal(five.left().value(), 'four');
  //   assert.equal(four.right().value(), 'five');

  //   assert.equal(dll.length(), 5);
  // });
};