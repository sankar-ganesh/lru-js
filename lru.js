var dll = require('./utils/dll');

/*
 *  Least Recently Used Cache : A cache which rotates recently used item in the cache
 *  and helps to retain the value when the cache run out of space
 *
 *  Methods:
 *  encache - {key, value} adds value to LRU Cache
 *  fetch   - {key} fetch the value from LRU Cache
 *  flush   - burst the cache
 */

var LRU = (function() {
  var size = 5,
      index = 0,
      keystore = {};

  return {
    set: function(key, value) {
      if (key && value) {
        // Check For Limit
        if (index < size) {
          // Update keystore to hold the node pointer
          keystore[key] = dll.enqueue({key: key, value: value});
          
          // Update Index
          index += 1;
        } else {
          // Remove the tail node upon reaching the limit
          let node = dll.dequeue();
          
          // Delete the key from keystore
          delete keystore[node.value().key];
          
          // Delete the node
          delete node;
          
          // Update keystore to hold the node pointer
          keystore[key] = dll.enqueue({key: key, value: value});
        }
      }
    },

    get: function(key) {
      if (key) {
        let node = keystore[key],
            nodeVal = node && node.value();

        // Check keystore to identify the node
        if (nodeVal) {
          dll.delete(node);
          keystore[key] = dll.enqueue(nodeVal);
          return nodeVal.value;
        }
      }
    },

    clear: function() {
      dll.flush();
      index = 0;
      keystore = {};
    },

    limit: function(value) {
      if (value) {
        size = value;
      }
    }

    // display: function() {
    //   console.log(dll.display());
    // }
  };
}());

module.exports = LRU;