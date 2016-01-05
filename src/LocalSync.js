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
   * Create a new Local Sync instance.  Each instance can have its own prefix, buckets, and separator.
   * @param {Object} [options={}] The bucket namespace to use.
   * @param {String} [options.bucket=LocalSync.BUCKET] The bucket namespace to use.
   * @param {String} [options.prefix=LocalSync.PREFIX] The key prefix namespace to use.
   * @param {String} [options.separator=LocalSync.SEPARATOR] Separates prefix, bucket, and keys.
   * @constructor
   */
  constructor(options = {}) {
    if (!(options instanceof Object)) throw new Error('LocalSync "options" must be an object.')

    const bucket = options.bucket || LocalSync.BUCKET
    const prefix = options.prefix || LocalSync.PREFIX
    const separator = options.separator || LocalSync.SEPARATOR

    this._validateBucket(bucket)
    this._validatePrefix(prefix)
    this._validateSeparator(separator)

    this._bucket = bucket
    this._prefix = prefix
    this._separator = separator
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
      if (fullKey.startsWith(this._prefix)) {
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
   * @private
   */
  _validatePrefix(prefix) {
    if (typeof prefix !== 'string') throw new Error(`LocalSync "prefix" must be a string.`)
    if (prefix.includes(' ')) throw new Error(`LocalSync "prefix" cannot contain spaces.`)
    if (prefix.includes(this._separator)) {
      throw new Error(`LocalSync "prefix" cannot contain the separator "${this._separator}".`)
    }
  }

  /**
   * Throw if `separator` is not valid.
   * @param {string} separator The value to be validated.
   * @private
   */
  _validateSeparator(separator) {
    if (typeof separator !== 'string') throw new Error(`LocalSync "separator" must be a string.`)
    if (separator.length !== 1) throw new Error(`LocalSync "separator" must be a single character.`)
  }

  /**
   * Throw if `bucket` is not valid.
   * @param {string} bucket The value to be validated.
   * @private
   */
  _validateBucket(bucket) {
    if (typeof bucket !== 'string') throw new Error(`LocalSync "bucket" must be a string.`)
    if (bucket.includes(' ')) throw new Error(`LocalSync "bucket" cannot contain spaces.`)
    if (bucket.includes(this._separator)) {
      throw new Error(`LocalSync "bucket" cannot contain the separator "${this._separator}".`)
    }
  }

  /**
   * Throw if `key` is not valid.
   * @param {string} key The value to be validated.
   * @private
   */
  _validateKey(key) {
    if (typeof key !== 'string') throw new Error(`LocalSync "key" parameter must be a string.`)
    if (key.includes(this._separator)) {
      throw new Error(`LocalSync "key" cannot contain the separator "${this._separator}".`)
    }
  }

  /**
   * Throw if `value` is not valid.
   * @param {*} value The value to be validated.
   * @private
   */
  _validateValue(value) {
    const validTypes = [null, undefined, true, 0, '', [], {}]
    const signature = () => Object.prototype.toString.call(...arguments)

    if (!validTypes.some(valid => signature(value) === signature(valid))) {
      throw new Error(`LocalSync cannot store "value" of type ${signature(value)}`)
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
LocalSync.BUCKET = 'default'

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
