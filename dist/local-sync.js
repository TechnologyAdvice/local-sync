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
	   * @param {Object} [options={}] Instance options.
	   * @param {String} [options.bucket=default] The bucket namespace to use.
	   * @param {String} [options.prefix=ls] The key prefix namespace to use.
	   * @param {String} [options.separator=.] Separates prefix, bucket, and keys.
	   * @constructor
	   */

	  function LocalSync() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, LocalSync);

	    if (!(options instanceof Object)) throw new Error('LocalSync "options" must be an object.');

	    this._bucket = this._validateBucket(options.bucket || 'default');
	    this._prefix = this._validatePrefix(options.prefix || 'ls');
	    this._separator = this._validateSeparator(options.separator || '.');
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
	     * @returns {string} The validated `prefix`.
	     * @private
	     */

	  }, {
	    key: '_validatePrefix',
	    value: function _validatePrefix(prefix) {
	      if (typeof prefix !== 'string') throw new Error('LocalSync "prefix" must be a string.');
	      if (prefix.indexOf(' ') !== -1) throw new Error('LocalSync "prefix" cannot contain spaces.');
	      if (prefix.indexOf(this._separator) !== -1) {
	        throw new Error('LocalSync "prefix" cannot contain the separator "' + this._separator + '".');
	      }
	      return prefix;
	    }

	    /**
	     * Throw if `separator` is not valid.
	     * @param {string} separator The value to be validated.
	     * @returns {string} The validated `separator`.
	     * @private
	     */

	  }, {
	    key: '_validateSeparator',
	    value: function _validateSeparator(separator) {
	      if (typeof separator !== 'string') throw new Error('LocalSync "separator" must be a string.');
	      if (separator.length !== 1) throw new Error('LocalSync "separator" must be a single character.');
	      return separator;
	    }

	    /**
	     * Throw if `bucket` is not valid.
	     * @param {string} bucket The value to be validated.
	     * @returns {string} The validated `bucket`.
	     * @private
	     */

	  }, {
	    key: '_validateBucket',
	    value: function _validateBucket(bucket) {
	      if (typeof bucket !== 'string') throw new Error('LocalSync "bucket" must be a string.');
	      if (bucket.indexOf(' ') !== -1) throw new Error('LocalSync "bucket" cannot contain spaces.');
	      if (bucket.indexOf(this._separator) !== -1) {
	        throw new Error('LocalSync "bucket" cannot contain the separator "' + this._separator + '".');
	      }
	      return bucket;
	    }

	    /**
	     * Throw if `key` is not valid.
	     * @param {string} key The value to be validated.
	     * @returns {string} The validated `key`.
	     * @private
	     */

	  }, {
	    key: '_validateKey',
	    value: function _validateKey(key) {
	      if (typeof key !== 'string') throw new Error('LocalSync "key" parameter must be a string.');
	      if (key.indexOf(this._separator) !== -1) {
	        throw new Error('LocalSync "key" cannot contain the separator "' + this._separator + '".');
	      }
	      return key;
	    }

	    /**
	     * Throw if `value` is not valid.
	     * @param {*} value The value to be validated.
	     * @returns {string} The validated `value`.
	     * @private
	     */

	  }, {
	    key: '_validateValue',
	    value: function _validateValue(value) {
	      var _arguments = arguments;

	      var validTypes = [null, undefined, true, 0, '', [], {}];
	      var signature = function signature() {
	        var _Object$prototype$toS;

	        return (_Object$prototype$toS = Object.prototype.toString).call.apply(_Object$prototype$toS, _arguments);
	      };

	      if (!validTypes.some(function (valid) {
	        return signature(value) === signature(valid);
	      })) {
	        throw new Error('LocalSync cannot store "value" of type ' + signature(value));
	      }
	      return value;
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
	      this._bucket = this._validateBucket(bucket);
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

	exports.default = LocalSync;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;