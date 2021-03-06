# [Local Sync](https://technologyadvice.github.io/local-sync)
[![Circle CI](https://img.shields.io/circleci/project/TechnologyAdvice/local-sync/master.svg?style=flat-square)](https://circleci.com/gh/TechnologyAdvice/local-sync/tree/master)
[![Codecov](https://img.shields.io/codecov/c/github/TechnologyAdvice/local-sync/master.svg?style=flat-square)](https://codecov.io/gh/TechnologyAdvice/local-sync)
[![npm](https://img.shields.io/npm/v/local-sync.svg?style=flat-square)](https://www.npmjs.com/package/local-sync)

A friendly, tiny, and cross-browser local storage solution:

  ✓ No dependencies  
  ✓ Synchronous  
  ✓ Namespaced storage support  
  ✓ In-memory fallback  

**NPM**

CommonJS build that needs to be bundled in your app.

```
npm i local-sync -S
```

**CDN**

Browser ready build that can be included in a script tag.

```
https://cdn.taplatform.net/local-sync/x.x.x/local-sync.js
https://cdn.taplatform.net/local-sync/x.x.x/local-sync.min.js
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [API](#api)
- [Usage](#usage)
  - [Buckets](#buckets)
  - [set, get, put](#set-get-put)
  - [keys, values, getAll](#keys-values-getall)
  - [remove, clear](#remove-clear)
- [Releasing](#releasing)
- [Credit](#credit)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## API

See [API Documentation](https://github.com/TechnologyAdvice/local-sync/blob/master/API.md).

## Usage

### Buckets

Set or get the current bucket. Subsequent methods operate only in the current bucket namespace.

```js
ls = new LocalSync()              // default settings
ls = new LocalSync({              // custom settings
  prefix: 'ocean',
  bucket: 'fish',
  separator: '~'
})

ls.setBucket('BikiniBottom')      // => 'BikiniBottom'
ls.getBucket()                    // => 'BikiniBottom'
```

List all buckets in storage.

```js
ls.allBuckets()                   // => [...buckets]
```

### set, get, put

Use any JSON serializable data type.

```js
ls.set('bob', {name: 'SpongeBob'})
ls.get('bob')
// => {name: 'SpongeBob'}

ls.set('quotes', ['Squidward!'])
ls.get('quotes')
// => ['Squidward!]
```

Update stored objects and arrays.

```js
ls.put('bob', {address: '124 Conch Street'})
// => {name: 'SpongeBob', address: '124 Conch Street'}

ls.put('quotes', ['Why so crabby, Patty?'])
// => ['Squidward!', 'Why so crabby, Patty?']
```

### keys, values, getAll

List all keys in storage.

```js
ls.keys()
// => ['bob', 'quotes']
```

List all values in storage.

```js
ls.values()
// [
//   {address: '124 Conch Street', name: 'SpongeBob'},
//   ['Squidward!', 'Why so crabby, Patty?']
// ]
```

List all keys and values in storage.

```js
ls.getAll()
// [
//   {address: '124 Conch Street', name: 'SpongeBob'},
//   {quotes: ['Squidward!', 'Why so crabby, Patty?']}
// ]
```

### remove, clear

Remove a single value by key or clear all values.

```js
ls.remove('bob')
ls.keys()
// => ['quotes']
```

Clear all keys and values.

```js
ls.clear()
ls.keys()
// => []
```

***

## Releasing

On the latest clean `master` run a build, commit and push, then:

```sh
npm run release:major
npm run release:minor
npm run release:patch
```

## Credit

&copy; 2016 TechnologyAdvice
