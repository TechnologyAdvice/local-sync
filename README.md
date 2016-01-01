Local Sync
==========

A friendly, tiny, synchronous, namespaced, and _dependency free_ local storage solution.

```
npm i @technologyadvice/local-sync -S
```

## Usage

- [Buckets](#buckets)
- [set, get, put](#set-get-put)
- [remove, clear](#remove-clear)
- [keys, values, getAll](#keys-values-getall)

### Buckets

Set or get the current bucket. Subsequent methods operate only in the current bucket namespace.

```js
ls = new LocalSync()              // 'default' bucket
ls = new LocalSync('fish')        // same as setBucket()

ls.setBucket('BikiniBottom')      // => 'BikiniBottom'
ls.getBucket()                    // => 'BikiniBottom'
``

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

Clear all keys and values.

```js
ls.clear()
ls.keys()
// => []
```

<a name="LocalSync"></a>
## API
  
* [LocalSync](#LocalSync)
    * _instance_
        * [.setBucket(bucket)](#LocalSync+setBucket) ⇒ <code>String</code>
        * [.getBucket()](#LocalSync+getBucket) ⇒ <code>String</code>
        * [.allBuckets()](#LocalSync+allBuckets) ⇒ <code>Array.&lt;String&gt;</code>
        * [.get(key)](#LocalSync+get) ⇒ <code>\*</code>
        * [.set(key, value)](#LocalSync+set) ⇒ <code>\*</code>
        * [.put(key, value)](#LocalSync+put) ⇒ <code>\*</code>
        * [.remove(key)](#LocalSync+remove) ⇒ <code>\*</code>
        * [.clear()](#LocalSync+clear)
        * [.keys()](#LocalSync+keys) ⇒ <code>Array.&lt;String&gt;</code>
        * [.values()](#LocalSync+values) ⇒ <code>Array.&lt;\*&gt;</code>
        * [.getAll()](#LocalSync+getAll) ⇒ <code>Array.&lt;Object&gt;</code>
    * _static_
        * [.DEFAULT_BUCKET](#LocalSync.DEFAULT_BUCKET) : <code>string</code>
        * [.PREFIX](#LocalSync.PREFIX) : <code>string</code>
        * [.SEPARATOR](#LocalSync.SEPARATOR) : <code>string</code>

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
<a name="LocalSync.DEFAULT_BUCKET"></a>
### LocalSync.DEFAULT_BUCKET : <code>string</code>
The default bucket name for new instances.

**Kind**: static property of <code>[LocalSync](#LocalSync)</code>  
<a name="LocalSync.PREFIX"></a>
### LocalSync.PREFIX : <code>string</code>
The default key prefix new instances.

**Kind**: static property of <code>[LocalSync](#LocalSync)</code>  
<a name="LocalSync.SEPARATOR"></a>
### LocalSync.SEPARATOR : <code>string</code>
The default separator for new instances.

**Kind**: static property of <code>[LocalSync](#LocalSync)</code>  

***

&copy; 2015 TechnologyAdvice. API Docs by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
