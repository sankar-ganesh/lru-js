'use strict';

/*
 * Creates Doubly Linked List Node
 * @constructor
 * @param {object} node The Node Object
 * @param {object} left The Left Node Pointer
 * @param {object} right The Right Node Pointer
 * @return {object} DLLNode
 */

function DLLNode(node) {
	if (node && node.value !== void 0) {
	  this._nodeValue = node.value;
	  this._leftNode = node.left || null;
	  this._rightNode = node.right || null;

	  // Check for time to idle time
	  let tti = (node.tti && parseInt(node.tti, 10)) || 0;
	  this._tti = tti;

	  // Store creation time
		this._createdAt = (tti && new Date().getTime()) || 0;

	  // Check for time to live
	  let ttl = (node.ttl && parseInt(node.ttl, 10)) || 0;
	  this._ttl = ttl;

	  // Store born time
		this._bornAt = (ttl && new Date().getTime()) || 0;

	  return this;
	}
	return;
}

/*
 * Set The Value
 * @param {object} value The Node Value
 * @return {object} DLLNode
 */
DLLNode.prototype.setValue = function(value) {
	if (value !== void 0) {
	  this._nodeValue = value;
	  
	  // Reset creation time if tti is set
	  if (this._tti) {
	  	this._createdAt = new Date().getTime();
	  }
	}
	return this;
};

/*
 * Get The Value
 * @return {object} value The Node Value
 */
DLLNode.prototype.value = function() {
	if (this._tti === 0 || this._createdAt === 0) {
		return this._nodeValue;
	}
	
	let localTime = new Date().getTime(),
			ttiTime = localTime - this._createdAt;

	if (ttiTime <= this._tti) {
		return this._nodeValue;
	}

	// Cache Expired : Reset Node Value
	this._nodeValue = void 0;
	this._tti = this._createdAt = 0;

	return this._nodeValue;
};

/*
 * Get The Time To Expire
 * @return {boolean} tte Time To Expire
 */
DLLNode.prototype.tte = function() {
	if (this._ttl && this._bornAt) {
		let localTime = new Date().getTime(),
				tteTime = localTime - this._bornAt;

		if (tteTime > this._ttl) {
			return true;
		}
	}
	return false;
};

/*
 * Set The Left Node Pointer
 * @param {object} left The Left Node Pointer
 * @return {object} DLLNode
 */
DLLNode.prototype.setLeft = function(left) {
  this._leftNode = left || null;
  return this;
};

/*
 * Get The Left Node Pointer
 * @return {object} The Left Node Pointer
 */
DLLNode.prototype.left = function() {
	return this._leftNode;
};

/*
 * Set The Right Node Pointer
 * @param {object} right The Right Node Pointer
 * @return {object} DLLNode
 */
DLLNode.prototype.setRight = function(right) {
  this._rightNode = right || null;
  return this;
};

/*
 * Get The Right Node Pointer
 * @return {object} The Right Node Pointer
 */
DLLNode.prototype.right = function() {
	return this._rightNode;
};

/*
 * Set The Time To Idle
 * @param {object} tti The Time To Idle
 * @return {object} DLLNode
 */
DLLNode.prototype.setTTI = function(tti) {
  let ttiTime = tti && parseInt(tti, 10) || 0;

	this._tti = ttiTime;
	this._createdAt = (ttiTime && new Date().getTime()) || 0;
	
	return this;
};

/*
 * Get The Time To Idle
 * @return {object} The Time To Idle
 */
DLLNode.prototype.tti = function() {
	return this._tti;
};

/*
 * Set The Time To Live
 * @param {object} ttl The Time To Live
 * @return {object} DLLNode
 */
DLLNode.prototype.setTTL = function(ttl) {
  let ttlTime = ttl && parseInt(ttl, 10) || 0;

	this._ttl = ttlTime;
	this._bornAt = (ttlTime && new Date().getTime()) || 0;
	
	return this;
};

/*
 * Get The Time To Live
 * @return {object} The Time To Live
 */
DLLNode.prototype.ttl = function() {
	return this._ttl;
};

/*
 * Get The Created At
 * @return {object} The Time To Idle
 */
DLLNode.prototype.createdAt = function() {
	return this._createdAt;
};

/*
 * Get The Born At
 * @return {object} The Time To Live
 */
DLLNode.prototype.bornAt = function() {
	return this._bornAt;
};

/*
 * Reset the node
 * @return {object} DLLNode
 */
DLLNode.prototype.reset = function() {
	// Reset Node Value
	this._nodeValue = void 0;

	// Reset Node Properties
	this._leftNode = this._rightNode = null;
	this._tti = this._createdAt = 0;
	this._ttl = this._bornAt = 0;
};

// DLLNode.prototype.display = function() {
// 	console.log(`Delete Node : { value : ${this._nodeValue}, left : ${this._leftNode}, right : ${this._rightNode} }`);
// };

export default DLLNode;
