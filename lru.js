'use strict';

import dll from './utils/dll';

/*
 *  Least Recently Used Cache : 
 *  A cache which rotates recently used item in the cache
 *  and helps to retain the value when the cache run out of space
 *
 *  Methods:
 *  set   - {key, value} adds value to LRU Cache
 *  get   - {key} fetch the value from LRU Cache
 *  clear - {keys} if keys is empty bust the cache
 *  limit - {size} set the size of the cache
 */

const LRU = (function() {
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
          delete node.value();
          
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

    clear: function(keys) {
      if (keys) {
        const clearKey = (key) => {
          // Clear key
          let node = keystore[key],
              nodeVal = node && node.value();

          if (nodeVal) {
            dll.delete(node);

            // Delete the key from keystore
            delete keystore[nodeVal.key];

            // Delete the node
            delete node.value();

            // Update Index
            index -= 1;
          }
        }
        if (keys.constructor.name === 'Array') {
          keys.forEach(key => clearKey(key));
        } else if (typeof keys === 'string') {
          clearKey(keys);
        }
      } else {
        // Clear all
        dll.flush();
        index = 0;
        keystore = {};
      }
    },

    limit: function(value) {
      if (value && Number.isInteger(value)) {
        // Allow resize only if current index is below the new limit
        if (index < value) {
          size = value;
        }
      }
    },

    // display: function() {
    //   console.log(dll.display());
    // }
  };
}());

export default LRU;