// --------------------------------------------------------
// Config
// --------------------------------------------------------

const DEFAULT_BUCKET = 'default'
const PREFIX = 'ls'
const SEPARATOR = '.'

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

// validators
const validateBucket = (bucket) => {
  if (typeof bucket !== 'string') throw new Error(`LocalSync "bucket" must be a string.`)
  if (bucket.includes(' ')) throw new Error(`LocalSync "bucket" cannot contain spaces.`)
}

const validateKey = (key) => {
  if (typeof key !== 'string') throw new Error(`LocalSync "key" parameter must be a string.`)
  if (key.includes(SEPARATOR)) throw new Error(`LocalSync "key" cannot contain ${SEPARATOR}.`)
}

const validateValue = (value) => {
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
    this._bucket = DEFAULT_BUCKET
  }

  /**
   * Map over all `key`s in the current `bucket`.
   * @param {Function} callback Called with each `key` string.
   * @returns {Array} Array of callback return values.
   * @private
   */
  _mapKeys(callback) {
    const result = []
    // iterate in reverse for max speed and index preservation when removing items
    for (let i = storageLength() - 1; i >= 0; --i) {
      const fullKey = storageKey(i)
      if (fullKey.startsWith(this._prefixedBucket())) {
        result.unshift(callback(this._shortKey(fullKey)))
      }
    }

    return result
  }

  /**
   * Get the full `bucket` name for the current `bucket` and PREFIX.
   * @returns {String} Prefixed bucket name.
   * @private
   */
  _prefixedBucket() {
    return [PREFIX, this._bucket].join(SEPARATOR)
  }

  /**
   * Get the full key name for the current `bucket` and PREFIX.
   * @param {String} key The short `key` name to prefix.
   * @returns {String} Full storage key name.
   * @private
   */
  _prefixedKey(key) {
    return [this._prefixedBucket(), key].join(SEPARATOR)
  }

  /**
   * Get the short `key` name, without the current `bucket` nor PREFIX.
   * @param {String} prefixedKey The full key name including prefix and `bucket`.
   * @returns {String} The short `key` string.
   * @private
   */
  _shortKey(prefixedKey) {
    const separatorRegExp = new RegExp(escapeRegExp(SEPARATOR))
    const bucketRegExp = new RegExp(escapeRegExp(this._prefixedBucket()), 'g')
    return prefixedKey
      .replace(bucketRegExp, '')
      .replace(separatorRegExp, '')
  }

  /**
   * Set the current `bucket`. Methods will only operate on keys in this namespace.
   * @param {String} name The bucket name.
   */
  setBucket(name) {
    validateBucket(name)
    this._bucket = name
  }

  /**
   * Get a value from the current `bucket`.
   * @param {String} key The name of the key you want to retrieve the value of.
   * @returns {*} The stored value at the specified `key`.
   */
  get(key) {
    validateKey(key)
    const value = storageGet(this._prefixedKey(key))
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
   * Set a value in the current `bucket`.
   * @param {String} key The name of the key you want to create/overwrite.
   * @param {*} value The value for this key.
   * @returns {*} The value that was just set.
   */
  set(key, value) {
    validateKey(key)
    validateValue(value)
    storageSet(this._prefixedKey(key), JSON.stringify(value))
    return this.get(key)
  }

  /**
   * Update a value in the current `bucket`.
   * @param {String} key The key under which the value to be updated is stored.
   * @param {*} value Value to assign to the stored object.
   * @returns {*} The updated value.
   */
  put(key, value) {
    validateKey(key)
    validateValue(value)
    return this.set(key, Object.assign(this.get(key), value))
  }

  /**
   * Remove a value from the current `bucket`.
   * @param {String} key The key under which the value to be deleted is stored.
   * @returns {*} The object just removed.
   */
  remove(key) {
    validateKey(key)
    const item = this.get(key)
    storageRemove(this._prefixedKey(key))
    return item
  }

  /**
   * Get all key/value pairs in the current `bucket`.
   * @returns {Object[]} An array of objects `{<key>: <value>}`.
   */
  all() {
    return this._mapKeys(key => ({[key]: this.get(key)}))
  }

  /**
   * Get all `key`s in the current `bucket`.
   * @returns {String[]} An array of `key` strings.
   */
  keys() {
    return this._mapKeys(key => key)
  }

  /**
   * Get all `value`s in the current `bucket`.
   * @returns {Array.<*>} An array of values.
   */
  values() {
    return this._mapKeys(key => this.get(key))
  }

  /**
   * Clears all values from the current `bucket`.
   */
  clear() {
    this.all().forEach(item => {
      this.remove(Object.keys(item)[0])
    })
  }
}

export default LocalSync
