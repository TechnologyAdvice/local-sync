Local Sync
==========

A friendly, tiny, synchronous, namespaced, and _dependency free_ local storage solution.

```
npm i local-sync -S
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
  - [Buckets](#buckets)
  - [set, get, put](#set-get-put)
  - [keys, values, getAll](#keys-values-getall)
  - [remove, clear](#remove-clear)
- [API](#api)
  - [new LocalSync([options])](#new-localsyncoptions)
  - [localSync.setBucket(bucket) ⇒ <code>String</code>](#localsyncsetbucketbucket-%E2%87%92-codestringcode)
  - [localSync.getBucket() ⇒ <code>String</code>](#localsyncgetbucket-%E2%87%92-codestringcode)
  - [localSync.allBuckets() ⇒ <code>Array.&lt;String&gt;</code>](#localsyncallbuckets-%E2%87%92-codearray&ltstring&gtcode)
  - [localSync.get(key) ⇒ <code>\*</code>](#localsyncgetkey-%E2%87%92-code%5Ccode)
  - [localSync.set(key, value) ⇒ <code>\*</code>](#localsyncsetkey-value-%E2%87%92-code%5Ccode)
  - [localSync.put(key, value) ⇒ <code>\*</code>](#localsyncputkey-value-%E2%87%92-code%5Ccode)
  - [localSync.remove(key) ⇒ <code>\*</code>](#localsyncremovekey-%E2%87%92-code%5Ccode)
  - [localSync.clear()](#localsyncclear)
  - [localSync.keys() ⇒ <code>Array.&lt;String&gt;</code>](#localsynckeys-%E2%87%92-codearray&ltstring&gtcode)
  - [localSync.values() ⇒ <code>Array.&lt;\*&gt;</code>](#localsyncvalues-%E2%87%92-codearray&lt%5C&gtcode)
  - [localSync.getAll() ⇒ <code>Array.&lt;Object&gt;</code>](#localsyncgetall-%E2%87%92-codearray&ltobject&gtcode)
- [Releasing](#releasing)
- [Credit](#credit)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


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

<a name="LocalSync"></a>
## API
  <a name="new_LocalSync_new"></a>
### new LocalSync([options])
Create a new Local Sync instance.  Each instance can have its own prefix, buckets, and separator.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Instance options. |
| [options.bucket] | <code>String</code> | <code>default</code> | The bucket namespace to use. |
| [options.prefix] | <code>String</code> | <code>ls</code> | The key prefix namespace to use. |
| [options.separator] | <code>String</code> | <code>.</code> | Separates prefix, bucket, and keys. |

<a name="LocalSync+setBucket"></a>
### localSync.setBucket(bucket) ⇒ <code>String</code>
Set the current `bucket`. Methods will only operate on keys in this namespace.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>String</code> - The bucket name just set.  

| Param | Type | Description |
| --- | --- | --- |
| bucket | <code>String</code> | The bucket name. |

<a name="LocalSync+getBucket"></a>
### localSync.getBucket() ⇒ <code>String</code>
Get the current `bucket`.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>String</code> - The current bucket name.  
<a name="LocalSync+allBuckets"></a>
### localSync.allBuckets() ⇒ <code>Array.&lt;String&gt;</code>
Get all buckets currently in storage.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - An array of bucket strings.  
<a name="LocalSync+get"></a>
### localSync.get(key) ⇒ <code>\*</code>
Get a value from the current bucket.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>\*</code> - The stored value at the specified `key`.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the key you want to retrieve the value of. |

<a name="LocalSync+set"></a>
### localSync.set(key, value) ⇒ <code>\*</code>
Set a value in the current bucket.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>\*</code> - The value that was just set.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the key you want to create/overwrite. |
| value | <code>\*</code> | The value for this key. |

<a name="LocalSync+put"></a>
### localSync.put(key, value) ⇒ <code>\*</code>
Update a value in the current bucket.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>\*</code> - The updated value.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key under which the value to be updated is stored. |
| value | <code>\*</code> | Value to assign to the stored object. |

<a name="LocalSync+remove"></a>
### localSync.remove(key) ⇒ <code>\*</code>
Remove a value from the current bucket.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>\*</code> - The object just removed.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key under which the value to be deleted is stored. |

<a name="LocalSync+clear"></a>
### localSync.clear()
Clears all values from the current bucket.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
<a name="LocalSync+keys"></a>
### localSync.keys() ⇒ <code>Array.&lt;String&gt;</code>
Get all `key`s in the current bucket.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - An array of `key` strings.  
<a name="LocalSync+values"></a>
### localSync.values() ⇒ <code>Array.&lt;\*&gt;</code>
Get all `value`s in the current bucket.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>Array.&lt;\*&gt;</code> - An array of values.  
<a name="LocalSync+getAll"></a>
### localSync.getAll() ⇒ <code>Array.&lt;Object&gt;</code>
Get all key/value pairs in the current bucket.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of objects `{<key>: <value>}`.  

***

## Releasing

On the latest clean `master`:

```sh
npm run release:major
npm run release:minor
npm run release:patch
```

## Credit

&copy; 2016 TechnologyAdvice
