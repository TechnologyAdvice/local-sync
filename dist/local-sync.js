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
	// Config
	// --------------------------------------------------------

	var DEFAULT_BUCKET = 'default';
	var PREFIX = 'ls';
	var SEPARATOR = '.';

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

	// validators
	var validateBucket = function validateBucket(bucket) {
	  if (typeof bucket !== 'string') throw new Error('LocalSync "bucket" must be a string.');
	  if (bucket.includes(' ')) throw new Error('LocalSync "bucket" cannot contain spaces.');
	};

	var validateKey = function validateKey(key) {
	  if (typeof key !== 'string') throw new Error('LocalSync "key" parameter must be a string.');
	  if (key.includes(SEPARATOR)) throw new Error('LocalSync "key" cannot contain ' + SEPARATOR + '.');
	};

	var validateValue = function validateValue(value) {
	  var validTypes = ['[object Array]', '[object Null]', '[object Number]', '[object Object]', '[object String]', '[object Undefined]'];
	  var valueType = Object.prototype.toString.call(value);
	  if (!validTypes.some(function (type) {
	    return valueType === type;
	  })) {
	    throw new Error('LocalSync "value" of type ' + valueType + ' is not supported.');
	  }
	};

	// --------------------------------------------------------
	// Local Sync
	// --------------------------------------------------------

	var LocalSync = (function () {
	  /**
	   * @class
	   */

	  function LocalSync() {
	    _classCallCheck(this, LocalSync);

	    /**
	     * The current working namespace in storage. Methods will only operate on `key`s in this namespace.
	     * @type {string}
	     * @private
	     */
	    this._bucket = DEFAULT_BUCKET;
	  }

	  /**
	   * Iterate over all `key`s in the current `bucket`.
	   * @param {function} callback Called with the `key` string.
	   * @private
	   */

	  _createClass(LocalSync, [{
	    key: '_mapKeys',
	    value: function _mapKeys(callback) {
	      var result = [];
	      // iterate in reverse for max speed and index preservation when removing items
	      for (var i = storageLength() - 1; i >= 0; --i) {
	        var fullKey = storageKey(i);
	        if (fullKey.startsWith(this._prefixedBucket())) {
	          result.unshift(callback(this._shortKey(fullKey)));
	        }
	      }

	      return result;
	    }

	    /**
	     * Get the full `bucket` name for the current `bucket` and PREFIX.
	     * @returns {string}
	     * @private
	     */

	  }, {
	    key: '_prefixedBucket',
	    value: function _prefixedBucket() {
	      return [PREFIX, this._bucket].join(SEPARATOR);
	    }

	    /**
	     * Get the full key name for the current `bucket` and PREFIX.
	     * @returns {string}
	     * @private
	     */

	  }, {
	    key: '_prefixedKey',
	    value: function _prefixedKey(key) {
	      return [this._prefixedBucket(), key].join(SEPARATOR);
	    }

	    /**
	     * Get the short `key` name, without the current `bucket` nor PREFIX.
	     * @returns {string} fullKey The full key name including prefix and `bucket`
	     * @private
	     */

	  }, {
	    key: '_shortKey',
	    value: function _shortKey(fullKey) {
	      var separatorRegExp = new RegExp(escapeRegExp(SEPARATOR));
	      var bucketRegExp = new RegExp(escapeRegExp(this._prefixedBucket()), 'g');
	      return fullKey.replace(bucketRegExp, '').replace(separatorRegExp, '');
	    }

	    /**
	     * Set the current `bucket`. Methods will only operate on keys in this namespace.
	     * @param {string} name The bucket name.
	     */

	  }, {
	    key: 'setBucket',
	    value: function setBucket(name) {
	      validateBucket(name);
	      this._bucket = name;
	    }

	    /**
	     * Get a value from the current `bucket`.
	     * @param {string} key The name of the key you want to retrieve the value of.
	     * @returns {*} The stored value at the specified `key`.
	     */

	  }, {
	    key: 'get',
	    value: function get(key) {
	      validateKey(key);
	      var value = storageGet(this._prefixedKey(key));
	      try {
	        return value === "undefined" ? undefined : JSON.parse(value);
	      } catch (e) {
	        console.error('Could not JSON.parse() value:', value);
	        throw e;
	      }
	    }

	    /**
	     * Set a value in the current `bucket`.
	     * @param {string} key The name of the key you want to create/overwrite.
	     * @param {*} value The value for this key.
	     * @returns {*} The value that was just set.
	     */

	  }, {
	    key: 'set',
	    value: function set(key, value) {
	      validateKey(key);
	      validateValue(value);
	      storageSet(this._prefixedKey(key), JSON.stringify(value));
	      return this.get(key);
	    }

	    /**
	     * Update a value in the current `bucket`.
	     * @param {string} key The key under which the value to be updated is stored.
	     * @param {*} value Value to assign to the stored object.
	     * @returns {*} The updated value.
	     */

	  }, {
	    key: 'put',
	    value: function put(key, value) {
	      validateKey(key);
	      validateValue(value);
	      return this.set(key, Object.assign(this.get(key), value));
	    }

	    /**
	     * Remove a value from the current `bucket`.
	     * @param {string} key The key under which the value to be deleted is stored.
	     * @returns {*} The object just removed.
	     */

	  }, {
	    key: 'remove',
	    value: function remove(key) {
	      validateKey(key);
	      var item = this.get(key);
	      storageRemove(this._prefixedKey(key));
	      return item;
	    }

	    /**
	     * Get all key/value pairs in the current `bucket`.
	     * @returns {object[]} An array of objects `{<key>: <value>}`.
	     */

	  }, {
	    key: 'all',
	    value: function all() {
	      var _this = this;

	      return this._mapKeys(function (key) {
	        return _defineProperty({}, key, _this.get(key));
	      });
	    }

	    /**
	     * Get all `key`s in the current `bucket`.
	     * @returns {string[]} An array of `key` strings.
	     */

	  }, {
	    key: 'keys',
	    value: function keys() {
	      return this._mapKeys(function (key) {
	        return key;
	      });
	    }

	    /**
	     * Get all `value`s in the current `bucket`.
	     * @returns {array.<*>} An array of values.
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
	     * Clears all values from the current `bucket`.
	     */

	  }, {
	    key: 'clear',
	    value: function clear() {
	      var _this3 = this;

	      this.all().forEach(function (item) {
	        _this3.remove(Object.keys(item)[0]);
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