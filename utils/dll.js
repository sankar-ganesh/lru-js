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

var DLL = (function() {
  var head = null,
      tail = null,
      index = 0,
      size = 5;

  return {
    length: function() {
      // Walk The DLL & clear expired cache
      this.walkTheDLL();

      return index;
    },

    // display: function() {
    //   let ptr = head,
    //       val = '';

    //   while (ptr) {
    //     val += `${ptr.value()} `;
    //     ptr = ptr.right();
    //   }
    //   return val;
    // },

    head: function() {
      return head;
    },

    tail: function() {
      return tail;
    },

    enqueue: function(obj) {
      if (obj && obj.value) {
        // Walk The DLL & clear expired cache
        if (index >= size) {
          this.walkTheDLL();
        }

        // Check if limit exceeded & clear tail node
        if (index >= size) {
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
        index = (index <= 0)? 1 : (index + 1);

        // Check For Empty List
        if (head) {
          head.setLeft(dllNode);
          dllNode.setRight(head);
          head = dllNode;
          return dllNode;
        }

        // Empty list : Reset head & tail
        head = tail = dllNode;

        // Return the node added to cache
        return dllNode;
      }
      
      // Object not cached - Return null
      return null;
    },

    dequeue: function() {
      if (head && tail) {
        this.delete(tail);
      }
    },

    delete: function(node) {
      if (node && node.constructor.name === 'DLLNode') {
        let left = node.left(),
            right = node.right();

        if (left) {
          left.setRight(right);
        }

        if (right) {
          right.setLeft(left);
        }

        if (left === null && head === node) {
          head = right;
        }

        if (right === null && tail === node) {
          tail = left;
        }

        // Staled Node
        if (left === null && right === null && head !== tail) {
          return;
        }

        // Update node
        node.reset();

        // Update index only if node got reset
        index = (index <= 1)? 0 : (index - 1);
      }
    },

    flush: function() {
      let ptr = head;

      while (ptr !== null) {
        // Delete Node Value
        ptr.reset();

        // Move Pointer
        ptr = ptr.right();
      }

      // Update index
      index = 0;

      // Update head & tail
      tail = head = null;
    },

    walkTheDLL: function() {
      let ptr = head;

      while (ptr !== null) {
        
        // Delete the node if cache has expired
        if (ptr.tte()) {
          this.delete(ptr);
        }

        // Rotate pointer
        ptr = ptr.right();
      }
    },

    limit: function(value) {
      if (value && Number.isInteger(value)) {
        // Allow resize only if current index is below the new limit
        if (index < value) {
          size = value;
        }
      }
    }
  };
}());

export default DLL;