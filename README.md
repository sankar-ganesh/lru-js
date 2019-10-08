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
var lru = require('lrujs-cache');

// To bust the cache
lru.clear();

// To restrict the size to 5
lru.limit(5);

// To set the value in cache
lru.set('one', 1);

// To get the value from cache
lru.get('one'); => Returns 1
```

## Installation

* `yarn add lrujs-cache`