"use strict";

import DLLNode from './dll_node';

/*
 *  Doubly Linked List is a singleton object which allows you to undergo the following operations
 *
 *  Methods:
 *  length      - Returns the length of the list
 *  head        - Returns the head of the list
 *  tail        - Returns the tail of the list
 *  enqueue     - { value } Adds the value to the head in the list
 *  dequeue     - Removes the tail node from the list
 *  delete      - { node } Removes the node from the list
 *  flush       - Removes all nodes from the list
 *  walkTheDLL  - Removes all expired nodes from the list
 */

function DLL(id, size) {
  this._id = id || 'dll';
  this._size = size || 5;
  this._head = this._tail = null;
  this._index = 0;
  return this;
}

DLL.prototype.getId = function() {
  return this._id;
};

DLL.prototype.headNode = function() {
  return this._head;
};

DLL.prototype.tailNode = function() {
  return this._tail;
};

DLL.prototype.enqueue = function(obj) {
  if (obj && obj.value) {
    // Walk The DLL & clear expired cache
    if (this._index >= this._size) {
      this.walkTheDLL();
    }

    // Check if limit exceeded & clear tail node
    if (this._index >= this._size) {
      this.dequeue();
    }

    let dllNode = new DLLNode({
      value: obj.value,
      left: null,
      right: null,
      tti: obj.timeToIdle || null,
      ttl: obj.timeToLive || null
    });

    // Update index
    this._index = (this._index <= 0)? 1 : (this._index + 1);

    // Check For Empty List
    if (this._head) {
      this._head.setLeft(dllNode);
      dllNode.setRight(this._head);
      this._head = dllNode;
      return dllNode;
    }

    // Empty list : Reset head & tail
    this._head = this._tail = dllNode;

    // Return the node added to cache
    return dllNode;
  }
  
  // Object not cached - Return null
  return null;
};

DLL.prototype.dequeue = function() {
  if (this._head && this._tail) {
    this.delete(this._tail);
  }
};

DLL.prototype.delete = function(node) {
  if (node && node.constructor.name === 'DLLNode') {
    let left = node.left(),
        right = node.right();

    if (left) {
      left.setRight(right);
    }

    if (right) {
      right.setLeft(left);
    }

    if (left === null && this._head === node) {
      this._head = right;
    }

    if (right === null && this._tail === node) {
      this._tail = left;
    }

    // Staled Node
    if (left === null && right === null && this._head !== this._tail) {
      return;
    }

    // Update node
    node.reset();

    // Update index only if node got reset
    this._index = (this._index <= 1)? 0 : (this._index - 1);
  }
};

DLL.prototype.flush = function() {
  let ptr = this._head;

  while (ptr !== null) {
    // Delete Node Value
    ptr.reset();

    // Move Pointer
    ptr = ptr.right();
  }

  // Update index
  this._index = 0;

  // Update head & tail
  this._tail = this._head = null;
},

DLL.prototype.walkTheDLL = function() {
  let ptr = this._head;

  while (ptr !== null) {
    // Delete the node if cache has expired
    if (ptr.tte()) {
      this.delete(ptr);
    }

    // Rotate pointer
    ptr = ptr.right();
  }
};

DLL.prototype.limit = function(value) {
  if (value && Number.isInteger(value)) {
    // Allow resize only if current index is below the new limit
    if (this._index < value) {
      this._size = value;
    }
  }
};

DLL.prototype.length = function() {
  // Walk The DLL & clear expired cache
  this.walkTheDLL();

  return this._index;
};

// DLL.prototype.display = function() {
//   let ptr = this._head,
//       val = '';

//   while (ptr) {
//     val += `${ptr.value()} `;
//     ptr = ptr.right();
//   }
//   return val;
// };

export default DLL;