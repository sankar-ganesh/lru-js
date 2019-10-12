import LRU from "./lru";

var key = 'cache';

window.setValue = function() {
	let cache = document.getElementById('cache');
	LRU.set(key, cache.value);
}

window.getValue = function() {
	alert(LRU.get(key));
}

window.clearCache = function() {
	LRU.clear();
}