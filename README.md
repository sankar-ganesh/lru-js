# lrujs-cache

Least Recently Used (LRU) Caching Technique

## Design

- Uses doubly-linked list for low complexity shuffling

- "head" contains most recently used

- "tail" contains least recently used

- keystore for node lookup to reduce complexity

- Size to restrict the usage of memory

- Removes the least recently used value from the cache when limit exceeds

## Usage

```javascript
// To access LRU Cache
import lru from 'lrujs-cache';

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
	value: 2,								// Value will get reset after timeToIdle (ms)
	timeToIdle: 10000				// Clock will get reset if value is accessed with timeToIdle (ms)
});

// To set the value in cache with timeToLive (ms)
lru.set({
	key: 'three',
	value: 3,								// Value will be dropped after timeToLive (ms)
	timeToIdle: 10000				// Clock will get reset only if timeToLive (ms) is updated
});

// To get the value from cache => Returns 1 from cache
lru.get('one');

// To clear the key from cache
lru.clear('one');

// To clear multiple keys from cache
lru.clear(['one', 'two']);
```

## Installation

* `yarn add lrujs-cache`