# lrujs-cache

Least Recently Used (LRU) Caching Technique

[![Build Status](https://travis-ci.org/sankar-ganesh/lrujs-cache.svg?branch=master)](https://travis-ci.org/sankar-ganesh/lrujs-cache) [![codecov](https://codecov.io/gh/sankar-ganesh/lrujs-cache/branch/master/graph/badge.svg)](https://codecov.io/gh/sankar-ganesh/lrujs-cache) [![NPM version](https://img.shields.io/npm/v/lrujs-cache.svg)](https://www.npmjs.com/package/lrujs-cache)

## Design

- Uses doubly-linked list for low complexity shuffling

- `head` contains most recently used

- `tail` contains least recently used

- keystore for node lookup to reduce complexity

- Size to restrict the usage of memory

- Removes the expired node in the cache when limit exceeds size

- Removes the least recently accessed node from the cache when limit exceeds

- `length` returns the number of live nodes in the cache

## API

### set

Sets the value against the key in the cache.

Removes the expired node in the cache if `timeToLive` had reached zero.

Removes the least recently used node in the cache if limit is reached.

Overides the `value`, `timeToIdle`, `timeToLive` if the key already exists.

**Parameters**

- `key` identifier for the value to be cached

- `value` actual value to be cached

- `timeToIdle` in (ms) value will get reset if it is not accessed within the timeframe

- `timeToLive` in (ms) key will get reset after the timeframe

### get

Fetches the value stored against the key in the cache. Updates the recently used list.

`timeToIdle` will get reset when the value is accessed.

**Parameters**

- `key` identifier for the value stored in the cache

### clear

Clear all values in the cache

**Parameters**

- `keys` one key (or) array of keys to be cleared

### limit

Sets the maximum size limit for the cache

**Parameters**

- `size` number of keys that can be stored in the cache

### length

- returns the current length of the cache

- removes the expired node from the cache

### hasKey

- returns true if the key is already taken in the cache

- returns false if the key is not taken before

### isLeast

- returns true if the key is least in the cache

### isRecent

- returns true if the key is recent in the cache

### keys

- returns all keys in the cache

## Usage

```javascript
// To access LRU Cache
import lruCache from 'lrujs-cache';

// To instantiate your own cache
var lru = new lruCache('lru');

// To bust the cache
lru.clear();

// To restrict the cache size to 5
lru.limit(5);

// To set the value in cache => Sets 1 into cache
lru.set({
	key: 'one',
	value: 1
});

// To set the value in cache with timeToIdle (ms)
lru.set({
	key: 'two',
	
	// Value will get reset after timeToIdle (ms)
	value: 2,
	
	// Clock will get reset if value is accessed with timeToIdle (ms)
	timeToIdle: 10000
});

// To set the value in cache with timeToLive (ms)
lru.set({
	key: 'three',
	
	// Value will be dropped after timeToLive (ms)
	value: 3,

	// Clock will get reset only if timeToLive (ms) is updated
	timeToLive: 10000
});

// To get the value from cache => Returns 1 from cache
lru.get('one');

// To confirm if the key is already taken in the cache => Returns true
lru.hasKey('one')

// To clear the key from cache
lru.clear('one');

// To clear multiple keys from cache
lru.clear(['one', 'two']);
```

## Installation

* `yarn add lrujs-cache`