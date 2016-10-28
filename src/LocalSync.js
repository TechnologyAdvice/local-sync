import memoryStorage from './memoryStorage'

// --------------------------------------------------------
// Utils
// --------------------------------------------------------

const escapeRegExp = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

const storage = (function getStorageAdapter() {
  // Default
  let adapter = localStorage

  // Feature detect and fallback to in-memory on fail. Ensures localStorage:
  //  - exists
  //  - can set/get/remove
  //  - read/write values match
  /* eslint-disable no-console */
  try {
    const set = '' + new Date
    adapter.setItem('uid', set)
    if (adapter.getItem('uid') !== set) {
      console.info('LocalSync: localStorage read/write is inconsistent, falling back to in-memory storage.')
      adapter = memoryStorage
    }
    adapter.removeItem('uid')
  } catch (err) {
    console.error(err)
    console.info('LocalSync: localStorage was not available, falling back to in-memory storage.')
    adapter = memoryStorage
  }
  /* eslint-enable no-console */

  // create storage
  return {
    get: (key) => adapter.getItem(key),
    set: (key, value) => adapter.setItem(key, value),
    remove: (key) => adapter.removeItem(key),
    key: (index) => adapter.key(index),
    length: () => adapter.length,
  }
}())

// --------------------------------------------------------
// Local Sync
// --------------------------------------------------------

class LocalSync {
  /**
   * Create a new Local Sync instance.  Each instance can have its own prefix, buckets, and separator.
   * @param {Object} [options={}] Instance options.
   * @param {String} [options.bucket=default] The bucket namespace to use.
   * @param {String} [options.prefix=ls] The key prefix namespace to use.
   * @param {String} [options.separator=.] Separates prefix, bucket, and keys.
   * @constructor
   */
  constructor(options = {}) {
    if (!(options instanceof Object)) throw new Error('LocalSync "options" must be an object.')

    this._bucket = this._validateBucket(options.bucket || 'default')
    this._prefix = this._validatePrefix(options.prefix || 'ls')
    this._separator = this._validateSeparator(options.separator || '.')
  }

  // --------------------------------------------------------
  // Private API
  // --------------------------------------------------------

  /**
   * Map over all `key`s in the current bucket.
   * @param {Function} callback Called with each `key` string.
   * @returns {Array} Array of callback return values.
   * @private
   */
  _mapKeys(callback) {
    const result = []
    // iterate in reverse for max speed and index preservation when removing items
    for (let i = storage.length() - 1; i >= 0; --i) {
      const fullKey = storage.key(i)
      if (fullKey.indexOf(this._fullBucket()) !== -1) {
        result.unshift(callback(this._parseKey(fullKey)))
      }
    }
    return result
  }

  /**
   * Map over all buckets in storage.
   * @param {Function} callback Called with each bucket string.
   * @returns {Array} Array of callback return values.
   * @private
   */
  _mapBuckets(callback) {
    const result = []
    // iterate in reverse for max speed and index preservation when removing items
    for (let i = storage.length() - 1; i >= 0; --i) {
      const fullKey = storage.key(i)
      if (fullKey.indexOf(this._prefix) !== -1) {
        result.unshift(callback(this._parseBucket(fullKey)))
      }
    }
    return result
  }

  /**
   * Get the full bucket name for the current bucket and `PREFIX`.
   * @returns {String} Full bucket name.
   * @private
   */
  _fullBucket() {
    return [this._prefix, this._bucket].join(this._separator)
  }

  /**
   * Get the full key name for the current bucket and `PREFIX`.
   * @param {String} key The short `key` name to prefix.
   * @returns {String} Full storage key name.
   * @private
   */
  _fullKey(key) {
    return [this._fullBucket(), key].join(this._separator)
  }

  /**
   * Get the short bucket name, without the `PREFIX` nor any `key`.
   * @param {String} fullKey The full key name including `PREFIX`, bucket, and `key`.
   * @returns {String} The short `key` string.
   * @private
   */
  _parseBucket(fullKey) {
    const prefix = escapeRegExp(this._prefix)
    const separator = escapeRegExp(this._separator)
    const re = new RegExp(`${prefix}${separator}(.*)${separator}`)
    const match = fullKey.match(re)
    return match && match[1] || undefined
  }

  /**
   * Get the short `key` name, without the current bucket nor `PREFIX`.
   * @param {String} fullKey The full key name including `PREFIX`, bucket, and `key`.
   * @returns {String} The short `key` string.
   * @private
   */
  _parseKey(fullKey) {
    const fullPrefix = this._fullKey('fakeKey').replace('fakeKey', '')
    const prefixRegExp = new RegExp(escapeRegExp(fullPrefix))
    return fullKey.replace(prefixRegExp, '')
  }

  /**
   * Throw if `prefix` is not valid.
   * @param {string} prefix The value to be validated.
   * @returns {string} The validated `prefix`.
   * @private
   */
  _validatePrefix(prefix) {
    if (typeof prefix !== 'string') throw new Error('LocalSync "prefix" must be a string.')
    if (prefix.indexOf(' ') !== -1) throw new Error('LocalSync "prefix" cannot contain spaces.')
    if (prefix.indexOf(this._separator) !== -1) {
      throw new Error(`LocalSync "prefix" cannot contain the separator "${this._separator}".`)
    }
    return prefix
  }

  /**
   * Throw if `separator` is not valid.
   * @param {string} separator The value to be validated.
   * @returns {string} The validated `separator`.
   * @private
   */
  _validateSeparator(separator) {
    if (typeof separator !== 'string') throw new Error('LocalSync "separator" must be a string.')
    if (separator.length !== 1) throw new Error('LocalSync "separator" must be a single character.')
    return separator
  }

  /**
   * Throw if `bucket` is not valid.
   * @param {string} bucket The value to be validated.
   * @returns {string} The validated `bucket`.
   * @private
   */
  _validateBucket(bucket) {
    if (typeof bucket !== 'string') throw new Error('LocalSync "bucket" must be a string.')
    if (bucket.indexOf(' ') !== -1) throw new Error('LocalSync "bucket" cannot contain spaces.')
    if (bucket.indexOf(this._separator) !== -1) {
      throw new Error(`LocalSync "bucket" cannot contain the separator "${this._separator}".`)
    }
    return bucket
  }

  /**
   * Throw if `key` is not valid.
   * @param {string} key The value to be validated.
   * @returns {string} The validated `key`.
   * @private
   */
  _validateKey(key) {
    if (typeof key !== 'string') throw new Error('LocalSync "key" parameter must be a string.')
    if (key.indexOf(this._separator) !== -1) {
      throw new Error(`LocalSync "key" cannot contain the separator "${this._separator}".`)
    }
    return key
  }

  /**
   * Throw if `value` is not valid.
   * @param {*} value The value to be validated.
   * @returns {string} The validated `value`.
   * @private
   */
  _validateValue(value) {
    const validTypes = [null, undefined, true, 0, '', [], {}]
    const signature = arg => Object.prototype.toString.call(arg)

    if (!validTypes.some(valid => signature(value) === signature(valid))) {
      throw new Error(`LocalSync cannot store "value" of type ${signature(value)}`)
    }
    return value
  }

  // --------------------------------------------------------
  // Public API
  // --------------------------------------------------------

  //
  // Buckets
  //

  /**
   * Set the current `bucket`. Methods will only operate on keys in this namespace.
   * @param {String} bucket The bucket name.
   * @returns {String} The bucket name just set.
   */
  setBucket(bucket) {
    this._bucket = this._validateBucket(bucket)
    return this._bucket
  }

  /**
   * Get the current `bucket`.
   * @returns {String} The current bucket name.
   */
  getBucket() {
    return this._bucket
  }

  /**
   * Get all buckets currently in storage.
   * @returns {String[]} An array of bucket strings.
   */
  allBuckets() {
    return this._mapBuckets(bucket => bucket)
  }

  //
  // Getters & Setters
  //

  /**
   * Get a value from the current bucket.
   * @param {String} key The name of the key you want to retrieve the value of.
   * @returns {*} The stored value at the specified `key`.
   */
  get(key) {
    this._validateKey(key)
    const value = storage.get(this._fullKey(key))
    try {
      return value === 'undefined' ? undefined : JSON.parse(value)
    } catch (e) {
      console.error('Could not JSON.parse() value:', value) // eslint-disable-line no-console
      throw e
    }
  }

  /**
   * Set a value in the current bucket.
   * @param {String} key The name of the key you want to create/overwrite.
   * @param {*} value The value for this key.
   * @returns {*} The value that was just set.
   */
  set(key, value) {
    this._validateKey(key)
    this._validateValue(value)
    storage.set(this._fullKey(key), JSON.stringify(value))
    return this.get(key)
  }

  /**
   * Update a value in the current bucket.
   * @param {String} key The key under which the value to be updated is stored.
   * @param {*} value Value to assign to the stored object.
   * @returns {*} The updated value.
   */
  put(key, value) {
    this._validateKey(key)
    this._validateValue(value)
    return this.set(key, { ...this.get(key), ...value })
  }

  //
  // Deleting
  //

  /**
   * Remove a value from the current bucket.
   * @param {String} key The key under which the value to be deleted is stored.
   * @returns {*} The object just removed.
   */
  remove(key) {
    this._validateKey(key)
    const item = this.get(key)
    storage.remove(this._fullKey(key))
    return item
  }

  /**
   * Clears all values from the current bucket.
   */
  clear() {
    this.getAll().forEach(item => {
      this.remove(Object.keys(item)[0])
    })
  }

  //
  // Listing
  //

  /**
   * Get all `key`s in the current bucket.
   * @returns {String[]} An array of `key` strings.
   */
  keys() {
    return this._mapKeys(key => key)
  }

  /**
   * Get all `value`s in the current bucket.
   * @returns {Array.<*>} An array of values.
   */
  values() {
    return this._mapKeys(key => this.get(key))
  }

  /**
   * Get all key/value pairs in the current bucket.
   * @returns {Object[]} An array of objects `{<key>: <value>}`.
   */
  getAll() {
    return this._mapKeys(key => ({ [key]: this.get(key) }))
  }
}

export default LocalSync
