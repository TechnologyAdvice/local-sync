Local Sync
==========

A friendly, tiny, synchronous, namespaced, and _dependency free_ local storage solution.

```
npm i @technologyadvice/local-sync -S
```

## Usage

[Bucket](#bucket)
[Set / Get](#set-/-get)
[Put](#put)
[Keys / Values / All](#keys-/-values-/-all)
[Remove / Clear](#remove-/-clear)

### Bucket

Methods operate only in the current bucket namespace.

```js
const ls = new LocalSync()
// => bucket is 'default'

const ls = new LocalSync('BikiniBottom')
// => bucket is 'BikiniBottom'
```

### Set / Get

Set / get any JSON serializable data type.

```js
ls.set('bob', {name: 'SpongeBob'})
// => {name: 'SpongeBob'}
ls.get('bob')
// => {name: 'SpongeBob'}

ls.set('quotes', ['Squidward!'])
// => ['Squidward!]
ls.get('quotes')
// => ['Squidward!]
```

### Put

Patch stored objects and arrays.

```js
ls.put('bob', {address: '124 Conch Street'})
// => {name: 'SpongeBob', address: '124 Conch Street'}

ls.put('quotes', ['Why so crabby, Patty?'])
// => ['Squidward!', 'Why so crabby, Patty?']
```

### Keys / Values / All

List stored keys, values, or key/value pairs as objects.

```js
ls.keys()
// => ['bob', 'quotes']

ls.values()
// [
//   {address: '124 Conch Street', name: 'SpongeBob'},
//   ['Squidward!', 'Why so crabby, Patty?']
// ]

ls.all()
// [
//   {address: '124 Conch Street', name: 'SpongeBob'},
//   {quotes: ['Squidward!', 'Why so crabby, Patty?']}
// ]
```

### Remove / Clear

Remove a single value by key or clear all values.

```js
ls.remove('bob')
ls.all()
// => [{quotes: ['Squidward!']}]

ls.clear()
ls.all()
// => []
```

<a name="LocalSync"></a>
## API
  
* [LocalSync](#LocalSync)
    * [.setBucket(name)](#LocalSync+setBucket)
    * [.get(key)](#LocalSync+get) ⇒ <code>\*</code>
    * [.set(key, value)](#LocalSync+set) ⇒ <code>\*</code>
    * [.put(key, value)](#LocalSync+put) ⇒ <code>\*</code>
    * [.remove(key)](#LocalSync+remove) ⇒ <code>\*</code>
    * [.all()](#LocalSync+all) ⇒ <code>Array.&lt;object&gt;</code>
    * [.keys()](#LocalSync+keys) ⇒ <code>Array.&lt;string&gt;</code>
    * [.values()](#LocalSync+values) ⇒ <code>array.&lt;\*&gt;</code>
    * [.clear()](#LocalSync+clear)

<a name="LocalSync+setBucket"></a>
### localSync.setBucket(name)
Set the current `bucket`. Methods will only operate on keys in this namespace.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The bucket name. |

<a name="LocalSync+get"></a>
### localSync.get(key) ⇒ <code>\*</code>
Get a value from the current `bucket`.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>\*</code> - The stored value at the specified `key`.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the key you want to retrieve the value of. |

<a name="LocalSync+set"></a>
### localSync.set(key, value) ⇒ <code>\*</code>
Set a value in the current `bucket`.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>\*</code> - The value that was just set.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the key you want to create/overwrite. |
| value | <code>\*</code> | The value for this key. |

<a name="LocalSync+put"></a>
### localSync.put(key, value) ⇒ <code>\*</code>
Update a value in the current `bucket`.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>\*</code> - The updated value.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key under which the value to be updated is stored. |
| value | <code>\*</code> | Value to assign to the stored object. |

<a name="LocalSync+remove"></a>
### localSync.remove(key) ⇒ <code>\*</code>
Remove a value from the current `bucket`.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>\*</code> - The object just removed.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key under which the value to be deleted is stored. |

<a name="LocalSync+all"></a>
### localSync.all() ⇒ <code>Array.&lt;object&gt;</code>
Get all key/value pairs in the current `bucket`.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>Array.&lt;object&gt;</code> - An array of objects `{<key>: <value>}`.  
<a name="LocalSync+keys"></a>
### localSync.keys() ⇒ <code>Array.&lt;string&gt;</code>
Get all `key`s in the current `bucket`.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of `key` strings.  
<a name="LocalSync+values"></a>
### localSync.values() ⇒ <code>array.&lt;\*&gt;</code>
Get all `value`s in the current `bucket`.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  
**Returns**: <code>array.&lt;\*&gt;</code> - An array of values.  
<a name="LocalSync+clear"></a>
### localSync.clear()
Clears all values from the current `bucket`.

**Kind**: instance method of <code>[LocalSync](#LocalSync)</code>  

***

&copy; 2015 TechnologyAdvice. API Docs by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
