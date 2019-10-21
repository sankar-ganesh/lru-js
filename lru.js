'use strict';

import dll from './utils/dll';

/*
 *  Least Recently Used Cache : 
 *  A cache which rotates recently used item in the cache
 *  and helps to retain the value when the cache run out of space
 *
 *  Methods:
 *  set     - {key, value} sets the value to LRU Cache
 *  get     - {key} fetch the value from LRU Cache
 *  clear   - {keys} Bust all given keys in the cache
 *  limit   - {size} set the size of the cache
 *  length  - returns the length of the active keys in cache
 */

const LRU = (function() {
  var keystore = {};

  return {
    set: function(obj) {
      let nodeKey = obj && obj.key,
          nodeExist = nodeKey && keystore[nodeKey] || null,
          nodeValue = nodeExist && nodeExist.value();

      // Reset Node Key if cached value expired
      if (nodeValue === void 0) {
        delete keystore[nodeKey];
      }

      // Drop Node if key already exists
      if (nodeExist) {
        dll.delete(nodeExist);
      }

      // Node not exists
      let lruNode = dll.enqueue(obj);
      if (lruNode !== null) {
        keystore[obj.key] = lruNode;
      }
    },

    get: function(key) {
      if (key) {
        let nodeExist = key && keystore[key] || null,
            nodeTTI = nodeExist && nodeExist.tti(),
            nodeValue = nodeExist && nodeExist.value();
        
        // Reset Node Key if cached value expired
        if (nodeValue === void 0) {
          delete keystore[key];
        }

        // Rotate Node if cached value exist
        if (nodeExist) {
          let clonedNode = Object.assign({}, {
            value: nodeValue,
            timeToIdle: nodeTTI
          });
          dll.delete(nodeExist);
          keystore[key] = dll.enqueue(clonedNode);
          return nodeValue;
        }
      }

      return void 0;
    },

    clear: function(keys) {
      if (keys) {
        const clearKey = (key) => dll.delete(keystore[key]);

        // Clear Key Array
        if (keys && keys.constructor && keys.constructor.name === 'Array') {
          keys.forEach(key => clearKey(key));
        }

        // Clear Key
        if (typeof keys === 'string') {
          clearKey(keys);
        }
      } else {
        // Clear all
        dll.flush();
        keystore = {};
      }
    },

    limit: dll.limit.bind(dll),

    length: dll.length.bind(dll),

    // display: function() {
    //   console.log(dll.display());
    // }
  };
}());

export default LRU;