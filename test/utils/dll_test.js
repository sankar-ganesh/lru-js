var assert = require('assert');

import dll from '../../utils/dll';
import sinon from 'sinon';

let clock;

module.exports = function DLLNodeTest() {
  beforeEach(function() {
    dll.flush();
  });

  it('doubly linked list create', function() {
    assert.equal(dll.head(), null);
    assert.equal(dll.tail(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list enqueue', function() {
    dll.enqueue({value: 'one'});
    assert.notEqual(dll.head(), null);
    assert.notEqual(dll.tail(), null);
    assert.equal(dll.length(), 1);
    assert.equal(dll.head().value(), 'one');
    assert.equal(dll.tail().value(), 'one');
    assert.equal(dll.head(), dll.tail());
  });

  it('doubly linked list enqueue null', function() {
    dll.enqueue();
    assert.equal(dll.head(), null);
    assert.equal(dll.tail(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list enqueue multiple elements', function() {
    dll.enqueue({value: 'one'});
    dll.enqueue({value: 'two'});
    dll.enqueue({value: 'three'});
    dll.enqueue({value: 'four'});
    dll.enqueue({value: 'five'});
    assert.equal(dll.length(), 5);
    assert.equal(dll.head().value(), 'five');
    assert.equal(dll.tail().value(), 'one');
  });

  it('doubly linked list dequeue null', function() {
    dll.dequeue();
    assert.equal(dll.head(), null);
    assert.equal(dll.tail(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list dequeue single and check empty', function() {
    dll.enqueue({value: 'one'});
    dll.dequeue();
    assert.equal(dll.head(), null);
    assert.equal(dll.tail(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list dequeue multiple and check empty', function() {
    dll.enqueue({value: 'one'});
    dll.enqueue({value: 'two'});
    dll.enqueue({value: 'three'});
    dll.dequeue();
    dll.dequeue();
    dll.dequeue();
    assert.equal(dll.head(), null);
    assert.equal(dll.tail(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list dequeue from multiple and check non-empty', function() {
    dll.enqueue({value: 'one'});
    dll.enqueue({value: 'two'});
    dll.enqueue({value: 'three'});
    dll.dequeue();
    assert.equal(dll.head().value(), 'three');
    assert.equal(dll.tail().value(), 'two');
    assert.notEqual(dll.head(), dll.tail());
    assert.equal(dll.length(), 2);
  });

  it('doubly linked list delete single and check empty', function() {
    let one = dll.enqueue({value: 'one'});
    dll.delete(one);
    assert.equal(dll.head(), null);
    assert.equal(dll.tail(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list delete nothing', function() {
    dll.delete();
    assert.equal(dll.head(), null);
    assert.equal(dll.tail(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list delete empty object', function() {
    let one = {};
    dll.delete(one);
    assert.equal(dll.head(), null);
    assert.equal(dll.tail(), null);
    assert.equal(dll.length(), 0);
  });

  it('doubly linked list delete multiple in-between and check non-empty', function() {
    let one = dll.enqueue({value: 'one'});
    dll.enqueue({value: 'two'});
    dll.enqueue({value: 'three'});
    let four = dll.enqueue({value: 'four'});
    dll.enqueue({value: 'five'});
    dll.delete(one);
    dll.delete(four);
    assert.equal(dll.head().value(), 'five');
    assert.equal(dll.tail().value(), 'two');
    assert.equal(dll.length(), 3);
  });

  it('doubly linked list checking upper limit', function() {
    dll.limit(3);
    dll.enqueue({value: 'one'});
    dll.enqueue({value: 'two'});
    dll.enqueue({value: 'three'});
    dll.enqueue({value: 'four'});
    assert.equal(dll.head().value(), 'four');
    assert.equal(dll.tail().value(), 'two');
    assert.equal(dll.length(), 3);
  });

  it('doubly linked list checking lower limit', function() {
    dll.limit(5);
    dll.enqueue({value: 'one'});
    dll.enqueue({value: 'two'});
    dll.limit(3);
    dll.enqueue({value: 'three'});
    assert.equal(dll.head().value(), 'three');
    assert.equal(dll.tail().value(), 'one');
    assert.equal(dll.length(), 3);
    dll.limit(2);
    dll.enqueue({value: 'four'});
    assert.equal(dll.head().value(), 'four');
    assert.equal(dll.tail().value(), 'two');
    assert.equal(dll.length(), 3);
  });

  it('doubly linked list checking limit', function() {
    dll.limit(4);
    dll.enqueue({value: 'one'});
    let two = dll.enqueue({value: 'two', timeToIdle: 1000});
    dll.enqueue({value: 'three'});
    dll.limit();
    dll.enqueue({value: 'four'});

    clock = sinon.useFakeTimers();
    clock.tick(two.createdAt() + 1001);

    dll.enqueue({value: 'five'});
    dll.enqueue({value: 'six'});
    assert.equal(dll.head().value(), 'six');
    assert.equal(dll.tail().value(), 'three');
    assert.equal(dll.length(), 4);
  });

  it('doubly linked list checking limit within tti', function() {
    dll.limit(4);
    dll.enqueue({value: 'one'});
    dll.enqueue({value: 'two'});
    let three = dll.enqueue({value: 'three', timeToIdle: 10000});
    dll.limit();
    dll.enqueue({value: 'four'});

    clock = sinon.useFakeTimers();
    clock.tick(three.createdAt() + 1000);

    dll.enqueue({value: 'five'});
    dll.enqueue({value: 'six'});
    assert.equal(dll.head().value(), 'six');
    assert.equal(dll.tail().value(), 'three');
    assert.equal(dll.length(), 4);
  });

  it('doubly linked list checking outside ttl', function() {
    dll.limit(5);
    dll.enqueue({value: 'one'});
    dll.enqueue({value: 'two', timeToIdle: 1000});
    let three = dll.enqueue({value: 'three', timeToLive: 1000});
    assert.equal(dll.length(), 3);
    assert.equal(dll.head().value(), 'three');
    clock = sinon.useFakeTimers();
    clock.tick(three.bornAt() + 1001);
    assert.equal(dll.length(), 2);
    assert.equal(dll.head().value(), void 0);
    let four = dll.enqueue({value: 'four', timeToLive: 1000});
    clock = sinon.useFakeTimers();
    clock.tick(four.bornAt() + 1001);
    dll.enqueue({value: 'five'});
    assert.equal(dll.length(), 3);
    assert.equal(dll.head().value(), 'five');
    assert.equal(dll.tail().value(), 'one');
  });

  it('doubly linked list checking within ttl', function() {
    dll.limit(5);
    dll.enqueue({value: 'one'});
    let two = dll.enqueue({value: 'two', timeToLive: 10000});
    assert.equal(dll.length(), 2);
    clock = sinon.useFakeTimers();
    clock.tick(two.bornAt() + 1000);
    assert.equal(dll.length(), 2);
  });

  // it('doubly linked list check display', function() {
  //   dll.limit(5);
  //   dll.enqueue({value: 'one'});
  //   dll.enqueue({value: 'two'});
  //   dll.enqueue({value: 'three'});
  //   dll.enqueue({value: 'four'});
  //   dll.enqueue({value: 'five'});
  //   dll.enqueue({value: 'six'});
  //   assert.equal(dll.display(), 'six five four three two ');
  // });

  // it('doubly linked list add empty object', function() {
  //   let one = {};
  //   dll.add('two', one);
  //   assert.equal(dll.head().value(), 'two');
  //   assert.equal(dll.tail().value(), 'two');
  //   assert.equal(dll.length(), 1);
  // });

  // it('doubly linked list add after node', function() {
  //   let four = dll.enqueue('four');
  //   let two = dll.enqueue('two');
  //   assert.equal(dll.head().value(), 'two');
  //   assert.equal(dll.tail().value(), 'four');
    
  //   // Adding as first node
  //   let one = dll.add('one');
  //   assert.equal(dll.head().value(), 'one');
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
  //   assert.equal(dll.tail().value(), 'five');
  //   assert.equal(five.right(), null);
  //   assert.equal(five.left().value(), 'four');
  //   assert.equal(four.right().value(), 'five');

  //   assert.equal(dll.length(), 5);
  // });
};