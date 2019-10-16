import LRU from './lru';

window.setValue = function() {
	const cache = document.getElementById('cache');
	const key = 'cache';
	LRU.set(key, cache.value);
};

window.getValue = function() {
	const key = 'cache';
	alert(LRU.get(key));
};

window.clearCache = function(keys) {
	LRU.clear(keys);
};

window.limit = function(value) {
	LRU.limit(value);
};

window.LRU = LRU;
