"use strict";

/*
 *  Doubly Linked List Node
 *
 *  Node with value and two pointers left, right
 */

function DLLNode(value, left, right) {
  this._nodeValue = value || null;
  this._leftNode = left || null;
  this._rightNode = right || null;
  return this;
}

DLLNode.prototype.setValue = function(value) {
  this._nodeValue = value;
  return this;
};

DLLNode.prototype.value = function() {
  return this._nodeValue;
};

DLLNode.prototype.setLeft = function(left) {
  this._leftNode = left;
  return this;
};

DLLNode.prototype.left = function() {
  return this._leftNode;
};

DLLNode.prototype.setRight = function(right) {
  this._rightNode = right;
  return this;
};

DLLNode.prototype.right = function() {
  return this._rightNode;
};

export default DLLNode;
