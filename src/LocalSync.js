// --------------------------------------------------------
// Utils
// --------------------------------------------------------

const escapeRegExp = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

// abstract dependency on storage, for future adapters
const storageGet = (key) => localStorage.getItem(key)
const storageSet = (key, value) => localStorage.setItem(key, value)
const storageRemove = (key) => localStorage.removeItem(key)
const storageKey = (index) => localStorage.key(index)
const storageLength = () => localStorage.length

// --------------------------------------------------------
// Local Sync
// --------------------------------------------------------

class LocalSync {
  /**
   * @class
   */
  constructor() {
    /**
     * The current working namespace in storage. Methods will only operate on `key`s in this namespace.
     * @type {String}
     * @private
     */
    this._bucket = LocalSync.DEFAULT_BUCKET
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
    for (let i = storageLength() - 1; i >= 0; --i) {
      const fullKey = storageKey(i)
      if (fullKey.startsWith(this._fullBucket())) {
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
    for (let i = storageLength() - 1; i >= 0; --i) {
      const fullKey = storageKey(i)
      if (fullKey.startsWith(LocalSync.PREFIX)) {
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
    return [LocalSync.PREFIX, this._bucket].join(LocalSync.SEPARATOR)
  }

  /**
   * Get the full key name for the current bucket and `PREFIX`.
   * @param {String} key The short `key` name to prefix.
   * @returns {String} Full storage key name.
   * @private
   */
  _fullKey(key) {
    return [this._fullBucket(), key].join(LocalSync.SEPARATOR)
  }

  /**
   * Get the short bucket name, without the `PREFIX` nor any `key`.
   * @param {String} fullKey The full key name including `PREFIX`, bucket, and `key`.
   * @returns {String} The short `key` string.
   * @private
   */
  _parseBucket(fullKey) {
    const prefix = escapeRegExp(LocalSync.PREFIX)
    const separator = escapeRegExp(LocalSync.SEPARATOR)
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
   * Throw if `bucket` is not valid.
   * @param {string} bucket The value to be validated.
   * @private
   */
  _validateBucket(bucket) {
    if (typeof bucket !== 'string') throw new Error(`LocalSync "bucket" must be a string.`)
    if (bucket.includes(' ')) throw new Error(`LocalSync "bucket" cannot contain spaces.`)
    if (bucket.includes(LocalSync.SEPARATOR)) {
      throw new Error(`LocalSync "bucket" cannot contain the separator "${LocalSync.SEPARATOR}".`)
    }
  }

  /**
   * Throw if `key` is not valid.
   * @param {string} key The value to be validated.
   * @private
   */
  _validateKey(key) {
    if (typeof key !== 'string') throw new Error(`LocalSync "key" parameter must be a string.`)
    if (key.includes(LocalSync.SEPARATOR)) {
      throw new Error(`LocalSync "key" cannot contain the separator "${LocalSync.SEPARATOR}".`)
    }
  }

  /**
   * Throw if `value` is not valid.
   * @param {*} value The value to be validated.
   * @private
   */
  _validateValue(value) {
    const validTypes = [
      '[object Array]',
      '[object Null]',
      '[object Number]',
      '[object Object]',
      '[object String]',
      '[object Undefined]',
    ]
    const valueType = Object.prototype.toString.call(value)
    if (!validTypes.some(type => valueType === type)) {
      throw new Error(`LocalSync "value" of type ${valueType} is not supported.`)
    }
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
    this._validateBucket(bucket)
    this._bucket = bucket
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
    const value = storageGet(this._fullKey(key))
    try {
      return value === 'undefined' ? undefined : JSON.parse(value)
    } catch (e) {
      /* eslint-disable no-console */
      console.error('Could not JSON.parse() value:', value)
      /* eslint-enable no-console */
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
    storageSet(this._fullKey(key), JSON.stringify(value))
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
    return this.set(key, Object.assign(this.get(key), value))
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
    storageRemove(this._fullKey(key))
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
    return this._mapKeys(key => ({[key]: this.get(key)}))
  }
}

// --------------------------------------------------------
// Statics
// --------------------------------------------------------

/**
 * The default bucket name for new instances.
 * @type {string}
 * @static
 */
LocalSync.DEFAULT_BUCKET = 'default'

/**
 * The default key prefix new instances.
 * @type {string}
 * @static
 */
LocalSync.PREFIX = 'ls'

/**
 * The default separator for new instances.
 * @type {string}
 * @static
 */
LocalSync.SEPARATOR = '.'

export default LocalSync
