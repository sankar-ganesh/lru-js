var assert = require('assert');
var DLLNode = require('../../utils/dll_node');

module.exports = function DLLNodeTest() {
  it('should return node with two pointers with default values on create', function() {
  	let dllNode = new DLLNode();
    assert.equal(dllNode.value(), null);
    assert.equal(dllNode.left(), null);
    assert.equal(dllNode.right(), null);
  });

  it('should return node with two pointers and given values on create', function() {
  	let dllNode = new DLLNode('test', 'left', 'right');
    assert.equal(dllNode.value(), 'test');
    assert.equal(dllNode.left(), 'left');
    assert.equal(dllNode.right(), 'right');
  });

  it('should return node with two pointers and given values on update', function() {
    let dllNode = new DLLNode();
    dllNode.setValue('test');
    assert.equal(dllNode.value(), 'test');
    dllNode.setLeft('left');
    assert.equal(dllNode.left(), 'left');
    dllNode.setRight('right');
    assert.equal(dllNode.right(), 'right');
  });
};