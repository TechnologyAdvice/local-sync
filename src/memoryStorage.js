let cache = {}
let length = 0

const memoryStorage = {
  /**
   * When passed a key name, will return that key's value.
   * @param {String} key Name of the key you want to retrieve the value of.
   * @returns {String|null}
   */
  getItem(key) {
    return cache[key] || null
  },

  /**
   * When passed a key name and value, will add that key to the storage,
   * or update that key's value if it already exists.
   * @param {String} key Name of the key you want to create/update.
   * @param {String} value Value you want to give the key you are creating/updating.
   * @returns {undefined}
   */
  setItem(key, value) {
    if (typeof value === 'undefined') {
      this.removeItem(key)
    } else {
      cache[key] = value.toString()
      length++
    }
  },

  /**
   * When passed a key name, will remove that key from the storage.
   * @param {String} key Name of the key you want to remove.
   * @returns {undefined}
   */
  removeItem(key) {
    if (!cache[key]) return

    delete cache[key]
    length--
  },

  /**
   * When passed a number n, returns the name of the nth key in the storage.
   * The order of keys is user-agent defined, so you should not rely on it.
   * @param {Number} index A zero-based integer index representing the number of the key you want to get the name of.
   * @returns {String|null}
   */
  key(index) {
    return Object.keys(cache)[index] || null
  },

  /**
   * When invoked, will empty all keys out of the storage.
   * @returns {undefined}
   */
  clear() {
    cache = {}
    length = 0
  },

  /**
   * The length read-only property returns an integer representing the number of data items stored.
   * @readonly
   * @returns {Number}
   */
  get length() {
    return length
  },
}

export default memoryStorage
