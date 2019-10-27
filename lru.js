'use strict';

import DLL from './utils/dll';

/*
 *  Least Recently Used Cache : 
 *  A cache which rotates recently used item in the cache
 *  and helps to retain the value when the cache run out of space
 *
 *  Methods:
 *  set       - {key, value} sets the value to LRU Cache
 *  get       - {key} fetch the value from LRU Cache
 *  clear     - {keys} Bust all given keys in the cache
 *  limit     - {size} set the size of the cache
 *  length    - returns the length of the active keys in cache
 *  hasKey    - {key} returns TRUE if the key is taken in the cache
 *  isLeast   - {key} returns TRUE if the key is least in the cache
 *  isRecent  - {key} returns TRUE if the key is recent in the cache
 *  keys      - returns all keys in the cache
 */

function LRU(id) {
  this._id = id || 'lru';
  this._keystore = {};
  this._dll = new DLL(`${this._id}_dll`);
  return this;
}

LRU.prototype.getId = function() {
  return this._id;
};

LRU.prototype.set = function(obj) {
  let nodeKey = obj && obj.key,
      nodeExist = nodeKey && this._keystore[nodeKey] || null,
      nodeValue = nodeExist && nodeExist.value();

  // Reset Node Key if cached value expired
  if (nodeValue === void 0) {
    delete this._keystore[nodeKey];
  }

  // Drop Node if key already exists
  if (nodeExist) {
    this._dll.delete(nodeExist);
  }

  // Node not exists
  let lruNode = this._dll.enqueue(obj);
  if (lruNode !== null) {
    this._keystore[obj.key] = lruNode;
  }
};

LRU.prototype.get = function(key) {
  if (key) {
    let nodeExist = key && this._keystore[key] || null,
        nodeTTI = nodeExist && nodeExist.tti(),
        nodeValue = nodeExist && nodeExist.value();
    
    // Reset Node Key if cached value expired
    if (nodeValue === void 0) {
      delete this._keystore[key];
    }

    // Rotate Node if cached value exist
    if (nodeExist) {
      let clonedNode = Object.assign({}, {
        value: nodeValue,
        timeToIdle: nodeTTI
      });
      this._dll.delete(nodeExist);
      this._keystore[key] = this._dll.enqueue(clonedNode);
      return nodeValue;
    }
  }

  return void 0;
};

LRU.prototype.clear = function(keys) {
  if (keys) {
    const clearKey = (key) => {
      this._dll.delete(this._keystore[key]);
      delete this._keystore[key];
    }

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
    this._dll.flush();
    this._keystore = {};
  }
};

LRU.prototype.limit = function(value) {
  this._dll.limit.call(this._dll, value);
};

LRU.prototype.length = function() {
  return this._dll.length.apply(this._dll);
};

LRU.prototype.hasKey = function(key) {
  if (key) {
    if (this._keystore[key] && Object.prototype.hasOwnProperty.call(this._keystore, key)) {
      return true;
    }
    return false;
  }
  return false;
};

LRU.prototype.isLeast = function(key) {
  return this._dll.isLeastNode(this._keystore[key]);
};

LRU.prototype.isRecent = function(key) {
  return this._dll.isRecentNode(this._keystore[key]);
};

LRU.prototype.keys = function() {
  return Object.keys(this._keystore);
};

// LRU.prototype.display = function() {
//   console.log(this._dll.display());
// };

export default LRU;