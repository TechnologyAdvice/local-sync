(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["LocalSync"] = factory();
	else
		root["LocalSync"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// --------------------------------------------------------
	// Utils
	// --------------------------------------------------------

	var escapeRegExp = function escapeRegExp(str) {
	  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
	};

	// abstract dependency on storage, for future adapters
	var storageGet = function storageGet(key) {
	  return localStorage.getItem(key);
	};
	var storageSet = function storageSet(key, value) {
	  return localStorage.setItem(key, value);
	};
	var storageRemove = function storageRemove(key) {
	  return localStorage.removeItem(key);
	};
	var storageKey = function storageKey(index) {
	  return localStorage.key(index);
	};
	var storageLength = function storageLength() {
	  return localStorage.length;
	};

	// --------------------------------------------------------
	// Local Sync
	// --------------------------------------------------------

	var LocalSync = (function () {
	  /**
	   * Create a new Local Sync instance.  Each instance can have its own prefix, buckets, and separator.
	   * @param {Object} [options={}] The bucket namespace to use.
	   * @param {String} [options.bucket=LocalSync.BUCKET] The bucket namespace to use.
	   * @param {String} [options.prefix=LocalSync.PREFIX] The key prefix namespace to use.
	   * @param {String} [options.separator=LocalSync.SEPARATOR] Separates prefix, bucket, and keys.
	   * @constructor
	   */

	  function LocalSync() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, LocalSync);

	    if (!(options instanceof Object)) throw new Error('LocalSync "options" must be an object.');

	    var bucket = options.bucket || LocalSync.BUCKET;
	    var prefix = options.prefix || LocalSync.PREFIX;
	    var separator = options.separator || LocalSync.SEPARATOR;

	    this._validateBucket(bucket);
	    this._validatePrefix(prefix);
	    this._validateSeparator(separator);

	    this._bucket = bucket;
	    this._prefix = prefix;
	    this._separator = separator;
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

	  _createClass(LocalSync, [{
	    key: '_mapKeys',
	    value: function _mapKeys(callback) {
	      var result = [];
	      // iterate in reverse for max speed and index preservation when removing items
	      for (var i = storageLength() - 1; i >= 0; --i) {
	        var fullKey = storageKey(i);
	        if (fullKey.startsWith(this._fullBucket())) {
	          result.unshift(callback(this._parseKey(fullKey)));
	        }
	      }
	      return result;
	    }

	    /**
	     * Map over all buckets in storage.
	     * @param {Function} callback Called with each bucket string.
	     * @returns {Array} Array of callback return values.
	     * @private
	     */

	  }, {
	    key: '_mapBuckets',
	    value: function _mapBuckets(callback) {
	      var result = [];
	      // iterate in reverse for max speed and index preservation when removing items
	      for (var i = storageLength() - 1; i >= 0; --i) {
	        var fullKey = storageKey(i);
	        if (fullKey.startsWith(this._prefix)) {
	          result.unshift(callback(this._parseBucket(fullKey)));
	        }
	      }
	      return result;
	    }

	    /**
	     * Get the full bucket name for the current bucket and `PREFIX`.
	     * @returns {String} Full bucket name.
	     * @private
	     */

	  }, {
	    key: '_fullBucket',
	    value: function _fullBucket() {
	      return [this._prefix, this._bucket].join(this._separator);
	    }

	    /**
	     * Get the full key name for the current bucket and `PREFIX`.
	     * @param {String} key The short `key` name to prefix.
	     * @returns {String} Full storage key name.
	     * @private
	     */

	  }, {
	    key: '_fullKey',
	    value: function _fullKey(key) {
	      return [this._fullBucket(), key].join(this._separator);
	    }

	    /**
	     * Get the short bucket name, without the `PREFIX` nor any `key`.
	     * @param {String} fullKey The full key name including `PREFIX`, bucket, and `key`.
	     * @returns {String} The short `key` string.
	     * @private
	     */

	  }, {
	    key: '_parseBucket',
	    value: function _parseBucket(fullKey) {
	      var prefix = escapeRegExp(this._prefix);
	      var separator = escapeRegExp(this._separator);
	      var re = new RegExp('' + prefix + separator + '(.*)' + separator);
	      var match = fullKey.match(re);
	      return match && match[1] || undefined;
	    }

	    /**
	     * Get the short `key` name, without the current bucket nor `PREFIX`.
	     * @param {String} fullKey The full key name including `PREFIX`, bucket, and `key`.
	     * @returns {String} The short `key` string.
	     * @private
	     */

	  }, {
	    key: '_parseKey',
	    value: function _parseKey(fullKey) {
	      var fullPrefix = this._fullKey('fakeKey').replace('fakeKey', '');
	      var prefixRegExp = new RegExp(escapeRegExp(fullPrefix));
	      return fullKey.replace(prefixRegExp, '');
	    }

	    /**
	     * Throw if `prefix` is not valid.
	     * @param {string} prefix The value to be validated.
	     * @private
	     */

	  }, {
	    key: '_validatePrefix',
	    value: function _validatePrefix(prefix) {
	      if (typeof prefix !== 'string') throw new Error('LocalSync "prefix" must be a string.');
	      if (prefix.includes(' ')) throw new Error('LocalSync "prefix" cannot contain spaces.');
	      if (prefix.includes(this._separator)) {
	        throw new Error('LocalSync "prefix" cannot contain the separator "' + this._separator + '".');
	      }
	    }

	    /**
	     * Throw if `separator` is not valid.
	     * @param {string} separator The value to be validated.
	     * @private
	     */

	  }, {
	    key: '_validateSeparator',
	    value: function _validateSeparator(separator) {
	      if (typeof separator !== 'string') throw new Error('LocalSync "separator" must be a string.');
	      if (separator.length !== 1) throw new Error('LocalSync "separator" must be a single character.');
	    }

	    /**
	     * Throw if `bucket` is not valid.
	     * @param {string} bucket The value to be validated.
	     * @private
	     */

	  }, {
	    key: '_validateBucket',
	    value: function _validateBucket(bucket) {
	      if (typeof bucket !== 'string') throw new Error('LocalSync "bucket" must be a string.');
	      if (bucket.includes(' ')) throw new Error('LocalSync "bucket" cannot contain spaces.');
	      if (bucket.includes(this._separator)) {
	        throw new Error('LocalSync "bucket" cannot contain the separator "' + this._separator + '".');
	      }
	    }

	    /**
	     * Throw if `key` is not valid.
	     * @param {string} key The value to be validated.
	     * @private
	     */

	  }, {
	    key: '_validateKey',
	    value: function _validateKey(key) {
	      if (typeof key !== 'string') throw new Error('LocalSync "key" parameter must be a string.');
	      if (key.includes(this._separator)) {
	        throw new Error('LocalSync "key" cannot contain the separator "' + this._separator + '".');
	      }
	    }

	    /**
	     * Throw if `value` is not valid.
	     * @param {*} value The value to be validated.
	     * @private
	     */

	  }, {
	    key: '_validateValue',
	    value: function _validateValue(value) {
	      var validTypes = ['[object Array]', '[object Boolean]', '[object Null]', '[object Number]', '[object Object]', '[object String]', '[object Undefined]'];
	      var valueType = Object.prototype.toString.call(value);
	      if (!validTypes.some(function (type) {
	        return valueType === type;
	      })) {
	        throw new Error('LocalSync "value" of type ' + valueType + ' is not supported.');
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

	  }, {
	    key: 'setBucket',
	    value: function setBucket(bucket) {
	      this._validateBucket(bucket);
	      this._bucket = bucket;
	      return this._bucket;
	    }

	    /**
	     * Get the current `bucket`.
	     * @returns {String} The current bucket name.
	     */

	  }, {
	    key: 'getBucket',
	    value: function getBucket() {
	      return this._bucket;
	    }

	    /**
	     * Get all buckets currently in storage.
	     * @returns {String[]} An array of bucket strings.
	     */

	  }, {
	    key: 'allBuckets',
	    value: function allBuckets() {
	      return this._mapBuckets(function (bucket) {
	        return bucket;
	      });
	    }

	    //
	    // Getters & Setters
	    //

	    /**
	     * Get a value from the current bucket.
	     * @param {String} key The name of the key you want to retrieve the value of.
	     * @returns {*} The stored value at the specified `key`.
	     */

	  }, {
	    key: 'get',
	    value: function get(key) {
	      this._validateKey(key);
	      var value = storageGet(this._fullKey(key));
	      try {
	        return value === 'undefined' ? undefined : JSON.parse(value);
	      } catch (e) {
	        /* eslint-disable no-console */
	        console.error('Could not JSON.parse() value:', value);
	        /* eslint-enable no-console */
	        throw e;
	      }
	    }

	    /**
	     * Set a value in the current bucket.
	     * @param {String} key The name of the key you want to create/overwrite.
	     * @param {*} value The value for this key.
	     * @returns {*} The value that was just set.
	     */

	  }, {
	    key: 'set',
	    value: function set(key, value) {
	      this._validateKey(key);
	      this._validateValue(value);
	      storageSet(this._fullKey(key), JSON.stringify(value));
	      return this.get(key);
	    }

	    /**
	     * Update a value in the current bucket.
	     * @param {String} key The key under which the value to be updated is stored.
	     * @param {*} value Value to assign to the stored object.
	     * @returns {*} The updated value.
	     */

	  }, {
	    key: 'put',
	    value: function put(key, value) {
	      this._validateKey(key);
	      this._validateValue(value);
	      return this.set(key, Object.assign(this.get(key), value));
	    }

	    //
	    // Deleting
	    //

	    /**
	     * Remove a value from the current bucket.
	     * @param {String} key The key under which the value to be deleted is stored.
	     * @returns {*} The object just removed.
	     */

	  }, {
	    key: 'remove',
	    value: function remove(key) {
	      this._validateKey(key);
	      var item = this.get(key);
	      storageRemove(this._fullKey(key));
	      return item;
	    }

	    /**
	     * Clears all values from the current bucket.
	     */

	  }, {
	    key: 'clear',
	    value: function clear() {
	      var _this = this;

	      this.getAll().forEach(function (item) {
	        _this.remove(Object.keys(item)[0]);
	      });
	    }

	    //
	    // Listing
	    //

	    /**
	     * Get all `key`s in the current bucket.
	     * @returns {String[]} An array of `key` strings.
	     */

	  }, {
	    key: 'keys',
	    value: function keys() {
	      return this._mapKeys(function (key) {
	        return key;
	      });
	    }

	    /**
	     * Get all `value`s in the current bucket.
	     * @returns {Array.<*>} An array of values.
	     */

	  }, {
	    key: 'values',
	    value: function values() {
	      var _this2 = this;

	      return this._mapKeys(function (key) {
	        return _this2.get(key);
	      });
	    }

	    /**
	     * Get all key/value pairs in the current bucket.
	     * @returns {Object[]} An array of objects `{<key>: <value>}`.
	     */

	  }, {
	    key: 'getAll',
	    value: function getAll() {
	      var _this3 = this;

	      return this._mapKeys(function (key) {
	        return _defineProperty({}, key, _this3.get(key));
	      });
	    }
	  }]);

	  return LocalSync;
	})();

	// --------------------------------------------------------
	// Statics
	// --------------------------------------------------------

	/**
	 * The default bucket name for new instances.
	 * @type {string}
	 * @static
	 */

	LocalSync.BUCKET = 'default';

	/**
	 * The default key prefix new instances.
	 * @type {string}
	 * @static
	 */
	LocalSync.PREFIX = 'ls';

	/**
	 * The default separator for new instances.
	 * @type {string}
	 * @static
	 */
	LocalSync.SEPARATOR = '.';

	exports.default = LocalSync;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;