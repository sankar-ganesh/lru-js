const DLLNodeTest = require('./utils/dll_node_test');
const DLLTest = require('./utils/dll_test');
const LRUTest = require('./lru_test');

describe('LRU Cache JS Test', function() {
	describe('DLL Node Test', DLLNodeTest.bind(this));
	describe('DLL Test', DLLTest.bind(this));
	describe('LRU Test', LRUTest.bind(this));
});