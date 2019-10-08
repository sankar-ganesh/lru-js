var DLLNode = require('./dll_node');

/*
 *  Doubly Linked List is a singleton object which allows you to undergo the following operations
 *
 *  Methods:
 *  length  - Returns the length of the list
 *  head    - Returns the head of the list
 *  tail    - Returns the tail of the list
 *  enqueue - { value } Adds the value to the head in the list
 *  dequeue - Removes the tail node from the list
 *  add     - { value, after } Adds the value next to after node in the list
 *  delete  - { node } Removes the node from the list
 *  flush   - Removes all nodes from the list
 */

var DLL = (function() {
  var head = null,
      tail = null;

  return {
    length: function() {
      let length = 0,
          ptr = head;

      while (ptr !== null) {
        length++;
        ptr = ptr.right();
      }

      return length;
    },

    // display: function() {
    //   let ptr = head,
    //       val = '';

    //   while (ptr) {
    //     val += `${ptr.value().value} `;
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

    enqueue: function(value) {
      if (value !== void 0) {
        let dllNode = new DLLNode(value, null, null);

        // Check For Empty List
        if (head) {
          head.setLeft(dllNode);
          dllNode.setRight(head);
          head = dllNode;
        } else {
          head = tail = dllNode;
        }
        return dllNode;
      }
      return;
    },

    dequeue: function() {
      if (head && tail) {
        // Check For Single Node
        if (head === tail) {
          delete head;
          head = tail = null;
        } else {
          let dllNode = tail;
          tail = tail.left();
          
          // Check For Tail
          if (tail === null) {
            head = tail;
          } else {
            tail.setRight(null);
          }
          return dllNode;
        }
      }
    },

    add: function(value, after) {
      if (after) {
        let dllNode = new DLLNode(value, null, null),
            right = after.right();
        dllNode.setLeft(after);
        dllNode.setRight(right);
        after.setRight(dllNode);

        // Check For Tail
        if (right === null) {
          tail = dllNode;
        } else {
          right.setLeft(dllNode);
        }
        return dllNode;
      } else {
        return this.enqueue(value);
      }
    },

    delete: function(node) {
      if (node) {
        let left = node.left(),
            right = node.right();

        if (left === null) {
          head = right;
        } else {
          left.setRight(right);
        }

        if (right === null) {
          tail = left;
        } else {
          right.setLeft(left);
        }
      }
    },

    flush: function() {
      let ptr = head;

      while (ptr !== null) {
        let dllNode = ptr;
        ptr = ptr.right();
        delete dllNode;
      }

      tail = head = null;
    }
  };
}());

module.exports = DLL;