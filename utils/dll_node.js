'use strict';

/*
 * Creates Doubly Linked List Node
 * @constructor
 * @param {object} value The Node Value
 * @param {object} left The Left Node Pointer
 * @param {object} right The Right Node Pointer
 * @return {object} DLLNode
 */

function DLLNode(value, left, right) {
  this._nodeValue = value || null;
  this._leftNode = left || null;
  this._rightNode = right || null;
  return this;
}

/*
 * Set The Value
 * @param {object} value The Node Value
 * @return {object} DLLNode
 */
DLLNode.prototype.setValue = function(value) {
  this._nodeValue = value;
  return this;
};

/*
 * Get The Value
 * @return {object} value The Node Value
 */
DLLNode.prototype.value = function() {
  return this._nodeValue;
};

/*
 * Set The Left Node Pointer
 * @param {object} left The Left Node Pointer
 * @return {object} DLLNode
 */
DLLNode.prototype.setLeft = function(left) {
  this._leftNode = left;
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
  this._rightNode = right;
  return this;
};

/*
 * Get The Right Node Pointer
 * @return {object} The Right Node Pointer
 */
DLLNode.prototype.right = function() {
  return this._rightNode;
};

export default DLLNode;
