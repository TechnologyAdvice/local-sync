## LocalSync API

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [new LocalSync([options])](#new-localsyncoptions)
- [localSync.setBucket(bucket) ⇒ <code>String</code>](#localsyncsetbucketbucket-%E2%87%92-codestringcode)
- [localSync.getBucket() ⇒ <code>String</code>](#localsyncgetbucket-%E2%87%92-codestringcode)
- [localSync.allBuckets() ⇒ <code>Array.&lt;String&gt;</code>](#localsyncallbuckets-%E2%87%92-codearrayltstringgtcode)
- [localSync.get(key) ⇒ <code>\*</code>](#localsyncgetkey-%E2%87%92-code%5Ccode)
- [localSync.set(key, value) ⇒ <code>\*</code>](#localsyncsetkey-value-%E2%87%92-code%5Ccode)
- [localSync.put(key, value) ⇒ <code>\*</code>](#localsyncputkey-value-%E2%87%92-code%5Ccode)
- [localSync.remove(key) ⇒ <code>\*</code>](#localsyncremovekey-%E2%87%92-code%5Ccode)
- [localSync.clear()](#localsyncclear)
- [localSync.keys() ⇒ <code>Array.&lt;String&gt;</code>](#localsynckeys-%E2%87%92-codearrayltstringgtcode)
- [localSync.values() ⇒ <code>Array.&lt;\*&gt;</code>](#localsyncvalues-%E2%87%92-codearraylt%5Cgtcode)
- [localSync.getAll() ⇒ <code>Array.&lt;Object&gt;</code>](#localsyncgetall-%E2%87%92-codearrayltobjectgtcode)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>String</code> - The bucket name just set.  

| Param | Type | Description |
| --- | --- | --- |
| bucket | <code>String</code> | The bucket name. |

<a name="LocalSync+getBucket"></a>

### localSync.getBucket() ⇒ <code>String</code>
Get the current `bucket`.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>String</code> - The current bucket name.  
<a name="LocalSync+allBuckets"></a>

### localSync.allBuckets() ⇒ <code>Array.&lt;String&gt;</code>
Get all buckets currently in storage.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>Array.&lt;String&gt;</code> - An array of bucket strings.  
<a name="LocalSync+get"></a>

### localSync.get(key) ⇒ <code>\*</code>
Get a value from the current bucket.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>\*</code> - The stored value at the specified `key`.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the key you want to retrieve the value of. |

<a name="LocalSync+set"></a>

### localSync.set(key, value) ⇒ <code>\*</code>
Set a value in the current bucket.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>\*</code> - The value that was just set.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the key you want to create/overwrite. |
| value | <code>\*</code> | The value for this key. |

<a name="LocalSync+put"></a>

### localSync.put(key, value) ⇒ <code>\*</code>
Update a value in the current bucket.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>\*</code> - The updated value.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key under which the value to be updated is stored. |
| value | <code>\*</code> | Value to assign to the stored object. |

<a name="LocalSync+remove"></a>

### localSync.remove(key) ⇒ <code>\*</code>
Remove a value from the current bucket.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>\*</code> - The object just removed.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key under which the value to be deleted is stored. |

<a name="LocalSync+clear"></a>

### localSync.clear()
Clears all values from the current bucket.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
<a name="LocalSync+keys"></a>

### localSync.keys() ⇒ <code>Array.&lt;String&gt;</code>
Get all `key`s in the current bucket.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>Array.&lt;String&gt;</code> - An array of `key` strings.  
<a name="LocalSync+values"></a>

### localSync.values() ⇒ <code>Array.&lt;\*&gt;</code>
Get all `value`s in the current bucket.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>Array.&lt;\*&gt;</code> - An array of values.  
<a name="LocalSync+getAll"></a>

### localSync.getAll() ⇒ <code>Array.&lt;Object&gt;</code>
Get all key/value pairs in the current bucket.

**Kind**: instance method of [<code>LocalSync</code>](#LocalSync)  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of objects `{<key>: <value>}`.  
