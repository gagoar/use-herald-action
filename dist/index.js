var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function toCommandValue(input) {
    if (input === null || input === void 0) {
      return "";
    } else if (typeof input === "string" || input instanceof String) {
      return input;
    }
    return JSON.stringify(input);
  }
  exports.toCommandValue = toCommandValue;
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS((exports) => {
  "use strict";
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  const os = __importStar(require("os"));
  const utils_1 = require_utils();
  function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
  }
  exports.issueCommand = issueCommand;
  function issue(name, message = "") {
    issueCommand(name, {}, message);
  }
  exports.issue = issue;
  const CMD_STRING = "::";
  class Command {
    constructor(command, properties, message) {
      if (!command) {
        command = "missing.command";
      }
      this.command = command;
      this.properties = properties;
      this.message = message;
    }
    toString() {
      let cmdStr = CMD_STRING + this.command;
      if (this.properties && Object.keys(this.properties).length > 0) {
        cmdStr += " ";
        let first = true;
        for (const key in this.properties) {
          if (this.properties.hasOwnProperty(key)) {
            const val = this.properties[key];
            if (val) {
              if (first) {
                first = false;
              } else {
                cmdStr += ",";
              }
              cmdStr += `${key}=${escapeProperty(val)}`;
            }
          }
        }
      }
      cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
      return cmdStr;
    }
  }
  function escapeData(s) {
    return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  }
  function escapeProperty(s) {
    return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
  }
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS((exports) => {
  "use strict";
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  const fs2 = __importStar(require("fs"));
  const os = __importStar(require("os"));
  const utils_1 = require_utils();
  function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
      throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs2.existsSync(filePath)) {
      throw new Error(`Missing file at path: ${filePath}`);
    }
    fs2.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
      encoding: "utf8"
    });
  }
  exports.issueCommand = issueCommand;
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS((exports) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  const command_1 = require_command();
  const file_command_1 = require_file_command();
  const utils_1 = require_utils();
  const os = __importStar(require("os"));
  const path3 = __importStar(require("path"));
  var ExitCode;
  (function(ExitCode2) {
    ExitCode2[ExitCode2["Success"] = 0] = "Success";
    ExitCode2[ExitCode2["Failure"] = 1] = "Failure";
  })(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
  function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env["GITHUB_ENV"] || "";
    if (filePath) {
      const delimiter = "_GitHubActionsFileCommandDelimeter_";
      const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
      file_command_1.issueCommand("ENV", commandValue);
    } else {
      command_1.issueCommand("set-env", {name}, convertedVal);
    }
  }
  exports.exportVariable = exportVariable;
  function setSecret(secret) {
    command_1.issueCommand("add-mask", {}, secret);
  }
  exports.setSecret = setSecret;
  function addPath(inputPath) {
    const filePath = process.env["GITHUB_PATH"] || "";
    if (filePath) {
      file_command_1.issueCommand("PATH", inputPath);
    } else {
      command_1.issueCommand("add-path", {}, inputPath);
    }
    process.env["PATH"] = `${inputPath}${path3.delimiter}${process.env["PATH"]}`;
  }
  exports.addPath = addPath;
  function getInput3(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
    if (options && options.required && !val) {
      throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
  }
  exports.getInput = getInput3;
  function setOutput2(name, value) {
    command_1.issueCommand("set-output", {name}, value);
  }
  exports.setOutput = setOutput2;
  function setCommandEcho(enabled) {
    command_1.issue("echo", enabled ? "on" : "off");
  }
  exports.setCommandEcho = setCommandEcho;
  function setFailed2(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
  }
  exports.setFailed = setFailed2;
  function isDebug() {
    return process.env["RUNNER_DEBUG"] === "1";
  }
  exports.isDebug = isDebug;
  function debug19(message) {
    command_1.issueCommand("debug", {}, message);
  }
  exports.debug = debug19;
  function error(message) {
    command_1.issue("error", message instanceof Error ? message.toString() : message);
  }
  exports.error = error;
  function warning(message) {
    command_1.issue("warning", message instanceof Error ? message.toString() : message);
  }
  exports.warning = warning;
  function info(message) {
    process.stdout.write(message + os.EOL);
  }
  exports.info = info;
  function startGroup(name) {
    command_1.issue("group", name);
  }
  exports.startGroup = startGroup;
  function endGroup() {
    command_1.issue("endgroup");
  }
  exports.endGroup = endGroup;
  function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
      startGroup(name);
      let result;
      try {
        result = yield fn();
      } finally {
        endGroup();
      }
      return result;
    });
  }
  exports.group = group;
  function saveState(name, value) {
    command_1.issueCommand("save-state", {name}, value);
  }
  exports.saveState = saveState;
  function getState(name) {
    return process.env[`STATE_${name}`] || "";
  }
  exports.getState = getState;
});

// node_modules/lodash.groupby/index.js
var require_lodash = __commonJS((exports, module2) => {
  var LARGE_ARRAY_SIZE = 200;
  var FUNC_ERROR_TEXT = "Expected a function";
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var UNORDERED_COMPARE_FLAG = 1;
  var PARTIAL_COMPARE_FLAG = 2;
  var INFINITY = 1 / 0;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var argsTag = "[object Arguments]";
  var arrayTag = "[object Array]";
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var objectTag = "[object Object]";
  var promiseTag = "[object Promise]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var symbolTag = "[object Symbol]";
  var weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  var reIsPlainProp = /^\w*$/;
  var reLeadingDot = /^\./;
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reEscapeChar = /\\(\\)?/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal.process;
  var nodeUtil = function() {
    try {
      return freeProcess && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1, length = array ? array.length : 0;
    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }
  function arraySome(array, predicate) {
    var index = -1, length = array ? array.length : 0;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function isHostObject(value) {
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e) {
      }
    }
    return result;
  }
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var arrayProto = Array.prototype;
  var funcProto = Function.prototype;
  var objectProto = Object.prototype;
  var coreJsData = root["__core-js_shared__"];
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectToString = objectProto.toString;
  var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  var Symbol2 = root.Symbol;
  var Uint8Array2 = root.Uint8Array;
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  var splice = arrayProto.splice;
  var nativeKeys = overArg(Object.keys, Object);
  var DataView = getNative(root, "DataView");
  var Map2 = getNative(root, "Map");
  var Promise2 = getNative(root, "Promise");
  var Set2 = getNative(root, "Set");
  var WeakMap = getNative(root, "WeakMap");
  var nativeCreate = getNative(Object, "create");
  var dataViewCtorString = toSource(DataView);
  var mapCtorString = toSource(Map2);
  var promiseCtorString = toSource(Promise2);
  var setCtorString = toSource(Set2);
  var weakMapCtorString = toSource(WeakMap);
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
  var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  var symbolToString = symbolProto ? symbolProto.toString : void 0;
  function Hash(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : void 0;
  }
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
  }
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.__data__ = {
      hash: new Hash(),
      map: new (Map2 || ListCache)(),
      string: new Hash()
    };
  }
  function mapCacheDelete(key) {
    return getMapData(this, key)["delete"](key);
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function SetCache(values) {
    var index = -1, length = values ? values.length : 0;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function Stack(entries) {
    this.__data__ = new ListCache(entries);
  }
  function stackClear() {
    this.__data__ = new ListCache();
  }
  function stackDelete(key) {
    return this.__data__["delete"](key);
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  function stackSet(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache) {
      var pairs = cache.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        return this;
      }
      cache = this.__data__ = new MapCache(pairs);
    }
    cache.set(key, value);
    return this;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function arrayLikeKeys(value, inherited) {
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseAggregator(collection, setter, iteratee, accumulator) {
    baseEach(collection, function(value, key, collection2) {
      setter(accumulator, value, iteratee(value), collection2);
    });
    return accumulator;
  }
  var baseEach = createBaseEach(baseForOwn);
  var baseFor = createBaseFor();
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }
  function baseGet(object, path3) {
    path3 = isKey(path3, object) ? [path3] : castPath(path3);
    var index = 0, length = path3.length;
    while (object != null && index < length) {
      object = object[toKey(path3[index++])];
    }
    return index && index == length ? object : void 0;
  }
  function baseGetTag(value) {
    return objectToString.call(value);
  }
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  function baseIsEqual(value, other, customizer, bitmask, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObject(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
  }
  function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
    var objIsArr = isArray(object), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
    if (!objIsArr) {
      objTag = getTag(object);
      objTag = objTag == argsTag ? objectTag : objTag;
    }
    if (!othIsArr) {
      othTag = getTag(other);
      othTag = othTag == argsTag ? objectTag : othTag;
    }
    var objIsObj = objTag == objectTag && !isHostObject(object), othIsObj = othTag == objectTag && !isHostObject(other), isSameTag = objTag == othTag;
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
    }
    if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
  }
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
  }
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  function baseMatchesProperty(path3, srcValue) {
    if (isKey(path3) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path3), srcValue);
    }
    return function(object) {
      var objValue = get(object, path3);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path3) : baseIsEqual(srcValue, objValue, void 0, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
    };
  }
  function basePropertyDeep(path3) {
    return function(object) {
      return baseGet(object, path3);
    };
  }
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function castPath(value) {
    return isArray(value) ? value : stringToPath(value);
  }
  function createAggregator(setter, initializer) {
    return function(collection, iteratee) {
      var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
      return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
    };
  }
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
    var isPartial = bitmask & PARTIAL_COMPARE_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1, result = true, seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!seen.has(othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, customizer, bitmask, stack))) {
            return seen.add(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= UNORDERED_COMPARE_FLAG;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
    var isPartial = bitmask & PARTIAL_COMPARE_FLAG, objProps = keys(object), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var getTag = baseGetTag;
  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function(value) {
      var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  function hasPath(object, path3, hasFunc) {
    path3 = isKey(path3, object) ? [path3] : castPath(path3);
    var result, index = -1, length = path3.length;
    while (++index < length) {
      var key = toKey(path3[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result) {
      return result;
    }
    var length = object ? object.length : 0;
    return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
  }
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
  }
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  var stringToPath = memoize(function(string) {
    string = toString(string);
    var result = [];
    if (reLeadingDot.test(string)) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, string2) {
      result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var groupBy3 = createAggregator(function(result, value, key) {
    if (hasOwnProperty.call(result, key)) {
      result[key].push(value);
    } else {
      result[key] = [value];
    }
  });
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  function isArguments(value) {
    return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
  }
  var isArray = Array.isArray;
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  function isFunction(value) {
    var tag = isObject(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
  }
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
  }
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function get(object, path3, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path3);
    return result === void 0 ? defaultValue : result;
  }
  function hasIn(object, path3) {
    return object != null && hasPath(object, path3, baseHasIn);
  }
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function identity(value) {
    return value;
  }
  function property(path3) {
    return isKey(path3) ? baseProperty(toKey(path3)) : basePropertyDeep(path3);
  }
  module2.exports = groupBy3;
});

// node_modules/fast-glob/out/utils/array.js
var require_array = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.splitWhen = exports.flatten = void 0;
  function flatten(items) {
    return items.reduce((collection, item) => [].concat(collection, item), []);
  }
  exports.flatten = flatten;
  function splitWhen(items, predicate) {
    const result = [[]];
    let groupIndex = 0;
    for (const item of items) {
      if (predicate(item)) {
        groupIndex++;
        result[groupIndex] = [];
      } else {
        result[groupIndex].push(item);
      }
    }
    return result;
  }
  exports.splitWhen = splitWhen;
});

// node_modules/fast-glob/out/utils/errno.js
var require_errno = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.isEnoentCodeError = void 0;
  function isEnoentCodeError(error) {
    return error.code === "ENOENT";
  }
  exports.isEnoentCodeError = isEnoentCodeError;
});

// node_modules/fast-glob/out/utils/fs.js
var require_fs = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.createDirentFromStats = void 0;
  class DirentFromStats {
    constructor(name, stats) {
      this.name = name;
      this.isBlockDevice = stats.isBlockDevice.bind(stats);
      this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
      this.isDirectory = stats.isDirectory.bind(stats);
      this.isFIFO = stats.isFIFO.bind(stats);
      this.isFile = stats.isFile.bind(stats);
      this.isSocket = stats.isSocket.bind(stats);
      this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
  }
  function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
  }
  exports.createDirentFromStats = createDirentFromStats;
});

// node_modules/fast-glob/out/utils/path.js
var require_path = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.removeLeadingDotSegment = exports.escape = exports.makeAbsolute = exports.unixify = void 0;
  const path3 = require("path");
  const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
  const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g;
  function unixify(filepath) {
    return filepath.replace(/\\/g, "/");
  }
  exports.unixify = unixify;
  function makeAbsolute(cwd, filepath) {
    return path3.resolve(cwd, filepath);
  }
  exports.makeAbsolute = makeAbsolute;
  function escape(pattern) {
    return pattern.replace(UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
  }
  exports.escape = escape;
  function removeLeadingDotSegment(entry) {
    if (entry.charAt(0) === ".") {
      const secondCharactery = entry.charAt(1);
      if (secondCharactery === "/" || secondCharactery === "\\") {
        return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
      }
    }
    return entry;
  }
  exports.removeLeadingDotSegment = removeLeadingDotSegment;
});

// node_modules/is-extglob/index.js
var require_is_extglob = __commonJS((exports, module2) => {
  /*!
   * is-extglob <https://github.com/jonschlinkert/is-extglob>
   *
   * Copyright (c) 2014-2016, Jon Schlinkert.
   * Licensed under the MIT License.
   */
  module2.exports = function isExtglob(str2) {
    if (typeof str2 !== "string" || str2 === "") {
      return false;
    }
    var match;
    while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str2)) {
      if (match[2])
        return true;
      str2 = str2.slice(match.index + match[0].length);
    }
    return false;
  };
});

// node_modules/is-glob/index.js
var require_is_glob = __commonJS((exports, module2) => {
  /*!
   * is-glob <https://github.com/jonschlinkert/is-glob>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  var isExtglob = require_is_extglob();
  var chars = {"{": "}", "(": ")", "[": "]"};
  var strictRegex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  var relaxedRegex = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;
  module2.exports = function isGlob(str2, options) {
    if (typeof str2 !== "string" || str2 === "") {
      return false;
    }
    if (isExtglob(str2)) {
      return true;
    }
    var regex = strictRegex;
    var match;
    if (options && options.strict === false) {
      regex = relaxedRegex;
    }
    while (match = regex.exec(str2)) {
      if (match[2])
        return true;
      var idx = match.index + match[0].length;
      var open = match[1];
      var close = open ? chars[open] : null;
      if (open && close) {
        var n = str2.indexOf(close, idx);
        if (n !== -1) {
          idx = n + 1;
        }
      }
      str2 = str2.slice(idx);
    }
    return false;
  };
});

// node_modules/glob-parent/index.js
var require_glob_parent = __commonJS((exports, module2) => {
  "use strict";
  var isGlob = require_is_glob();
  var pathPosixDirname = require("path").posix.dirname;
  var isWin32 = require("os").platform() === "win32";
  var slash = "/";
  var backslash = /\\/g;
  var enclosure = /[\{\[].*[\/]*.*[\}\]]$/;
  var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
  var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
  module2.exports = function globParent(str2, opts) {
    var options = Object.assign({flipBackslashes: true}, opts);
    if (options.flipBackslashes && isWin32 && str2.indexOf(slash) < 0) {
      str2 = str2.replace(backslash, slash);
    }
    if (enclosure.test(str2)) {
      str2 += slash;
    }
    str2 += "a";
    do {
      str2 = pathPosixDirname(str2);
    } while (isGlob(str2) || globby.test(str2));
    return str2.replace(escaped, "$1");
  };
});

// node_modules/braces/lib/utils.js
var require_utils2 = __commonJS((exports) => {
  "use strict";
  exports.isInteger = (num) => {
    if (typeof num === "number") {
      return Number.isInteger(num);
    }
    if (typeof num === "string" && num.trim() !== "") {
      return Number.isInteger(Number(num));
    }
    return false;
  };
  exports.find = (node, type) => node.nodes.find((node2) => node2.type === type);
  exports.exceedsLimit = (min, max, step = 1, limit) => {
    if (limit === false)
      return false;
    if (!exports.isInteger(min) || !exports.isInteger(max))
      return false;
    return (Number(max) - Number(min)) / Number(step) >= limit;
  };
  exports.escapeNode = (block, n = 0, type) => {
    let node = block.nodes[n];
    if (!node)
      return;
    if (type && node.type === type || node.type === "open" || node.type === "close") {
      if (node.escaped !== true) {
        node.value = "\\" + node.value;
        node.escaped = true;
      }
    }
  };
  exports.encloseBrace = (node) => {
    if (node.type !== "brace")
      return false;
    if (node.commas >> 0 + node.ranges >> 0 === 0) {
      node.invalid = true;
      return true;
    }
    return false;
  };
  exports.isInvalidBrace = (block) => {
    if (block.type !== "brace")
      return false;
    if (block.invalid === true || block.dollar)
      return true;
    if (block.commas >> 0 + block.ranges >> 0 === 0) {
      block.invalid = true;
      return true;
    }
    if (block.open !== true || block.close !== true) {
      block.invalid = true;
      return true;
    }
    return false;
  };
  exports.isOpenOrClose = (node) => {
    if (node.type === "open" || node.type === "close") {
      return true;
    }
    return node.open === true || node.close === true;
  };
  exports.reduce = (nodes) => nodes.reduce((acc, node) => {
    if (node.type === "text")
      acc.push(node.value);
    if (node.type === "range")
      node.type = "text";
    return acc;
  }, []);
  exports.flatten = (...args) => {
    const result = [];
    const flat = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        let ele = arr[i];
        Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
      }
      return result;
    };
    flat(args);
    return result;
  };
});

// node_modules/braces/lib/stringify.js
var require_stringify = __commonJS((exports, module2) => {
  "use strict";
  const utils = require_utils2();
  module2.exports = (ast, options = {}) => {
    let stringify = (node, parent = {}) => {
      let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
      let invalidNode = node.invalid === true && options.escapeInvalid === true;
      let output = "";
      if (node.value) {
        if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
          return "\\" + node.value;
        }
        return node.value;
      }
      if (node.value) {
        return node.value;
      }
      if (node.nodes) {
        for (let child of node.nodes) {
          output += stringify(child);
        }
      }
      return output;
    };
    return stringify(ast);
  };
});

// node_modules/is-number/index.js
var require_is_number = __commonJS((exports, module2) => {
  /*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   */
  "use strict";
  module2.exports = function(num) {
    if (typeof num === "number") {
      return num - num === 0;
    }
    if (typeof num === "string" && num.trim() !== "") {
      return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
  };
});

// node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS((exports, module2) => {
  /*!
   * to-regex-range <https://github.com/micromatch/to-regex-range>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   */
  "use strict";
  const isNumber = require_is_number();
  const toRegexRange = (min, max, options) => {
    if (isNumber(min) === false) {
      throw new TypeError("toRegexRange: expected the first argument to be a number");
    }
    if (max === void 0 || min === max) {
      return String(min);
    }
    if (isNumber(max) === false) {
      throw new TypeError("toRegexRange: expected the second argument to be a number.");
    }
    let opts = {relaxZeros: true, ...options};
    if (typeof opts.strictZeros === "boolean") {
      opts.relaxZeros = opts.strictZeros === false;
    }
    let relax = String(opts.relaxZeros);
    let shorthand = String(opts.shorthand);
    let capture = String(opts.capture);
    let wrap = String(opts.wrap);
    let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
    if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
      return toRegexRange.cache[cacheKey].result;
    }
    let a = Math.min(min, max);
    let b = Math.max(min, max);
    if (Math.abs(a - b) === 1) {
      let result = min + "|" + max;
      if (opts.capture) {
        return `(${result})`;
      }
      if (opts.wrap === false) {
        return result;
      }
      return `(?:${result})`;
    }
    let isPadded = hasPadding(min) || hasPadding(max);
    let state = {min, max, a, b};
    let positives = [];
    let negatives = [];
    if (isPadded) {
      state.isPadded = isPadded;
      state.maxLen = String(state.max).length;
    }
    if (a < 0) {
      let newMin = b < 0 ? Math.abs(b) : 1;
      negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
      a = state.a = 0;
    }
    if (b >= 0) {
      positives = splitToPatterns(a, b, state, opts);
    }
    state.negatives = negatives;
    state.positives = positives;
    state.result = collatePatterns(negatives, positives, opts);
    if (opts.capture === true) {
      state.result = `(${state.result})`;
    } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
      state.result = `(?:${state.result})`;
    }
    toRegexRange.cache[cacheKey] = state;
    return state.result;
  };
  function collatePatterns(neg, pos, options) {
    let onlyNegative = filterPatterns(neg, pos, "-", false, options) || [];
    let onlyPositive = filterPatterns(pos, neg, "", false, options) || [];
    let intersected = filterPatterns(neg, pos, "-?", true, options) || [];
    let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
    return subpatterns.join("|");
  }
  function splitToRanges(min, max) {
    let nines = 1;
    let zeros = 1;
    let stop = countNines(min, nines);
    let stops = new Set([max]);
    while (min <= stop && stop <= max) {
      stops.add(stop);
      nines += 1;
      stop = countNines(min, nines);
    }
    stop = countZeros(max + 1, zeros) - 1;
    while (min < stop && stop <= max) {
      stops.add(stop);
      zeros += 1;
      stop = countZeros(max + 1, zeros) - 1;
    }
    stops = [...stops];
    stops.sort(compare);
    return stops;
  }
  function rangeToPattern(start, stop, options) {
    if (start === stop) {
      return {pattern: start, count: [], digits: 0};
    }
    let zipped = zip(start, stop);
    let digits = zipped.length;
    let pattern = "";
    let count = 0;
    for (let i = 0; i < digits; i++) {
      let [startDigit, stopDigit] = zipped[i];
      if (startDigit === stopDigit) {
        pattern += startDigit;
      } else if (startDigit !== "0" || stopDigit !== "9") {
        pattern += toCharacterClass(startDigit, stopDigit, options);
      } else {
        count++;
      }
    }
    if (count) {
      pattern += options.shorthand === true ? "\\d" : "[0-9]";
    }
    return {pattern, count: [count], digits};
  }
  function splitToPatterns(min, max, tok, options) {
    let ranges = splitToRanges(min, max);
    let tokens = [];
    let start = min;
    let prev;
    for (let i = 0; i < ranges.length; i++) {
      let max2 = ranges[i];
      let obj = rangeToPattern(String(start), String(max2), options);
      let zeros = "";
      if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
        if (prev.count.length > 1) {
          prev.count.pop();
        }
        prev.count.push(obj.count[0]);
        prev.string = prev.pattern + toQuantifier(prev.count);
        start = max2 + 1;
        continue;
      }
      if (tok.isPadded) {
        zeros = padZeros(max2, tok, options);
      }
      obj.string = zeros + obj.pattern + toQuantifier(obj.count);
      tokens.push(obj);
      start = max2 + 1;
      prev = obj;
    }
    return tokens;
  }
  function filterPatterns(arr, comparison, prefix, intersection, options) {
    let result = [];
    for (let ele of arr) {
      let {string} = ele;
      if (!intersection && !contains(comparison, "string", string)) {
        result.push(prefix + string);
      }
      if (intersection && contains(comparison, "string", string)) {
        result.push(prefix + string);
      }
    }
    return result;
  }
  function zip(a, b) {
    let arr = [];
    for (let i = 0; i < a.length; i++)
      arr.push([a[i], b[i]]);
    return arr;
  }
  function compare(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
  }
  function contains(arr, key, val) {
    return arr.some((ele) => ele[key] === val);
  }
  function countNines(min, len) {
    return Number(String(min).slice(0, -len) + "9".repeat(len));
  }
  function countZeros(integer, zeros) {
    return integer - integer % Math.pow(10, zeros);
  }
  function toQuantifier(digits) {
    let [start = 0, stop = ""] = digits;
    if (stop || start > 1) {
      return `{${start + (stop ? "," + stop : "")}}`;
    }
    return "";
  }
  function toCharacterClass(a, b, options) {
    return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
  }
  function hasPadding(str2) {
    return /^-?(0+)\d/.test(str2);
  }
  function padZeros(value, tok, options) {
    if (!tok.isPadded) {
      return value;
    }
    let diff = Math.abs(tok.maxLen - String(value).length);
    let relax = options.relaxZeros !== false;
    switch (diff) {
      case 0:
        return "";
      case 1:
        return relax ? "0?" : "0";
      case 2:
        return relax ? "0{0,2}" : "00";
      default: {
        return relax ? `0{0,${diff}}` : `0{${diff}}`;
      }
    }
  }
  toRegexRange.cache = {};
  toRegexRange.clearCache = () => toRegexRange.cache = {};
  module2.exports = toRegexRange;
});

// node_modules/fill-range/index.js
var require_fill_range = __commonJS((exports, module2) => {
  /*!
   * fill-range <https://github.com/jonschlinkert/fill-range>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Licensed under the MIT License.
   */
  "use strict";
  const util = require("util");
  const toRegexRange = require_to_regex_range();
  const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  const transform = (toNumber) => {
    return (value) => toNumber === true ? Number(value) : String(value);
  };
  const isValidValue = (value) => {
    return typeof value === "number" || typeof value === "string" && value !== "";
  };
  const isNumber = (num) => Number.isInteger(+num);
  const zeros = (input) => {
    let value = `${input}`;
    let index = -1;
    if (value[0] === "-")
      value = value.slice(1);
    if (value === "0")
      return false;
    while (value[++index] === "0")
      ;
    return index > 0;
  };
  const stringify = (start, end, options) => {
    if (typeof start === "string" || typeof end === "string") {
      return true;
    }
    return options.stringify === true;
  };
  const pad = (input, maxLength, toNumber) => {
    if (maxLength > 0) {
      let dash = input[0] === "-" ? "-" : "";
      if (dash)
        input = input.slice(1);
      input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
    }
    if (toNumber === false) {
      return String(input);
    }
    return input;
  };
  const toMaxLen = (input, maxLength) => {
    let negative = input[0] === "-" ? "-" : "";
    if (negative) {
      input = input.slice(1);
      maxLength--;
    }
    while (input.length < maxLength)
      input = "0" + input;
    return negative ? "-" + input : input;
  };
  const toSequence = (parts, options) => {
    parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    let prefix = options.capture ? "" : "?:";
    let positives = "";
    let negatives = "";
    let result;
    if (parts.positives.length) {
      positives = parts.positives.join("|");
    }
    if (parts.negatives.length) {
      negatives = `-(${prefix}${parts.negatives.join("|")})`;
    }
    if (positives && negatives) {
      result = `${positives}|${negatives}`;
    } else {
      result = positives || negatives;
    }
    if (options.wrap) {
      return `(${prefix}${result})`;
    }
    return result;
  };
  const toRange = (a, b, isNumbers, options) => {
    if (isNumbers) {
      return toRegexRange(a, b, {wrap: false, ...options});
    }
    let start = String.fromCharCode(a);
    if (a === b)
      return start;
    let stop = String.fromCharCode(b);
    return `[${start}-${stop}]`;
  };
  const toRegex = (start, end, options) => {
    if (Array.isArray(start)) {
      let wrap = options.wrap === true;
      let prefix = options.capture ? "" : "?:";
      return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
    }
    return toRegexRange(start, end, options);
  };
  const rangeError = (...args) => {
    return new RangeError("Invalid range arguments: " + util.inspect(...args));
  };
  const invalidRange = (start, end, options) => {
    if (options.strictRanges === true)
      throw rangeError([start, end]);
    return [];
  };
  const invalidStep = (step, options) => {
    if (options.strictRanges === true) {
      throw new TypeError(`Expected step "${step}" to be a number`);
    }
    return [];
  };
  const fillNumbers = (start, end, step = 1, options = {}) => {
    let a = Number(start);
    let b = Number(end);
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      if (options.strictRanges === true)
        throw rangeError([start, end]);
      return [];
    }
    if (a === 0)
      a = 0;
    if (b === 0)
      b = 0;
    let descending = a > b;
    let startString = String(start);
    let endString = String(end);
    let stepString = String(step);
    step = Math.max(Math.abs(step), 1);
    let padded = zeros(startString) || zeros(endString) || zeros(stepString);
    let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
    let toNumber = padded === false && stringify(start, end, options) === false;
    let format = options.transform || transform(toNumber);
    if (options.toRegex && step === 1) {
      return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
    }
    let parts = {negatives: [], positives: []};
    let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
    let range = [];
    let index = 0;
    while (descending ? a >= b : a <= b) {
      if (options.toRegex === true && step > 1) {
        push(a);
      } else {
        range.push(pad(format(a, index), maxLen, toNumber));
      }
      a = descending ? a - step : a + step;
      index++;
    }
    if (options.toRegex === true) {
      return step > 1 ? toSequence(parts, options) : toRegex(range, null, {wrap: false, ...options});
    }
    return range;
  };
  const fillLetters = (start, end, step = 1, options = {}) => {
    if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) {
      return invalidRange(start, end, options);
    }
    let format = options.transform || ((val) => String.fromCharCode(val));
    let a = `${start}`.charCodeAt(0);
    let b = `${end}`.charCodeAt(0);
    let descending = a > b;
    let min = Math.min(a, b);
    let max = Math.max(a, b);
    if (options.toRegex && step === 1) {
      return toRange(min, max, false, options);
    }
    let range = [];
    let index = 0;
    while (descending ? a >= b : a <= b) {
      range.push(format(a, index));
      a = descending ? a - step : a + step;
      index++;
    }
    if (options.toRegex === true) {
      return toRegex(range, null, {wrap: false, options});
    }
    return range;
  };
  const fill = (start, end, step, options = {}) => {
    if (end == null && isValidValue(start)) {
      return [start];
    }
    if (!isValidValue(start) || !isValidValue(end)) {
      return invalidRange(start, end, options);
    }
    if (typeof step === "function") {
      return fill(start, end, 1, {transform: step});
    }
    if (isObject(step)) {
      return fill(start, end, 0, step);
    }
    let opts = {...options};
    if (opts.capture === true)
      opts.wrap = true;
    step = step || opts.step || 1;
    if (!isNumber(step)) {
      if (step != null && !isObject(step))
        return invalidStep(step, opts);
      return fill(start, end, 1, step);
    }
    if (isNumber(start) && isNumber(end)) {
      return fillNumbers(start, end, step, opts);
    }
    return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
  };
  module2.exports = fill;
});

// node_modules/braces/lib/compile.js
var require_compile = __commonJS((exports, module2) => {
  "use strict";
  const fill = require_fill_range();
  const utils = require_utils2();
  const compile = (ast, options = {}) => {
    let walk = (node, parent = {}) => {
      let invalidBlock = utils.isInvalidBrace(parent);
      let invalidNode = node.invalid === true && options.escapeInvalid === true;
      let invalid = invalidBlock === true || invalidNode === true;
      let prefix = options.escapeInvalid === true ? "\\" : "";
      let output = "";
      if (node.isOpen === true) {
        return prefix + node.value;
      }
      if (node.isClose === true) {
        return prefix + node.value;
      }
      if (node.type === "open") {
        return invalid ? prefix + node.value : "(";
      }
      if (node.type === "close") {
        return invalid ? prefix + node.value : ")";
      }
      if (node.type === "comma") {
        return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
      }
      if (node.value) {
        return node.value;
      }
      if (node.nodes && node.ranges > 0) {
        let args = utils.reduce(node.nodes);
        let range = fill(...args, {...options, wrap: false, toRegex: true});
        if (range.length !== 0) {
          return args.length > 1 && range.length > 1 ? `(${range})` : range;
        }
      }
      if (node.nodes) {
        for (let child of node.nodes) {
          output += walk(child, node);
        }
      }
      return output;
    };
    return walk(ast);
  };
  module2.exports = compile;
});

// node_modules/braces/lib/expand.js
var require_expand = __commonJS((exports, module2) => {
  "use strict";
  const fill = require_fill_range();
  const stringify = require_stringify();
  const utils = require_utils2();
  const append = (queue = "", stash = "", enclose = false) => {
    let result = [];
    queue = [].concat(queue);
    stash = [].concat(stash);
    if (!stash.length)
      return queue;
    if (!queue.length) {
      return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
    }
    for (let item of queue) {
      if (Array.isArray(item)) {
        for (let value of item) {
          result.push(append(value, stash, enclose));
        }
      } else {
        for (let ele of stash) {
          if (enclose === true && typeof ele === "string")
            ele = `{${ele}}`;
          result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
        }
      }
    }
    return utils.flatten(result);
  };
  const expand = (ast, options = {}) => {
    let rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
    let walk = (node, parent = {}) => {
      node.queue = [];
      let p = parent;
      let q = parent.queue;
      while (p.type !== "brace" && p.type !== "root" && p.parent) {
        p = p.parent;
        q = p.queue;
      }
      if (node.invalid || node.dollar) {
        q.push(append(q.pop(), stringify(node, options)));
        return;
      }
      if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
        q.push(append(q.pop(), ["{}"]));
        return;
      }
      if (node.nodes && node.ranges > 0) {
        let args = utils.reduce(node.nodes);
        if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
          throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
        }
        let range = fill(...args, options);
        if (range.length === 0) {
          range = stringify(node, options);
        }
        q.push(append(q.pop(), range));
        node.nodes = [];
        return;
      }
      let enclose = utils.encloseBrace(node);
      let queue = node.queue;
      let block = node;
      while (block.type !== "brace" && block.type !== "root" && block.parent) {
        block = block.parent;
        queue = block.queue;
      }
      for (let i = 0; i < node.nodes.length; i++) {
        let child = node.nodes[i];
        if (child.type === "comma" && node.type === "brace") {
          if (i === 1)
            queue.push("");
          queue.push("");
          continue;
        }
        if (child.type === "close") {
          q.push(append(q.pop(), queue, enclose));
          continue;
        }
        if (child.value && child.type !== "open") {
          queue.push(append(queue.pop(), child.value));
          continue;
        }
        if (child.nodes) {
          walk(child, node);
        }
      }
      return queue;
    };
    return utils.flatten(walk(ast));
  };
  module2.exports = expand;
});

// node_modules/braces/lib/constants.js
var require_constants = __commonJS((exports, module2) => {
  "use strict";
  module2.exports = {
    MAX_LENGTH: 1024 * 64,
    CHAR_0: "0",
    CHAR_9: "9",
    CHAR_UPPERCASE_A: "A",
    CHAR_LOWERCASE_A: "a",
    CHAR_UPPERCASE_Z: "Z",
    CHAR_LOWERCASE_Z: "z",
    CHAR_LEFT_PARENTHESES: "(",
    CHAR_RIGHT_PARENTHESES: ")",
    CHAR_ASTERISK: "*",
    CHAR_AMPERSAND: "&",
    CHAR_AT: "@",
    CHAR_BACKSLASH: "\\",
    CHAR_BACKTICK: "`",
    CHAR_CARRIAGE_RETURN: "\r",
    CHAR_CIRCUMFLEX_ACCENT: "^",
    CHAR_COLON: ":",
    CHAR_COMMA: ",",
    CHAR_DOLLAR: "$",
    CHAR_DOT: ".",
    CHAR_DOUBLE_QUOTE: '"',
    CHAR_EQUAL: "=",
    CHAR_EXCLAMATION_MARK: "!",
    CHAR_FORM_FEED: "\f",
    CHAR_FORWARD_SLASH: "/",
    CHAR_HASH: "#",
    CHAR_HYPHEN_MINUS: "-",
    CHAR_LEFT_ANGLE_BRACKET: "<",
    CHAR_LEFT_CURLY_BRACE: "{",
    CHAR_LEFT_SQUARE_BRACKET: "[",
    CHAR_LINE_FEED: "\n",
    CHAR_NO_BREAK_SPACE: "\xA0",
    CHAR_PERCENT: "%",
    CHAR_PLUS: "+",
    CHAR_QUESTION_MARK: "?",
    CHAR_RIGHT_ANGLE_BRACKET: ">",
    CHAR_RIGHT_CURLY_BRACE: "}",
    CHAR_RIGHT_SQUARE_BRACKET: "]",
    CHAR_SEMICOLON: ";",
    CHAR_SINGLE_QUOTE: "'",
    CHAR_SPACE: " ",
    CHAR_TAB: "	",
    CHAR_UNDERSCORE: "_",
    CHAR_VERTICAL_LINE: "|",
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
  };
});

// node_modules/braces/lib/parse.js
var require_parse = __commonJS((exports, module2) => {
  "use strict";
  const stringify = require_stringify();
  const {
    MAX_LENGTH,
    CHAR_BACKSLASH,
    CHAR_BACKTICK,
    CHAR_COMMA,
    CHAR_DOT,
    CHAR_LEFT_PARENTHESES,
    CHAR_RIGHT_PARENTHESES,
    CHAR_LEFT_CURLY_BRACE,
    CHAR_RIGHT_CURLY_BRACE,
    CHAR_LEFT_SQUARE_BRACKET,
    CHAR_RIGHT_SQUARE_BRACKET,
    CHAR_DOUBLE_QUOTE,
    CHAR_SINGLE_QUOTE,
    CHAR_NO_BREAK_SPACE,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE
  } = require_constants();
  const parse = (input, options = {}) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string");
    }
    let opts = options || {};
    let max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    if (input.length > max) {
      throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
    }
    let ast = {type: "root", input, nodes: []};
    let stack = [ast];
    let block = ast;
    let prev = ast;
    let brackets = 0;
    let length = input.length;
    let index = 0;
    let depth = 0;
    let value;
    let memo = {};
    const advance = () => input[index++];
    const push = (node) => {
      if (node.type === "text" && prev.type === "dot") {
        prev.type = "text";
      }
      if (prev && prev.type === "text" && node.type === "text") {
        prev.value += node.value;
        return;
      }
      block.nodes.push(node);
      node.parent = block;
      node.prev = prev;
      prev = node;
      return node;
    };
    push({type: "bos"});
    while (index < length) {
      block = stack[stack.length - 1];
      value = advance();
      if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
        continue;
      }
      if (value === CHAR_BACKSLASH) {
        push({type: "text", value: (options.keepEscaping ? value : "") + advance()});
        continue;
      }
      if (value === CHAR_RIGHT_SQUARE_BRACKET) {
        push({type: "text", value: "\\" + value});
        continue;
      }
      if (value === CHAR_LEFT_SQUARE_BRACKET) {
        brackets++;
        let closed = true;
        let next;
        while (index < length && (next = advance())) {
          value += next;
          if (next === CHAR_LEFT_SQUARE_BRACKET) {
            brackets++;
            continue;
          }
          if (next === CHAR_BACKSLASH) {
            value += advance();
            continue;
          }
          if (next === CHAR_RIGHT_SQUARE_BRACKET) {
            brackets--;
            if (brackets === 0) {
              break;
            }
          }
        }
        push({type: "text", value});
        continue;
      }
      if (value === CHAR_LEFT_PARENTHESES) {
        block = push({type: "paren", nodes: []});
        stack.push(block);
        push({type: "text", value});
        continue;
      }
      if (value === CHAR_RIGHT_PARENTHESES) {
        if (block.type !== "paren") {
          push({type: "text", value});
          continue;
        }
        block = stack.pop();
        push({type: "text", value});
        block = stack[stack.length - 1];
        continue;
      }
      if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
        let open = value;
        let next;
        if (options.keepQuotes !== true) {
          value = "";
        }
        while (index < length && (next = advance())) {
          if (next === CHAR_BACKSLASH) {
            value += next + advance();
            continue;
          }
          if (next === open) {
            if (options.keepQuotes === true)
              value += next;
            break;
          }
          value += next;
        }
        push({type: "text", value});
        continue;
      }
      if (value === CHAR_LEFT_CURLY_BRACE) {
        depth++;
        let dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
        let brace = {
          type: "brace",
          open: true,
          close: false,
          dollar,
          depth,
          commas: 0,
          ranges: 0,
          nodes: []
        };
        block = push(brace);
        stack.push(block);
        push({type: "open", value});
        continue;
      }
      if (value === CHAR_RIGHT_CURLY_BRACE) {
        if (block.type !== "brace") {
          push({type: "text", value});
          continue;
        }
        let type = "close";
        block = stack.pop();
        block.close = true;
        push({type, value});
        depth--;
        block = stack[stack.length - 1];
        continue;
      }
      if (value === CHAR_COMMA && depth > 0) {
        if (block.ranges > 0) {
          block.ranges = 0;
          let open = block.nodes.shift();
          block.nodes = [open, {type: "text", value: stringify(block)}];
        }
        push({type: "comma", value});
        block.commas++;
        continue;
      }
      if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
        let siblings = block.nodes;
        if (depth === 0 || siblings.length === 0) {
          push({type: "text", value});
          continue;
        }
        if (prev.type === "dot") {
          block.range = [];
          prev.value += value;
          prev.type = "range";
          if (block.nodes.length !== 3 && block.nodes.length !== 5) {
            block.invalid = true;
            block.ranges = 0;
            prev.type = "text";
            continue;
          }
          block.ranges++;
          block.args = [];
          continue;
        }
        if (prev.type === "range") {
          siblings.pop();
          let before = siblings[siblings.length - 1];
          before.value += prev.value + value;
          prev = before;
          block.ranges--;
          continue;
        }
        push({type: "dot", value});
        continue;
      }
      push({type: "text", value});
    }
    do {
      block = stack.pop();
      if (block.type !== "root") {
        block.nodes.forEach((node) => {
          if (!node.nodes) {
            if (node.type === "open")
              node.isOpen = true;
            if (node.type === "close")
              node.isClose = true;
            if (!node.nodes)
              node.type = "text";
            node.invalid = true;
          }
        });
        let parent = stack[stack.length - 1];
        let index2 = parent.nodes.indexOf(block);
        parent.nodes.splice(index2, 1, ...block.nodes);
      }
    } while (stack.length > 0);
    push({type: "eos"});
    return ast;
  };
  module2.exports = parse;
});

// node_modules/braces/index.js
var require_braces = __commonJS((exports, module2) => {
  "use strict";
  const stringify = require_stringify();
  const compile = require_compile();
  const expand = require_expand();
  const parse = require_parse();
  const braces = (input, options = {}) => {
    let output = [];
    if (Array.isArray(input)) {
      for (let pattern of input) {
        let result = braces.create(pattern, options);
        if (Array.isArray(result)) {
          output.push(...result);
        } else {
          output.push(result);
        }
      }
    } else {
      output = [].concat(braces.create(input, options));
    }
    if (options && options.expand === true && options.nodupes === true) {
      output = [...new Set(output)];
    }
    return output;
  };
  braces.parse = (input, options = {}) => parse(input, options);
  braces.stringify = (input, options = {}) => {
    if (typeof input === "string") {
      return stringify(braces.parse(input, options), options);
    }
    return stringify(input, options);
  };
  braces.compile = (input, options = {}) => {
    if (typeof input === "string") {
      input = braces.parse(input, options);
    }
    return compile(input, options);
  };
  braces.expand = (input, options = {}) => {
    if (typeof input === "string") {
      input = braces.parse(input, options);
    }
    let result = expand(input, options);
    if (options.noempty === true) {
      result = result.filter(Boolean);
    }
    if (options.nodupes === true) {
      result = [...new Set(result)];
    }
    return result;
  };
  braces.create = (input, options = {}) => {
    if (input === "" || input.length < 3) {
      return [input];
    }
    return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options);
  };
  module2.exports = braces;
});

// node_modules/picomatch/lib/constants.js
var require_constants2 = __commonJS((exports, module2) => {
  "use strict";
  const path3 = require("path");
  const WIN_SLASH = "\\\\/";
  const WIN_NO_SLASH = `[^${WIN_SLASH}]`;
  const DOT_LITERAL = "\\.";
  const PLUS_LITERAL = "\\+";
  const QMARK_LITERAL = "\\?";
  const SLASH_LITERAL = "\\/";
  const ONE_CHAR = "(?=.)";
  const QMARK = "[^/]";
  const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
  const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
  const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
  const NO_DOT = `(?!${DOT_LITERAL})`;
  const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
  const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
  const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
  const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
  const STAR = `${QMARK}*?`;
  const POSIX_CHARS = {
    DOT_LITERAL,
    PLUS_LITERAL,
    QMARK_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    QMARK,
    END_ANCHOR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  };
  const WINDOWS_CHARS = {
    ...POSIX_CHARS,
    SLASH_LITERAL: `[${WIN_SLASH}]`,
    QMARK: WIN_NO_SLASH,
    STAR: `${WIN_NO_SLASH}*?`,
    DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
    NO_DOT: `(?!${DOT_LITERAL})`,
    NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
    NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
    START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
    END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
  };
  const POSIX_REGEX_SOURCE = {
    alnum: "a-zA-Z0-9",
    alpha: "a-zA-Z",
    ascii: "\\x00-\\x7F",
    blank: " \\t",
    cntrl: "\\x00-\\x1F\\x7F",
    digit: "0-9",
    graph: "\\x21-\\x7E",
    lower: "a-z",
    print: "\\x20-\\x7E ",
    punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
    space: " \\t\\r\\n\\v\\f",
    upper: "A-Z",
    word: "A-Za-z0-9_",
    xdigit: "A-Fa-f0-9"
  };
  module2.exports = {
    MAX_LENGTH: 1024 * 64,
    POSIX_REGEX_SOURCE,
    REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
    REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
    REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
    REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
    REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
    REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
    REPLACEMENTS: {
      "***": "*",
      "**/**": "**",
      "**/**/**": "**"
    },
    CHAR_0: 48,
    CHAR_9: 57,
    CHAR_UPPERCASE_A: 65,
    CHAR_LOWERCASE_A: 97,
    CHAR_UPPERCASE_Z: 90,
    CHAR_LOWERCASE_Z: 122,
    CHAR_LEFT_PARENTHESES: 40,
    CHAR_RIGHT_PARENTHESES: 41,
    CHAR_ASTERISK: 42,
    CHAR_AMPERSAND: 38,
    CHAR_AT: 64,
    CHAR_BACKWARD_SLASH: 92,
    CHAR_CARRIAGE_RETURN: 13,
    CHAR_CIRCUMFLEX_ACCENT: 94,
    CHAR_COLON: 58,
    CHAR_COMMA: 44,
    CHAR_DOT: 46,
    CHAR_DOUBLE_QUOTE: 34,
    CHAR_EQUAL: 61,
    CHAR_EXCLAMATION_MARK: 33,
    CHAR_FORM_FEED: 12,
    CHAR_FORWARD_SLASH: 47,
    CHAR_GRAVE_ACCENT: 96,
    CHAR_HASH: 35,
    CHAR_HYPHEN_MINUS: 45,
    CHAR_LEFT_ANGLE_BRACKET: 60,
    CHAR_LEFT_CURLY_BRACE: 123,
    CHAR_LEFT_SQUARE_BRACKET: 91,
    CHAR_LINE_FEED: 10,
    CHAR_NO_BREAK_SPACE: 160,
    CHAR_PERCENT: 37,
    CHAR_PLUS: 43,
    CHAR_QUESTION_MARK: 63,
    CHAR_RIGHT_ANGLE_BRACKET: 62,
    CHAR_RIGHT_CURLY_BRACE: 125,
    CHAR_RIGHT_SQUARE_BRACKET: 93,
    CHAR_SEMICOLON: 59,
    CHAR_SINGLE_QUOTE: 39,
    CHAR_SPACE: 32,
    CHAR_TAB: 9,
    CHAR_UNDERSCORE: 95,
    CHAR_VERTICAL_LINE: 124,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
    SEP: path3.sep,
    extglobChars(chars) {
      return {
        "!": {type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})`},
        "?": {type: "qmark", open: "(?:", close: ")?"},
        "+": {type: "plus", open: "(?:", close: ")+"},
        "*": {type: "star", open: "(?:", close: ")*"},
        "@": {type: "at", open: "(?:", close: ")"}
      };
    },
    globChars(win32) {
      return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
    }
  };
});

// node_modules/picomatch/lib/utils.js
var require_utils3 = __commonJS((exports) => {
  "use strict";
  const path3 = require("path");
  const win32 = process.platform === "win32";
  const {
    REGEX_BACKSLASH,
    REGEX_REMOVE_BACKSLASH,
    REGEX_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_GLOBAL
  } = require_constants2();
  exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  exports.hasRegexChars = (str2) => REGEX_SPECIAL_CHARS.test(str2);
  exports.isRegexChar = (str2) => str2.length === 1 && exports.hasRegexChars(str2);
  exports.escapeRegex = (str2) => str2.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
  exports.toPosixSlashes = (str2) => str2.replace(REGEX_BACKSLASH, "/");
  exports.removeBackslashes = (str2) => {
    return str2.replace(REGEX_REMOVE_BACKSLASH, (match) => {
      return match === "\\" ? "" : match;
    });
  };
  exports.supportsLookbehinds = () => {
    const segs = process.version.slice(1).split(".").map(Number);
    if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) {
      return true;
    }
    return false;
  };
  exports.isWindows = (options) => {
    if (options && typeof options.windows === "boolean") {
      return options.windows;
    }
    return win32 === true || path3.sep === "\\";
  };
  exports.escapeLast = (input, char, lastIdx) => {
    const idx = input.lastIndexOf(char, lastIdx);
    if (idx === -1)
      return input;
    if (input[idx - 1] === "\\")
      return exports.escapeLast(input, char, idx - 1);
    return `${input.slice(0, idx)}\\${input.slice(idx)}`;
  };
  exports.removePrefix = (input, state = {}) => {
    let output = input;
    if (output.startsWith("./")) {
      output = output.slice(2);
      state.prefix = "./";
    }
    return output;
  };
  exports.wrapOutput = (input, state = {}, options = {}) => {
    const prepend = options.contains ? "" : "^";
    const append = options.contains ? "" : "$";
    let output = `${prepend}(?:${input})${append}`;
    if (state.negated === true) {
      output = `(?:^(?!${output}).*$)`;
    }
    return output;
  };
});

// node_modules/picomatch/lib/scan.js
var require_scan = __commonJS((exports, module2) => {
  "use strict";
  const utils = require_utils3();
  const {
    CHAR_ASTERISK,
    CHAR_AT,
    CHAR_BACKWARD_SLASH,
    CHAR_COMMA,
    CHAR_DOT,
    CHAR_EXCLAMATION_MARK,
    CHAR_FORWARD_SLASH,
    CHAR_LEFT_CURLY_BRACE,
    CHAR_LEFT_PARENTHESES,
    CHAR_LEFT_SQUARE_BRACKET,
    CHAR_PLUS,
    CHAR_QUESTION_MARK,
    CHAR_RIGHT_CURLY_BRACE,
    CHAR_RIGHT_PARENTHESES,
    CHAR_RIGHT_SQUARE_BRACKET
  } = require_constants2();
  const isPathSeparator = (code) => {
    return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
  };
  const depth = (token) => {
    if (token.isPrefix !== true) {
      token.depth = token.isGlobstar ? Infinity : 1;
    }
  };
  const scan = (input, options) => {
    const opts = options || {};
    const length = input.length - 1;
    const scanToEnd = opts.parts === true || opts.scanToEnd === true;
    const slashes = [];
    const tokens = [];
    const parts = [];
    let str2 = input;
    let index = -1;
    let start = 0;
    let lastIndex = 0;
    let isBrace = false;
    let isBracket = false;
    let isGlob = false;
    let isExtglob = false;
    let isGlobstar = false;
    let braceEscaped = false;
    let backslashes = false;
    let negated = false;
    let finished = false;
    let braces = 0;
    let prev;
    let code;
    let token = {value: "", depth: 0, isGlob: false};
    const eos = () => index >= length;
    const peek = () => str2.charCodeAt(index + 1);
    const advance = () => {
      prev = code;
      return str2.charCodeAt(++index);
    };
    while (index < length) {
      code = advance();
      let next;
      if (code === CHAR_BACKWARD_SLASH) {
        backslashes = token.backslashes = true;
        code = advance();
        if (code === CHAR_LEFT_CURLY_BRACE) {
          braceEscaped = true;
        }
        continue;
      }
      if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
        braces++;
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            advance();
            continue;
          }
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braces++;
            continue;
          }
          if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
            isBrace = token.isBrace = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (braceEscaped !== true && code === CHAR_COMMA) {
            isBrace = token.isBrace = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (code === CHAR_RIGHT_CURLY_BRACE) {
            braces--;
            if (braces === 0) {
              braceEscaped = false;
              isBrace = token.isBrace = true;
              finished = true;
              break;
            }
          }
        }
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (code === CHAR_FORWARD_SLASH) {
        slashes.push(index);
        tokens.push(token);
        token = {value: "", depth: 0, isGlob: false};
        if (finished === true)
          continue;
        if (prev === CHAR_DOT && index === start + 1) {
          start += 2;
          continue;
        }
        lastIndex = index + 1;
        continue;
      }
      if (opts.noext !== true) {
        const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
        if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          isExtglob = token.isExtglob = true;
          finished = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_BACKWARD_SLASH) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                isGlob = token.isGlob = true;
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
      }
      if (code === CHAR_ASTERISK) {
        if (prev === CHAR_ASTERISK)
          isGlobstar = token.isGlobstar = true;
        isGlob = token.isGlob = true;
        finished = true;
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (code === CHAR_QUESTION_MARK) {
        isGlob = token.isGlob = true;
        finished = true;
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (code === CHAR_LEFT_SQUARE_BRACKET) {
        while (eos() !== true && (next = advance())) {
          if (next === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            advance();
            continue;
          }
          if (next === CHAR_RIGHT_SQUARE_BRACKET) {
            isBracket = token.isBracket = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
        }
      }
      if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
        negated = token.negated = true;
        start++;
        continue;
      }
      if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_LEFT_PARENTHESES) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }
            if (code === CHAR_RIGHT_PARENTHESES) {
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
      if (isGlob === true) {
        finished = true;
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
    }
    if (opts.noext === true) {
      isExtglob = false;
      isGlob = false;
    }
    let base = str2;
    let prefix = "";
    let glob = "";
    if (start > 0) {
      prefix = str2.slice(0, start);
      str2 = str2.slice(start);
      lastIndex -= start;
    }
    if (base && isGlob === true && lastIndex > 0) {
      base = str2.slice(0, lastIndex);
      glob = str2.slice(lastIndex);
    } else if (isGlob === true) {
      base = "";
      glob = str2;
    } else {
      base = str2;
    }
    if (base && base !== "" && base !== "/" && base !== str2) {
      if (isPathSeparator(base.charCodeAt(base.length - 1))) {
        base = base.slice(0, -1);
      }
    }
    if (opts.unescape === true) {
      if (glob)
        glob = utils.removeBackslashes(glob);
      if (base && backslashes === true) {
        base = utils.removeBackslashes(base);
      }
    }
    const state = {
      prefix,
      input,
      start,
      base,
      glob,
      isBrace,
      isBracket,
      isGlob,
      isExtglob,
      isGlobstar,
      negated
    };
    if (opts.tokens === true) {
      state.maxDepth = 0;
      if (!isPathSeparator(code)) {
        tokens.push(token);
      }
      state.tokens = tokens;
    }
    if (opts.parts === true || opts.tokens === true) {
      let prevIndex;
      for (let idx = 0; idx < slashes.length; idx++) {
        const n = prevIndex ? prevIndex + 1 : start;
        const i = slashes[idx];
        const value = input.slice(n, i);
        if (opts.tokens) {
          if (idx === 0 && start !== 0) {
            tokens[idx].isPrefix = true;
            tokens[idx].value = prefix;
          } else {
            tokens[idx].value = value;
          }
          depth(tokens[idx]);
          state.maxDepth += tokens[idx].depth;
        }
        if (idx !== 0 || value !== "") {
          parts.push(value);
        }
        prevIndex = i;
      }
      if (prevIndex && prevIndex + 1 < input.length) {
        const value = input.slice(prevIndex + 1);
        parts.push(value);
        if (opts.tokens) {
          tokens[tokens.length - 1].value = value;
          depth(tokens[tokens.length - 1]);
          state.maxDepth += tokens[tokens.length - 1].depth;
        }
      }
      state.slashes = slashes;
      state.parts = parts;
    }
    return state;
  };
  module2.exports = scan;
});

// node_modules/picomatch/lib/parse.js
var require_parse2 = __commonJS((exports, module2) => {
  "use strict";
  const constants7 = require_constants2();
  const utils = require_utils3();
  const {
    MAX_LENGTH,
    POSIX_REGEX_SOURCE,
    REGEX_NON_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_BACKREF,
    REPLACEMENTS
  } = constants7;
  const expandRange = (args, options) => {
    if (typeof options.expandRange === "function") {
      return options.expandRange(...args, options);
    }
    args.sort();
    const value = `[${args.join("-")}]`;
    try {
      new RegExp(value);
    } catch (ex) {
      return args.map((v) => utils.escapeRegex(v)).join("..");
    }
    return value;
  };
  const syntaxError = (type, char) => {
    return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
  };
  const parse = (input, options) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string");
    }
    input = REPLACEMENTS[input] || input;
    const opts = {...options};
    const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    let len = input.length;
    if (len > max) {
      throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    }
    const bos = {type: "bos", value: "", output: opts.prepend || ""};
    const tokens = [bos];
    const capture = opts.capture ? "" : "?:";
    const win32 = utils.isWindows(options);
    const PLATFORM_CHARS = constants7.globChars(win32);
    const EXTGLOB_CHARS = constants7.extglobChars(PLATFORM_CHARS);
    const {
      DOT_LITERAL,
      PLUS_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    } = PLATFORM_CHARS;
    const globstar = (opts2) => {
      return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const nodot = opts.dot ? "" : NO_DOT;
    const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
    let star = opts.bash === true ? globstar(opts) : STAR;
    if (opts.capture) {
      star = `(${star})`;
    }
    if (typeof opts.noext === "boolean") {
      opts.noextglob = opts.noext;
    }
    const state = {
      input,
      index: -1,
      start: 0,
      dot: opts.dot === true,
      consumed: "",
      output: "",
      prefix: "",
      backtrack: false,
      negated: false,
      brackets: 0,
      braces: 0,
      parens: 0,
      quotes: 0,
      globstar: false,
      tokens
    };
    input = utils.removePrefix(input, state);
    len = input.length;
    const extglobs = [];
    const braces = [];
    const stack = [];
    let prev = bos;
    let value;
    const eos = () => state.index === len - 1;
    const peek = state.peek = (n = 1) => input[state.index + n];
    const advance = state.advance = () => input[++state.index];
    const remaining = () => input.slice(state.index + 1);
    const consume = (value2 = "", num = 0) => {
      state.consumed += value2;
      state.index += num;
    };
    const append = (token) => {
      state.output += token.output != null ? token.output : token.value;
      consume(token.value);
    };
    const negate = () => {
      let count = 1;
      while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
        advance();
        state.start++;
        count++;
      }
      if (count % 2 === 0) {
        return false;
      }
      state.negated = true;
      state.start++;
      return true;
    };
    const increment = (type) => {
      state[type]++;
      stack.push(type);
    };
    const decrement = (type) => {
      state[type]--;
      stack.pop();
    };
    const push = (tok) => {
      if (prev.type === "globstar") {
        const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
        const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
        if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "star";
          prev.value = "*";
          prev.output = star;
          state.output += prev.output;
        }
      }
      if (extglobs.length && tok.type !== "paren" && !EXTGLOB_CHARS[tok.value]) {
        extglobs[extglobs.length - 1].inner += tok.value;
      }
      if (tok.value || tok.output)
        append(tok);
      if (prev && prev.type === "text" && tok.type === "text") {
        prev.value += tok.value;
        prev.output = (prev.output || "") + tok.value;
        return;
      }
      tok.prev = prev;
      tokens.push(tok);
      prev = tok;
    };
    const extglobOpen = (type, value2) => {
      const token = {...EXTGLOB_CHARS[value2], conditions: 1, inner: ""};
      token.prev = prev;
      token.parens = state.parens;
      token.output = state.output;
      const output = (opts.capture ? "(" : "") + token.open;
      increment("parens");
      push({type, value: value2, output: state.output ? "" : ONE_CHAR});
      push({type: "paren", extglob: true, value: advance(), output});
      extglobs.push(token);
    };
    const extglobClose = (token) => {
      let output = token.close + (opts.capture ? ")" : "");
      if (token.type === "negate") {
        let extglobStar = star;
        if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
          extglobStar = globstar(opts);
        }
        if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
          output = token.close = `)$))${extglobStar}`;
        }
        if (token.prev.type === "bos" && eos()) {
          state.negatedExtglob = true;
        }
      }
      push({type: "paren", extglob: true, value, output});
      decrement("parens");
    };
    if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
      let backslashes = false;
      let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest2, index) => {
        if (first === "\\") {
          backslashes = true;
          return m;
        }
        if (first === "?") {
          if (esc) {
            return esc + first + (rest2 ? QMARK.repeat(rest2.length) : "");
          }
          if (index === 0) {
            return qmarkNoDot + (rest2 ? QMARK.repeat(rest2.length) : "");
          }
          return QMARK.repeat(chars.length);
        }
        if (first === ".") {
          return DOT_LITERAL.repeat(chars.length);
        }
        if (first === "*") {
          if (esc) {
            return esc + first + (rest2 ? star : "");
          }
          return star;
        }
        return esc ? m : `\\${m}`;
      });
      if (backslashes === true) {
        if (opts.unescape === true) {
          output = output.replace(/\\/g, "");
        } else {
          output = output.replace(/\\+/g, (m) => {
            return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
          });
        }
      }
      if (output === input && opts.contains === true) {
        state.output = input;
        return state;
      }
      state.output = utils.wrapOutput(output, state, options);
      return state;
    }
    while (!eos()) {
      value = advance();
      if (value === "\0") {
        continue;
      }
      if (value === "\\") {
        const next = peek();
        if (next === "/" && opts.bash !== true) {
          continue;
        }
        if (next === "." || next === ";") {
          continue;
        }
        if (!next) {
          value += "\\";
          push({type: "text", value});
          continue;
        }
        const match = /^\\+/.exec(remaining());
        let slashes = 0;
        if (match && match[0].length > 2) {
          slashes = match[0].length;
          state.index += slashes;
          if (slashes % 2 !== 0) {
            value += "\\";
          }
        }
        if (opts.unescape === true) {
          value = advance() || "";
        } else {
          value += advance() || "";
        }
        if (state.brackets === 0) {
          push({type: "text", value});
          continue;
        }
      }
      if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
        if (opts.posix !== false && value === ":") {
          const inner = prev.value.slice(1);
          if (inner.includes("[")) {
            prev.posix = true;
            if (inner.includes(":")) {
              const idx = prev.value.lastIndexOf("[");
              const pre = prev.value.slice(0, idx);
              const rest3 = prev.value.slice(idx + 2);
              const posix = POSIX_REGEX_SOURCE[rest3];
              if (posix) {
                prev.value = pre + posix;
                state.backtrack = true;
                advance();
                if (!bos.output && tokens.indexOf(prev) === 1) {
                  bos.output = ONE_CHAR;
                }
                continue;
              }
            }
          }
        }
        if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
          value = `\\${value}`;
        }
        if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
          value = `\\${value}`;
        }
        if (opts.posix === true && value === "!" && prev.value === "[") {
          value = "^";
        }
        prev.value += value;
        append({value});
        continue;
      }
      if (state.quotes === 1 && value !== '"') {
        value = utils.escapeRegex(value);
        prev.value += value;
        append({value});
        continue;
      }
      if (value === '"') {
        state.quotes = state.quotes === 1 ? 0 : 1;
        if (opts.keepQuotes === true) {
          push({type: "text", value});
        }
        continue;
      }
      if (value === "(") {
        increment("parens");
        push({type: "paren", value});
        continue;
      }
      if (value === ")") {
        if (state.parens === 0 && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError("opening", "("));
        }
        const extglob = extglobs[extglobs.length - 1];
        if (extglob && state.parens === extglob.parens + 1) {
          extglobClose(extglobs.pop());
          continue;
        }
        push({type: "paren", value, output: state.parens ? ")" : "\\)"});
        decrement("parens");
        continue;
      }
      if (value === "[") {
        if (opts.nobracket === true || !remaining().includes("]")) {
          if (opts.nobracket !== true && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("closing", "]"));
          }
          value = `\\${value}`;
        } else {
          increment("brackets");
        }
        push({type: "bracket", value});
        continue;
      }
      if (value === "]") {
        if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
          push({type: "text", value, output: `\\${value}`});
          continue;
        }
        if (state.brackets === 0) {
          if (opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "["));
          }
          push({type: "text", value, output: `\\${value}`});
          continue;
        }
        decrement("brackets");
        const prevValue = prev.value.slice(1);
        if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
          value = `/${value}`;
        }
        prev.value += value;
        append({value});
        if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
          continue;
        }
        const escaped = utils.escapeRegex(prev.value);
        state.output = state.output.slice(0, -prev.value.length);
        if (opts.literalBrackets === true) {
          state.output += escaped;
          prev.value = escaped;
          continue;
        }
        prev.value = `(${capture}${escaped}|${prev.value})`;
        state.output += prev.value;
        continue;
      }
      if (value === "{" && opts.nobrace !== true) {
        increment("braces");
        const open = {
          type: "brace",
          value,
          output: "(",
          outputIndex: state.output.length,
          tokensIndex: state.tokens.length
        };
        braces.push(open);
        push(open);
        continue;
      }
      if (value === "}") {
        const brace = braces[braces.length - 1];
        if (opts.nobrace === true || !brace) {
          push({type: "text", value, output: value});
          continue;
        }
        let output = ")";
        if (brace.dots === true) {
          const arr = tokens.slice();
          const range = [];
          for (let i = arr.length - 1; i >= 0; i--) {
            tokens.pop();
            if (arr[i].type === "brace") {
              break;
            }
            if (arr[i].type !== "dots") {
              range.unshift(arr[i].value);
            }
          }
          output = expandRange(range, opts);
          state.backtrack = true;
        }
        if (brace.comma !== true && brace.dots !== true) {
          const out = state.output.slice(0, brace.outputIndex);
          const toks = state.tokens.slice(brace.tokensIndex);
          brace.value = brace.output = "\\{";
          value = output = "\\}";
          state.output = out;
          for (const t of toks) {
            state.output += t.output || t.value;
          }
        }
        push({type: "brace", value, output});
        decrement("braces");
        braces.pop();
        continue;
      }
      if (value === "|") {
        if (extglobs.length > 0) {
          extglobs[extglobs.length - 1].conditions++;
        }
        push({type: "text", value});
        continue;
      }
      if (value === ",") {
        let output = value;
        const brace = braces[braces.length - 1];
        if (brace && stack[stack.length - 1] === "braces") {
          brace.comma = true;
          output = "|";
        }
        push({type: "comma", value, output});
        continue;
      }
      if (value === "/") {
        if (prev.type === "dot" && state.index === state.start + 1) {
          state.start = state.index + 1;
          state.consumed = "";
          state.output = "";
          tokens.pop();
          prev = bos;
          continue;
        }
        push({type: "slash", value, output: SLASH_LITERAL});
        continue;
      }
      if (value === ".") {
        if (state.braces > 0 && prev.type === "dot") {
          if (prev.value === ".")
            prev.output = DOT_LITERAL;
          const brace = braces[braces.length - 1];
          prev.type = "dots";
          prev.output += value;
          prev.value += value;
          brace.dots = true;
          continue;
        }
        if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
          push({type: "text", value, output: DOT_LITERAL});
          continue;
        }
        push({type: "dot", value, output: DOT_LITERAL});
        continue;
      }
      if (value === "?") {
        const isGroup = prev && prev.value === "(";
        if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("qmark", value);
          continue;
        }
        if (prev && prev.type === "paren") {
          const next = peek();
          let output = value;
          if (next === "<" && !utils.supportsLookbehinds()) {
            throw new Error("Node.js v10 or higher is required for regex lookbehinds");
          }
          if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
            output = `\\${value}`;
          }
          push({type: "text", value, output});
          continue;
        }
        if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
          push({type: "qmark", value, output: QMARK_NO_DOT});
          continue;
        }
        push({type: "qmark", value, output: QMARK});
        continue;
      }
      if (value === "!") {
        if (opts.noextglob !== true && peek() === "(") {
          if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
            extglobOpen("negate", value);
            continue;
          }
        }
        if (opts.nonegate !== true && state.index === 0) {
          negate();
          continue;
        }
      }
      if (value === "+") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("plus", value);
          continue;
        }
        if (prev && prev.value === "(" || opts.regex === false) {
          push({type: "plus", value, output: PLUS_LITERAL});
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
          push({type: "plus", value});
          continue;
        }
        push({type: "plus", value: PLUS_LITERAL});
        continue;
      }
      if (value === "@") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          push({type: "at", extglob: true, value, output: ""});
          continue;
        }
        push({type: "text", value});
        continue;
      }
      if (value !== "*") {
        if (value === "$" || value === "^") {
          value = `\\${value}`;
        }
        const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
        if (match) {
          value += match[0];
          state.index += match[0].length;
        }
        push({type: "text", value});
        continue;
      }
      if (prev && (prev.type === "globstar" || prev.star === true)) {
        prev.type = "star";
        prev.star = true;
        prev.value += value;
        prev.output = star;
        state.backtrack = true;
        state.globstar = true;
        consume(value);
        continue;
      }
      let rest2 = remaining();
      if (opts.noextglob !== true && /^\([^?]/.test(rest2)) {
        extglobOpen("star", value);
        continue;
      }
      if (prev.type === "star") {
        if (opts.noglobstar === true) {
          consume(value);
          continue;
        }
        const prior = prev.prev;
        const before = prior.prev;
        const isStart = prior.type === "slash" || prior.type === "bos";
        const afterStar = before && (before.type === "star" || before.type === "globstar");
        if (opts.bash === true && (!isStart || rest2[0] && rest2[0] !== "/")) {
          push({type: "star", value, output: ""});
          continue;
        }
        const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
        const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
        if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
          push({type: "star", value, output: ""});
          continue;
        }
        while (rest2.slice(0, 3) === "/**") {
          const after = input[state.index + 4];
          if (after && after !== "/") {
            break;
          }
          rest2 = rest2.slice(3);
          consume("/**", 3);
        }
        if (prior.type === "bos" && eos()) {
          prev.type = "globstar";
          prev.value += value;
          prev.output = globstar(opts);
          state.output = prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = `(?:${prior.output}`;
          prev.type = "globstar";
          prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
          prev.value += value;
          state.globstar = true;
          state.output += prior.output + prev.output;
          consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && rest2[0] === "/") {
          const end = rest2[1] !== void 0 ? "|$" : "";
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = `(?:${prior.output}`;
          prev.type = "globstar";
          prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
          prev.value += value;
          state.output += prior.output + prev.output;
          state.globstar = true;
          consume(value + advance());
          push({type: "slash", value: "/", output: ""});
          continue;
        }
        if (prior.type === "bos" && rest2[0] === "/") {
          prev.type = "globstar";
          prev.value += value;
          prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
          state.output = prev.output;
          state.globstar = true;
          consume(value + advance());
          push({type: "slash", value: "/", output: ""});
          continue;
        }
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = "globstar";
        prev.output = globstar(opts);
        prev.value += value;
        state.output += prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }
      const token = {type: "star", value, output: star};
      if (opts.bash === true) {
        token.output = ".*?";
        if (prev.type === "bos" || prev.type === "slash") {
          token.output = nodot + token.output;
        }
        push(token);
        continue;
      }
      if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
        token.output = value;
        push(token);
        continue;
      }
      if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
        if (prev.type === "dot") {
          state.output += NO_DOT_SLASH;
          prev.output += NO_DOT_SLASH;
        } else if (opts.dot === true) {
          state.output += NO_DOTS_SLASH;
          prev.output += NO_DOTS_SLASH;
        } else {
          state.output += nodot;
          prev.output += nodot;
        }
        if (peek() !== "*") {
          state.output += ONE_CHAR;
          prev.output += ONE_CHAR;
        }
      }
      push(token);
    }
    while (state.brackets > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", "]"));
      state.output = utils.escapeLast(state.output, "[");
      decrement("brackets");
    }
    while (state.parens > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", ")"));
      state.output = utils.escapeLast(state.output, "(");
      decrement("parens");
    }
    while (state.braces > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", "}"));
      state.output = utils.escapeLast(state.output, "{");
      decrement("braces");
    }
    if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
      push({type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?`});
    }
    if (state.backtrack === true) {
      state.output = "";
      for (const token of state.tokens) {
        state.output += token.output != null ? token.output : token.value;
        if (token.suffix) {
          state.output += token.suffix;
        }
      }
    }
    return state;
  };
  parse.fastpaths = (input, options) => {
    const opts = {...options};
    const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    const len = input.length;
    if (len > max) {
      throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    }
    input = REPLACEMENTS[input] || input;
    const win32 = utils.isWindows(options);
    const {
      DOT_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOTS_SLASH,
      STAR,
      START_ANCHOR
    } = constants7.globChars(win32);
    const nodot = opts.dot ? NO_DOTS : NO_DOT;
    const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
    const capture = opts.capture ? "" : "?:";
    const state = {negated: false, prefix: ""};
    let star = opts.bash === true ? ".*?" : STAR;
    if (opts.capture) {
      star = `(${star})`;
    }
    const globstar = (opts2) => {
      if (opts2.noglobstar === true)
        return star;
      return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const create = (str2) => {
      switch (str2) {
        case "*":
          return `${nodot}${ONE_CHAR}${star}`;
        case ".*":
          return `${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*.*":
          return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*/*":
          return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
        case "**":
          return nodot + globstar(opts);
        case "**/*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
        case "**/*.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "**/.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
        default: {
          const match = /^(.*?)\.(\w+)$/.exec(str2);
          if (!match)
            return;
          const source2 = create(match[1]);
          if (!source2)
            return;
          return source2 + DOT_LITERAL + match[2];
        }
      }
    };
    const output = utils.removePrefix(input, state);
    let source = create(output);
    if (source && opts.strictSlashes !== true) {
      source += `${SLASH_LITERAL}?`;
    }
    return source;
  };
  module2.exports = parse;
});

// node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS((exports, module2) => {
  "use strict";
  const path3 = require("path");
  const scan = require_scan();
  const parse = require_parse2();
  const utils = require_utils3();
  const constants7 = require_constants2();
  const isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
  const picomatch = (glob, options, returnState = false) => {
    if (Array.isArray(glob)) {
      const fns = glob.map((input) => picomatch(input, options, returnState));
      const arrayMatcher = (str2) => {
        for (const isMatch2 of fns) {
          const state2 = isMatch2(str2);
          if (state2)
            return state2;
        }
        return false;
      };
      return arrayMatcher;
    }
    const isState = isObject(glob) && glob.tokens && glob.input;
    if (glob === "" || typeof glob !== "string" && !isState) {
      throw new TypeError("Expected pattern to be a non-empty string");
    }
    const opts = options || {};
    const posix = utils.isWindows(options);
    const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
    const state = regex.state;
    delete regex.state;
    let isIgnored = () => false;
    if (opts.ignore) {
      const ignoreOpts = {...options, ignore: null, onMatch: null, onResult: null};
      isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
    }
    const matcher = (input, returnObject = false) => {
      const {isMatch: isMatch2, match, output} = picomatch.test(input, regex, options, {glob, posix});
      const result = {glob, state, regex, posix, input, output, match, isMatch: isMatch2};
      if (typeof opts.onResult === "function") {
        opts.onResult(result);
      }
      if (isMatch2 === false) {
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (isIgnored(input)) {
        if (typeof opts.onIgnore === "function") {
          opts.onIgnore(result);
        }
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (typeof opts.onMatch === "function") {
        opts.onMatch(result);
      }
      return returnObject ? result : true;
    };
    if (returnState) {
      matcher.state = state;
    }
    return matcher;
  };
  picomatch.test = (input, regex, options, {glob, posix} = {}) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected input to be a string");
    }
    if (input === "") {
      return {isMatch: false, output: ""};
    }
    const opts = options || {};
    const format = opts.format || (posix ? utils.toPosixSlashes : null);
    let match = input === glob;
    let output = match && format ? format(input) : input;
    if (match === false) {
      output = format ? format(input) : input;
      match = output === glob;
    }
    if (match === false || opts.capture === true) {
      if (opts.matchBase === true || opts.basename === true) {
        match = picomatch.matchBase(input, regex, options, posix);
      } else {
        match = regex.exec(output);
      }
    }
    return {isMatch: Boolean(match), match, output};
  };
  picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
    const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
    return regex.test(path3.basename(input));
  };
  picomatch.isMatch = (str2, patterns, options) => picomatch(patterns, options)(str2);
  picomatch.parse = (pattern, options) => {
    if (Array.isArray(pattern))
      return pattern.map((p) => picomatch.parse(p, options));
    return parse(pattern, {...options, fastpaths: false});
  };
  picomatch.scan = (input, options) => scan(input, options);
  picomatch.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
    if (returnOutput === true) {
      return parsed.output;
    }
    const opts = options || {};
    const prepend = opts.contains ? "" : "^";
    const append = opts.contains ? "" : "$";
    let source = `${prepend}(?:${parsed.output})${append}`;
    if (parsed && parsed.negated === true) {
      source = `^(?!${source}).*$`;
    }
    const regex = picomatch.toRegex(source, options);
    if (returnState === true) {
      regex.state = parsed;
    }
    return regex;
  };
  picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
    if (!input || typeof input !== "string") {
      throw new TypeError("Expected a non-empty string");
    }
    const opts = options || {};
    let parsed = {negated: false, fastpaths: true};
    let prefix = "";
    let output;
    if (input.startsWith("./")) {
      input = input.slice(2);
      prefix = parsed.prefix = "./";
    }
    if (opts.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
      output = parse.fastpaths(input, options);
    }
    if (output === void 0) {
      parsed = parse(input, options);
      parsed.prefix = prefix + (parsed.prefix || "");
    } else {
      parsed.output = output;
    }
    return picomatch.compileRe(parsed, options, returnOutput, returnState);
  };
  picomatch.toRegex = (source, options) => {
    try {
      const opts = options || {};
      return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
    } catch (err) {
      if (options && options.debug === true)
        throw err;
      return /$^/;
    }
  };
  picomatch.constants = constants7;
  module2.exports = picomatch;
});

// node_modules/picomatch/index.js
var require_picomatch2 = __commonJS((exports, module2) => {
  "use strict";
  module2.exports = require_picomatch();
});

// node_modules/micromatch/index.js
var require_micromatch = __commonJS((exports, module2) => {
  "use strict";
  const util = require("util");
  const braces = require_braces();
  const picomatch = require_picomatch2();
  const utils = require_utils3();
  const isEmptyString = (val) => typeof val === "string" && (val === "" || val === "./");
  const micromatch = (list, patterns, options) => {
    patterns = [].concat(patterns);
    list = [].concat(list);
    let omit = new Set();
    let keep = new Set();
    let items = new Set();
    let negatives = 0;
    let onResult = (state) => {
      items.add(state.output);
      if (options && options.onResult) {
        options.onResult(state);
      }
    };
    for (let i = 0; i < patterns.length; i++) {
      let isMatch2 = picomatch(String(patterns[i]), {...options, onResult}, true);
      let negated = isMatch2.state.negated || isMatch2.state.negatedExtglob;
      if (negated)
        negatives++;
      for (let item of list) {
        let matched = isMatch2(item, true);
        let match = negated ? !matched.isMatch : matched.isMatch;
        if (!match)
          continue;
        if (negated) {
          omit.add(matched.output);
        } else {
          omit.delete(matched.output);
          keep.add(matched.output);
        }
      }
    }
    let result = negatives === patterns.length ? [...items] : [...keep];
    let matches = result.filter((item) => !omit.has(item));
    if (options && matches.length === 0) {
      if (options.failglob === true) {
        throw new Error(`No matches found for "${patterns.join(", ")}"`);
      }
      if (options.nonull === true || options.nullglob === true) {
        return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
      }
    }
    return matches;
  };
  micromatch.match = micromatch;
  micromatch.matcher = (pattern, options) => picomatch(pattern, options);
  micromatch.isMatch = (str2, patterns, options) => picomatch(patterns, options)(str2);
  micromatch.any = micromatch.isMatch;
  micromatch.not = (list, patterns, options = {}) => {
    patterns = [].concat(patterns).map(String);
    let result = new Set();
    let items = [];
    let onResult = (state) => {
      if (options.onResult)
        options.onResult(state);
      items.push(state.output);
    };
    let matches = micromatch(list, patterns, {...options, onResult});
    for (let item of items) {
      if (!matches.includes(item)) {
        result.add(item);
      }
    }
    return [...result];
  };
  micromatch.contains = (str2, pattern, options) => {
    if (typeof str2 !== "string") {
      throw new TypeError(`Expected a string: "${util.inspect(str2)}"`);
    }
    if (Array.isArray(pattern)) {
      return pattern.some((p) => micromatch.contains(str2, p, options));
    }
    if (typeof pattern === "string") {
      if (isEmptyString(str2) || isEmptyString(pattern)) {
        return false;
      }
      if (str2.includes(pattern) || str2.startsWith("./") && str2.slice(2).includes(pattern)) {
        return true;
      }
    }
    return micromatch.isMatch(str2, pattern, {...options, contains: true});
  };
  micromatch.matchKeys = (obj, patterns, options) => {
    if (!utils.isObject(obj)) {
      throw new TypeError("Expected the first argument to be an object");
    }
    let keys = micromatch(Object.keys(obj), patterns, options);
    let res = {};
    for (let key of keys)
      res[key] = obj[key];
    return res;
  };
  micromatch.some = (list, patterns, options) => {
    let items = [].concat(list);
    for (let pattern of [].concat(patterns)) {
      let isMatch2 = picomatch(String(pattern), options);
      if (items.some((item) => isMatch2(item))) {
        return true;
      }
    }
    return false;
  };
  micromatch.every = (list, patterns, options) => {
    let items = [].concat(list);
    for (let pattern of [].concat(patterns)) {
      let isMatch2 = picomatch(String(pattern), options);
      if (!items.every((item) => isMatch2(item))) {
        return false;
      }
    }
    return true;
  };
  micromatch.all = (str2, patterns, options) => {
    if (typeof str2 !== "string") {
      throw new TypeError(`Expected a string: "${util.inspect(str2)}"`);
    }
    return [].concat(patterns).every((p) => picomatch(p, options)(str2));
  };
  micromatch.capture = (glob, input, options) => {
    let posix = utils.isWindows(options);
    let regex = picomatch.makeRe(String(glob), {...options, capture: true});
    let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);
    if (match) {
      return match.slice(1).map((v) => v === void 0 ? "" : v);
    }
  };
  micromatch.makeRe = (...args) => picomatch.makeRe(...args);
  micromatch.scan = (...args) => picomatch.scan(...args);
  micromatch.parse = (patterns, options) => {
    let res = [];
    for (let pattern of [].concat(patterns || [])) {
      for (let str2 of braces(String(pattern), options)) {
        res.push(picomatch.parse(str2, options));
      }
    }
    return res;
  };
  micromatch.braces = (pattern, options) => {
    if (typeof pattern !== "string")
      throw new TypeError("Expected a string");
    if (options && options.nobrace === true || !/\{.*\}/.test(pattern)) {
      return [pattern];
    }
    return braces(pattern, options);
  };
  micromatch.braceExpand = (pattern, options) => {
    if (typeof pattern !== "string")
      throw new TypeError("Expected a string");
    return micromatch.braces(pattern, {...options, expand: true});
  };
  module2.exports = micromatch;
});

// node_modules/fast-glob/out/utils/pattern.js
var require_pattern = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.matchAny = exports.convertPatternsToRe = exports.makeRe = exports.getPatternParts = exports.expandBraceExpansion = exports.expandPatternsWithBraceExpansion = exports.isAffectDepthOfReadingPattern = exports.endsWithSlashGlobStar = exports.hasGlobStar = exports.getBaseDirectory = exports.getPositivePatterns = exports.getNegativePatterns = exports.isPositivePattern = exports.isNegativePattern = exports.convertToNegativePattern = exports.convertToPositivePattern = exports.isDynamicPattern = exports.isStaticPattern = void 0;
  const path3 = require("path");
  const globParent = require_glob_parent();
  const micromatch = require_micromatch();
  const picomatch = require_picomatch2();
  const GLOBSTAR = "**";
  const ESCAPE_SYMBOL = "\\";
  const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
  const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[.*]/;
  const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\(.*\|.*\)/;
  const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\(.*\)/;
  const BRACE_EXPANSIONS_SYMBOLS_RE = /{.*(?:,|\.\.).*}/;
  function isStaticPattern(pattern, options = {}) {
    return !isDynamicPattern(pattern, options);
  }
  exports.isStaticPattern = isStaticPattern;
  function isDynamicPattern(pattern, options = {}) {
    if (pattern === "") {
      return false;
    }
    if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
      return true;
    }
    if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
      return true;
    }
    if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
      return true;
    }
    if (options.braceExpansion !== false && BRACE_EXPANSIONS_SYMBOLS_RE.test(pattern)) {
      return true;
    }
    return false;
  }
  exports.isDynamicPattern = isDynamicPattern;
  function convertToPositivePattern(pattern) {
    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
  }
  exports.convertToPositivePattern = convertToPositivePattern;
  function convertToNegativePattern(pattern) {
    return "!" + pattern;
  }
  exports.convertToNegativePattern = convertToNegativePattern;
  function isNegativePattern(pattern) {
    return pattern.startsWith("!") && pattern[1] !== "(";
  }
  exports.isNegativePattern = isNegativePattern;
  function isPositivePattern(pattern) {
    return !isNegativePattern(pattern);
  }
  exports.isPositivePattern = isPositivePattern;
  function getNegativePatterns(patterns) {
    return patterns.filter(isNegativePattern);
  }
  exports.getNegativePatterns = getNegativePatterns;
  function getPositivePatterns(patterns) {
    return patterns.filter(isPositivePattern);
  }
  exports.getPositivePatterns = getPositivePatterns;
  function getBaseDirectory(pattern) {
    return globParent(pattern, {flipBackslashes: false});
  }
  exports.getBaseDirectory = getBaseDirectory;
  function hasGlobStar(pattern) {
    return pattern.includes(GLOBSTAR);
  }
  exports.hasGlobStar = hasGlobStar;
  function endsWithSlashGlobStar(pattern) {
    return pattern.endsWith("/" + GLOBSTAR);
  }
  exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
  function isAffectDepthOfReadingPattern(pattern) {
    const basename2 = path3.basename(pattern);
    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename2);
  }
  exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
  function expandPatternsWithBraceExpansion(patterns) {
    return patterns.reduce((collection, pattern) => {
      return collection.concat(expandBraceExpansion(pattern));
    }, []);
  }
  exports.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
  function expandBraceExpansion(pattern) {
    return micromatch.braces(pattern, {
      expand: true,
      nodupes: true
    });
  }
  exports.expandBraceExpansion = expandBraceExpansion;
  function getPatternParts(pattern, options) {
    let {parts} = picomatch.scan(pattern, Object.assign(Object.assign({}, options), {parts: true}));
    if (parts.length === 0) {
      parts = [pattern];
    }
    if (parts[0].startsWith("/")) {
      parts[0] = parts[0].slice(1);
      parts.unshift("");
    }
    return parts;
  }
  exports.getPatternParts = getPatternParts;
  function makeRe(pattern, options) {
    return micromatch.makeRe(pattern, options);
  }
  exports.makeRe = makeRe;
  function convertPatternsToRe(patterns, options) {
    return patterns.map((pattern) => makeRe(pattern, options));
  }
  exports.convertPatternsToRe = convertPatternsToRe;
  function matchAny(entry, patternsRe) {
    return patternsRe.some((patternRe) => patternRe.test(entry));
  }
  exports.matchAny = matchAny;
});

// node_modules/merge2/index.js
var require_merge2 = __commonJS((exports, module2) => {
  "use strict";
  const Stream = require("stream");
  const PassThrough = Stream.PassThrough;
  const slice = Array.prototype.slice;
  module2.exports = merge2;
  function merge2() {
    const streamsQueue = [];
    const args = slice.call(arguments);
    let merging = false;
    let options = args[args.length - 1];
    if (options && !Array.isArray(options) && options.pipe == null) {
      args.pop();
    } else {
      options = {};
    }
    const doEnd = options.end !== false;
    const doPipeError = options.pipeError === true;
    if (options.objectMode == null) {
      options.objectMode = true;
    }
    if (options.highWaterMark == null) {
      options.highWaterMark = 64 * 1024;
    }
    const mergedStream = PassThrough(options);
    function addStream() {
      for (let i = 0, len = arguments.length; i < len; i++) {
        streamsQueue.push(pauseStreams(arguments[i], options));
      }
      mergeStream();
      return this;
    }
    function mergeStream() {
      if (merging) {
        return;
      }
      merging = true;
      let streams = streamsQueue.shift();
      if (!streams) {
        process.nextTick(endStream);
        return;
      }
      if (!Array.isArray(streams)) {
        streams = [streams];
      }
      let pipesCount = streams.length + 1;
      function next() {
        if (--pipesCount > 0) {
          return;
        }
        merging = false;
        mergeStream();
      }
      function pipe(stream) {
        function onend() {
          stream.removeListener("merge2UnpipeEnd", onend);
          stream.removeListener("end", onend);
          if (doPipeError) {
            stream.removeListener("error", onerror);
          }
          next();
        }
        function onerror(err) {
          mergedStream.emit("error", err);
        }
        if (stream._readableState.endEmitted) {
          return next();
        }
        stream.on("merge2UnpipeEnd", onend);
        stream.on("end", onend);
        if (doPipeError) {
          stream.on("error", onerror);
        }
        stream.pipe(mergedStream, {end: false});
        stream.resume();
      }
      for (let i = 0; i < streams.length; i++) {
        pipe(streams[i]);
      }
      next();
    }
    function endStream() {
      merging = false;
      mergedStream.emit("queueDrain");
      if (doEnd) {
        mergedStream.end();
      }
    }
    mergedStream.setMaxListeners(0);
    mergedStream.add = addStream;
    mergedStream.on("unpipe", function(stream) {
      stream.emit("merge2UnpipeEnd");
    });
    if (args.length) {
      addStream.apply(null, args);
    }
    return mergedStream;
  }
  function pauseStreams(streams, options) {
    if (!Array.isArray(streams)) {
      if (!streams._readableState && streams.pipe) {
        streams = streams.pipe(PassThrough(options));
      }
      if (!streams._readableState || !streams.pause || !streams.pipe) {
        throw new Error("Only readable stream can be merged.");
      }
      streams.pause();
    } else {
      for (let i = 0, len = streams.length; i < len; i++) {
        streams[i] = pauseStreams(streams[i], options);
      }
    }
    return streams;
  }
});

// node_modules/fast-glob/out/utils/stream.js
var require_stream = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.merge = void 0;
  const merge2 = require_merge2();
  function merge(streams) {
    const mergedStream = merge2(streams);
    streams.forEach((stream) => {
      stream.once("error", (error) => mergedStream.emit("error", error));
    });
    mergedStream.once("close", () => propagateCloseEventToSources(streams));
    mergedStream.once("end", () => propagateCloseEventToSources(streams));
    return mergedStream;
  }
  exports.merge = merge;
  function propagateCloseEventToSources(streams) {
    streams.forEach((stream) => stream.emit("close"));
  }
});

// node_modules/fast-glob/out/utils/string.js
var require_string = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.isEmpty = exports.isString = void 0;
  function isString(input) {
    return typeof input === "string";
  }
  exports.isString = isString;
  function isEmpty(input) {
    return input === "";
  }
  exports.isEmpty = isEmpty;
});

// node_modules/fast-glob/out/utils/index.js
var require_utils4 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.string = exports.stream = exports.pattern = exports.path = exports.fs = exports.errno = exports.array = void 0;
  const array = require_array();
  exports.array = array;
  const errno = require_errno();
  exports.errno = errno;
  const fs2 = require_fs();
  exports.fs = fs2;
  const path3 = require_path();
  exports.path = path3;
  const pattern = require_pattern();
  exports.pattern = pattern;
  const stream = require_stream();
  exports.stream = stream;
  const string = require_string();
  exports.string = string;
});

// node_modules/fast-glob/out/managers/tasks.js
var require_tasks = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.convertPatternGroupToTask = exports.convertPatternGroupsToTasks = exports.groupPatternsByBaseDirectory = exports.getNegativePatternsAsPositive = exports.getPositivePatterns = exports.convertPatternsToTasks = exports.generate = void 0;
  const utils = require_utils4();
  function generate(patterns, settings) {
    const positivePatterns = getPositivePatterns(patterns);
    const negativePatterns = getNegativePatternsAsPositive(patterns, settings.ignore);
    const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
    const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
    const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, false);
    const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, true);
    return staticTasks.concat(dynamicTasks);
  }
  exports.generate = generate;
  function convertPatternsToTasks(positive, negative, dynamic) {
    const positivePatternsGroup = groupPatternsByBaseDirectory(positive);
    if ("." in positivePatternsGroup) {
      const task = convertPatternGroupToTask(".", positive, negative, dynamic);
      return [task];
    }
    return convertPatternGroupsToTasks(positivePatternsGroup, negative, dynamic);
  }
  exports.convertPatternsToTasks = convertPatternsToTasks;
  function getPositivePatterns(patterns) {
    return utils.pattern.getPositivePatterns(patterns);
  }
  exports.getPositivePatterns = getPositivePatterns;
  function getNegativePatternsAsPositive(patterns, ignore) {
    const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
    const positive = negative.map(utils.pattern.convertToPositivePattern);
    return positive;
  }
  exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
  function groupPatternsByBaseDirectory(patterns) {
    const group = {};
    return patterns.reduce((collection, pattern) => {
      const base = utils.pattern.getBaseDirectory(pattern);
      if (base in collection) {
        collection[base].push(pattern);
      } else {
        collection[base] = [pattern];
      }
      return collection;
    }, group);
  }
  exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
  function convertPatternGroupsToTasks(positive, negative, dynamic) {
    return Object.keys(positive).map((base) => {
      return convertPatternGroupToTask(base, positive[base], negative, dynamic);
    });
  }
  exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
  function convertPatternGroupToTask(base, positive, negative, dynamic) {
    return {
      dynamic,
      positive,
      negative,
      base,
      patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
    };
  }
  exports.convertPatternGroupToTask = convertPatternGroupToTask;
});

// node_modules/@nodelib/fs.stat/out/providers/async.js
var require_async = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function read(path3, settings, callback) {
    settings.fs.lstat(path3, (lstatError, lstat) => {
      if (lstatError !== null) {
        return callFailureCallback(callback, lstatError);
      }
      if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return callSuccessCallback(callback, lstat);
      }
      settings.fs.stat(path3, (statError, stat) => {
        if (statError !== null) {
          if (settings.throwErrorOnBrokenSymbolicLink) {
            return callFailureCallback(callback, statError);
          }
          return callSuccessCallback(callback, lstat);
        }
        if (settings.markSymbolicLink) {
          stat.isSymbolicLink = () => true;
        }
        callSuccessCallback(callback, stat);
      });
    });
  }
  exports.read = read;
  function callFailureCallback(callback, error) {
    callback(error);
  }
  function callSuccessCallback(callback, result) {
    callback(null, result);
  }
});

// node_modules/@nodelib/fs.stat/out/providers/sync.js
var require_sync = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function read(path3, settings) {
    const lstat = settings.fs.lstatSync(path3);
    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
      return lstat;
    }
    try {
      const stat = settings.fs.statSync(path3);
      if (settings.markSymbolicLink) {
        stat.isSymbolicLink = () => true;
      }
      return stat;
    } catch (error) {
      if (!settings.throwErrorOnBrokenSymbolicLink) {
        return lstat;
      }
      throw error;
    }
  }
  exports.read = read;
});

// node_modules/@nodelib/fs.stat/out/adapters/fs.js
var require_fs2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const fs2 = require("fs");
  exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs2.lstat,
    stat: fs2.stat,
    lstatSync: fs2.lstatSync,
    statSync: fs2.statSync
  };
  function createFileSystemAdapter(fsMethods) {
    if (fsMethods === void 0) {
      return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
  }
  exports.createFileSystemAdapter = createFileSystemAdapter;
});

// node_modules/@nodelib/fs.stat/out/settings.js
var require_settings = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const fs2 = require_fs2();
  class Settings {
    constructor(_options = {}) {
      this._options = _options;
      this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
      this.fs = fs2.createFileSystemAdapter(this._options.fs);
      this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
      this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
    }
    _getValue(option, value) {
      return option === void 0 ? value : option;
    }
  }
  exports.default = Settings;
});

// node_modules/@nodelib/fs.stat/out/index.js
var require_out = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const async = require_async();
  const sync2 = require_sync();
  const settings_1 = require_settings();
  exports.Settings = settings_1.default;
  function stat(path3, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === "function") {
      return async.read(path3, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path3, getSettings(optionsOrSettingsOrCallback), callback);
  }
  exports.stat = stat;
  function statSync(path3, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync2.read(path3, settings);
  }
  exports.statSync = statSync;
  function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
      return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
  }
});

// node_modules/run-parallel/index.js
var require_run_parallel = __commonJS((exports, module2) => {
  module2.exports = runParallel;
  function runParallel(tasks, cb) {
    var results, pending, keys;
    var isSync = true;
    if (Array.isArray(tasks)) {
      results = [];
      pending = tasks.length;
    } else {
      keys = Object.keys(tasks);
      results = {};
      pending = keys.length;
    }
    function done(err) {
      function end() {
        if (cb)
          cb(err, results);
        cb = null;
      }
      if (isSync)
        process.nextTick(end);
      else
        end();
    }
    function each(i, err, result) {
      results[i] = result;
      if (--pending === 0 || err) {
        done(err);
      }
    }
    if (!pending) {
      done(null);
    } else if (keys) {
      keys.forEach(function(key) {
        tasks[key](function(err, result) {
          each(key, err, result);
        });
      });
    } else {
      tasks.forEach(function(task, i) {
        task(function(err, result) {
          each(i, err, result);
        });
      });
    }
    isSync = false;
  }
});

// node_modules/@nodelib/fs.scandir/out/constants.js
var require_constants3 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
  const MAJOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
  const MINOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
  const SUPPORTED_MAJOR_VERSION = 10;
  const SUPPORTED_MINOR_VERSION = 10;
  const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
  const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
  exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
});

// node_modules/@nodelib/fs.scandir/out/utils/fs.js
var require_fs3 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  class DirentFromStats {
    constructor(name, stats) {
      this.name = name;
      this.isBlockDevice = stats.isBlockDevice.bind(stats);
      this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
      this.isDirectory = stats.isDirectory.bind(stats);
      this.isFIFO = stats.isFIFO.bind(stats);
      this.isFile = stats.isFile.bind(stats);
      this.isSocket = stats.isSocket.bind(stats);
      this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
  }
  function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
  }
  exports.createDirentFromStats = createDirentFromStats;
});

// node_modules/@nodelib/fs.scandir/out/utils/index.js
var require_utils5 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const fs2 = require_fs3();
  exports.fs = fs2;
});

// node_modules/@nodelib/fs.scandir/out/providers/async.js
var require_async2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const fsStat = require_out();
  const rpl = require_run_parallel();
  const constants_1 = require_constants3();
  const utils = require_utils5();
  function read(directory, settings, callback) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
      return readdirWithFileTypes(directory, settings, callback);
    }
    return readdir(directory, settings, callback);
  }
  exports.read = read;
  function readdirWithFileTypes(directory, settings, callback) {
    settings.fs.readdir(directory, {withFileTypes: true}, (readdirError, dirents) => {
      if (readdirError !== null) {
        return callFailureCallback(callback, readdirError);
      }
      const entries = dirents.map((dirent) => ({
        dirent,
        name: dirent.name,
        path: `${directory}${settings.pathSegmentSeparator}${dirent.name}`
      }));
      if (!settings.followSymbolicLinks) {
        return callSuccessCallback(callback, entries);
      }
      const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
      rpl(tasks, (rplError, rplEntries) => {
        if (rplError !== null) {
          return callFailureCallback(callback, rplError);
        }
        callSuccessCallback(callback, rplEntries);
      });
    });
  }
  exports.readdirWithFileTypes = readdirWithFileTypes;
  function makeRplTaskEntry(entry, settings) {
    return (done) => {
      if (!entry.dirent.isSymbolicLink()) {
        return done(null, entry);
      }
      settings.fs.stat(entry.path, (statError, stats) => {
        if (statError !== null) {
          if (settings.throwErrorOnBrokenSymbolicLink) {
            return done(statError);
          }
          return done(null, entry);
        }
        entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
        return done(null, entry);
      });
    };
  }
  function readdir(directory, settings, callback) {
    settings.fs.readdir(directory, (readdirError, names) => {
      if (readdirError !== null) {
        return callFailureCallback(callback, readdirError);
      }
      const filepaths = names.map((name) => `${directory}${settings.pathSegmentSeparator}${name}`);
      const tasks = filepaths.map((filepath) => {
        return (done) => fsStat.stat(filepath, settings.fsStatSettings, done);
      });
      rpl(tasks, (rplError, results) => {
        if (rplError !== null) {
          return callFailureCallback(callback, rplError);
        }
        const entries = [];
        names.forEach((name, index) => {
          const stats = results[index];
          const entry = {
            name,
            path: filepaths[index],
            dirent: utils.fs.createDirentFromStats(name, stats)
          };
          if (settings.stats) {
            entry.stats = stats;
          }
          entries.push(entry);
        });
        callSuccessCallback(callback, entries);
      });
    });
  }
  exports.readdir = readdir;
  function callFailureCallback(callback, error) {
    callback(error);
  }
  function callSuccessCallback(callback, result) {
    callback(null, result);
  }
});

// node_modules/@nodelib/fs.scandir/out/providers/sync.js
var require_sync2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const fsStat = require_out();
  const constants_1 = require_constants3();
  const utils = require_utils5();
  function read(directory, settings) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
      return readdirWithFileTypes(directory, settings);
    }
    return readdir(directory, settings);
  }
  exports.read = read;
  function readdirWithFileTypes(directory, settings) {
    const dirents = settings.fs.readdirSync(directory, {withFileTypes: true});
    return dirents.map((dirent) => {
      const entry = {
        dirent,
        name: dirent.name,
        path: `${directory}${settings.pathSegmentSeparator}${dirent.name}`
      };
      if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
        try {
          const stats = settings.fs.statSync(entry.path);
          entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
        } catch (error) {
          if (settings.throwErrorOnBrokenSymbolicLink) {
            throw error;
          }
        }
      }
      return entry;
    });
  }
  exports.readdirWithFileTypes = readdirWithFileTypes;
  function readdir(directory, settings) {
    const names = settings.fs.readdirSync(directory);
    return names.map((name) => {
      const entryPath = `${directory}${settings.pathSegmentSeparator}${name}`;
      const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
      const entry = {
        name,
        path: entryPath,
        dirent: utils.fs.createDirentFromStats(name, stats)
      };
      if (settings.stats) {
        entry.stats = stats;
      }
      return entry;
    });
  }
  exports.readdir = readdir;
});

// node_modules/@nodelib/fs.scandir/out/adapters/fs.js
var require_fs4 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const fs2 = require("fs");
  exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs2.lstat,
    stat: fs2.stat,
    lstatSync: fs2.lstatSync,
    statSync: fs2.statSync,
    readdir: fs2.readdir,
    readdirSync: fs2.readdirSync
  };
  function createFileSystemAdapter(fsMethods) {
    if (fsMethods === void 0) {
      return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
  }
  exports.createFileSystemAdapter = createFileSystemAdapter;
});

// node_modules/@nodelib/fs.scandir/out/settings.js
var require_settings2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const path3 = require("path");
  const fsStat = require_out();
  const fs2 = require_fs4();
  class Settings {
    constructor(_options = {}) {
      this._options = _options;
      this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
      this.fs = fs2.createFileSystemAdapter(this._options.fs);
      this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path3.sep);
      this.stats = this._getValue(this._options.stats, false);
      this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
      this.fsStatSettings = new fsStat.Settings({
        followSymbolicLink: this.followSymbolicLinks,
        fs: this.fs,
        throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
      });
    }
    _getValue(option, value) {
      return option === void 0 ? value : option;
    }
  }
  exports.default = Settings;
});

// node_modules/@nodelib/fs.scandir/out/index.js
var require_out2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const async = require_async2();
  const sync2 = require_sync2();
  const settings_1 = require_settings2();
  exports.Settings = settings_1.default;
  function scandir(path3, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === "function") {
      return async.read(path3, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path3, getSettings(optionsOrSettingsOrCallback), callback);
  }
  exports.scandir = scandir;
  function scandirSync(path3, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync2.read(path3, settings);
  }
  exports.scandirSync = scandirSync;
  function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
      return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
  }
});

// node_modules/reusify/reusify.js
var require_reusify = __commonJS((exports, module2) => {
  "use strict";
  function reusify(Constructor) {
    var head = new Constructor();
    var tail = head;
    function get() {
      var current = head;
      if (current.next) {
        head = current.next;
      } else {
        head = new Constructor();
        tail = head;
      }
      current.next = null;
      return current;
    }
    function release(obj) {
      tail.next = obj;
      tail = obj;
    }
    return {
      get,
      release
    };
  }
  module2.exports = reusify;
});

// node_modules/fastq/queue.js
var require_queue = __commonJS((exports, module2) => {
  "use strict";
  var reusify = require_reusify();
  function fastqueue(context, worker, concurrency) {
    if (typeof context === "function") {
      concurrency = worker;
      worker = context;
      context = null;
    }
    var cache = reusify(Task);
    var queueHead = null;
    var queueTail = null;
    var _running = 0;
    var self2 = {
      push,
      drain: noop,
      saturated: noop,
      pause,
      paused: false,
      concurrency,
      running,
      resume,
      idle,
      length,
      getQueue,
      unshift,
      empty: noop,
      kill,
      killAndDrain
    };
    return self2;
    function running() {
      return _running;
    }
    function pause() {
      self2.paused = true;
    }
    function length() {
      var current = queueHead;
      var counter = 0;
      while (current) {
        current = current.next;
        counter++;
      }
      return counter;
    }
    function getQueue() {
      var current = queueHead;
      var tasks = [];
      while (current) {
        tasks.push(current.value);
        current = current.next;
      }
      return tasks;
    }
    function resume() {
      if (!self2.paused)
        return;
      self2.paused = false;
      for (var i = 0; i < self2.concurrency; i++) {
        _running++;
        release();
      }
    }
    function idle() {
      return _running === 0 && self2.length() === 0;
    }
    function push(value, done) {
      var current = cache.get();
      current.context = context;
      current.release = release;
      current.value = value;
      current.callback = done || noop;
      if (_running === self2.concurrency || self2.paused) {
        if (queueTail) {
          queueTail.next = current;
          queueTail = current;
        } else {
          queueHead = current;
          queueTail = current;
          self2.saturated();
        }
      } else {
        _running++;
        worker.call(context, current.value, current.worked);
      }
    }
    function unshift(value, done) {
      var current = cache.get();
      current.context = context;
      current.release = release;
      current.value = value;
      current.callback = done || noop;
      if (_running === self2.concurrency || self2.paused) {
        if (queueHead) {
          current.next = queueHead;
          queueHead = current;
        } else {
          queueHead = current;
          queueTail = current;
          self2.saturated();
        }
      } else {
        _running++;
        worker.call(context, current.value, current.worked);
      }
    }
    function release(holder) {
      if (holder) {
        cache.release(holder);
      }
      var next = queueHead;
      if (next) {
        if (!self2.paused) {
          if (queueTail === queueHead) {
            queueTail = null;
          }
          queueHead = next.next;
          next.next = null;
          worker.call(context, next.value, next.worked);
          if (queueTail === null) {
            self2.empty();
          }
        } else {
          _running--;
        }
      } else if (--_running === 0) {
        self2.drain();
      }
    }
    function kill() {
      queueHead = null;
      queueTail = null;
      self2.drain = noop;
    }
    function killAndDrain() {
      queueHead = null;
      queueTail = null;
      self2.drain();
      self2.drain = noop;
    }
  }
  function noop() {
  }
  function Task() {
    this.value = null;
    this.callback = noop;
    this.next = null;
    this.release = noop;
    this.context = null;
    var self2 = this;
    this.worked = function worked(err, result) {
      var callback = self2.callback;
      self2.value = null;
      self2.callback = noop;
      callback.call(self2.context, err, result);
      self2.release(self2);
    };
  }
  module2.exports = fastqueue;
});

// node_modules/@nodelib/fs.walk/out/readers/common.js
var require_common = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function isFatalError(settings, error) {
    if (settings.errorFilter === null) {
      return true;
    }
    return !settings.errorFilter(error);
  }
  exports.isFatalError = isFatalError;
  function isAppliedFilter(filter, value) {
    return filter === null || filter(value);
  }
  exports.isAppliedFilter = isAppliedFilter;
  function replacePathSegmentSeparator(filepath, separator) {
    return filepath.split(/[\\/]/).join(separator);
  }
  exports.replacePathSegmentSeparator = replacePathSegmentSeparator;
  function joinPathSegments(a, b, separator) {
    if (a === "") {
      return b;
    }
    return a + separator + b;
  }
  exports.joinPathSegments = joinPathSegments;
});

// node_modules/@nodelib/fs.walk/out/readers/reader.js
var require_reader = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const common = require_common();
  class Reader {
    constructor(_root, _settings) {
      this._root = _root;
      this._settings = _settings;
      this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
    }
  }
  exports.default = Reader;
});

// node_modules/@nodelib/fs.walk/out/readers/async.js
var require_async3 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const events_1 = require("events");
  const fsScandir = require_out2();
  const fastq = require_queue();
  const common = require_common();
  const reader_1 = require_reader();
  class AsyncReader extends reader_1.default {
    constructor(_root, _settings) {
      super(_root, _settings);
      this._settings = _settings;
      this._scandir = fsScandir.scandir;
      this._emitter = new events_1.EventEmitter();
      this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
      this._isFatalError = false;
      this._isDestroyed = false;
      this._queue.drain = () => {
        if (!this._isFatalError) {
          this._emitter.emit("end");
        }
      };
    }
    read() {
      this._isFatalError = false;
      this._isDestroyed = false;
      setImmediate(() => {
        this._pushToQueue(this._root, this._settings.basePath);
      });
      return this._emitter;
    }
    destroy() {
      if (this._isDestroyed) {
        throw new Error("The reader is already destroyed");
      }
      this._isDestroyed = true;
      this._queue.killAndDrain();
    }
    onEntry(callback) {
      this._emitter.on("entry", callback);
    }
    onError(callback) {
      this._emitter.once("error", callback);
    }
    onEnd(callback) {
      this._emitter.once("end", callback);
    }
    _pushToQueue(directory, base) {
      const queueItem = {directory, base};
      this._queue.push(queueItem, (error) => {
        if (error !== null) {
          this._handleError(error);
        }
      });
    }
    _worker(item, done) {
      this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
        if (error !== null) {
          return done(error, void 0);
        }
        for (const entry of entries) {
          this._handleEntry(entry, item.base);
        }
        done(null, void 0);
      });
    }
    _handleError(error) {
      if (!common.isFatalError(this._settings, error)) {
        return;
      }
      this._isFatalError = true;
      this._isDestroyed = true;
      this._emitter.emit("error", error);
    }
    _handleEntry(entry, base) {
      if (this._isDestroyed || this._isFatalError) {
        return;
      }
      const fullpath = entry.path;
      if (base !== void 0) {
        entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
      }
      if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
        this._emitEntry(entry);
      }
      if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
        this._pushToQueue(fullpath, entry.path);
      }
    }
    _emitEntry(entry) {
      this._emitter.emit("entry", entry);
    }
  }
  exports.default = AsyncReader;
});

// node_modules/@nodelib/fs.walk/out/providers/async.js
var require_async4 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const async_1 = require_async3();
  class AsyncProvider {
    constructor(_root, _settings) {
      this._root = _root;
      this._settings = _settings;
      this._reader = new async_1.default(this._root, this._settings);
      this._storage = new Set();
    }
    read(callback) {
      this._reader.onError((error) => {
        callFailureCallback(callback, error);
      });
      this._reader.onEntry((entry) => {
        this._storage.add(entry);
      });
      this._reader.onEnd(() => {
        callSuccessCallback(callback, [...this._storage]);
      });
      this._reader.read();
    }
  }
  exports.default = AsyncProvider;
  function callFailureCallback(callback, error) {
    callback(error);
  }
  function callSuccessCallback(callback, entries) {
    callback(null, entries);
  }
});

// node_modules/@nodelib/fs.walk/out/providers/stream.js
var require_stream2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const stream_1 = require("stream");
  const async_1 = require_async3();
  class StreamProvider {
    constructor(_root, _settings) {
      this._root = _root;
      this._settings = _settings;
      this._reader = new async_1.default(this._root, this._settings);
      this._stream = new stream_1.Readable({
        objectMode: true,
        read: () => {
        },
        destroy: this._reader.destroy.bind(this._reader)
      });
    }
    read() {
      this._reader.onError((error) => {
        this._stream.emit("error", error);
      });
      this._reader.onEntry((entry) => {
        this._stream.push(entry);
      });
      this._reader.onEnd(() => {
        this._stream.push(null);
      });
      this._reader.read();
      return this._stream;
    }
  }
  exports.default = StreamProvider;
});

// node_modules/@nodelib/fs.walk/out/readers/sync.js
var require_sync3 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const fsScandir = require_out2();
  const common = require_common();
  const reader_1 = require_reader();
  class SyncReader extends reader_1.default {
    constructor() {
      super(...arguments);
      this._scandir = fsScandir.scandirSync;
      this._storage = new Set();
      this._queue = new Set();
    }
    read() {
      this._pushToQueue(this._root, this._settings.basePath);
      this._handleQueue();
      return [...this._storage];
    }
    _pushToQueue(directory, base) {
      this._queue.add({directory, base});
    }
    _handleQueue() {
      for (const item of this._queue.values()) {
        this._handleDirectory(item.directory, item.base);
      }
    }
    _handleDirectory(directory, base) {
      try {
        const entries = this._scandir(directory, this._settings.fsScandirSettings);
        for (const entry of entries) {
          this._handleEntry(entry, base);
        }
      } catch (error) {
        this._handleError(error);
      }
    }
    _handleError(error) {
      if (!common.isFatalError(this._settings, error)) {
        return;
      }
      throw error;
    }
    _handleEntry(entry, base) {
      const fullpath = entry.path;
      if (base !== void 0) {
        entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
      }
      if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
        this._pushToStorage(entry);
      }
      if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
        this._pushToQueue(fullpath, entry.path);
      }
    }
    _pushToStorage(entry) {
      this._storage.add(entry);
    }
  }
  exports.default = SyncReader;
});

// node_modules/@nodelib/fs.walk/out/providers/sync.js
var require_sync4 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const sync_1 = require_sync3();
  class SyncProvider {
    constructor(_root, _settings) {
      this._root = _root;
      this._settings = _settings;
      this._reader = new sync_1.default(this._root, this._settings);
    }
    read() {
      return this._reader.read();
    }
  }
  exports.default = SyncProvider;
});

// node_modules/@nodelib/fs.walk/out/settings.js
var require_settings3 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const path3 = require("path");
  const fsScandir = require_out2();
  class Settings {
    constructor(_options = {}) {
      this._options = _options;
      this.basePath = this._getValue(this._options.basePath, void 0);
      this.concurrency = this._getValue(this._options.concurrency, Infinity);
      this.deepFilter = this._getValue(this._options.deepFilter, null);
      this.entryFilter = this._getValue(this._options.entryFilter, null);
      this.errorFilter = this._getValue(this._options.errorFilter, null);
      this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path3.sep);
      this.fsScandirSettings = new fsScandir.Settings({
        followSymbolicLinks: this._options.followSymbolicLinks,
        fs: this._options.fs,
        pathSegmentSeparator: this._options.pathSegmentSeparator,
        stats: this._options.stats,
        throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
      });
    }
    _getValue(option, value) {
      return option === void 0 ? value : option;
    }
  }
  exports.default = Settings;
});

// node_modules/@nodelib/fs.walk/out/index.js
var require_out3 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const async_1 = require_async4();
  const stream_1 = require_stream2();
  const sync_1 = require_sync4();
  const settings_1 = require_settings3();
  exports.Settings = settings_1.default;
  function walk(directory, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === "function") {
      return new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
    }
    new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
  }
  exports.walk = walk;
  function walkSync(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new sync_1.default(directory, settings);
    return provider.read();
  }
  exports.walkSync = walkSync;
  function walkStream(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new stream_1.default(directory, settings);
    return provider.read();
  }
  exports.walkStream = walkStream;
  function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
      return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
  }
});

// node_modules/fast-glob/out/readers/reader.js
var require_reader2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const path3 = require("path");
  const fsStat = require_out();
  const utils = require_utils4();
  class Reader {
    constructor(_settings) {
      this._settings = _settings;
      this._fsStatSettings = new fsStat.Settings({
        followSymbolicLink: this._settings.followSymbolicLinks,
        fs: this._settings.fs,
        throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
      });
    }
    _getFullEntryPath(filepath) {
      return path3.resolve(this._settings.cwd, filepath);
    }
    _makeEntry(stats, pattern) {
      const entry = {
        name: pattern,
        path: pattern,
        dirent: utils.fs.createDirentFromStats(pattern, stats)
      };
      if (this._settings.stats) {
        entry.stats = stats;
      }
      return entry;
    }
    _isFatalError(error) {
      return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
    }
  }
  exports.default = Reader;
});

// node_modules/fast-glob/out/readers/stream.js
var require_stream3 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const stream_1 = require("stream");
  const fsStat = require_out();
  const fsWalk = require_out3();
  const reader_1 = require_reader2();
  class ReaderStream extends reader_1.default {
    constructor() {
      super(...arguments);
      this._walkStream = fsWalk.walkStream;
      this._stat = fsStat.stat;
    }
    dynamic(root, options) {
      return this._walkStream(root, options);
    }
    static(patterns, options) {
      const filepaths = patterns.map(this._getFullEntryPath, this);
      const stream = new stream_1.PassThrough({objectMode: true});
      stream._write = (index, _enc, done) => {
        return this._getEntry(filepaths[index], patterns[index], options).then((entry) => {
          if (entry !== null && options.entryFilter(entry)) {
            stream.push(entry);
          }
          if (index === filepaths.length - 1) {
            stream.end();
          }
          done();
        }).catch(done);
      };
      for (let i = 0; i < filepaths.length; i++) {
        stream.write(i);
      }
      return stream;
    }
    _getEntry(filepath, pattern, options) {
      return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern)).catch((error) => {
        if (options.errorFilter(error)) {
          return null;
        }
        throw error;
      });
    }
    _getStat(filepath) {
      return new Promise((resolve, reject) => {
        this._stat(filepath, this._fsStatSettings, (error, stats) => {
          return error === null ? resolve(stats) : reject(error);
        });
      });
    }
  }
  exports.default = ReaderStream;
});

// node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const utils = require_utils4();
  class Matcher {
    constructor(_patterns, _settings, _micromatchOptions) {
      this._patterns = _patterns;
      this._settings = _settings;
      this._micromatchOptions = _micromatchOptions;
      this._storage = [];
      this._fillStorage();
    }
    _fillStorage() {
      const patterns = utils.pattern.expandPatternsWithBraceExpansion(this._patterns);
      for (const pattern of patterns) {
        const segments = this._getPatternSegments(pattern);
        const sections = this._splitSegmentsIntoSections(segments);
        this._storage.push({
          complete: sections.length <= 1,
          pattern,
          segments,
          sections
        });
      }
    }
    _getPatternSegments(pattern) {
      const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
      return parts.map((part) => {
        const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
        if (!dynamic) {
          return {
            dynamic: false,
            pattern: part
          };
        }
        return {
          dynamic: true,
          pattern: part,
          patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
        };
      });
    }
    _splitSegmentsIntoSections(segments) {
      return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
    }
  }
  exports.default = Matcher;
});

// node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const matcher_1 = require_matcher();
  class PartialMatcher extends matcher_1.default {
    match(filepath) {
      const parts = filepath.split("/");
      const levels = parts.length;
      const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
      for (const pattern of patterns) {
        const section = pattern.sections[0];
        if (!pattern.complete && levels > section.length) {
          return true;
        }
        const match = parts.every((part, index) => {
          const segment = pattern.segments[index];
          if (segment.dynamic && segment.patternRe.test(part)) {
            return true;
          }
          if (!segment.dynamic && segment.pattern === part) {
            return true;
          }
          return false;
        });
        if (match) {
          return true;
        }
      }
      return false;
    }
  }
  exports.default = PartialMatcher;
});

// node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const utils = require_utils4();
  const partial_1 = require_partial();
  class DeepFilter {
    constructor(_settings, _micromatchOptions) {
      this._settings = _settings;
      this._micromatchOptions = _micromatchOptions;
    }
    getFilter(basePath, positive, negative) {
      const matcher = this._getMatcher(positive);
      const negativeRe = this._getNegativePatternsRe(negative);
      return (entry) => this._filter(basePath, entry, matcher, negativeRe);
    }
    _getMatcher(patterns) {
      return new partial_1.default(patterns, this._settings, this._micromatchOptions);
    }
    _getNegativePatternsRe(patterns) {
      const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
      return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
    }
    _filter(basePath, entry, matcher, negativeRe) {
      if (this._isSkippedByDeep(basePath, entry.path)) {
        return false;
      }
      if (this._isSkippedSymbolicLink(entry)) {
        return false;
      }
      const filepath = utils.path.removeLeadingDotSegment(entry.path);
      if (this._isSkippedByPositivePatterns(filepath, matcher)) {
        return false;
      }
      return this._isSkippedByNegativePatterns(filepath, negativeRe);
    }
    _isSkippedByDeep(basePath, entryPath) {
      if (this._settings.deep === Infinity) {
        return false;
      }
      return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
    }
    _getEntryLevel(basePath, entryPath) {
      const entryPathDepth = entryPath.split("/").length;
      if (basePath === "") {
        return entryPathDepth;
      }
      const basePathDepth = basePath.split("/").length;
      return entryPathDepth - basePathDepth;
    }
    _isSkippedSymbolicLink(entry) {
      return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
    }
    _isSkippedByPositivePatterns(entryPath, matcher) {
      return !this._settings.baseNameMatch && !matcher.match(entryPath);
    }
    _isSkippedByNegativePatterns(entryPath, patternsRe) {
      return !utils.pattern.matchAny(entryPath, patternsRe);
    }
  }
  exports.default = DeepFilter;
});

// node_modules/fast-glob/out/providers/filters/entry.js
var require_entry = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const utils = require_utils4();
  class EntryFilter {
    constructor(_settings, _micromatchOptions) {
      this._settings = _settings;
      this._micromatchOptions = _micromatchOptions;
      this.index = new Map();
    }
    getFilter(positive, negative) {
      const positiveRe = utils.pattern.convertPatternsToRe(positive, this._micromatchOptions);
      const negativeRe = utils.pattern.convertPatternsToRe(negative, this._micromatchOptions);
      return (entry) => this._filter(entry, positiveRe, negativeRe);
    }
    _filter(entry, positiveRe, negativeRe) {
      if (this._settings.unique && this._isDuplicateEntry(entry)) {
        return false;
      }
      if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
        return false;
      }
      if (this._isSkippedByAbsoluteNegativePatterns(entry.path, negativeRe)) {
        return false;
      }
      const filepath = this._settings.baseNameMatch ? entry.name : entry.path;
      const isMatched = this._isMatchToPatterns(filepath, positiveRe) && !this._isMatchToPatterns(entry.path, negativeRe);
      if (this._settings.unique && isMatched) {
        this._createIndexRecord(entry);
      }
      return isMatched;
    }
    _isDuplicateEntry(entry) {
      return this.index.has(entry.path);
    }
    _createIndexRecord(entry) {
      this.index.set(entry.path, void 0);
    }
    _onlyFileFilter(entry) {
      return this._settings.onlyFiles && !entry.dirent.isFile();
    }
    _onlyDirectoryFilter(entry) {
      return this._settings.onlyDirectories && !entry.dirent.isDirectory();
    }
    _isSkippedByAbsoluteNegativePatterns(entryPath, patternsRe) {
      if (!this._settings.absolute) {
        return false;
      }
      const fullpath = utils.path.makeAbsolute(this._settings.cwd, entryPath);
      return utils.pattern.matchAny(fullpath, patternsRe);
    }
    _isMatchToPatterns(entryPath, patternsRe) {
      const filepath = utils.path.removeLeadingDotSegment(entryPath);
      return utils.pattern.matchAny(filepath, patternsRe);
    }
  }
  exports.default = EntryFilter;
});

// node_modules/fast-glob/out/providers/filters/error.js
var require_error = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const utils = require_utils4();
  class ErrorFilter {
    constructor(_settings) {
      this._settings = _settings;
    }
    getFilter() {
      return (error) => this._isNonFatalError(error);
    }
    _isNonFatalError(error) {
      return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
    }
  }
  exports.default = ErrorFilter;
});

// node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const utils = require_utils4();
  class EntryTransformer {
    constructor(_settings) {
      this._settings = _settings;
    }
    getTransformer() {
      return (entry) => this._transform(entry);
    }
    _transform(entry) {
      let filepath = entry.path;
      if (this._settings.absolute) {
        filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
        filepath = utils.path.unixify(filepath);
      }
      if (this._settings.markDirectories && entry.dirent.isDirectory()) {
        filepath += "/";
      }
      if (!this._settings.objectMode) {
        return filepath;
      }
      return Object.assign(Object.assign({}, entry), {path: filepath});
    }
  }
  exports.default = EntryTransformer;
});

// node_modules/fast-glob/out/providers/provider.js
var require_provider = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const path3 = require("path");
  const deep_1 = require_deep();
  const entry_1 = require_entry();
  const error_1 = require_error();
  const entry_2 = require_entry2();
  class Provider {
    constructor(_settings) {
      this._settings = _settings;
      this.errorFilter = new error_1.default(this._settings);
      this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
      this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
      this.entryTransformer = new entry_2.default(this._settings);
    }
    _getRootDirectory(task) {
      return path3.resolve(this._settings.cwd, task.base);
    }
    _getReaderOptions(task) {
      const basePath = task.base === "." ? "" : task.base;
      return {
        basePath,
        pathSegmentSeparator: "/",
        concurrency: this._settings.concurrency,
        deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
        entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
        errorFilter: this.errorFilter.getFilter(),
        followSymbolicLinks: this._settings.followSymbolicLinks,
        fs: this._settings.fs,
        stats: this._settings.stats,
        throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
        transform: this.entryTransformer.getTransformer()
      };
    }
    _getMicromatchOptions() {
      return {
        dot: this._settings.dot,
        matchBase: this._settings.baseNameMatch,
        nobrace: !this._settings.braceExpansion,
        nocase: !this._settings.caseSensitiveMatch,
        noext: !this._settings.extglob,
        noglobstar: !this._settings.globstar,
        posix: true,
        strictSlashes: false
      };
    }
  }
  exports.default = Provider;
});

// node_modules/fast-glob/out/providers/async.js
var require_async5 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const stream_1 = require_stream3();
  const provider_1 = require_provider();
  class ProviderAsync extends provider_1.default {
    constructor() {
      super(...arguments);
      this._reader = new stream_1.default(this._settings);
    }
    read(task) {
      const root = this._getRootDirectory(task);
      const options = this._getReaderOptions(task);
      const entries = [];
      return new Promise((resolve, reject) => {
        const stream = this.api(root, task, options);
        stream.once("error", reject);
        stream.on("data", (entry) => entries.push(options.transform(entry)));
        stream.once("end", () => resolve(entries));
      });
    }
    api(root, task, options) {
      if (task.dynamic) {
        return this._reader.dynamic(root, options);
      }
      return this._reader.static(task.patterns, options);
    }
  }
  exports.default = ProviderAsync;
});

// node_modules/fast-glob/out/providers/stream.js
var require_stream4 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const stream_1 = require("stream");
  const stream_2 = require_stream3();
  const provider_1 = require_provider();
  class ProviderStream extends provider_1.default {
    constructor() {
      super(...arguments);
      this._reader = new stream_2.default(this._settings);
    }
    read(task) {
      const root = this._getRootDirectory(task);
      const options = this._getReaderOptions(task);
      const source = this.api(root, task, options);
      const destination = new stream_1.Readable({objectMode: true, read: () => {
      }});
      source.once("error", (error) => destination.emit("error", error)).on("data", (entry) => destination.emit("data", options.transform(entry))).once("end", () => destination.emit("end"));
      destination.once("close", () => source.destroy());
      return destination;
    }
    api(root, task, options) {
      if (task.dynamic) {
        return this._reader.dynamic(root, options);
      }
      return this._reader.static(task.patterns, options);
    }
  }
  exports.default = ProviderStream;
});

// node_modules/fast-glob/out/readers/sync.js
var require_sync5 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const fsStat = require_out();
  const fsWalk = require_out3();
  const reader_1 = require_reader2();
  class ReaderSync extends reader_1.default {
    constructor() {
      super(...arguments);
      this._walkSync = fsWalk.walkSync;
      this._statSync = fsStat.statSync;
    }
    dynamic(root, options) {
      return this._walkSync(root, options);
    }
    static(patterns, options) {
      const entries = [];
      for (const pattern of patterns) {
        const filepath = this._getFullEntryPath(pattern);
        const entry = this._getEntry(filepath, pattern, options);
        if (entry === null || !options.entryFilter(entry)) {
          continue;
        }
        entries.push(entry);
      }
      return entries;
    }
    _getEntry(filepath, pattern, options) {
      try {
        const stats = this._getStat(filepath);
        return this._makeEntry(stats, pattern);
      } catch (error) {
        if (options.errorFilter(error)) {
          return null;
        }
        throw error;
      }
    }
    _getStat(filepath) {
      return this._statSync(filepath, this._fsStatSettings);
    }
  }
  exports.default = ReaderSync;
});

// node_modules/fast-glob/out/providers/sync.js
var require_sync6 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const sync_1 = require_sync5();
  const provider_1 = require_provider();
  class ProviderSync extends provider_1.default {
    constructor() {
      super(...arguments);
      this._reader = new sync_1.default(this._settings);
    }
    read(task) {
      const root = this._getRootDirectory(task);
      const options = this._getReaderOptions(task);
      const entries = this.api(root, task, options);
      return entries.map(options.transform);
    }
    api(root, task, options) {
      if (task.dynamic) {
        return this._reader.dynamic(root, options);
      }
      return this._reader.static(task.patterns, options);
    }
  }
  exports.default = ProviderSync;
});

// node_modules/fast-glob/out/settings.js
var require_settings4 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
  const fs2 = require("fs");
  const os = require("os");
  const CPU_COUNT = os.cpus().length;
  exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: fs2.lstat,
    lstatSync: fs2.lstatSync,
    stat: fs2.stat,
    statSync: fs2.statSync,
    readdir: fs2.readdir,
    readdirSync: fs2.readdirSync
  };
  class Settings {
    constructor(_options = {}) {
      this._options = _options;
      this.absolute = this._getValue(this._options.absolute, false);
      this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
      this.braceExpansion = this._getValue(this._options.braceExpansion, true);
      this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
      this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
      this.cwd = this._getValue(this._options.cwd, process.cwd());
      this.deep = this._getValue(this._options.deep, Infinity);
      this.dot = this._getValue(this._options.dot, false);
      this.extglob = this._getValue(this._options.extglob, true);
      this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
      this.fs = this._getFileSystemMethods(this._options.fs);
      this.globstar = this._getValue(this._options.globstar, true);
      this.ignore = this._getValue(this._options.ignore, []);
      this.markDirectories = this._getValue(this._options.markDirectories, false);
      this.objectMode = this._getValue(this._options.objectMode, false);
      this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
      this.onlyFiles = this._getValue(this._options.onlyFiles, true);
      this.stats = this._getValue(this._options.stats, false);
      this.suppressErrors = this._getValue(this._options.suppressErrors, false);
      this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
      this.unique = this._getValue(this._options.unique, true);
      if (this.onlyDirectories) {
        this.onlyFiles = false;
      }
      if (this.stats) {
        this.objectMode = true;
      }
    }
    _getValue(option, value) {
      return option === void 0 ? value : option;
    }
    _getFileSystemMethods(methods = {}) {
      return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
    }
  }
  exports.default = Settings;
});

// node_modules/fast-glob/out/index.js
var require_out4 = __commonJS((exports, module2) => {
  "use strict";
  const taskManager = require_tasks();
  const async_1 = require_async5();
  const stream_1 = require_stream4();
  const sync_1 = require_sync6();
  const settings_1 = require_settings4();
  const utils = require_utils4();
  async function FastGlob(source, options) {
    assertPatternsInput(source);
    const works = getWorks(source, async_1.default, options);
    const result = await Promise.all(works);
    return utils.array.flatten(result);
  }
  (function(FastGlob2) {
    function sync2(source, options) {
      assertPatternsInput(source);
      const works = getWorks(source, sync_1.default, options);
      return utils.array.flatten(works);
    }
    FastGlob2.sync = sync2;
    function stream(source, options) {
      assertPatternsInput(source);
      const works = getWorks(source, stream_1.default, options);
      return utils.stream.merge(works);
    }
    FastGlob2.stream = stream;
    function generateTasks(source, options) {
      assertPatternsInput(source);
      const patterns = [].concat(source);
      const settings = new settings_1.default(options);
      return taskManager.generate(patterns, settings);
    }
    FastGlob2.generateTasks = generateTasks;
    function isDynamicPattern(source, options) {
      assertPatternsInput(source);
      const settings = new settings_1.default(options);
      return utils.pattern.isDynamicPattern(source, settings);
    }
    FastGlob2.isDynamicPattern = isDynamicPattern;
    function escapePath(source) {
      assertPatternsInput(source);
      return utils.path.escape(source);
    }
    FastGlob2.escapePath = escapePath;
  })(FastGlob || (FastGlob = {}));
  function getWorks(source, _Provider, options) {
    const patterns = [].concat(source);
    const settings = new settings_1.default(options);
    const tasks = taskManager.generate(patterns, settings);
    const provider = new _Provider(settings);
    return tasks.map(provider.read, provider);
  }
  function assertPatternsInput(input) {
    const source = [].concat(input);
    const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
    if (!isValidSource) {
      throw new TypeError("Patterns must be a string (non empty) or an array of strings");
    }
  }
  module2.exports = FastGlob;
});

// node_modules/validator/lib/util/assertString.js
var require_assertString = __commonJS((exports, module2) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = assertString;
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof2(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function _typeof2(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  function assertString(input) {
    var isString = typeof input === "string" || input instanceof String;
    if (!isString) {
      var invalidType;
      if (input === null) {
        invalidType = "null";
      } else {
        invalidType = _typeof(input);
        if (invalidType === "object" && input.constructor && input.constructor.hasOwnProperty("name")) {
          invalidType = input.constructor.name;
        } else {
          invalidType = "a ".concat(invalidType);
        }
      }
      throw new TypeError("Expected string but received ".concat(invalidType, "."));
    }
  }
  module2.exports = exports.default;
  module2.exports.default = exports.default;
});

// node_modules/validator/lib/util/merge.js
var require_merge = __commonJS((exports, module2) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = merge;
  function merge() {
    var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var defaults = arguments.length > 1 ? arguments[1] : void 0;
    for (var key in defaults) {
      if (typeof obj[key] === "undefined") {
        obj[key] = defaults[key];
      }
    }
    return obj;
  }
  module2.exports = exports.default;
  module2.exports.default = exports.default;
});

// node_modules/validator/lib/isFQDN.js
var require_isFQDN = __commonJS((exports, module2) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isFQDN;
  var _assertString = _interopRequireDefault(require_assertString());
  var _merge = _interopRequireDefault(require_merge());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var default_fqdn_options = {
    require_tld: true,
    allow_underscores: false,
    allow_trailing_dot: false
  };
  function isFQDN(str2, options) {
    (0, _assertString.default)(str2);
    options = (0, _merge.default)(options, default_fqdn_options);
    if (options.allow_trailing_dot && str2[str2.length - 1] === ".") {
      str2 = str2.substring(0, str2.length - 1);
    }
    var parts = str2.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 63) {
        return false;
      }
    }
    if (options.require_tld) {
      var tld = parts.pop();
      if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
        return false;
      }
      if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20\u00A9\uFFFD]/.test(tld)) {
        return false;
      }
    }
    for (var part, _i = 0; _i < parts.length; _i++) {
      part = parts[_i];
      if (options.allow_underscores) {
        part = part.replace(/_/g, "");
      }
      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false;
      }
      if (/[\uff01-\uff5e]/.test(part)) {
        return false;
      }
      if (part[0] === "-" || part[part.length - 1] === "-") {
        return false;
      }
    }
    return true;
  }
  module2.exports = exports.default;
  module2.exports.default = exports.default;
});

// node_modules/validator/lib/isIP.js
var require_isIP = __commonJS((exports, module2) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isIP;
  var _assertString = _interopRequireDefault(require_assertString());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var ipv4Maybe = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  var ipv6Block = /^[0-9A-F]{1,4}$/i;
  function isIP(str2) {
    var version = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    (0, _assertString.default)(str2);
    version = String(version);
    if (!version) {
      return isIP(str2, 4) || isIP(str2, 6);
    } else if (version === "4") {
      if (!ipv4Maybe.test(str2)) {
        return false;
      }
      var parts = str2.split(".").sort(function(a, b) {
        return a - b;
      });
      return parts[3] <= 255;
    } else if (version === "6") {
      var addressAndZone = [str2];
      if (str2.includes("%")) {
        addressAndZone = str2.split("%");
        if (addressAndZone.length !== 2) {
          return false;
        }
        if (!addressAndZone[0].includes(":")) {
          return false;
        }
        if (addressAndZone[1] === "") {
          return false;
        }
      }
      var blocks = addressAndZone[0].split(":");
      var foundOmissionBlock = false;
      var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
      var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;
      if (blocks.length > expectedNumberOfBlocks) {
        return false;
      }
      if (str2 === "::") {
        return true;
      } else if (str2.substr(0, 2) === "::") {
        blocks.shift();
        blocks.shift();
        foundOmissionBlock = true;
      } else if (str2.substr(str2.length - 2) === "::") {
        blocks.pop();
        blocks.pop();
        foundOmissionBlock = true;
      }
      for (var i = 0; i < blocks.length; ++i) {
        if (blocks[i] === "" && i > 0 && i < blocks.length - 1) {
          if (foundOmissionBlock) {
            return false;
          }
          foundOmissionBlock = true;
        } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
        } else if (!ipv6Block.test(blocks[i])) {
          return false;
        }
      }
      if (foundOmissionBlock) {
        return blocks.length >= 1;
      }
      return blocks.length === expectedNumberOfBlocks;
    }
    return false;
  }
  module2.exports = exports.default;
  module2.exports.default = exports.default;
});

// node_modules/envalid/src/validators.js
var require_validators = __commonJS((exports) => {
  const isFQDN = require_isFQDN();
  const isIP = require_isIP();
  const EMAIL_REGEX2 = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  class EnvError extends TypeError {
    constructor(...args) {
      super(...args);
      Error.captureStackTrace(this, EnvError);
      this.name = "EnvError";
    }
  }
  exports.EnvError = EnvError;
  class EnvMissingError extends ReferenceError {
    constructor(...args) {
      super(...args);
      Error.captureStackTrace(this, EnvMissingError);
      this.name = "EnvMissingError";
    }
  }
  exports.EnvMissingError = EnvMissingError;
  function makeValidator(parseFn, type = "unknown") {
    return function(spec = {}) {
      spec.type = type;
      spec._parse = parseFn;
      return spec;
    };
  }
  exports.makeValidator = makeValidator;
  exports.bool = makeValidator((input) => {
    switch (input) {
      case true:
      case "true":
      case "t":
      case "1":
        return true;
      case false:
      case "false":
      case "f":
      case "0":
        return false;
      default:
        return null;
    }
  }, "bool");
  exports.num = makeValidator((input) => {
    const coerced = +input;
    if (Number.isNaN(coerced))
      throw new EnvError(`Invalid number input: "${input}"`);
    return coerced;
  }, "num");
  exports.str = makeValidator((input) => {
    if (typeof input === "string")
      return input;
    throw new EnvError(`Not a string: "${input}"`);
  }, "str");
  exports.email = makeValidator((x) => {
    if (EMAIL_REGEX2.test(x))
      return x;
    throw new EnvError(`Invalid email address: "${x}"`);
  }, "email");
  exports.host = makeValidator((input) => {
    if (!isFQDN(input, {require_tld: false}) && !isIP(input)) {
      throw new EnvError(`Invalid host (domain or ip): "${input}"`);
    }
    return input;
  }, "host");
  exports.port = makeValidator((input) => {
    const coerced = +input;
    if (Number.isNaN(coerced) || `${coerced}` !== `${input}` || coerced % 1 !== 0 || coerced < 1 || coerced > 65535) {
      throw new EnvError(`Invalid port input: "${input}"`);
    }
    return coerced;
  }, "port");
  exports.url = makeValidator((x) => {
    const url = require("url");
    let isValid = false;
    if (url.URL) {
      try {
        new url.URL(x);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
    } else {
      const parsed = url.parse(x);
      isValid = !!(parsed.protocol && parsed.host && parsed.slashes);
    }
    if (isValid)
      return x;
    throw new EnvError(`Invalid url: "${x}"`);
  }, "url");
  exports.json = makeValidator((x) => {
    try {
      return JSON.parse(x);
    } catch (e) {
      throw new EnvError(`Invalid json: "${x}"`);
    }
  }, "json");
});

// node_modules/envalid/src/utils.js
var require_utils6 = __commonJS((exports) => {
  const extend = (x = {}, y = {}) => Object.assign({}, x, y);
  exports.extend = extend;
});

// node_modules/color-name/index.js
var require_color_name = __commonJS((exports, module2) => {
  "use strict";
  module2.exports = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50]
  };
});

// node_modules/color-convert/conversions.js
var require_conversions = __commonJS((exports, module2) => {
  const cssKeywords = require_color_name();
  const reverseKeywords = {};
  for (const key of Object.keys(cssKeywords)) {
    reverseKeywords[cssKeywords[key]] = key;
  }
  const convert = {
    rgb: {channels: 3, labels: "rgb"},
    hsl: {channels: 3, labels: "hsl"},
    hsv: {channels: 3, labels: "hsv"},
    hwb: {channels: 3, labels: "hwb"},
    cmyk: {channels: 4, labels: "cmyk"},
    xyz: {channels: 3, labels: "xyz"},
    lab: {channels: 3, labels: "lab"},
    lch: {channels: 3, labels: "lch"},
    hex: {channels: 1, labels: ["hex"]},
    keyword: {channels: 1, labels: ["keyword"]},
    ansi16: {channels: 1, labels: ["ansi16"]},
    ansi256: {channels: 1, labels: ["ansi256"]},
    hcg: {channels: 3, labels: ["h", "c", "g"]},
    apple: {channels: 3, labels: ["r16", "g16", "b16"]},
    gray: {channels: 1, labels: ["gray"]}
  };
  module2.exports = convert;
  for (const model of Object.keys(convert)) {
    if (!("channels" in convert[model])) {
      throw new Error("missing channels property: " + model);
    }
    if (!("labels" in convert[model])) {
      throw new Error("missing channel labels property: " + model);
    }
    if (convert[model].labels.length !== convert[model].channels) {
      throw new Error("channel and label counts mismatch: " + model);
    }
    const {channels, labels: labels2} = convert[model];
    delete convert[model].channels;
    delete convert[model].labels;
    Object.defineProperty(convert[model], "channels", {value: channels});
    Object.defineProperty(convert[model], "labels", {value: labels2});
  }
  convert.rgb.hsl = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h;
    let s;
    if (max === min) {
      h = 0;
    } else if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else if (b === max) {
      h = 4 + (r - g) / delta;
    }
    h = Math.min(h * 60, 360);
    if (h < 0) {
      h += 360;
    }
    const l = (min + max) / 2;
    if (max === min) {
      s = 0;
    } else if (l <= 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }
    return [h, s * 100, l * 100];
  };
  convert.rgb.hsv = function(rgb) {
    let rdif;
    let gdif;
    let bdif;
    let h;
    let s;
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const v = Math.max(r, g, b);
    const diff = v - Math.min(r, g, b);
    const diffc = function(c) {
      return (v - c) / 6 / diff + 1 / 2;
    };
    if (diff === 0) {
      h = 0;
      s = 0;
    } else {
      s = diff / v;
      rdif = diffc(r);
      gdif = diffc(g);
      bdif = diffc(b);
      if (r === v) {
        h = bdif - gdif;
      } else if (g === v) {
        h = 1 / 3 + rdif - bdif;
      } else if (b === v) {
        h = 2 / 3 + gdif - rdif;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return [
      h * 360,
      s * 100,
      v * 100
    ];
  };
  convert.rgb.hwb = function(rgb) {
    const r = rgb[0];
    const g = rgb[1];
    let b = rgb[2];
    const h = convert.rgb.hsl(rgb)[0];
    const w = 1 / 255 * Math.min(r, Math.min(g, b));
    b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
    return [h, w * 100, b * 100];
  };
  convert.rgb.cmyk = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const k = Math.min(1 - r, 1 - g, 1 - b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    return [c * 100, m * 100, y * 100, k * 100];
  };
  function comparativeDistance(x, y) {
    return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
  }
  convert.rgb.keyword = function(rgb) {
    const reversed = reverseKeywords[rgb];
    if (reversed) {
      return reversed;
    }
    let currentClosestDistance = Infinity;
    let currentClosestKeyword;
    for (const keyword of Object.keys(cssKeywords)) {
      const value = cssKeywords[keyword];
      const distance = comparativeDistance(rgb, value);
      if (distance < currentClosestDistance) {
        currentClosestDistance = distance;
        currentClosestKeyword = keyword;
      }
    }
    return currentClosestKeyword;
  };
  convert.keyword.rgb = function(keyword) {
    return cssKeywords[keyword];
  };
  convert.rgb.xyz = function(rgb) {
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
    r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
    g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
    b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x * 100, y * 100, z * 100];
  };
  convert.rgb.lab = function(rgb) {
    const xyz = convert.rgb.xyz(rgb);
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
    y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
    z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return [l, a, b];
  };
  convert.hsl.rgb = function(hsl) {
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    let t2;
    let t3;
    let val;
    if (s === 0) {
      val = l * 255;
      return [val, val, val];
    }
    if (l < 0.5) {
      t2 = l * (1 + s);
    } else {
      t2 = l + s - l * s;
    }
    const t1 = 2 * l - t2;
    const rgb = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      t3 = h + 1 / 3 * -(i - 1);
      if (t3 < 0) {
        t3++;
      }
      if (t3 > 1) {
        t3--;
      }
      if (6 * t3 < 1) {
        val = t1 + (t2 - t1) * 6 * t3;
      } else if (2 * t3 < 1) {
        val = t2;
      } else if (3 * t3 < 2) {
        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
      } else {
        val = t1;
      }
      rgb[i] = val * 255;
    }
    return rgb;
  };
  convert.hsl.hsv = function(hsl) {
    const h = hsl[0];
    let s = hsl[1] / 100;
    let l = hsl[2] / 100;
    let smin = s;
    const lmin = Math.max(l, 0.01);
    l *= 2;
    s *= l <= 1 ? l : 2 - l;
    smin *= lmin <= 1 ? lmin : 2 - lmin;
    const v = (l + s) / 2;
    const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
    return [h, sv * 100, v * 100];
  };
  convert.hsv.rgb = function(hsv) {
    const h = hsv[0] / 60;
    const s = hsv[1] / 100;
    let v = hsv[2] / 100;
    const hi = Math.floor(h) % 6;
    const f = h - Math.floor(h);
    const p = 255 * v * (1 - s);
    const q = 255 * v * (1 - s * f);
    const t = 255 * v * (1 - s * (1 - f));
    v *= 255;
    switch (hi) {
      case 0:
        return [v, t, p];
      case 1:
        return [q, v, p];
      case 2:
        return [p, v, t];
      case 3:
        return [p, q, v];
      case 4:
        return [t, p, v];
      case 5:
        return [v, p, q];
    }
  };
  convert.hsv.hsl = function(hsv) {
    const h = hsv[0];
    const s = hsv[1] / 100;
    const v = hsv[2] / 100;
    const vmin = Math.max(v, 0.01);
    let sl;
    let l;
    l = (2 - s) * v;
    const lmin = (2 - s) * vmin;
    sl = s * vmin;
    sl /= lmin <= 1 ? lmin : 2 - lmin;
    sl = sl || 0;
    l /= 2;
    return [h, sl * 100, l * 100];
  };
  convert.hwb.rgb = function(hwb) {
    const h = hwb[0] / 360;
    let wh = hwb[1] / 100;
    let bl = hwb[2] / 100;
    const ratio = wh + bl;
    let f;
    if (ratio > 1) {
      wh /= ratio;
      bl /= ratio;
    }
    const i = Math.floor(6 * h);
    const v = 1 - bl;
    f = 6 * h - i;
    if ((i & 1) !== 0) {
      f = 1 - f;
    }
    const n = wh + f * (v - wh);
    let r;
    let g;
    let b;
    switch (i) {
      default:
      case 6:
      case 0:
        r = v;
        g = n;
        b = wh;
        break;
      case 1:
        r = n;
        g = v;
        b = wh;
        break;
      case 2:
        r = wh;
        g = v;
        b = n;
        break;
      case 3:
        r = wh;
        g = n;
        b = v;
        break;
      case 4:
        r = n;
        g = wh;
        b = v;
        break;
      case 5:
        r = v;
        g = wh;
        b = n;
        break;
    }
    return [r * 255, g * 255, b * 255];
  };
  convert.cmyk.rgb = function(cmyk) {
    const c = cmyk[0] / 100;
    const m = cmyk[1] / 100;
    const y = cmyk[2] / 100;
    const k = cmyk[3] / 100;
    const r = 1 - Math.min(1, c * (1 - k) + k);
    const g = 1 - Math.min(1, m * (1 - k) + k);
    const b = 1 - Math.min(1, y * (1 - k) + k);
    return [r * 255, g * 255, b * 255];
  };
  convert.xyz.rgb = function(xyz) {
    const x = xyz[0] / 100;
    const y = xyz[1] / 100;
    const z = xyz[2] / 100;
    let r;
    let g;
    let b;
    r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    b = x * 0.0557 + y * -0.204 + z * 1.057;
    r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
    g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
    b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
    r = Math.min(Math.max(0, r), 1);
    g = Math.min(Math.max(0, g), 1);
    b = Math.min(Math.max(0, b), 1);
    return [r * 255, g * 255, b * 255];
  };
  convert.xyz.lab = function(xyz) {
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
    y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
    z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return [l, a, b];
  };
  convert.lab.xyz = function(lab) {
    const l = lab[0];
    const a = lab[1];
    const b = lab[2];
    let x;
    let y;
    let z;
    y = (l + 16) / 116;
    x = a / 500 + y;
    z = y - b / 200;
    const y2 = y ** 3;
    const x2 = x ** 3;
    const z2 = z ** 3;
    y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
    x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
    z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
    x *= 95.047;
    y *= 100;
    z *= 108.883;
    return [x, y, z];
  };
  convert.lab.lch = function(lab) {
    const l = lab[0];
    const a = lab[1];
    const b = lab[2];
    let h;
    const hr = Math.atan2(b, a);
    h = hr * 360 / 2 / Math.PI;
    if (h < 0) {
      h += 360;
    }
    const c = Math.sqrt(a * a + b * b);
    return [l, c, h];
  };
  convert.lch.lab = function(lch) {
    const l = lch[0];
    const c = lch[1];
    const h = lch[2];
    const hr = h / 360 * 2 * Math.PI;
    const a = c * Math.cos(hr);
    const b = c * Math.sin(hr);
    return [l, a, b];
  };
  convert.rgb.ansi16 = function(args, saturation = null) {
    const [r, g, b] = args;
    let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
    value = Math.round(value / 50);
    if (value === 0) {
      return 30;
    }
    let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
    if (value === 2) {
      ansi += 60;
    }
    return ansi;
  };
  convert.hsv.ansi16 = function(args) {
    return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
  };
  convert.rgb.ansi256 = function(args) {
    const r = args[0];
    const g = args[1];
    const b = args[2];
    if (r === g && g === b) {
      if (r < 8) {
        return 16;
      }
      if (r > 248) {
        return 231;
      }
      return Math.round((r - 8) / 247 * 24) + 232;
    }
    const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
    return ansi;
  };
  convert.ansi16.rgb = function(args) {
    let color = args % 10;
    if (color === 0 || color === 7) {
      if (args > 50) {
        color += 3.5;
      }
      color = color / 10.5 * 255;
      return [color, color, color];
    }
    const mult = (~~(args > 50) + 1) * 0.5;
    const r = (color & 1) * mult * 255;
    const g = (color >> 1 & 1) * mult * 255;
    const b = (color >> 2 & 1) * mult * 255;
    return [r, g, b];
  };
  convert.ansi256.rgb = function(args) {
    if (args >= 232) {
      const c = (args - 232) * 10 + 8;
      return [c, c, c];
    }
    args -= 16;
    let rem;
    const r = Math.floor(args / 36) / 5 * 255;
    const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
    const b = rem % 6 / 5 * 255;
    return [r, g, b];
  };
  convert.rgb.hex = function(args) {
    const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
    const string = integer.toString(16).toUpperCase();
    return "000000".substring(string.length) + string;
  };
  convert.hex.rgb = function(args) {
    const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!match) {
      return [0, 0, 0];
    }
    let colorString = match[0];
    if (match[0].length === 3) {
      colorString = colorString.split("").map((char) => {
        return char + char;
      }).join("");
    }
    const integer = parseInt(colorString, 16);
    const r = integer >> 16 & 255;
    const g = integer >> 8 & 255;
    const b = integer & 255;
    return [r, g, b];
  };
  convert.rgb.hcg = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const max = Math.max(Math.max(r, g), b);
    const min = Math.min(Math.min(r, g), b);
    const chroma = max - min;
    let grayscale;
    let hue;
    if (chroma < 1) {
      grayscale = min / (1 - chroma);
    } else {
      grayscale = 0;
    }
    if (chroma <= 0) {
      hue = 0;
    } else if (max === r) {
      hue = (g - b) / chroma % 6;
    } else if (max === g) {
      hue = 2 + (b - r) / chroma;
    } else {
      hue = 4 + (r - g) / chroma;
    }
    hue /= 6;
    hue %= 1;
    return [hue * 360, chroma * 100, grayscale * 100];
  };
  convert.hsl.hcg = function(hsl) {
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
    let f = 0;
    if (c < 1) {
      f = (l - 0.5 * c) / (1 - c);
    }
    return [hsl[0], c * 100, f * 100];
  };
  convert.hsv.hcg = function(hsv) {
    const s = hsv[1] / 100;
    const v = hsv[2] / 100;
    const c = s * v;
    let f = 0;
    if (c < 1) {
      f = (v - c) / (1 - c);
    }
    return [hsv[0], c * 100, f * 100];
  };
  convert.hcg.rgb = function(hcg) {
    const h = hcg[0] / 360;
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    if (c === 0) {
      return [g * 255, g * 255, g * 255];
    }
    const pure = [0, 0, 0];
    const hi = h % 1 * 6;
    const v = hi % 1;
    const w = 1 - v;
    let mg = 0;
    switch (Math.floor(hi)) {
      case 0:
        pure[0] = 1;
        pure[1] = v;
        pure[2] = 0;
        break;
      case 1:
        pure[0] = w;
        pure[1] = 1;
        pure[2] = 0;
        break;
      case 2:
        pure[0] = 0;
        pure[1] = 1;
        pure[2] = v;
        break;
      case 3:
        pure[0] = 0;
        pure[1] = w;
        pure[2] = 1;
        break;
      case 4:
        pure[0] = v;
        pure[1] = 0;
        pure[2] = 1;
        break;
      default:
        pure[0] = 1;
        pure[1] = 0;
        pure[2] = w;
    }
    mg = (1 - c) * g;
    return [
      (c * pure[0] + mg) * 255,
      (c * pure[1] + mg) * 255,
      (c * pure[2] + mg) * 255
    ];
  };
  convert.hcg.hsv = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const v = c + g * (1 - c);
    let f = 0;
    if (v > 0) {
      f = c / v;
    }
    return [hcg[0], f * 100, v * 100];
  };
  convert.hcg.hsl = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const l = g * (1 - c) + 0.5 * c;
    let s = 0;
    if (l > 0 && l < 0.5) {
      s = c / (2 * l);
    } else if (l >= 0.5 && l < 1) {
      s = c / (2 * (1 - l));
    }
    return [hcg[0], s * 100, l * 100];
  };
  convert.hcg.hwb = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const v = c + g * (1 - c);
    return [hcg[0], (v - c) * 100, (1 - v) * 100];
  };
  convert.hwb.hcg = function(hwb) {
    const w = hwb[1] / 100;
    const b = hwb[2] / 100;
    const v = 1 - b;
    const c = v - w;
    let g = 0;
    if (c < 1) {
      g = (v - c) / (1 - c);
    }
    return [hwb[0], c * 100, g * 100];
  };
  convert.apple.rgb = function(apple) {
    return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
  };
  convert.rgb.apple = function(rgb) {
    return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
  };
  convert.gray.rgb = function(args) {
    return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
  };
  convert.gray.hsl = function(args) {
    return [0, 0, args[0]];
  };
  convert.gray.hsv = convert.gray.hsl;
  convert.gray.hwb = function(gray) {
    return [0, 100, gray[0]];
  };
  convert.gray.cmyk = function(gray) {
    return [0, 0, 0, gray[0]];
  };
  convert.gray.lab = function(gray) {
    return [gray[0], 0, 0];
  };
  convert.gray.hex = function(gray) {
    const val = Math.round(gray[0] / 100 * 255) & 255;
    const integer = (val << 16) + (val << 8) + val;
    const string = integer.toString(16).toUpperCase();
    return "000000".substring(string.length) + string;
  };
  convert.rgb.gray = function(rgb) {
    const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
    return [val / 255 * 100];
  };
});

// node_modules/color-convert/route.js
var require_route = __commonJS((exports, module2) => {
  const conversions = require_conversions();
  function buildGraph() {
    const graph = {};
    const models = Object.keys(conversions);
    for (let len = models.length, i = 0; i < len; i++) {
      graph[models[i]] = {
        distance: -1,
        parent: null
      };
    }
    return graph;
  }
  function deriveBFS(fromModel) {
    const graph = buildGraph();
    const queue = [fromModel];
    graph[fromModel].distance = 0;
    while (queue.length) {
      const current = queue.pop();
      const adjacents = Object.keys(conversions[current]);
      for (let len = adjacents.length, i = 0; i < len; i++) {
        const adjacent = adjacents[i];
        const node = graph[adjacent];
        if (node.distance === -1) {
          node.distance = graph[current].distance + 1;
          node.parent = current;
          queue.unshift(adjacent);
        }
      }
    }
    return graph;
  }
  function link(from, to) {
    return function(args) {
      return to(from(args));
    };
  }
  function wrapConversion(toModel, graph) {
    const path3 = [graph[toModel].parent, toModel];
    let fn = conversions[graph[toModel].parent][toModel];
    let cur = graph[toModel].parent;
    while (graph[cur].parent) {
      path3.unshift(graph[cur].parent);
      fn = link(conversions[graph[cur].parent][cur], fn);
      cur = graph[cur].parent;
    }
    fn.conversion = path3;
    return fn;
  }
  module2.exports = function(fromModel) {
    const graph = deriveBFS(fromModel);
    const conversion = {};
    const models = Object.keys(graph);
    for (let len = models.length, i = 0; i < len; i++) {
      const toModel = models[i];
      const node = graph[toModel];
      if (node.parent === null) {
        continue;
      }
      conversion[toModel] = wrapConversion(toModel, graph);
    }
    return conversion;
  };
});

// node_modules/color-convert/index.js
var require_color_convert = __commonJS((exports, module2) => {
  const conversions = require_conversions();
  const route = require_route();
  const convert = {};
  const models = Object.keys(conversions);
  function wrapRaw(fn) {
    const wrappedFn = function(...args) {
      const arg0 = args[0];
      if (arg0 === void 0 || arg0 === null) {
        return arg0;
      }
      if (arg0.length > 1) {
        args = arg0;
      }
      return fn(args);
    };
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
  }
  function wrapRounded(fn) {
    const wrappedFn = function(...args) {
      const arg0 = args[0];
      if (arg0 === void 0 || arg0 === null) {
        return arg0;
      }
      if (arg0.length > 1) {
        args = arg0;
      }
      const result = fn(args);
      if (typeof result === "object") {
        for (let len = result.length, i = 0; i < len; i++) {
          result[i] = Math.round(result[i]);
        }
      }
      return result;
    };
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
  }
  models.forEach((fromModel) => {
    convert[fromModel] = {};
    Object.defineProperty(convert[fromModel], "channels", {value: conversions[fromModel].channels});
    Object.defineProperty(convert[fromModel], "labels", {value: conversions[fromModel].labels});
    const routes = route(fromModel);
    const routeModels = Object.keys(routes);
    routeModels.forEach((toModel) => {
      const fn = routes[toModel];
      convert[fromModel][toModel] = wrapRounded(fn);
      convert[fromModel][toModel].raw = wrapRaw(fn);
    });
  });
  module2.exports = convert;
});

// node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS((exports, module2) => {
  "use strict";
  const wrapAnsi16 = (fn, offset) => (...args) => {
    const code = fn(...args);
    return `[${code + offset}m`;
  };
  const wrapAnsi256 = (fn, offset) => (...args) => {
    const code = fn(...args);
    return `[${38 + offset};5;${code}m`;
  };
  const wrapAnsi16m = (fn, offset) => (...args) => {
    const rgb = fn(...args);
    return `[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
  };
  const ansi2ansi = (n) => n;
  const rgb2rgb = (r, g, b) => [r, g, b];
  const setLazyProperty = (object, property, get) => {
    Object.defineProperty(object, property, {
      get: () => {
        const value = get();
        Object.defineProperty(object, property, {
          value,
          enumerable: true,
          configurable: true
        });
        return value;
      },
      enumerable: true,
      configurable: true
    });
  };
  let colorConvert;
  const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
    if (colorConvert === void 0) {
      colorConvert = require_color_convert();
    }
    const offset = isBackground ? 10 : 0;
    const styles = {};
    for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
      const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
      if (sourceSpace === targetSpace) {
        styles[name] = wrap(identity, offset);
      } else if (typeof suite === "object") {
        styles[name] = wrap(suite[targetSpace], offset);
      }
    }
    return styles;
  };
  function assembleStyles() {
    const codes = new Map();
    const styles = {
      modifier: {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29]
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        blackBright: [90, 39],
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39]
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgBlackBright: [100, 49],
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49]
      }
    };
    styles.color.gray = styles.color.blackBright;
    styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
    styles.color.grey = styles.color.blackBright;
    styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
    for (const [groupName, group] of Object.entries(styles)) {
      for (const [styleName, style] of Object.entries(group)) {
        styles[styleName] = {
          open: `[${style[0]}m`,
          close: `[${style[1]}m`
        };
        group[styleName] = styles[styleName];
        codes.set(style[0], style[1]);
      }
      Object.defineProperty(styles, groupName, {
        value: group,
        enumerable: false
      });
    }
    Object.defineProperty(styles, "codes", {
      value: codes,
      enumerable: false
    });
    styles.color.close = "[39m";
    styles.bgColor.close = "[49m";
    setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
    setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
    setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
    setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
    setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
    setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
    return styles;
  }
  Object.defineProperty(module2, "exports", {
    enumerable: true,
    get: assembleStyles
  });
});

// node_modules/supports-color/browser.js
var require_browser = __commonJS((exports, module2) => {
  "use strict";
  module2.exports = {
    stdout: false,
    stderr: false
  };
});

// node_modules/envalid/node_modules/chalk/source/util.js
var require_util = __commonJS((exports, module2) => {
  "use strict";
  const stringReplaceAll = (string, substring, replacer) => {
    let index = string.indexOf(substring);
    if (index === -1) {
      return string;
    }
    const substringLength = substring.length;
    let endIndex = 0;
    let returnValue = "";
    do {
      returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
      endIndex = index + substringLength;
      index = string.indexOf(substring, endIndex);
    } while (index !== -1);
    returnValue += string.substr(endIndex);
    return returnValue;
  };
  const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
    let endIndex = 0;
    let returnValue = "";
    do {
      const gotCR = string[index - 1] === "\r";
      returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
      endIndex = index + 1;
      index = string.indexOf("\n", endIndex);
    } while (index !== -1);
    returnValue += string.substr(endIndex);
    return returnValue;
  };
  module2.exports = {
    stringReplaceAll,
    stringEncaseCRLFWithFirstIndex
  };
});

// node_modules/envalid/node_modules/chalk/source/templates.js
var require_templates = __commonJS((exports, module2) => {
  "use strict";
  const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
  const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
  const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
  const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.)|([^\\])/gi;
  const ESCAPES = new Map([
    ["n", "\n"],
    ["r", "\r"],
    ["t", "	"],
    ["b", "\b"],
    ["f", "\f"],
    ["v", "\v"],
    ["0", "\0"],
    ["\\", "\\"],
    ["e", ""],
    ["a", "\x07"]
  ]);
  function unescape(c) {
    const u = c[0] === "u";
    const bracket = c[1] === "{";
    if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
      return String.fromCharCode(parseInt(c.slice(1), 16));
    }
    if (u && bracket) {
      return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
    }
    return ESCAPES.get(c) || c;
  }
  function parseArguments(name, arguments_) {
    const results = [];
    const chunks = arguments_.trim().split(/\s*,\s*/g);
    let matches;
    for (const chunk of chunks) {
      const number = Number(chunk);
      if (!Number.isNaN(number)) {
        results.push(number);
      } else if (matches = chunk.match(STRING_REGEX)) {
        results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
      } else {
        throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
      }
    }
    return results;
  }
  function parseStyle(style) {
    STYLE_REGEX.lastIndex = 0;
    const results = [];
    let matches;
    while ((matches = STYLE_REGEX.exec(style)) !== null) {
      const name = matches[1];
      if (matches[2]) {
        const args = parseArguments(name, matches[2]);
        results.push([name].concat(args));
      } else {
        results.push([name]);
      }
    }
    return results;
  }
  function buildStyle(chalk, styles) {
    const enabled = {};
    for (const layer of styles) {
      for (const style of layer.styles) {
        enabled[style[0]] = layer.inverse ? null : style.slice(1);
      }
    }
    let current = chalk;
    for (const [styleName, styles2] of Object.entries(enabled)) {
      if (!Array.isArray(styles2)) {
        continue;
      }
      if (!(styleName in current)) {
        throw new Error(`Unknown Chalk style: ${styleName}`);
      }
      current = styles2.length > 0 ? current[styleName](...styles2) : current[styleName];
    }
    return current;
  }
  module2.exports = (chalk, temporary) => {
    const styles = [];
    const chunks = [];
    let chunk = [];
    temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
      if (escapeCharacter) {
        chunk.push(unescape(escapeCharacter));
      } else if (style) {
        const string = chunk.join("");
        chunk = [];
        chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
        styles.push({inverse, styles: parseStyle(style)});
      } else if (close) {
        if (styles.length === 0) {
          throw new Error("Found extraneous } in Chalk template literal");
        }
        chunks.push(buildStyle(chalk, styles)(chunk.join("")));
        chunk = [];
        styles.pop();
      } else {
        chunk.push(character);
      }
    });
    chunks.push(chunk.join(""));
    if (styles.length > 0) {
      const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
      throw new Error(errMsg);
    }
    return chunks.join("");
  };
});

// node_modules/envalid/node_modules/chalk/source/index.js
var require_source = __commonJS((exports, module2) => {
  "use strict";
  const ansiStyles = require_ansi_styles();
  const {stdout: stdoutColor, stderr: stderrColor} = require_browser();
  const {
    stringReplaceAll,
    stringEncaseCRLFWithFirstIndex
  } = require_util();
  const levelMapping = [
    "ansi",
    "ansi",
    "ansi256",
    "ansi16m"
  ];
  const styles = Object.create(null);
  const applyOptions = (object, options = {}) => {
    if (options.level > 3 || options.level < 0) {
      throw new Error("The `level` option should be an integer from 0 to 3");
    }
    const colorLevel = stdoutColor ? stdoutColor.level : 0;
    object.level = options.level === void 0 ? colorLevel : options.level;
  };
  class ChalkClass {
    constructor(options) {
      return chalkFactory(options);
    }
  }
  const chalkFactory = (options) => {
    const chalk2 = {};
    applyOptions(chalk2, options);
    chalk2.template = (...arguments_) => chalkTag(chalk2.template, ...arguments_);
    Object.setPrototypeOf(chalk2, Chalk.prototype);
    Object.setPrototypeOf(chalk2.template, chalk2);
    chalk2.template.constructor = () => {
      throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
    };
    chalk2.template.Instance = ChalkClass;
    return chalk2.template;
  };
  function Chalk(options) {
    return chalkFactory(options);
  }
  for (const [styleName, style] of Object.entries(ansiStyles)) {
    styles[styleName] = {
      get() {
        const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
        Object.defineProperty(this, styleName, {value: builder});
        return builder;
      }
    };
  }
  styles.visible = {
    get() {
      const builder = createBuilder(this, this._styler, true);
      Object.defineProperty(this, "visible", {value: builder});
      return builder;
    }
  };
  const usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
  for (const model of usedModels) {
    styles[model] = {
      get() {
        const {level} = this;
        return function(...arguments_) {
          const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
          return createBuilder(this, styler, this._isEmpty);
        };
      }
    };
  }
  for (const model of usedModels) {
    const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
    styles[bgModel] = {
      get() {
        const {level} = this;
        return function(...arguments_) {
          const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
          return createBuilder(this, styler, this._isEmpty);
        };
      }
    };
  }
  const proto = Object.defineProperties(() => {
  }, {
    ...styles,
    level: {
      enumerable: true,
      get() {
        return this._generator.level;
      },
      set(level) {
        this._generator.level = level;
      }
    }
  });
  const createStyler = (open, close, parent) => {
    let openAll;
    let closeAll;
    if (parent === void 0) {
      openAll = open;
      closeAll = close;
    } else {
      openAll = parent.openAll + open;
      closeAll = close + parent.closeAll;
    }
    return {
      open,
      close,
      openAll,
      closeAll,
      parent
    };
  };
  const createBuilder = (self2, _styler, _isEmpty) => {
    const builder = (...arguments_) => {
      return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
    };
    builder.__proto__ = proto;
    builder._generator = self2;
    builder._styler = _styler;
    builder._isEmpty = _isEmpty;
    return builder;
  };
  const applyStyle = (self2, string) => {
    if (self2.level <= 0 || !string) {
      return self2._isEmpty ? "" : string;
    }
    let styler = self2._styler;
    if (styler === void 0) {
      return string;
    }
    const {openAll, closeAll} = styler;
    if (string.indexOf("") !== -1) {
      while (styler !== void 0) {
        string = stringReplaceAll(string, styler.close, styler.open);
        styler = styler.parent;
      }
    }
    const lfIndex = string.indexOf("\n");
    if (lfIndex !== -1) {
      string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
    }
    return openAll + string + closeAll;
  };
  let template;
  const chalkTag = (chalk2, ...strings) => {
    const [firstString] = strings;
    if (!Array.isArray(firstString)) {
      return strings.join(" ");
    }
    const arguments_ = strings.slice(1);
    const parts = [firstString.raw[0]];
    for (let i = 1; i < firstString.length; i++) {
      parts.push(String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"), String(firstString.raw[i]));
    }
    if (template === void 0) {
      template = require_templates();
    }
    return template(chalk2, parts.join(""));
  };
  Object.defineProperties(Chalk.prototype, styles);
  const chalk = Chalk();
  chalk.supportsColor = stdoutColor;
  chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0});
  chalk.stderr.supportsColor = stderrColor;
  chalk.Level = {
    None: 0,
    Basic: 1,
    Ansi256: 2,
    TrueColor: 3,
    0: "None",
    1: "Basic",
    2: "Ansi256",
    3: "TrueColor"
  };
  module2.exports = chalk;
});

// node_modules/envalid/src/reporter.js
var require_reporter = __commonJS((exports, module2) => {
  const {EnvMissingError} = require_validators();
  const chalk = require_source();
  const RULE = chalk.grey("================================");
  module2.exports = function defaultReporter({errors = {}, env: env2 = {}}) {
    const errorKeys = Object.keys(errors);
    if (!errorKeys.length)
      return;
    const missingVarsOutput = [];
    const invalidVarsOutput = [];
    for (const k of errorKeys) {
      const err = errors[k];
      if (err instanceof EnvMissingError) {
        missingVarsOutput.push(`    ${chalk.blue(k)}: ${errors[k].message || "(required)"}`);
      } else
        invalidVarsOutput.push(`    ${chalk.blue(k)}: ${errors[k].message}`);
    }
    if (invalidVarsOutput.length) {
      invalidVarsOutput.unshift(` ${chalk.yellow("Invalid")} environment variables:`);
    }
    if (missingVarsOutput.length) {
      missingVarsOutput.unshift(` ${chalk.yellow("Missing")} environment variables:`);
    }
    const output = [
      RULE,
      invalidVarsOutput.join("\n"),
      missingVarsOutput.join("\n"),
      chalk.yellow("\n Exiting with error code 1"),
      RULE
    ].filter((x) => !!x).join("\n");
    console.error(output);
    process.exit(1);
  };
});

// node_modules/meant/index.js
var require_meant = __commonJS((exports, module2) => {
  function levenshteinD(s1, s2) {
    var d = [];
    var i = 0;
    for (i = 0; i <= s1.length; i++)
      d[i] = [i];
    for (i = 0; i <= s2.length; i++)
      d[0][i] = i;
    s2.split("").forEach(function(c2, j) {
      s1.split("").forEach(function(c1, i2) {
        if (c1 === c2) {
          d[i2 + 1][j + 1] = d[i2][j];
          return;
        }
        d[i2 + 1][j + 1] = Math.min(d[i2][j + 1] + 1, d[i2 + 1][j] + 1, d[i2][j] + 1);
      });
    });
    return d[s1.length][s2.length];
  }
  function meant(scmd, commands) {
    var d = [];
    var bestSimilarity = [];
    commands.forEach(function(cmd, i) {
      var item = {};
      item[levenshteinD(scmd, cmd)] = i;
      d.push(item);
    });
    d.sort(function(a, b) {
      return Number(Object.keys(a)[0]) - Number(Object.keys(b)[0]);
    });
    d.forEach(function(item) {
      var key = Number(Object.keys(item)[0]);
      if (scmd.length / 2 >= key) {
        bestSimilarity.push(commands[item[key]]);
      }
    });
    return bestSimilarity;
  }
  module2.exports = meant;
});

// node_modules/envalid/src/strictProxy.js
var require_strictProxy = __commonJS((exports, module2) => {
  const meant = require_meant();
  const didYouMean = (scmd, commands) => {
    const bestSimilarity = meant(scmd, commands);
    const suggestion = bestSimilarity.join(", ");
    if (bestSimilarity.length > 0) {
      throw new ReferenceError(`[envalid] Env var ${scmd} not found, did you mean ${suggestion}?`);
    }
  };
  const inspectables = [
    "length",
    "inspect",
    "hasOwnProperty",
    Symbol.toStringTag,
    Symbol.iterator,
    "then",
    "__esModule"
  ];
  const inspectSymbolStrings = ["Symbol(util.inspect.custom)", "Symbol(nodejs.util.inspect.custom)"];
  module2.exports = (envObj, originalEnv) => new Proxy(envObj, {
    get(target, name) {
      if (inspectables.includes(name) || inspectSymbolStrings.includes(name.toString())) {
        return envObj[name];
      }
      const varExists = envObj.hasOwnProperty(name);
      if (!varExists) {
        if (originalEnv.hasOwnProperty(name)) {
          throw new ReferenceError(`[envalid] Env var ${name} was accessed but not validated. This var is set in the environment; please add an envalid validator for it.`);
        }
        didYouMean(name, Object.keys(envObj));
        throw new ReferenceError(`[envalid] Env var not found: ${name}`);
      }
      return envObj[name];
    },
    set(target, name) {
      throw new TypeError(`[envalid] Attempt to mutate environment value: ${name}`);
    }
  });
});

// node_modules/envalid/src/envalidWithoutDotenv.js
var require_envalidWithoutDotenv = __commonJS((exports, module2) => {
  const {
    EnvError,
    EnvMissingError,
    makeValidator,
    bool,
    num,
    str: str2,
    json,
    url,
    email,
    host,
    port
  } = require_validators();
  const {extend} = require_utils6();
  const testOnlySymbol = Symbol("envalid - test only");
  function validateVar({spec = {}, name, rawValue}) {
    if (typeof spec._parse !== "function") {
      throw new EnvError(`Invalid spec for "${name}"`);
    }
    const value = spec._parse(rawValue);
    if (spec.choices) {
      if (!Array.isArray(spec.choices)) {
        throw new TypeError(`"choices" must be an array (in spec for "${name}")`);
      } else if (!spec.choices.includes(value)) {
        throw new EnvError(`Value "${value}" not in choices [${spec.choices}]`);
      }
    }
    if (value == null)
      throw new EnvError(`Invalid value for env var "${name}"`);
    return value;
  }
  function formatSpecDescription(spec) {
    const egText = spec.example ? ` (eg. "${spec.example}")` : "";
    const docsText = spec.docs ? `. See ${spec.docs}` : "";
    return `${spec.desc}${egText}${docsText}` || "";
  }
  function cleanEnv(env2, specs = {}, options = {}) {
    let output = {};
    let defaultNodeEnv = "";
    const errors = {};
    const varKeys = Object.keys(specs);
    if (!varKeys.includes("NODE_ENV")) {
      defaultNodeEnv = validateVar({
        name: "NODE_ENV",
        spec: str2({choices: ["development", "test", "production"]}),
        rawValue: env2.NODE_ENV || "production"
      });
    }
    for (const k of varKeys) {
      const spec = specs[k];
      const usingDevDefault = env2.NODE_ENV !== "production" && spec.hasOwnProperty("devDefault");
      const devDefault = usingDevDefault ? spec.devDefault : void 0;
      let rawValue = env2[k];
      if (rawValue === void 0) {
        rawValue = devDefault === void 0 ? spec.default : devDefault;
      }
      const usingFalsyDefault = spec.hasOwnProperty("default") && spec.default === rawValue || usingDevDefault && devDefault === rawValue;
      try {
        if (rawValue === testOnlySymbol) {
          throw new EnvMissingError(formatSpecDescription(spec));
        }
        if (rawValue === void 0) {
          if (!usingFalsyDefault) {
            throw new EnvMissingError(formatSpecDescription(spec));
          }
          output[k] = void 0;
        } else {
          output[k] = validateVar({name: k, spec, rawValue});
        }
      } catch (err) {
        if (options.reporter === null)
          throw err;
        errors[k] = err;
      }
    }
    output = options.strict ? output : extend(env2, output);
    const computedNodeEnv = defaultNodeEnv || output.NODE_ENV;
    Object.defineProperties(output, {
      isDevelopment: {value: computedNodeEnv === "development"},
      isDev: {value: computedNodeEnv === "development"},
      isProduction: {value: computedNodeEnv === "production"},
      isProd: {value: computedNodeEnv === "production"},
      isTest: {value: computedNodeEnv === "test"}
    });
    if (options.transformer) {
      output = options.transformer(output);
    }
    const reporter = options.reporter || require_reporter();
    reporter({errors, env: output});
    if (options.strict)
      output = require_strictProxy()(output, env2);
    return Object.freeze(output);
  }
  const testOnly2 = (defaultValueForTests) => {
    return process.env.NODE_ENV === "test" ? defaultValueForTests : testOnlySymbol;
  };
  module2.exports = {
    cleanEnv,
    makeValidator,
    EnvError,
    EnvMissingError,
    testOnly: testOnly2,
    bool,
    num,
    str: str2,
    json,
    host,
    port,
    url,
    email
  };
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS((exports, module2) => {
  const fs2 = require("fs");
  const path3 = require("path");
  function log(message) {
    console.log(`[dotenv][DEBUG] ${message}`);
  }
  const NEWLINE = "\n";
  const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
  const RE_NEWLINES = /\\n/g;
  const NEWLINES_MATCH = /\n|\r|\r\n/;
  function parse(src2, options) {
    const debug19 = Boolean(options && options.debug);
    const obj = {};
    src2.toString().split(NEWLINES_MATCH).forEach(function(line, idx) {
      const keyValueArr = line.match(RE_INI_KEY_VAL);
      if (keyValueArr != null) {
        const key = keyValueArr[1];
        let val = keyValueArr[2] || "";
        const end = val.length - 1;
        const isDoubleQuoted = val[0] === '"' && val[end] === '"';
        const isSingleQuoted = val[0] === "'" && val[end] === "'";
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end);
          if (isDoubleQuoted) {
            val = val.replace(RE_NEWLINES, NEWLINE);
          }
        } else {
          val = val.trim();
        }
        obj[key] = val;
      } else if (debug19) {
        log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
      }
    });
    return obj;
  }
  function config(options) {
    let dotenvPath = path3.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    let debug19 = false;
    if (options) {
      if (options.path != null) {
        dotenvPath = options.path;
      }
      if (options.encoding != null) {
        encoding = options.encoding;
      }
      if (options.debug != null) {
        debug19 = true;
      }
    }
    try {
      const parsed = parse(fs2.readFileSync(dotenvPath, {encoding}), {debug: debug19});
      Object.keys(parsed).forEach(function(key) {
        if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
          process.env[key] = parsed[key];
        } else if (debug19) {
          log(`"${key}" is already defined in \`process.env\` and will not be overwritten`);
        }
      });
      return {parsed};
    } catch (e) {
      return {error: e};
    }
  }
  module2.exports.config = config;
  module2.exports.parse = parse;
});

// node_modules/envalid/src/envalid.js
var require_envalid = __commonJS((exports, module2) => {
  const envalid3 = require_envalidWithoutDotenv();
  const {extend} = require_utils6();
  const fs2 = require("fs");
  const dotenv = require_main();
  function extendWithDotEnv(inputEnv, dotEnvPath = ".env") {
    let dotEnvBuffer = null;
    try {
      dotEnvBuffer = fs2.readFileSync(dotEnvPath);
    } catch (err) {
      if (err.code === "ENOENT")
        return inputEnv;
      throw err;
    }
    const parsed = dotenv.parse(dotEnvBuffer);
    return extend(parsed, inputEnv);
  }
  const originalCleanEnv = envalid3.cleanEnv;
  envalid3.cleanEnv = function cleanEnv(inputEnv, specs = {}, options = {}) {
    const env2 = options.dotEnvPath !== null ? extendWithDotEnv(inputEnv, options.dotEnvPath) : inputEnv;
    return originalCleanEnv(env2, specs, options);
  };
  module2.exports = envalid3;
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS((exports, module2) => {
  module2.exports = function(xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
      var x = fn(xs[i], i);
      if (isArray(x))
        res.push.apply(res, x);
      else
        res.push(x);
    }
    return res;
  };
  var isArray = Array.isArray || function(xs) {
    return Object.prototype.toString.call(xs) === "[object Array]";
  };
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS((exports, module2) => {
  "use strict";
  module2.exports = balanced;
  function balanced(a, b, str2) {
    if (a instanceof RegExp)
      a = maybeMatch(a, str2);
    if (b instanceof RegExp)
      b = maybeMatch(b, str2);
    var r = range(a, b, str2);
    return r && {
      start: r[0],
      end: r[1],
      pre: str2.slice(0, r[0]),
      body: str2.slice(r[0] + a.length, r[1]),
      post: str2.slice(r[1] + b.length)
    };
  }
  function maybeMatch(reg, str2) {
    var m = str2.match(reg);
    return m ? m[0] : null;
  }
  balanced.range = range;
  function range(a, b, str2) {
    var begs, beg, left, right, result;
    var ai = str2.indexOf(a);
    var bi = str2.indexOf(b, ai + 1);
    var i = ai;
    if (ai >= 0 && bi > 0) {
      begs = [];
      left = str2.length;
      while (i >= 0 && !result) {
        if (i == ai) {
          begs.push(i);
          ai = str2.indexOf(a, i + 1);
        } else if (begs.length == 1) {
          result = [begs.pop(), bi];
        } else {
          beg = begs.pop();
          if (beg < left) {
            left = beg;
            right = bi;
          }
          bi = str2.indexOf(b, i + 1);
        }
        i = ai < bi && ai >= 0 ? ai : bi;
      }
      if (begs.length) {
        result = [left, right];
      }
    }
    return result;
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS((exports, module2) => {
  var concatMap = require_concat_map();
  var balanced = require_balanced_match();
  module2.exports = expandTop;
  var escSlash = "\0SLASH" + Math.random() + "\0";
  var escOpen = "\0OPEN" + Math.random() + "\0";
  var escClose = "\0CLOSE" + Math.random() + "\0";
  var escComma = "\0COMMA" + Math.random() + "\0";
  var escPeriod = "\0PERIOD" + Math.random() + "\0";
  function numeric(str2) {
    return parseInt(str2, 10) == str2 ? parseInt(str2, 10) : str2.charCodeAt(0);
  }
  function escapeBraces(str2) {
    return str2.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
  }
  function unescapeBraces(str2) {
    return str2.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
  }
  function parseCommaParts(str2) {
    if (!str2)
      return [""];
    var parts = [];
    var m = balanced("{", "}", str2);
    if (!m)
      return str2.split(",");
    var pre = m.pre;
    var body = m.body;
    var post = m.post;
    var p = pre.split(",");
    p[p.length - 1] += "{" + body + "}";
    var postParts = parseCommaParts(post);
    if (post.length) {
      p[p.length - 1] += postParts.shift();
      p.push.apply(p, postParts);
    }
    parts.push.apply(parts, p);
    return parts;
  }
  function expandTop(str2) {
    if (!str2)
      return [];
    if (str2.substr(0, 2) === "{}") {
      str2 = "\\{\\}" + str2.substr(2);
    }
    return expand(escapeBraces(str2), true).map(unescapeBraces);
  }
  function embrace(str2) {
    return "{" + str2 + "}";
  }
  function isPadded(el) {
    return /^-?0\d/.test(el);
  }
  function lte(i, y) {
    return i <= y;
  }
  function gte(i, y) {
    return i >= y;
  }
  function expand(str2, isTop) {
    var expansions = [];
    var m = balanced("{", "}", str2);
    if (!m || /\$$/.test(m.pre))
      return [str2];
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions) {
      if (m.post.match(/,.*\}/)) {
        str2 = m.pre + "{" + m.body + escClose + m.post;
        return expand(str2);
      }
      return [str2];
    }
    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        n = expand(n[0], false).map(embrace);
        if (n.length === 1) {
          var post = m.post.length ? expand(m.post, false) : [""];
          return post.map(function(p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }
    var pre = m.pre;
    var post = m.post.length ? expand(m.post, false) : [""];
    var N;
    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length);
      var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);
      N = [];
      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === "\\")
            c = "";
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join("0");
              if (i < 0)
                c = "-" + z + c.slice(1);
              else
                c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = concatMap(n, function(el) {
        return expand(el, false);
      });
    }
    for (var j = 0; j < N.length; j++) {
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion)
          expansions.push(expansion);
      }
    }
    return expansions;
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS((exports, module2) => {
  module2.exports = minimatch3;
  minimatch3.Minimatch = Minimatch;
  var path3 = {sep: "/"};
  try {
    path3 = require("path");
  } catch (er) {
  }
  var GLOBSTAR = minimatch3.GLOBSTAR = Minimatch.GLOBSTAR = {};
  var expand = require_brace_expansion();
  var plTypes = {
    "!": {open: "(?:(?!(?:", close: "))[^/]*?)"},
    "?": {open: "(?:", close: ")?"},
    "+": {open: "(?:", close: ")+"},
    "*": {open: "(?:", close: ")*"},
    "@": {open: "(?:", close: ")"}
  };
  var qmark = "[^/]";
  var star = qmark + "*?";
  var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
  var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
  var reSpecials = charSet("().*{}+?[]^$\\!");
  function charSet(s) {
    return s.split("").reduce(function(set, c) {
      set[c] = true;
      return set;
    }, {});
  }
  var slashSplit = /\/+/;
  minimatch3.filter = filter;
  function filter(pattern, options) {
    options = options || {};
    return function(p, i, list) {
      return minimatch3(p, pattern, options);
    };
  }
  function ext(a, b) {
    a = a || {};
    b = b || {};
    var t = {};
    Object.keys(b).forEach(function(k) {
      t[k] = b[k];
    });
    Object.keys(a).forEach(function(k) {
      t[k] = a[k];
    });
    return t;
  }
  minimatch3.defaults = function(def) {
    if (!def || !Object.keys(def).length)
      return minimatch3;
    var orig = minimatch3;
    var m = function minimatch4(p, pattern, options) {
      return orig.minimatch(p, pattern, ext(def, options));
    };
    m.Minimatch = function Minimatch2(pattern, options) {
      return new orig.Minimatch(pattern, ext(def, options));
    };
    return m;
  };
  Minimatch.defaults = function(def) {
    if (!def || !Object.keys(def).length)
      return Minimatch;
    return minimatch3.defaults(def).Minimatch;
  };
  function minimatch3(p, pattern, options) {
    if (typeof pattern !== "string") {
      throw new TypeError("glob pattern string required");
    }
    if (!options)
      options = {};
    if (!options.nocomment && pattern.charAt(0) === "#") {
      return false;
    }
    if (pattern.trim() === "")
      return p === "";
    return new Minimatch(pattern, options).match(p);
  }
  function Minimatch(pattern, options) {
    if (!(this instanceof Minimatch)) {
      return new Minimatch(pattern, options);
    }
    if (typeof pattern !== "string") {
      throw new TypeError("glob pattern string required");
    }
    if (!options)
      options = {};
    pattern = pattern.trim();
    if (path3.sep !== "/") {
      pattern = pattern.split(path3.sep).join("/");
    }
    this.options = options;
    this.set = [];
    this.pattern = pattern;
    this.regexp = null;
    this.negate = false;
    this.comment = false;
    this.empty = false;
    this.make();
  }
  Minimatch.prototype.debug = function() {
  };
  Minimatch.prototype.make = make;
  function make() {
    if (this._made)
      return;
    var pattern = this.pattern;
    var options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    var set = this.globSet = this.braceExpand();
    if (options.debug)
      this.debug = console.error;
    this.debug(this.pattern, set);
    set = this.globParts = set.map(function(s) {
      return s.split(slashSplit);
    });
    this.debug(this.pattern, set);
    set = set.map(function(s, si, set2) {
      return s.map(this.parse, this);
    }, this);
    this.debug(this.pattern, set);
    set = set.filter(function(s) {
      return s.indexOf(false) === -1;
    });
    this.debug(this.pattern, set);
    this.set = set;
  }
  Minimatch.prototype.parseNegate = parseNegate;
  function parseNegate() {
    var pattern = this.pattern;
    var negate = false;
    var options = this.options;
    var negateOffset = 0;
    if (options.nonegate)
      return;
    for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset)
      this.pattern = pattern.substr(negateOffset);
    this.negate = negate;
  }
  minimatch3.braceExpand = function(pattern, options) {
    return braceExpand(pattern, options);
  };
  Minimatch.prototype.braceExpand = braceExpand;
  function braceExpand(pattern, options) {
    if (!options) {
      if (this instanceof Minimatch) {
        options = this.options;
      } else {
        options = {};
      }
    }
    pattern = typeof pattern === "undefined" ? this.pattern : pattern;
    if (typeof pattern === "undefined") {
      throw new TypeError("undefined pattern");
    }
    if (options.nobrace || !pattern.match(/\{.*\}/)) {
      return [pattern];
    }
    return expand(pattern);
  }
  Minimatch.prototype.parse = parse;
  var SUBPARSE = {};
  function parse(pattern, isSub) {
    if (pattern.length > 1024 * 64) {
      throw new TypeError("pattern is too long");
    }
    var options = this.options;
    if (!options.noglobstar && pattern === "**")
      return GLOBSTAR;
    if (pattern === "")
      return "";
    var re = "";
    var hasMagic = !!options.nocase;
    var escaping = false;
    var patternListStack = [];
    var negativeLists = [];
    var stateChar;
    var inClass = false;
    var reClassStart = -1;
    var classStart = -1;
    var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
    var self2 = this;
    function clearStateChar() {
      if (stateChar) {
        switch (stateChar) {
          case "*":
            re += star;
            hasMagic = true;
            break;
          case "?":
            re += qmark;
            hasMagic = true;
            break;
          default:
            re += "\\" + stateChar;
            break;
        }
        self2.debug("clearStateChar %j %j", stateChar, re);
        stateChar = false;
      }
    }
    for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
      this.debug("%s	%s %s %j", pattern, i, re, c);
      if (escaping && reSpecials[c]) {
        re += "\\" + c;
        escaping = false;
        continue;
      }
      switch (c) {
        case "/":
          return false;
        case "\\":
          clearStateChar();
          escaping = true;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
          if (inClass) {
            this.debug("  in class");
            if (c === "!" && i === classStart + 1)
              c = "^";
            re += c;
            continue;
          }
          self2.debug("call clearStateChar %j", stateChar);
          clearStateChar();
          stateChar = c;
          if (options.noext)
            clearStateChar();
          continue;
        case "(":
          if (inClass) {
            re += "(";
            continue;
          }
          if (!stateChar) {
            re += "\\(";
            continue;
          }
          patternListStack.push({
            type: stateChar,
            start: i - 1,
            reStart: re.length,
            open: plTypes[stateChar].open,
            close: plTypes[stateChar].close
          });
          re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
          this.debug("plType %j %j", stateChar, re);
          stateChar = false;
          continue;
        case ")":
          if (inClass || !patternListStack.length) {
            re += "\\)";
            continue;
          }
          clearStateChar();
          hasMagic = true;
          var pl = patternListStack.pop();
          re += pl.close;
          if (pl.type === "!") {
            negativeLists.push(pl);
          }
          pl.reEnd = re.length;
          continue;
        case "|":
          if (inClass || !patternListStack.length || escaping) {
            re += "\\|";
            escaping = false;
            continue;
          }
          clearStateChar();
          re += "|";
          continue;
        case "[":
          clearStateChar();
          if (inClass) {
            re += "\\" + c;
            continue;
          }
          inClass = true;
          classStart = i;
          reClassStart = re.length;
          re += c;
          continue;
        case "]":
          if (i === classStart + 1 || !inClass) {
            re += "\\" + c;
            escaping = false;
            continue;
          }
          if (inClass) {
            var cs = pattern.substring(classStart + 1, i);
            try {
              RegExp("[" + cs + "]");
            } catch (er) {
              var sp = this.parse(cs, SUBPARSE);
              re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
              hasMagic = hasMagic || sp[1];
              inClass = false;
              continue;
            }
          }
          hasMagic = true;
          inClass = false;
          re += c;
          continue;
        default:
          clearStateChar();
          if (escaping) {
            escaping = false;
          } else if (reSpecials[c] && !(c === "^" && inClass)) {
            re += "\\";
          }
          re += c;
      }
    }
    if (inClass) {
      cs = pattern.substr(classStart + 1);
      sp = this.parse(cs, SUBPARSE);
      re = re.substr(0, reClassStart) + "\\[" + sp[0];
      hasMagic = hasMagic || sp[1];
    }
    for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
      var tail = re.slice(pl.reStart + pl.open.length);
      this.debug("setting tail", re, pl);
      tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
        if (!$2) {
          $2 = "\\";
        }
        return $1 + $1 + $2 + "|";
      });
      this.debug("tail=%j\n   %s", tail, tail, pl, re);
      var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
      hasMagic = true;
      re = re.slice(0, pl.reStart) + t + "\\(" + tail;
    }
    clearStateChar();
    if (escaping) {
      re += "\\\\";
    }
    var addPatternStart = false;
    switch (re.charAt(0)) {
      case ".":
      case "[":
      case "(":
        addPatternStart = true;
    }
    for (var n = negativeLists.length - 1; n > -1; n--) {
      var nl = negativeLists[n];
      var nlBefore = re.slice(0, nl.reStart);
      var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
      var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
      var nlAfter = re.slice(nl.reEnd);
      nlLast += nlAfter;
      var openParensBefore = nlBefore.split("(").length - 1;
      var cleanAfter = nlAfter;
      for (i = 0; i < openParensBefore; i++) {
        cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
      }
      nlAfter = cleanAfter;
      var dollar = "";
      if (nlAfter === "" && isSub !== SUBPARSE) {
        dollar = "$";
      }
      var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
      re = newRe;
    }
    if (re !== "" && hasMagic) {
      re = "(?=.)" + re;
    }
    if (addPatternStart) {
      re = patternStart + re;
    }
    if (isSub === SUBPARSE) {
      return [re, hasMagic];
    }
    if (!hasMagic) {
      return globUnescape(pattern);
    }
    var flags = options.nocase ? "i" : "";
    try {
      var regExp = new RegExp("^" + re + "$", flags);
    } catch (er) {
      return new RegExp("$.");
    }
    regExp._glob = pattern;
    regExp._src = re;
    return regExp;
  }
  minimatch3.makeRe = function(pattern, options) {
    return new Minimatch(pattern, options || {}).makeRe();
  };
  Minimatch.prototype.makeRe = makeRe;
  function makeRe() {
    if (this.regexp || this.regexp === false)
      return this.regexp;
    var set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    var options = this.options;
    var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
    var flags = options.nocase ? "i" : "";
    var re = set.map(function(pattern) {
      return pattern.map(function(p) {
        return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
      }).join("\\/");
    }).join("|");
    re = "^(?:" + re + ")$";
    if (this.negate)
      re = "^(?!" + re + ").*$";
    try {
      this.regexp = new RegExp(re, flags);
    } catch (ex) {
      this.regexp = false;
    }
    return this.regexp;
  }
  minimatch3.match = function(list, pattern, options) {
    options = options || {};
    var mm = new Minimatch(pattern, options);
    list = list.filter(function(f) {
      return mm.match(f);
    });
    if (mm.options.nonull && !list.length) {
      list.push(pattern);
    }
    return list;
  };
  Minimatch.prototype.match = match;
  function match(f, partial) {
    this.debug("match", f, this.pattern);
    if (this.comment)
      return false;
    if (this.empty)
      return f === "";
    if (f === "/" && partial)
      return true;
    var options = this.options;
    if (path3.sep !== "/") {
      f = f.split(path3.sep).join("/");
    }
    f = f.split(slashSplit);
    this.debug(this.pattern, "split", f);
    var set = this.set;
    this.debug(this.pattern, "set", set);
    var filename;
    var i;
    for (i = f.length - 1; i >= 0; i--) {
      filename = f[i];
      if (filename)
        break;
    }
    for (i = 0; i < set.length; i++) {
      var pattern = set[i];
      var file = f;
      if (options.matchBase && pattern.length === 1) {
        file = [filename];
      }
      var hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate)
          return true;
        return !this.negate;
      }
    }
    if (options.flipNegate)
      return false;
    return this.negate;
  }
  Minimatch.prototype.matchOne = function(file, pattern, partial) {
    var options = this.options;
    this.debug("matchOne", {this: this, file, pattern});
    this.debug("matchOne", file.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      var p = pattern[pi];
      var f = file[fi];
      this.debug(pattern, p, f);
      if (p === false)
        return false;
      if (p === GLOBSTAR) {
        this.debug("GLOBSTAR", [pattern, p, f]);
        var fr = fi;
        var pr = pi + 1;
        if (pr === pl) {
          this.debug("** at the end");
          for (; fi < fl; fi++) {
            if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
              return false;
          }
          return true;
        }
        while (fr < fl) {
          var swallowee = file[fr];
          this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
          if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
            this.debug("globstar found match!", fr, fl, swallowee);
            return true;
          } else {
            if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
              this.debug("dot detected!", file, fr, pattern, pr);
              break;
            }
            this.debug("globstar swallow a segment, and continue");
            fr++;
          }
        }
        if (partial) {
          this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
          if (fr === fl)
            return true;
        }
        return false;
      }
      var hit;
      if (typeof p === "string") {
        if (options.nocase) {
          hit = f.toLowerCase() === p.toLowerCase();
        } else {
          hit = f === p;
        }
        this.debug("string match", p, f, hit);
      } else {
        hit = f.match(p);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit)
        return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      var emptyFileEnd = fi === fl - 1 && file[fi] === "";
      return emptyFileEnd;
    }
    throw new Error("wtf?");
  };
  function globUnescape(s) {
    return s.replace(/\\(.)/g, "$1");
  }
  function regExpEscape(s) {
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
});

// node_modules/jsonpath/jsonpath.js
var require_jsonpath = __commonJS((exports, module2) => {
  /*! jsonpath 1.0.2 */
  (function(f) {
    if (typeof exports === "object" && typeof module2 !== "undefined") {
      module2.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }
      g.jsonpath = f();
    }
  })(function() {
    var define2, module3, exports2;
    return function e(t, n, r) {
      function s(o2, u) {
        if (!n[o2]) {
          if (!t[o2]) {
            var a = require;
            if (!u && a)
              return a(o2, true);
            if (i)
              return i(o2, true);
            var f = new Error("Cannot find module '" + o2 + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
          }
          var l = n[o2] = {exports: {}};
          t[o2][0].call(l.exports, function(e2) {
            var n2 = t[o2][1][e2];
            return s(n2 ? n2 : e2);
          }, l, l.exports, e, t, n, r);
        }
        return n[o2].exports;
      }
      var i = require;
      for (var o = 0; o < r.length; o++)
        s(r[o]);
      return s;
    }({"./aesprim": [function(require2, module4, exports3) {
      (function(root, factory) {
        "use strict";
        if (typeof define2 === "function" && define2.amd) {
          define2(["exports"], factory);
        } else if (typeof exports3 !== "undefined") {
          factory(exports3);
        } else {
          factory(root.esprima = {});
        }
      })(this, function(exports4) {
        "use strict";
        var Token, TokenName, FnExprTokens, Syntax, PropertyKind, Messages, Regex, SyntaxTreeDelegate, source, strict, index, lineNumber, lineStart, length, delegate, lookahead, state, extra;
        Token = {
          BooleanLiteral: 1,
          EOF: 2,
          Identifier: 3,
          Keyword: 4,
          NullLiteral: 5,
          NumericLiteral: 6,
          Punctuator: 7,
          StringLiteral: 8,
          RegularExpression: 9
        };
        TokenName = {};
        TokenName[Token.BooleanLiteral] = "Boolean";
        TokenName[Token.EOF] = "<end>";
        TokenName[Token.Identifier] = "Identifier";
        TokenName[Token.Keyword] = "Keyword";
        TokenName[Token.NullLiteral] = "Null";
        TokenName[Token.NumericLiteral] = "Numeric";
        TokenName[Token.Punctuator] = "Punctuator";
        TokenName[Token.StringLiteral] = "String";
        TokenName[Token.RegularExpression] = "RegularExpression";
        FnExprTokens = [
          "(",
          "{",
          "[",
          "in",
          "typeof",
          "instanceof",
          "new",
          "return",
          "case",
          "delete",
          "throw",
          "void",
          "=",
          "+=",
          "-=",
          "*=",
          "/=",
          "%=",
          "<<=",
          ">>=",
          ">>>=",
          "&=",
          "|=",
          "^=",
          ",",
          "+",
          "-",
          "*",
          "/",
          "%",
          "++",
          "--",
          "<<",
          ">>",
          ">>>",
          "&",
          "|",
          "^",
          "!",
          "~",
          "&&",
          "||",
          "?",
          ":",
          "===",
          "==",
          ">=",
          "<=",
          "<",
          ">",
          "!=",
          "!=="
        ];
        Syntax = {
          AssignmentExpression: "AssignmentExpression",
          ArrayExpression: "ArrayExpression",
          BlockStatement: "BlockStatement",
          BinaryExpression: "BinaryExpression",
          BreakStatement: "BreakStatement",
          CallExpression: "CallExpression",
          CatchClause: "CatchClause",
          ConditionalExpression: "ConditionalExpression",
          ContinueStatement: "ContinueStatement",
          DoWhileStatement: "DoWhileStatement",
          DebuggerStatement: "DebuggerStatement",
          EmptyStatement: "EmptyStatement",
          ExpressionStatement: "ExpressionStatement",
          ForStatement: "ForStatement",
          ForInStatement: "ForInStatement",
          FunctionDeclaration: "FunctionDeclaration",
          FunctionExpression: "FunctionExpression",
          Identifier: "Identifier",
          IfStatement: "IfStatement",
          Literal: "Literal",
          LabeledStatement: "LabeledStatement",
          LogicalExpression: "LogicalExpression",
          MemberExpression: "MemberExpression",
          NewExpression: "NewExpression",
          ObjectExpression: "ObjectExpression",
          Program: "Program",
          Property: "Property",
          ReturnStatement: "ReturnStatement",
          SequenceExpression: "SequenceExpression",
          SwitchStatement: "SwitchStatement",
          SwitchCase: "SwitchCase",
          ThisExpression: "ThisExpression",
          ThrowStatement: "ThrowStatement",
          TryStatement: "TryStatement",
          UnaryExpression: "UnaryExpression",
          UpdateExpression: "UpdateExpression",
          VariableDeclaration: "VariableDeclaration",
          VariableDeclarator: "VariableDeclarator",
          WhileStatement: "WhileStatement",
          WithStatement: "WithStatement"
        };
        PropertyKind = {
          Data: 1,
          Get: 2,
          Set: 4
        };
        Messages = {
          UnexpectedToken: "Unexpected token %0",
          UnexpectedNumber: "Unexpected number",
          UnexpectedString: "Unexpected string",
          UnexpectedIdentifier: "Unexpected identifier",
          UnexpectedReserved: "Unexpected reserved word",
          UnexpectedEOS: "Unexpected end of input",
          NewlineAfterThrow: "Illegal newline after throw",
          InvalidRegExp: "Invalid regular expression",
          UnterminatedRegExp: "Invalid regular expression: missing /",
          InvalidLHSInAssignment: "Invalid left-hand side in assignment",
          InvalidLHSInForIn: "Invalid left-hand side in for-in",
          MultipleDefaultsInSwitch: "More than one default clause in switch statement",
          NoCatchOrFinally: "Missing catch or finally after try",
          UnknownLabel: "Undefined label '%0'",
          Redeclaration: "%0 '%1' has already been declared",
          IllegalContinue: "Illegal continue statement",
          IllegalBreak: "Illegal break statement",
          IllegalReturn: "Illegal return statement",
          StrictModeWith: "Strict mode code may not include a with statement",
          StrictCatchVariable: "Catch variable may not be eval or arguments in strict mode",
          StrictVarName: "Variable name may not be eval or arguments in strict mode",
          StrictParamName: "Parameter name eval or arguments is not allowed in strict mode",
          StrictParamDupe: "Strict mode function may not have duplicate parameter names",
          StrictFunctionName: "Function name may not be eval or arguments in strict mode",
          StrictOctalLiteral: "Octal literals are not allowed in strict mode.",
          StrictDelete: "Delete of an unqualified identifier in strict mode.",
          StrictDuplicateProperty: "Duplicate data property in object literal not allowed in strict mode",
          AccessorDataProperty: "Object literal may not have data and accessor property with the same name",
          AccessorGetSet: "Object literal may not have multiple get/set accessors with the same name",
          StrictLHSAssignment: "Assignment to eval or arguments is not allowed in strict mode",
          StrictLHSPostfix: "Postfix increment/decrement may not have eval or arguments operand in strict mode",
          StrictLHSPrefix: "Prefix increment/decrement may not have eval or arguments operand in strict mode",
          StrictReservedWord: "Use of future reserved word in strict mode"
        };
        Regex = {
          NonAsciiIdentifierStart: new RegExp("[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]"),
          NonAsciiIdentifierPart: new RegExp("[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]")
        };
        function assert(condition, message) {
          if (!condition) {
            throw new Error("ASSERT: " + message);
          }
        }
        function isDecimalDigit(ch) {
          return ch >= 48 && ch <= 57;
        }
        function isHexDigit(ch) {
          return "0123456789abcdefABCDEF".indexOf(ch) >= 0;
        }
        function isOctalDigit(ch) {
          return "01234567".indexOf(ch) >= 0;
        }
        function isWhiteSpace(ch) {
          return ch === 32 || ch === 9 || ch === 11 || ch === 12 || ch === 160 || ch >= 5760 && [5760, 6158, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288, 65279].indexOf(ch) >= 0;
        }
        function isLineTerminator(ch) {
          return ch === 10 || ch === 13 || ch === 8232 || ch === 8233;
        }
        function isIdentifierStart(ch) {
          return ch == 64 || ch === 36 || ch === 95 || ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch));
        }
        function isIdentifierPart(ch) {
          return ch === 36 || ch === 95 || ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch >= 48 && ch <= 57 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch));
        }
        function isFutureReservedWord(id) {
          switch (id) {
            case "class":
            case "enum":
            case "export":
            case "extends":
            case "import":
            case "super":
              return true;
            default:
              return false;
          }
        }
        function isStrictModeReservedWord(id) {
          switch (id) {
            case "implements":
            case "interface":
            case "package":
            case "private":
            case "protected":
            case "public":
            case "static":
            case "yield":
            case "let":
              return true;
            default:
              return false;
          }
        }
        function isRestrictedWord(id) {
          return id === "eval" || id === "arguments";
        }
        function isKeyword(id) {
          if (strict && isStrictModeReservedWord(id)) {
            return true;
          }
          switch (id.length) {
            case 2:
              return id === "if" || id === "in" || id === "do";
            case 3:
              return id === "var" || id === "for" || id === "new" || id === "try" || id === "let";
            case 4:
              return id === "this" || id === "else" || id === "case" || id === "void" || id === "with" || id === "enum";
            case 5:
              return id === "while" || id === "break" || id === "catch" || id === "throw" || id === "const" || id === "yield" || id === "class" || id === "super";
            case 6:
              return id === "return" || id === "typeof" || id === "delete" || id === "switch" || id === "export" || id === "import";
            case 7:
              return id === "default" || id === "finally" || id === "extends";
            case 8:
              return id === "function" || id === "continue" || id === "debugger";
            case 10:
              return id === "instanceof";
            default:
              return false;
          }
        }
        function addComment(type, value, start, end, loc) {
          var comment2, attacher;
          assert(typeof start === "number", "Comment must have valid position");
          if (state.lastCommentStart >= start) {
            return;
          }
          state.lastCommentStart = start;
          comment2 = {
            type,
            value
          };
          if (extra.range) {
            comment2.range = [start, end];
          }
          if (extra.loc) {
            comment2.loc = loc;
          }
          extra.comments.push(comment2);
          if (extra.attachComment) {
            extra.leadingComments.push(comment2);
            extra.trailingComments.push(comment2);
          }
        }
        function skipSingleLineComment(offset) {
          var start, loc, ch, comment2;
          start = index - offset;
          loc = {
            start: {
              line: lineNumber,
              column: index - lineStart - offset
            }
          };
          while (index < length) {
            ch = source.charCodeAt(index);
            ++index;
            if (isLineTerminator(ch)) {
              if (extra.comments) {
                comment2 = source.slice(start + offset, index - 1);
                loc.end = {
                  line: lineNumber,
                  column: index - lineStart - 1
                };
                addComment("Line", comment2, start, index - 1, loc);
              }
              if (ch === 13 && source.charCodeAt(index) === 10) {
                ++index;
              }
              ++lineNumber;
              lineStart = index;
              return;
            }
          }
          if (extra.comments) {
            comment2 = source.slice(start + offset, index);
            loc.end = {
              line: lineNumber,
              column: index - lineStart
            };
            addComment("Line", comment2, start, index, loc);
          }
        }
        function skipMultiLineComment() {
          var start, loc, ch, comment2;
          if (extra.comments) {
            start = index - 2;
            loc = {
              start: {
                line: lineNumber,
                column: index - lineStart - 2
              }
            };
          }
          while (index < length) {
            ch = source.charCodeAt(index);
            if (isLineTerminator(ch)) {
              if (ch === 13 && source.charCodeAt(index + 1) === 10) {
                ++index;
              }
              ++lineNumber;
              ++index;
              lineStart = index;
              if (index >= length) {
                throwError({}, Messages.UnexpectedToken, "ILLEGAL");
              }
            } else if (ch === 42) {
              if (source.charCodeAt(index + 1) === 47) {
                ++index;
                ++index;
                if (extra.comments) {
                  comment2 = source.slice(start + 2, index - 2);
                  loc.end = {
                    line: lineNumber,
                    column: index - lineStart
                  };
                  addComment("Block", comment2, start, index, loc);
                }
                return;
              }
              ++index;
            } else {
              ++index;
            }
          }
          throwError({}, Messages.UnexpectedToken, "ILLEGAL");
        }
        function skipComment() {
          var ch, start;
          start = index === 0;
          while (index < length) {
            ch = source.charCodeAt(index);
            if (isWhiteSpace(ch)) {
              ++index;
            } else if (isLineTerminator(ch)) {
              ++index;
              if (ch === 13 && source.charCodeAt(index) === 10) {
                ++index;
              }
              ++lineNumber;
              lineStart = index;
              start = true;
            } else if (ch === 47) {
              ch = source.charCodeAt(index + 1);
              if (ch === 47) {
                ++index;
                ++index;
                skipSingleLineComment(2);
                start = true;
              } else if (ch === 42) {
                ++index;
                ++index;
                skipMultiLineComment();
              } else {
                break;
              }
            } else if (start && ch === 45) {
              if (source.charCodeAt(index + 1) === 45 && source.charCodeAt(index + 2) === 62) {
                index += 3;
                skipSingleLineComment(3);
              } else {
                break;
              }
            } else if (ch === 60) {
              if (source.slice(index + 1, index + 4) === "!--") {
                ++index;
                ++index;
                ++index;
                ++index;
                skipSingleLineComment(4);
              } else {
                break;
              }
            } else {
              break;
            }
          }
        }
        function scanHexEscape(prefix) {
          var i, len, ch, code = 0;
          len = prefix === "u" ? 4 : 2;
          for (i = 0; i < len; ++i) {
            if (index < length && isHexDigit(source[index])) {
              ch = source[index++];
              code = code * 16 + "0123456789abcdef".indexOf(ch.toLowerCase());
            } else {
              return "";
            }
          }
          return String.fromCharCode(code);
        }
        function getEscapedIdentifier() {
          var ch, id;
          ch = source.charCodeAt(index++);
          id = String.fromCharCode(ch);
          if (ch === 92) {
            if (source.charCodeAt(index) !== 117) {
              throwError({}, Messages.UnexpectedToken, "ILLEGAL");
            }
            ++index;
            ch = scanHexEscape("u");
            if (!ch || ch === "\\" || !isIdentifierStart(ch.charCodeAt(0))) {
              throwError({}, Messages.UnexpectedToken, "ILLEGAL");
            }
            id = ch;
          }
          while (index < length) {
            ch = source.charCodeAt(index);
            if (!isIdentifierPart(ch)) {
              break;
            }
            ++index;
            id += String.fromCharCode(ch);
            if (ch === 92) {
              id = id.substr(0, id.length - 1);
              if (source.charCodeAt(index) !== 117) {
                throwError({}, Messages.UnexpectedToken, "ILLEGAL");
              }
              ++index;
              ch = scanHexEscape("u");
              if (!ch || ch === "\\" || !isIdentifierPart(ch.charCodeAt(0))) {
                throwError({}, Messages.UnexpectedToken, "ILLEGAL");
              }
              id += ch;
            }
          }
          return id;
        }
        function getIdentifier() {
          var start, ch;
          start = index++;
          while (index < length) {
            ch = source.charCodeAt(index);
            if (ch === 92) {
              index = start;
              return getEscapedIdentifier();
            }
            if (isIdentifierPart(ch)) {
              ++index;
            } else {
              break;
            }
          }
          return source.slice(start, index);
        }
        function scanIdentifier() {
          var start, id, type;
          start = index;
          id = source.charCodeAt(index) === 92 ? getEscapedIdentifier() : getIdentifier();
          if (id.length === 1) {
            type = Token.Identifier;
          } else if (isKeyword(id)) {
            type = Token.Keyword;
          } else if (id === "null") {
            type = Token.NullLiteral;
          } else if (id === "true" || id === "false") {
            type = Token.BooleanLiteral;
          } else {
            type = Token.Identifier;
          }
          return {
            type,
            value: id,
            lineNumber,
            lineStart,
            start,
            end: index
          };
        }
        function scanPunctuator() {
          var start = index, code = source.charCodeAt(index), code2, ch1 = source[index], ch2, ch3, ch4;
          switch (code) {
            case 46:
            case 40:
            case 41:
            case 59:
            case 44:
            case 123:
            case 125:
            case 91:
            case 93:
            case 58:
            case 63:
            case 126:
              ++index;
              if (extra.tokenize) {
                if (code === 40) {
                  extra.openParenToken = extra.tokens.length;
                } else if (code === 123) {
                  extra.openCurlyToken = extra.tokens.length;
                }
              }
              return {
                type: Token.Punctuator,
                value: String.fromCharCode(code),
                lineNumber,
                lineStart,
                start,
                end: index
              };
            default:
              code2 = source.charCodeAt(index + 1);
              if (code2 === 61) {
                switch (code) {
                  case 43:
                  case 45:
                  case 47:
                  case 60:
                  case 62:
                  case 94:
                  case 124:
                  case 37:
                  case 38:
                  case 42:
                    index += 2;
                    return {
                      type: Token.Punctuator,
                      value: String.fromCharCode(code) + String.fromCharCode(code2),
                      lineNumber,
                      lineStart,
                      start,
                      end: index
                    };
                  case 33:
                  case 61:
                    index += 2;
                    if (source.charCodeAt(index) === 61) {
                      ++index;
                    }
                    return {
                      type: Token.Punctuator,
                      value: source.slice(start, index),
                      lineNumber,
                      lineStart,
                      start,
                      end: index
                    };
                }
              }
          }
          ch4 = source.substr(index, 4);
          if (ch4 === ">>>=") {
            index += 4;
            return {
              type: Token.Punctuator,
              value: ch4,
              lineNumber,
              lineStart,
              start,
              end: index
            };
          }
          ch3 = ch4.substr(0, 3);
          if (ch3 === ">>>" || ch3 === "<<=" || ch3 === ">>=") {
            index += 3;
            return {
              type: Token.Punctuator,
              value: ch3,
              lineNumber,
              lineStart,
              start,
              end: index
            };
          }
          ch2 = ch3.substr(0, 2);
          if (ch1 === ch2[1] && "+-<>&|".indexOf(ch1) >= 0 || ch2 === "=>") {
            index += 2;
            return {
              type: Token.Punctuator,
              value: ch2,
              lineNumber,
              lineStart,
              start,
              end: index
            };
          }
          if ("<>=!+-*%&|^/".indexOf(ch1) >= 0) {
            ++index;
            return {
              type: Token.Punctuator,
              value: ch1,
              lineNumber,
              lineStart,
              start,
              end: index
            };
          }
          throwError({}, Messages.UnexpectedToken, "ILLEGAL");
        }
        function scanHexLiteral(start) {
          var number = "";
          while (index < length) {
            if (!isHexDigit(source[index])) {
              break;
            }
            number += source[index++];
          }
          if (number.length === 0) {
            throwError({}, Messages.UnexpectedToken, "ILLEGAL");
          }
          if (isIdentifierStart(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, "ILLEGAL");
          }
          return {
            type: Token.NumericLiteral,
            value: parseInt("0x" + number, 16),
            lineNumber,
            lineStart,
            start,
            end: index
          };
        }
        function scanOctalLiteral(start) {
          var number = "0" + source[index++];
          while (index < length) {
            if (!isOctalDigit(source[index])) {
              break;
            }
            number += source[index++];
          }
          if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, "ILLEGAL");
          }
          return {
            type: Token.NumericLiteral,
            value: parseInt(number, 8),
            octal: true,
            lineNumber,
            lineStart,
            start,
            end: index
          };
        }
        function scanNumericLiteral() {
          var number, start, ch;
          ch = source[index];
          assert(isDecimalDigit(ch.charCodeAt(0)) || ch === ".", "Numeric literal must start with a decimal digit or a decimal point");
          start = index;
          number = "";
          if (ch !== ".") {
            number = source[index++];
            ch = source[index];
            if (number === "0") {
              if (ch === "x" || ch === "X") {
                ++index;
                return scanHexLiteral(start);
              }
              if (isOctalDigit(ch)) {
                return scanOctalLiteral(start);
              }
              if (ch && isDecimalDigit(ch.charCodeAt(0))) {
                throwError({}, Messages.UnexpectedToken, "ILLEGAL");
              }
            }
            while (isDecimalDigit(source.charCodeAt(index))) {
              number += source[index++];
            }
            ch = source[index];
          }
          if (ch === ".") {
            number += source[index++];
            while (isDecimalDigit(source.charCodeAt(index))) {
              number += source[index++];
            }
            ch = source[index];
          }
          if (ch === "e" || ch === "E") {
            number += source[index++];
            ch = source[index];
            if (ch === "+" || ch === "-") {
              number += source[index++];
            }
            if (isDecimalDigit(source.charCodeAt(index))) {
              while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
              }
            } else {
              throwError({}, Messages.UnexpectedToken, "ILLEGAL");
            }
          }
          if (isIdentifierStart(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, "ILLEGAL");
          }
          return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            lineNumber,
            lineStart,
            start,
            end: index
          };
        }
        function scanStringLiteral() {
          var str2 = "", quote, start, ch, code, unescaped, restore, octal = false, startLineNumber, startLineStart;
          startLineNumber = lineNumber;
          startLineStart = lineStart;
          quote = source[index];
          assert(quote === "'" || quote === '"', "String literal must starts with a quote");
          start = index;
          ++index;
          while (index < length) {
            ch = source[index++];
            if (ch === quote) {
              quote = "";
              break;
            } else if (ch === "\\") {
              ch = source[index++];
              if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
                switch (ch) {
                  case "u":
                  case "x":
                    restore = index;
                    unescaped = scanHexEscape(ch);
                    if (unescaped) {
                      str2 += unescaped;
                    } else {
                      index = restore;
                      str2 += ch;
                    }
                    break;
                  case "n":
                    str2 += "\n";
                    break;
                  case "r":
                    str2 += "\r";
                    break;
                  case "t":
                    str2 += "	";
                    break;
                  case "b":
                    str2 += "\b";
                    break;
                  case "f":
                    str2 += "\f";
                    break;
                  case "v":
                    str2 += "\v";
                    break;
                  default:
                    if (isOctalDigit(ch)) {
                      code = "01234567".indexOf(ch);
                      if (code !== 0) {
                        octal = true;
                      }
                      if (index < length && isOctalDigit(source[index])) {
                        octal = true;
                        code = code * 8 + "01234567".indexOf(source[index++]);
                        if ("0123".indexOf(ch) >= 0 && index < length && isOctalDigit(source[index])) {
                          code = code * 8 + "01234567".indexOf(source[index++]);
                        }
                      }
                      str2 += String.fromCharCode(code);
                    } else {
                      str2 += ch;
                    }
                    break;
                }
              } else {
                ++lineNumber;
                if (ch === "\r" && source[index] === "\n") {
                  ++index;
                }
                lineStart = index;
              }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
              break;
            } else {
              str2 += ch;
            }
          }
          if (quote !== "") {
            throwError({}, Messages.UnexpectedToken, "ILLEGAL");
          }
          return {
            type: Token.StringLiteral,
            value: str2,
            octal,
            startLineNumber,
            startLineStart,
            lineNumber,
            lineStart,
            start,
            end: index
          };
        }
        function testRegExp(pattern, flags) {
          var value;
          try {
            value = new RegExp(pattern, flags);
          } catch (e) {
            throwError({}, Messages.InvalidRegExp);
          }
          return value;
        }
        function scanRegExpBody() {
          var ch, str2, classMarker, terminated, body;
          ch = source[index];
          assert(ch === "/", "Regular expression literal must start with a slash");
          str2 = source[index++];
          classMarker = false;
          terminated = false;
          while (index < length) {
            ch = source[index++];
            str2 += ch;
            if (ch === "\\") {
              ch = source[index++];
              if (isLineTerminator(ch.charCodeAt(0))) {
                throwError({}, Messages.UnterminatedRegExp);
              }
              str2 += ch;
            } else if (isLineTerminator(ch.charCodeAt(0))) {
              throwError({}, Messages.UnterminatedRegExp);
            } else if (classMarker) {
              if (ch === "]") {
                classMarker = false;
              }
            } else {
              if (ch === "/") {
                terminated = true;
                break;
              } else if (ch === "[") {
                classMarker = true;
              }
            }
          }
          if (!terminated) {
            throwError({}, Messages.UnterminatedRegExp);
          }
          body = str2.substr(1, str2.length - 2);
          return {
            value: body,
            literal: str2
          };
        }
        function scanRegExpFlags() {
          var ch, str2, flags, restore;
          str2 = "";
          flags = "";
          while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch.charCodeAt(0))) {
              break;
            }
            ++index;
            if (ch === "\\" && index < length) {
              ch = source[index];
              if (ch === "u") {
                ++index;
                restore = index;
                ch = scanHexEscape("u");
                if (ch) {
                  flags += ch;
                  for (str2 += "\\u"; restore < index; ++restore) {
                    str2 += source[restore];
                  }
                } else {
                  index = restore;
                  flags += "u";
                  str2 += "\\u";
                }
                throwErrorTolerant({}, Messages.UnexpectedToken, "ILLEGAL");
              } else {
                str2 += "\\";
                throwErrorTolerant({}, Messages.UnexpectedToken, "ILLEGAL");
              }
            } else {
              flags += ch;
              str2 += ch;
            }
          }
          return {
            value: flags,
            literal: str2
          };
        }
        function scanRegExp() {
          var start, body, flags, pattern, value;
          lookahead = null;
          skipComment();
          start = index;
          body = scanRegExpBody();
          flags = scanRegExpFlags();
          value = testRegExp(body.value, flags.value);
          if (extra.tokenize) {
            return {
              type: Token.RegularExpression,
              value,
              lineNumber,
              lineStart,
              start,
              end: index
            };
          }
          return {
            literal: body.literal + flags.literal,
            value,
            start,
            end: index
          };
        }
        function collectRegex() {
          var pos, loc, regex, token;
          skipComment();
          pos = index;
          loc = {
            start: {
              line: lineNumber,
              column: index - lineStart
            }
          };
          regex = scanRegExp();
          loc.end = {
            line: lineNumber,
            column: index - lineStart
          };
          if (!extra.tokenize) {
            if (extra.tokens.length > 0) {
              token = extra.tokens[extra.tokens.length - 1];
              if (token.range[0] === pos && token.type === "Punctuator") {
                if (token.value === "/" || token.value === "/=") {
                  extra.tokens.pop();
                }
              }
            }
            extra.tokens.push({
              type: "RegularExpression",
              value: regex.literal,
              range: [pos, index],
              loc
            });
          }
          return regex;
        }
        function isIdentifierName(token) {
          return token.type === Token.Identifier || token.type === Token.Keyword || token.type === Token.BooleanLiteral || token.type === Token.NullLiteral;
        }
        function advanceSlash() {
          var prevToken, checkToken;
          prevToken = extra.tokens[extra.tokens.length - 1];
          if (!prevToken) {
            return collectRegex();
          }
          if (prevToken.type === "Punctuator") {
            if (prevToken.value === "]") {
              return scanPunctuator();
            }
            if (prevToken.value === ")") {
              checkToken = extra.tokens[extra.openParenToken - 1];
              if (checkToken && checkToken.type === "Keyword" && (checkToken.value === "if" || checkToken.value === "while" || checkToken.value === "for" || checkToken.value === "with")) {
                return collectRegex();
              }
              return scanPunctuator();
            }
            if (prevToken.value === "}") {
              if (extra.tokens[extra.openCurlyToken - 3] && extra.tokens[extra.openCurlyToken - 3].type === "Keyword") {
                checkToken = extra.tokens[extra.openCurlyToken - 4];
                if (!checkToken) {
                  return scanPunctuator();
                }
              } else if (extra.tokens[extra.openCurlyToken - 4] && extra.tokens[extra.openCurlyToken - 4].type === "Keyword") {
                checkToken = extra.tokens[extra.openCurlyToken - 5];
                if (!checkToken) {
                  return collectRegex();
                }
              } else {
                return scanPunctuator();
              }
              if (FnExprTokens.indexOf(checkToken.value) >= 0) {
                return scanPunctuator();
              }
              return collectRegex();
            }
            return collectRegex();
          }
          if (prevToken.type === "Keyword") {
            return collectRegex();
          }
          return scanPunctuator();
        }
        function advance() {
          var ch;
          skipComment();
          if (index >= length) {
            return {
              type: Token.EOF,
              lineNumber,
              lineStart,
              start: index,
              end: index
            };
          }
          ch = source.charCodeAt(index);
          if (isIdentifierStart(ch)) {
            return scanIdentifier();
          }
          if (ch === 40 || ch === 41 || ch === 59) {
            return scanPunctuator();
          }
          if (ch === 39 || ch === 34) {
            return scanStringLiteral();
          }
          if (ch === 46) {
            if (isDecimalDigit(source.charCodeAt(index + 1))) {
              return scanNumericLiteral();
            }
            return scanPunctuator();
          }
          if (isDecimalDigit(ch)) {
            return scanNumericLiteral();
          }
          if (extra.tokenize && ch === 47) {
            return advanceSlash();
          }
          return scanPunctuator();
        }
        function collectToken() {
          var loc, token, range, value;
          skipComment();
          loc = {
            start: {
              line: lineNumber,
              column: index - lineStart
            }
          };
          token = advance();
          loc.end = {
            line: lineNumber,
            column: index - lineStart
          };
          if (token.type !== Token.EOF) {
            value = source.slice(token.start, token.end);
            extra.tokens.push({
              type: TokenName[token.type],
              value,
              range: [token.start, token.end],
              loc
            });
          }
          return token;
        }
        function lex() {
          var token;
          token = lookahead;
          index = token.end;
          lineNumber = token.lineNumber;
          lineStart = token.lineStart;
          lookahead = typeof extra.tokens !== "undefined" ? collectToken() : advance();
          index = token.end;
          lineNumber = token.lineNumber;
          lineStart = token.lineStart;
          return token;
        }
        function peek() {
          var pos, line, start;
          pos = index;
          line = lineNumber;
          start = lineStart;
          lookahead = typeof extra.tokens !== "undefined" ? collectToken() : advance();
          index = pos;
          lineNumber = line;
          lineStart = start;
        }
        function Position(line, column) {
          this.line = line;
          this.column = column;
        }
        function SourceLocation(startLine, startColumn, line, column) {
          this.start = new Position(startLine, startColumn);
          this.end = new Position(line, column);
        }
        SyntaxTreeDelegate = {
          name: "SyntaxTree",
          processComment: function(node) {
            var lastChild, trailingComments;
            if (node.type === Syntax.Program) {
              if (node.body.length > 0) {
                return;
              }
            }
            if (extra.trailingComments.length > 0) {
              if (extra.trailingComments[0].range[0] >= node.range[1]) {
                trailingComments = extra.trailingComments;
                extra.trailingComments = [];
              } else {
                extra.trailingComments.length = 0;
              }
            } else {
              if (extra.bottomRightStack.length > 0 && extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments && extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments[0].range[0] >= node.range[1]) {
                trailingComments = extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
                delete extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
              }
            }
            while (extra.bottomRightStack.length > 0 && extra.bottomRightStack[extra.bottomRightStack.length - 1].range[0] >= node.range[0]) {
              lastChild = extra.bottomRightStack.pop();
            }
            if (lastChild) {
              if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= node.range[0]) {
                node.leadingComments = lastChild.leadingComments;
                delete lastChild.leadingComments;
              }
            } else if (extra.leadingComments.length > 0 && extra.leadingComments[extra.leadingComments.length - 1].range[1] <= node.range[0]) {
              node.leadingComments = extra.leadingComments;
              extra.leadingComments = [];
            }
            if (trailingComments) {
              node.trailingComments = trailingComments;
            }
            extra.bottomRightStack.push(node);
          },
          markEnd: function(node, startToken) {
            if (extra.range) {
              node.range = [startToken.start, index];
            }
            if (extra.loc) {
              node.loc = new SourceLocation(startToken.startLineNumber === void 0 ? startToken.lineNumber : startToken.startLineNumber, startToken.start - (startToken.startLineStart === void 0 ? startToken.lineStart : startToken.startLineStart), lineNumber, index - lineStart);
              this.postProcess(node);
            }
            if (extra.attachComment) {
              this.processComment(node);
            }
            return node;
          },
          postProcess: function(node) {
            if (extra.source) {
              node.loc.source = extra.source;
            }
            return node;
          },
          createArrayExpression: function(elements) {
            return {
              type: Syntax.ArrayExpression,
              elements
            };
          },
          createAssignmentExpression: function(operator, left, right) {
            return {
              type: Syntax.AssignmentExpression,
              operator,
              left,
              right
            };
          },
          createBinaryExpression: function(operator, left, right) {
            var type = operator === "||" || operator === "&&" ? Syntax.LogicalExpression : Syntax.BinaryExpression;
            return {
              type,
              operator,
              left,
              right
            };
          },
          createBlockStatement: function(body) {
            return {
              type: Syntax.BlockStatement,
              body
            };
          },
          createBreakStatement: function(label) {
            return {
              type: Syntax.BreakStatement,
              label
            };
          },
          createCallExpression: function(callee, args) {
            return {
              type: Syntax.CallExpression,
              callee,
              arguments: args
            };
          },
          createCatchClause: function(param, body) {
            return {
              type: Syntax.CatchClause,
              param,
              body
            };
          },
          createConditionalExpression: function(test, consequent, alternate) {
            return {
              type: Syntax.ConditionalExpression,
              test,
              consequent,
              alternate
            };
          },
          createContinueStatement: function(label) {
            return {
              type: Syntax.ContinueStatement,
              label
            };
          },
          createDebuggerStatement: function() {
            return {
              type: Syntax.DebuggerStatement
            };
          },
          createDoWhileStatement: function(body, test) {
            return {
              type: Syntax.DoWhileStatement,
              body,
              test
            };
          },
          createEmptyStatement: function() {
            return {
              type: Syntax.EmptyStatement
            };
          },
          createExpressionStatement: function(expression) {
            return {
              type: Syntax.ExpressionStatement,
              expression
            };
          },
          createForStatement: function(init, test, update, body) {
            return {
              type: Syntax.ForStatement,
              init,
              test,
              update,
              body
            };
          },
          createForInStatement: function(left, right, body) {
            return {
              type: Syntax.ForInStatement,
              left,
              right,
              body,
              each: false
            };
          },
          createFunctionDeclaration: function(id, params, defaults, body) {
            return {
              type: Syntax.FunctionDeclaration,
              id,
              params,
              defaults,
              body,
              rest: null,
              generator: false,
              expression: false
            };
          },
          createFunctionExpression: function(id, params, defaults, body) {
            return {
              type: Syntax.FunctionExpression,
              id,
              params,
              defaults,
              body,
              rest: null,
              generator: false,
              expression: false
            };
          },
          createIdentifier: function(name) {
            return {
              type: Syntax.Identifier,
              name
            };
          },
          createIfStatement: function(test, consequent, alternate) {
            return {
              type: Syntax.IfStatement,
              test,
              consequent,
              alternate
            };
          },
          createLabeledStatement: function(label, body) {
            return {
              type: Syntax.LabeledStatement,
              label,
              body
            };
          },
          createLiteral: function(token) {
            return {
              type: Syntax.Literal,
              value: token.value,
              raw: source.slice(token.start, token.end)
            };
          },
          createMemberExpression: function(accessor, object, property) {
            return {
              type: Syntax.MemberExpression,
              computed: accessor === "[",
              object,
              property
            };
          },
          createNewExpression: function(callee, args) {
            return {
              type: Syntax.NewExpression,
              callee,
              arguments: args
            };
          },
          createObjectExpression: function(properties) {
            return {
              type: Syntax.ObjectExpression,
              properties
            };
          },
          createPostfixExpression: function(operator, argument) {
            return {
              type: Syntax.UpdateExpression,
              operator,
              argument,
              prefix: false
            };
          },
          createProgram: function(body) {
            return {
              type: Syntax.Program,
              body
            };
          },
          createProperty: function(kind, key, value) {
            return {
              type: Syntax.Property,
              key,
              value,
              kind
            };
          },
          createReturnStatement: function(argument) {
            return {
              type: Syntax.ReturnStatement,
              argument
            };
          },
          createSequenceExpression: function(expressions) {
            return {
              type: Syntax.SequenceExpression,
              expressions
            };
          },
          createSwitchCase: function(test, consequent) {
            return {
              type: Syntax.SwitchCase,
              test,
              consequent
            };
          },
          createSwitchStatement: function(discriminant, cases) {
            return {
              type: Syntax.SwitchStatement,
              discriminant,
              cases
            };
          },
          createThisExpression: function() {
            return {
              type: Syntax.ThisExpression
            };
          },
          createThrowStatement: function(argument) {
            return {
              type: Syntax.ThrowStatement,
              argument
            };
          },
          createTryStatement: function(block, guardedHandlers, handlers, finalizer) {
            return {
              type: Syntax.TryStatement,
              block,
              guardedHandlers,
              handlers,
              finalizer
            };
          },
          createUnaryExpression: function(operator, argument) {
            if (operator === "++" || operator === "--") {
              return {
                type: Syntax.UpdateExpression,
                operator,
                argument,
                prefix: true
              };
            }
            return {
              type: Syntax.UnaryExpression,
              operator,
              argument,
              prefix: true
            };
          },
          createVariableDeclaration: function(declarations, kind) {
            return {
              type: Syntax.VariableDeclaration,
              declarations,
              kind
            };
          },
          createVariableDeclarator: function(id, init) {
            return {
              type: Syntax.VariableDeclarator,
              id,
              init
            };
          },
          createWhileStatement: function(test, body) {
            return {
              type: Syntax.WhileStatement,
              test,
              body
            };
          },
          createWithStatement: function(object, body) {
            return {
              type: Syntax.WithStatement,
              object,
              body
            };
          }
        };
        function peekLineTerminator() {
          var pos, line, start, found;
          pos = index;
          line = lineNumber;
          start = lineStart;
          skipComment();
          found = lineNumber !== line;
          index = pos;
          lineNumber = line;
          lineStart = start;
          return found;
        }
        function throwError(token, messageFormat) {
          var error, args = Array.prototype.slice.call(arguments, 2), msg = messageFormat.replace(/%(\d)/g, function(whole, index2) {
            assert(index2 < args.length, "Message reference must be in range");
            return args[index2];
          });
          if (typeof token.lineNumber === "number") {
            error = new Error("Line " + token.lineNumber + ": " + msg);
            error.index = token.start;
            error.lineNumber = token.lineNumber;
            error.column = token.start - lineStart + 1;
          } else {
            error = new Error("Line " + lineNumber + ": " + msg);
            error.index = index;
            error.lineNumber = lineNumber;
            error.column = index - lineStart + 1;
          }
          error.description = msg;
          throw error;
        }
        function throwErrorTolerant() {
          try {
            throwError.apply(null, arguments);
          } catch (e) {
            if (extra.errors) {
              extra.errors.push(e);
            } else {
              throw e;
            }
          }
        }
        function throwUnexpected(token) {
          if (token.type === Token.EOF) {
            throwError(token, Messages.UnexpectedEOS);
          }
          if (token.type === Token.NumericLiteral) {
            throwError(token, Messages.UnexpectedNumber);
          }
          if (token.type === Token.StringLiteral) {
            throwError(token, Messages.UnexpectedString);
          }
          if (token.type === Token.Identifier) {
            throwError(token, Messages.UnexpectedIdentifier);
          }
          if (token.type === Token.Keyword) {
            if (isFutureReservedWord(token.value)) {
              throwError(token, Messages.UnexpectedReserved);
            } else if (strict && isStrictModeReservedWord(token.value)) {
              throwErrorTolerant(token, Messages.StrictReservedWord);
              return;
            }
            throwError(token, Messages.UnexpectedToken, token.value);
          }
          throwError(token, Messages.UnexpectedToken, token.value);
        }
        function expect(value) {
          var token = lex();
          if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpected(token);
          }
        }
        function expectKeyword(keyword) {
          var token = lex();
          if (token.type !== Token.Keyword || token.value !== keyword) {
            throwUnexpected(token);
          }
        }
        function match(value) {
          return lookahead.type === Token.Punctuator && lookahead.value === value;
        }
        function matchKeyword(keyword) {
          return lookahead.type === Token.Keyword && lookahead.value === keyword;
        }
        function matchAssign() {
          var op;
          if (lookahead.type !== Token.Punctuator) {
            return false;
          }
          op = lookahead.value;
          return op === "=" || op === "*=" || op === "/=" || op === "%=" || op === "+=" || op === "-=" || op === "<<=" || op === ">>=" || op === ">>>=" || op === "&=" || op === "^=" || op === "|=";
        }
        function consumeSemicolon() {
          var line;
          if (source.charCodeAt(index) === 59 || match(";")) {
            lex();
            return;
          }
          line = lineNumber;
          skipComment();
          if (lineNumber !== line) {
            return;
          }
          if (lookahead.type !== Token.EOF && !match("}")) {
            throwUnexpected(lookahead);
          }
        }
        function isLeftHandSide(expr) {
          return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
        }
        function parseArrayInitialiser() {
          var elements = [], startToken;
          startToken = lookahead;
          expect("[");
          while (!match("]")) {
            if (match(",")) {
              lex();
              elements.push(null);
            } else {
              elements.push(parseAssignmentExpression());
              if (!match("]")) {
                expect(",");
              }
            }
          }
          lex();
          return delegate.markEnd(delegate.createArrayExpression(elements), startToken);
        }
        function parsePropertyFunction(param, first) {
          var previousStrict, body, startToken;
          previousStrict = strict;
          startToken = lookahead;
          body = parseFunctionSourceElements();
          if (first && strict && isRestrictedWord(param[0].name)) {
            throwErrorTolerant(first, Messages.StrictParamName);
          }
          strict = previousStrict;
          return delegate.markEnd(delegate.createFunctionExpression(null, param, [], body), startToken);
        }
        function parseObjectPropertyKey() {
          var token, startToken;
          startToken = lookahead;
          token = lex();
          if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
            if (strict && token.octal) {
              throwErrorTolerant(token, Messages.StrictOctalLiteral);
            }
            return delegate.markEnd(delegate.createLiteral(token), startToken);
          }
          return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
        }
        function parseObjectProperty() {
          var token, key, id, value, param, startToken;
          token = lookahead;
          startToken = lookahead;
          if (token.type === Token.Identifier) {
            id = parseObjectPropertyKey();
            if (token.value === "get" && !match(":")) {
              key = parseObjectPropertyKey();
              expect("(");
              expect(")");
              value = parsePropertyFunction([]);
              return delegate.markEnd(delegate.createProperty("get", key, value), startToken);
            }
            if (token.value === "set" && !match(":")) {
              key = parseObjectPropertyKey();
              expect("(");
              token = lookahead;
              if (token.type !== Token.Identifier) {
                expect(")");
                throwErrorTolerant(token, Messages.UnexpectedToken, token.value);
                value = parsePropertyFunction([]);
              } else {
                param = [parseVariableIdentifier()];
                expect(")");
                value = parsePropertyFunction(param, token);
              }
              return delegate.markEnd(delegate.createProperty("set", key, value), startToken);
            }
            expect(":");
            value = parseAssignmentExpression();
            return delegate.markEnd(delegate.createProperty("init", id, value), startToken);
          }
          if (token.type === Token.EOF || token.type === Token.Punctuator) {
            throwUnexpected(token);
          } else {
            key = parseObjectPropertyKey();
            expect(":");
            value = parseAssignmentExpression();
            return delegate.markEnd(delegate.createProperty("init", key, value), startToken);
          }
        }
        function parseObjectInitialiser() {
          var properties = [], property, name, key, kind, map = {}, toString = String, startToken;
          startToken = lookahead;
          expect("{");
          while (!match("}")) {
            property = parseObjectProperty();
            if (property.key.type === Syntax.Identifier) {
              name = property.key.name;
            } else {
              name = toString(property.key.value);
            }
            kind = property.kind === "init" ? PropertyKind.Data : property.kind === "get" ? PropertyKind.Get : PropertyKind.Set;
            key = "$" + name;
            if (Object.prototype.hasOwnProperty.call(map, key)) {
              if (map[key] === PropertyKind.Data) {
                if (strict && kind === PropertyKind.Data) {
                  throwErrorTolerant({}, Messages.StrictDuplicateProperty);
                } else if (kind !== PropertyKind.Data) {
                  throwErrorTolerant({}, Messages.AccessorDataProperty);
                }
              } else {
                if (kind === PropertyKind.Data) {
                  throwErrorTolerant({}, Messages.AccessorDataProperty);
                } else if (map[key] & kind) {
                  throwErrorTolerant({}, Messages.AccessorGetSet);
                }
              }
              map[key] |= kind;
            } else {
              map[key] = kind;
            }
            properties.push(property);
            if (!match("}")) {
              expect(",");
            }
          }
          expect("}");
          return delegate.markEnd(delegate.createObjectExpression(properties), startToken);
        }
        function parseGroupExpression() {
          var expr;
          expect("(");
          expr = parseExpression();
          expect(")");
          return expr;
        }
        function parsePrimaryExpression() {
          var type, token, expr, startToken;
          if (match("(")) {
            return parseGroupExpression();
          }
          if (match("[")) {
            return parseArrayInitialiser();
          }
          if (match("{")) {
            return parseObjectInitialiser();
          }
          type = lookahead.type;
          startToken = lookahead;
          if (type === Token.Identifier) {
            expr = delegate.createIdentifier(lex().value);
          } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            if (strict && lookahead.octal) {
              throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
            }
            expr = delegate.createLiteral(lex());
          } else if (type === Token.Keyword) {
            if (matchKeyword("function")) {
              return parseFunctionExpression();
            }
            if (matchKeyword("this")) {
              lex();
              expr = delegate.createThisExpression();
            } else {
              throwUnexpected(lex());
            }
          } else if (type === Token.BooleanLiteral) {
            token = lex();
            token.value = token.value === "true";
            expr = delegate.createLiteral(token);
          } else if (type === Token.NullLiteral) {
            token = lex();
            token.value = null;
            expr = delegate.createLiteral(token);
          } else if (match("/") || match("/=")) {
            if (typeof extra.tokens !== "undefined") {
              expr = delegate.createLiteral(collectRegex());
            } else {
              expr = delegate.createLiteral(scanRegExp());
            }
            peek();
          } else {
            throwUnexpected(lex());
          }
          return delegate.markEnd(expr, startToken);
        }
        function parseArguments() {
          var args = [];
          expect("(");
          if (!match(")")) {
            while (index < length) {
              args.push(parseAssignmentExpression());
              if (match(")")) {
                break;
              }
              expect(",");
            }
          }
          expect(")");
          return args;
        }
        function parseNonComputedProperty() {
          var token, startToken;
          startToken = lookahead;
          token = lex();
          if (!isIdentifierName(token)) {
            throwUnexpected(token);
          }
          return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
        }
        function parseNonComputedMember() {
          expect(".");
          return parseNonComputedProperty();
        }
        function parseComputedMember() {
          var expr;
          expect("[");
          expr = parseExpression();
          expect("]");
          return expr;
        }
        function parseNewExpression() {
          var callee, args, startToken;
          startToken = lookahead;
          expectKeyword("new");
          callee = parseLeftHandSideExpression();
          args = match("(") ? parseArguments() : [];
          return delegate.markEnd(delegate.createNewExpression(callee, args), startToken);
        }
        function parseLeftHandSideExpressionAllowCall() {
          var previousAllowIn, expr, args, property, startToken;
          startToken = lookahead;
          previousAllowIn = state.allowIn;
          state.allowIn = true;
          expr = matchKeyword("new") ? parseNewExpression() : parsePrimaryExpression();
          state.allowIn = previousAllowIn;
          for (; ; ) {
            if (match(".")) {
              property = parseNonComputedMember();
              expr = delegate.createMemberExpression(".", expr, property);
            } else if (match("(")) {
              args = parseArguments();
              expr = delegate.createCallExpression(expr, args);
            } else if (match("[")) {
              property = parseComputedMember();
              expr = delegate.createMemberExpression("[", expr, property);
            } else {
              break;
            }
            delegate.markEnd(expr, startToken);
          }
          return expr;
        }
        function parseLeftHandSideExpression() {
          var previousAllowIn, expr, property, startToken;
          startToken = lookahead;
          previousAllowIn = state.allowIn;
          expr = matchKeyword("new") ? parseNewExpression() : parsePrimaryExpression();
          state.allowIn = previousAllowIn;
          while (match(".") || match("[")) {
            if (match("[")) {
              property = parseComputedMember();
              expr = delegate.createMemberExpression("[", expr, property);
            } else {
              property = parseNonComputedMember();
              expr = delegate.createMemberExpression(".", expr, property);
            }
            delegate.markEnd(expr, startToken);
          }
          return expr;
        }
        function parsePostfixExpression() {
          var expr, token, startToken = lookahead;
          expr = parseLeftHandSideExpressionAllowCall();
          if (lookahead.type === Token.Punctuator) {
            if ((match("++") || match("--")) && !peekLineTerminator()) {
              if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                throwErrorTolerant({}, Messages.StrictLHSPostfix);
              }
              if (!isLeftHandSide(expr)) {
                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
              }
              token = lex();
              expr = delegate.markEnd(delegate.createPostfixExpression(token.value, expr), startToken);
            }
          }
          return expr;
        }
        function parseUnaryExpression() {
          var token, expr, startToken;
          if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
            expr = parsePostfixExpression();
          } else if (match("++") || match("--")) {
            startToken = lookahead;
            token = lex();
            expr = parseUnaryExpression();
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
              throwErrorTolerant({}, Messages.StrictLHSPrefix);
            }
            if (!isLeftHandSide(expr)) {
              throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
            }
            expr = delegate.createUnaryExpression(token.value, expr);
            expr = delegate.markEnd(expr, startToken);
          } else if (match("+") || match("-") || match("~") || match("!")) {
            startToken = lookahead;
            token = lex();
            expr = parseUnaryExpression();
            expr = delegate.createUnaryExpression(token.value, expr);
            expr = delegate.markEnd(expr, startToken);
          } else if (matchKeyword("delete") || matchKeyword("void") || matchKeyword("typeof")) {
            startToken = lookahead;
            token = lex();
            expr = parseUnaryExpression();
            expr = delegate.createUnaryExpression(token.value, expr);
            expr = delegate.markEnd(expr, startToken);
            if (strict && expr.operator === "delete" && expr.argument.type === Syntax.Identifier) {
              throwErrorTolerant({}, Messages.StrictDelete);
            }
          } else {
            expr = parsePostfixExpression();
          }
          return expr;
        }
        function binaryPrecedence(token, allowIn) {
          var prec = 0;
          if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
            return 0;
          }
          switch (token.value) {
            case "||":
              prec = 1;
              break;
            case "&&":
              prec = 2;
              break;
            case "|":
              prec = 3;
              break;
            case "^":
              prec = 4;
              break;
            case "&":
              prec = 5;
              break;
            case "==":
            case "!=":
            case "===":
            case "!==":
              prec = 6;
              break;
            case "<":
            case ">":
            case "<=":
            case ">=":
            case "instanceof":
              prec = 7;
              break;
            case "in":
              prec = allowIn ? 7 : 0;
              break;
            case "<<":
            case ">>":
            case ">>>":
              prec = 8;
              break;
            case "+":
            case "-":
              prec = 9;
              break;
            case "*":
            case "/":
            case "%":
              prec = 11;
              break;
            default:
              break;
          }
          return prec;
        }
        function parseBinaryExpression() {
          var marker, markers, expr, token, prec, stack, right, operator, left, i;
          marker = lookahead;
          left = parseUnaryExpression();
          token = lookahead;
          prec = binaryPrecedence(token, state.allowIn);
          if (prec === 0) {
            return left;
          }
          token.prec = prec;
          lex();
          markers = [marker, lookahead];
          right = parseUnaryExpression();
          stack = [left, token, right];
          while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {
            while (stack.length > 2 && prec <= stack[stack.length - 2].prec) {
              right = stack.pop();
              operator = stack.pop().value;
              left = stack.pop();
              expr = delegate.createBinaryExpression(operator, left, right);
              markers.pop();
              marker = markers[markers.length - 1];
              delegate.markEnd(expr, marker);
              stack.push(expr);
            }
            token = lex();
            token.prec = prec;
            stack.push(token);
            markers.push(lookahead);
            expr = parseUnaryExpression();
            stack.push(expr);
          }
          i = stack.length - 1;
          expr = stack[i];
          markers.pop();
          while (i > 1) {
            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
            i -= 2;
            marker = markers.pop();
            delegate.markEnd(expr, marker);
          }
          return expr;
        }
        function parseConditionalExpression() {
          var expr, previousAllowIn, consequent, alternate, startToken;
          startToken = lookahead;
          expr = parseBinaryExpression();
          if (match("?")) {
            lex();
            previousAllowIn = state.allowIn;
            state.allowIn = true;
            consequent = parseAssignmentExpression();
            state.allowIn = previousAllowIn;
            expect(":");
            alternate = parseAssignmentExpression();
            expr = delegate.createConditionalExpression(expr, consequent, alternate);
            delegate.markEnd(expr, startToken);
          }
          return expr;
        }
        function parseAssignmentExpression() {
          var token, left, right, node, startToken;
          token = lookahead;
          startToken = lookahead;
          node = left = parseConditionalExpression();
          if (matchAssign()) {
            if (!isLeftHandSide(left)) {
              throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
            }
            if (strict && left.type === Syntax.Identifier && isRestrictedWord(left.name)) {
              throwErrorTolerant(token, Messages.StrictLHSAssignment);
            }
            token = lex();
            right = parseAssignmentExpression();
            node = delegate.markEnd(delegate.createAssignmentExpression(token.value, left, right), startToken);
          }
          return node;
        }
        function parseExpression() {
          var expr, startToken = lookahead;
          expr = parseAssignmentExpression();
          if (match(",")) {
            expr = delegate.createSequenceExpression([expr]);
            while (index < length) {
              if (!match(",")) {
                break;
              }
              lex();
              expr.expressions.push(parseAssignmentExpression());
            }
            delegate.markEnd(expr, startToken);
          }
          return expr;
        }
        function parseStatementList() {
          var list = [], statement;
          while (index < length) {
            if (match("}")) {
              break;
            }
            statement = parseSourceElement();
            if (typeof statement === "undefined") {
              break;
            }
            list.push(statement);
          }
          return list;
        }
        function parseBlock() {
          var block, startToken;
          startToken = lookahead;
          expect("{");
          block = parseStatementList();
          expect("}");
          return delegate.markEnd(delegate.createBlockStatement(block), startToken);
        }
        function parseVariableIdentifier() {
          var token, startToken;
          startToken = lookahead;
          token = lex();
          if (token.type !== Token.Identifier) {
            throwUnexpected(token);
          }
          return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
        }
        function parseVariableDeclaration(kind) {
          var init = null, id, startToken;
          startToken = lookahead;
          id = parseVariableIdentifier();
          if (strict && isRestrictedWord(id.name)) {
            throwErrorTolerant({}, Messages.StrictVarName);
          }
          if (kind === "const") {
            expect("=");
            init = parseAssignmentExpression();
          } else if (match("=")) {
            lex();
            init = parseAssignmentExpression();
          }
          return delegate.markEnd(delegate.createVariableDeclarator(id, init), startToken);
        }
        function parseVariableDeclarationList(kind) {
          var list = [];
          do {
            list.push(parseVariableDeclaration(kind));
            if (!match(",")) {
              break;
            }
            lex();
          } while (index < length);
          return list;
        }
        function parseVariableStatement() {
          var declarations;
          expectKeyword("var");
          declarations = parseVariableDeclarationList();
          consumeSemicolon();
          return delegate.createVariableDeclaration(declarations, "var");
        }
        function parseConstLetDeclaration(kind) {
          var declarations, startToken;
          startToken = lookahead;
          expectKeyword(kind);
          declarations = parseVariableDeclarationList(kind);
          consumeSemicolon();
          return delegate.markEnd(delegate.createVariableDeclaration(declarations, kind), startToken);
        }
        function parseEmptyStatement() {
          expect(";");
          return delegate.createEmptyStatement();
        }
        function parseExpressionStatement() {
          var expr = parseExpression();
          consumeSemicolon();
          return delegate.createExpressionStatement(expr);
        }
        function parseIfStatement() {
          var test, consequent, alternate;
          expectKeyword("if");
          expect("(");
          test = parseExpression();
          expect(")");
          consequent = parseStatement();
          if (matchKeyword("else")) {
            lex();
            alternate = parseStatement();
          } else {
            alternate = null;
          }
          return delegate.createIfStatement(test, consequent, alternate);
        }
        function parseDoWhileStatement() {
          var body, test, oldInIteration;
          expectKeyword("do");
          oldInIteration = state.inIteration;
          state.inIteration = true;
          body = parseStatement();
          state.inIteration = oldInIteration;
          expectKeyword("while");
          expect("(");
          test = parseExpression();
          expect(")");
          if (match(";")) {
            lex();
          }
          return delegate.createDoWhileStatement(body, test);
        }
        function parseWhileStatement() {
          var test, body, oldInIteration;
          expectKeyword("while");
          expect("(");
          test = parseExpression();
          expect(")");
          oldInIteration = state.inIteration;
          state.inIteration = true;
          body = parseStatement();
          state.inIteration = oldInIteration;
          return delegate.createWhileStatement(test, body);
        }
        function parseForVariableDeclaration() {
          var token, declarations, startToken;
          startToken = lookahead;
          token = lex();
          declarations = parseVariableDeclarationList();
          return delegate.markEnd(delegate.createVariableDeclaration(declarations, token.value), startToken);
        }
        function parseForStatement() {
          var init, test, update, left, right, body, oldInIteration;
          init = test = update = null;
          expectKeyword("for");
          expect("(");
          if (match(";")) {
            lex();
          } else {
            if (matchKeyword("var") || matchKeyword("let")) {
              state.allowIn = false;
              init = parseForVariableDeclaration();
              state.allowIn = true;
              if (init.declarations.length === 1 && matchKeyword("in")) {
                lex();
                left = init;
                right = parseExpression();
                init = null;
              }
            } else {
              state.allowIn = false;
              init = parseExpression();
              state.allowIn = true;
              if (matchKeyword("in")) {
                if (!isLeftHandSide(init)) {
                  throwErrorTolerant({}, Messages.InvalidLHSInForIn);
                }
                lex();
                left = init;
                right = parseExpression();
                init = null;
              }
            }
            if (typeof left === "undefined") {
              expect(";");
            }
          }
          if (typeof left === "undefined") {
            if (!match(";")) {
              test = parseExpression();
            }
            expect(";");
            if (!match(")")) {
              update = parseExpression();
            }
          }
          expect(")");
          oldInIteration = state.inIteration;
          state.inIteration = true;
          body = parseStatement();
          state.inIteration = oldInIteration;
          return typeof left === "undefined" ? delegate.createForStatement(init, test, update, body) : delegate.createForInStatement(left, right, body);
        }
        function parseContinueStatement() {
          var label = null, key;
          expectKeyword("continue");
          if (source.charCodeAt(index) === 59) {
            lex();
            if (!state.inIteration) {
              throwError({}, Messages.IllegalContinue);
            }
            return delegate.createContinueStatement(null);
          }
          if (peekLineTerminator()) {
            if (!state.inIteration) {
              throwError({}, Messages.IllegalContinue);
            }
            return delegate.createContinueStatement(null);
          }
          if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();
            key = "$" + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
              throwError({}, Messages.UnknownLabel, label.name);
            }
          }
          consumeSemicolon();
          if (label === null && !state.inIteration) {
            throwError({}, Messages.IllegalContinue);
          }
          return delegate.createContinueStatement(label);
        }
        function parseBreakStatement() {
          var label = null, key;
          expectKeyword("break");
          if (source.charCodeAt(index) === 59) {
            lex();
            if (!(state.inIteration || state.inSwitch)) {
              throwError({}, Messages.IllegalBreak);
            }
            return delegate.createBreakStatement(null);
          }
          if (peekLineTerminator()) {
            if (!(state.inIteration || state.inSwitch)) {
              throwError({}, Messages.IllegalBreak);
            }
            return delegate.createBreakStatement(null);
          }
          if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();
            key = "$" + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
              throwError({}, Messages.UnknownLabel, label.name);
            }
          }
          consumeSemicolon();
          if (label === null && !(state.inIteration || state.inSwitch)) {
            throwError({}, Messages.IllegalBreak);
          }
          return delegate.createBreakStatement(label);
        }
        function parseReturnStatement() {
          var argument = null;
          expectKeyword("return");
          if (!state.inFunctionBody) {
            throwErrorTolerant({}, Messages.IllegalReturn);
          }
          if (source.charCodeAt(index) === 32) {
            if (isIdentifierStart(source.charCodeAt(index + 1))) {
              argument = parseExpression();
              consumeSemicolon();
              return delegate.createReturnStatement(argument);
            }
          }
          if (peekLineTerminator()) {
            return delegate.createReturnStatement(null);
          }
          if (!match(";")) {
            if (!match("}") && lookahead.type !== Token.EOF) {
              argument = parseExpression();
            }
          }
          consumeSemicolon();
          return delegate.createReturnStatement(argument);
        }
        function parseWithStatement() {
          var object, body;
          if (strict) {
            skipComment();
            throwErrorTolerant({}, Messages.StrictModeWith);
          }
          expectKeyword("with");
          expect("(");
          object = parseExpression();
          expect(")");
          body = parseStatement();
          return delegate.createWithStatement(object, body);
        }
        function parseSwitchCase() {
          var test, consequent = [], statement, startToken;
          startToken = lookahead;
          if (matchKeyword("default")) {
            lex();
            test = null;
          } else {
            expectKeyword("case");
            test = parseExpression();
          }
          expect(":");
          while (index < length) {
            if (match("}") || matchKeyword("default") || matchKeyword("case")) {
              break;
            }
            statement = parseStatement();
            consequent.push(statement);
          }
          return delegate.markEnd(delegate.createSwitchCase(test, consequent), startToken);
        }
        function parseSwitchStatement() {
          var discriminant, cases, clause, oldInSwitch, defaultFound;
          expectKeyword("switch");
          expect("(");
          discriminant = parseExpression();
          expect(")");
          expect("{");
          cases = [];
          if (match("}")) {
            lex();
            return delegate.createSwitchStatement(discriminant, cases);
          }
          oldInSwitch = state.inSwitch;
          state.inSwitch = true;
          defaultFound = false;
          while (index < length) {
            if (match("}")) {
              break;
            }
            clause = parseSwitchCase();
            if (clause.test === null) {
              if (defaultFound) {
                throwError({}, Messages.MultipleDefaultsInSwitch);
              }
              defaultFound = true;
            }
            cases.push(clause);
          }
          state.inSwitch = oldInSwitch;
          expect("}");
          return delegate.createSwitchStatement(discriminant, cases);
        }
        function parseThrowStatement() {
          var argument;
          expectKeyword("throw");
          if (peekLineTerminator()) {
            throwError({}, Messages.NewlineAfterThrow);
          }
          argument = parseExpression();
          consumeSemicolon();
          return delegate.createThrowStatement(argument);
        }
        function parseCatchClause() {
          var param, body, startToken;
          startToken = lookahead;
          expectKeyword("catch");
          expect("(");
          if (match(")")) {
            throwUnexpected(lookahead);
          }
          param = parseVariableIdentifier();
          if (strict && isRestrictedWord(param.name)) {
            throwErrorTolerant({}, Messages.StrictCatchVariable);
          }
          expect(")");
          body = parseBlock();
          return delegate.markEnd(delegate.createCatchClause(param, body), startToken);
        }
        function parseTryStatement() {
          var block, handlers = [], finalizer = null;
          expectKeyword("try");
          block = parseBlock();
          if (matchKeyword("catch")) {
            handlers.push(parseCatchClause());
          }
          if (matchKeyword("finally")) {
            lex();
            finalizer = parseBlock();
          }
          if (handlers.length === 0 && !finalizer) {
            throwError({}, Messages.NoCatchOrFinally);
          }
          return delegate.createTryStatement(block, [], handlers, finalizer);
        }
        function parseDebuggerStatement() {
          expectKeyword("debugger");
          consumeSemicolon();
          return delegate.createDebuggerStatement();
        }
        function parseStatement() {
          var type = lookahead.type, expr, labeledBody, key, startToken;
          if (type === Token.EOF) {
            throwUnexpected(lookahead);
          }
          if (type === Token.Punctuator && lookahead.value === "{") {
            return parseBlock();
          }
          startToken = lookahead;
          if (type === Token.Punctuator) {
            switch (lookahead.value) {
              case ";":
                return delegate.markEnd(parseEmptyStatement(), startToken);
              case "(":
                return delegate.markEnd(parseExpressionStatement(), startToken);
              default:
                break;
            }
          }
          if (type === Token.Keyword) {
            switch (lookahead.value) {
              case "break":
                return delegate.markEnd(parseBreakStatement(), startToken);
              case "continue":
                return delegate.markEnd(parseContinueStatement(), startToken);
              case "debugger":
                return delegate.markEnd(parseDebuggerStatement(), startToken);
              case "do":
                return delegate.markEnd(parseDoWhileStatement(), startToken);
              case "for":
                return delegate.markEnd(parseForStatement(), startToken);
              case "function":
                return delegate.markEnd(parseFunctionDeclaration(), startToken);
              case "if":
                return delegate.markEnd(parseIfStatement(), startToken);
              case "return":
                return delegate.markEnd(parseReturnStatement(), startToken);
              case "switch":
                return delegate.markEnd(parseSwitchStatement(), startToken);
              case "throw":
                return delegate.markEnd(parseThrowStatement(), startToken);
              case "try":
                return delegate.markEnd(parseTryStatement(), startToken);
              case "var":
                return delegate.markEnd(parseVariableStatement(), startToken);
              case "while":
                return delegate.markEnd(parseWhileStatement(), startToken);
              case "with":
                return delegate.markEnd(parseWithStatement(), startToken);
              default:
                break;
            }
          }
          expr = parseExpression();
          if (expr.type === Syntax.Identifier && match(":")) {
            lex();
            key = "$" + expr.name;
            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
              throwError({}, Messages.Redeclaration, "Label", expr.name);
            }
            state.labelSet[key] = true;
            labeledBody = parseStatement();
            delete state.labelSet[key];
            return delegate.markEnd(delegate.createLabeledStatement(expr, labeledBody), startToken);
          }
          consumeSemicolon();
          return delegate.markEnd(delegate.createExpressionStatement(expr), startToken);
        }
        function parseFunctionSourceElements() {
          var sourceElement, sourceElements = [], token, directive, firstRestricted, oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, startToken;
          startToken = lookahead;
          expect("{");
          while (index < length) {
            if (lookahead.type !== Token.StringLiteral) {
              break;
            }
            token = lookahead;
            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
              break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === "use strict") {
              strict = true;
              if (firstRestricted) {
                throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
              }
            } else {
              if (!firstRestricted && token.octal) {
                firstRestricted = token;
              }
            }
          }
          oldLabelSet = state.labelSet;
          oldInIteration = state.inIteration;
          oldInSwitch = state.inSwitch;
          oldInFunctionBody = state.inFunctionBody;
          state.labelSet = {};
          state.inIteration = false;
          state.inSwitch = false;
          state.inFunctionBody = true;
          while (index < length) {
            if (match("}")) {
              break;
            }
            sourceElement = parseSourceElement();
            if (typeof sourceElement === "undefined") {
              break;
            }
            sourceElements.push(sourceElement);
          }
          expect("}");
          state.labelSet = oldLabelSet;
          state.inIteration = oldInIteration;
          state.inSwitch = oldInSwitch;
          state.inFunctionBody = oldInFunctionBody;
          return delegate.markEnd(delegate.createBlockStatement(sourceElements), startToken);
        }
        function parseParams(firstRestricted) {
          var param, params = [], token, stricted, paramSet, key, message;
          expect("(");
          if (!match(")")) {
            paramSet = {};
            while (index < length) {
              token = lookahead;
              param = parseVariableIdentifier();
              key = "$" + token.value;
              if (strict) {
                if (isRestrictedWord(token.value)) {
                  stricted = token;
                  message = Messages.StrictParamName;
                }
                if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                  stricted = token;
                  message = Messages.StrictParamDupe;
                }
              } else if (!firstRestricted) {
                if (isRestrictedWord(token.value)) {
                  firstRestricted = token;
                  message = Messages.StrictParamName;
                } else if (isStrictModeReservedWord(token.value)) {
                  firstRestricted = token;
                  message = Messages.StrictReservedWord;
                } else if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                  firstRestricted = token;
                  message = Messages.StrictParamDupe;
                }
              }
              params.push(param);
              paramSet[key] = true;
              if (match(")")) {
                break;
              }
              expect(",");
            }
          }
          expect(")");
          return {
            params,
            stricted,
            firstRestricted,
            message
          };
        }
        function parseFunctionDeclaration() {
          var id, params = [], body, token, stricted, tmp, firstRestricted, message, previousStrict, startToken;
          startToken = lookahead;
          expectKeyword("function");
          token = lookahead;
          id = parseVariableIdentifier();
          if (strict) {
            if (isRestrictedWord(token.value)) {
              throwErrorTolerant(token, Messages.StrictFunctionName);
            }
          } else {
            if (isRestrictedWord(token.value)) {
              firstRestricted = token;
              message = Messages.StrictFunctionName;
            } else if (isStrictModeReservedWord(token.value)) {
              firstRestricted = token;
              message = Messages.StrictReservedWord;
            }
          }
          tmp = parseParams(firstRestricted);
          params = tmp.params;
          stricted = tmp.stricted;
          firstRestricted = tmp.firstRestricted;
          if (tmp.message) {
            message = tmp.message;
          }
          previousStrict = strict;
          body = parseFunctionSourceElements();
          if (strict && firstRestricted) {
            throwError(firstRestricted, message);
          }
          if (strict && stricted) {
            throwErrorTolerant(stricted, message);
          }
          strict = previousStrict;
          return delegate.markEnd(delegate.createFunctionDeclaration(id, params, [], body), startToken);
        }
        function parseFunctionExpression() {
          var token, id = null, stricted, firstRestricted, message, tmp, params = [], body, previousStrict, startToken;
          startToken = lookahead;
          expectKeyword("function");
          if (!match("(")) {
            token = lookahead;
            id = parseVariableIdentifier();
            if (strict) {
              if (isRestrictedWord(token.value)) {
                throwErrorTolerant(token, Messages.StrictFunctionName);
              }
            } else {
              if (isRestrictedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictFunctionName;
              } else if (isStrictModeReservedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictReservedWord;
              }
            }
          }
          tmp = parseParams(firstRestricted);
          params = tmp.params;
          stricted = tmp.stricted;
          firstRestricted = tmp.firstRestricted;
          if (tmp.message) {
            message = tmp.message;
          }
          previousStrict = strict;
          body = parseFunctionSourceElements();
          if (strict && firstRestricted) {
            throwError(firstRestricted, message);
          }
          if (strict && stricted) {
            throwErrorTolerant(stricted, message);
          }
          strict = previousStrict;
          return delegate.markEnd(delegate.createFunctionExpression(id, params, [], body), startToken);
        }
        function parseSourceElement() {
          if (lookahead.type === Token.Keyword) {
            switch (lookahead.value) {
              case "const":
              case "let":
                return parseConstLetDeclaration(lookahead.value);
              case "function":
                return parseFunctionDeclaration();
              default:
                return parseStatement();
            }
          }
          if (lookahead.type !== Token.EOF) {
            return parseStatement();
          }
        }
        function parseSourceElements() {
          var sourceElement, sourceElements = [], token, directive, firstRestricted;
          while (index < length) {
            token = lookahead;
            if (token.type !== Token.StringLiteral) {
              break;
            }
            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
              break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === "use strict") {
              strict = true;
              if (firstRestricted) {
                throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
              }
            } else {
              if (!firstRestricted && token.octal) {
                firstRestricted = token;
              }
            }
          }
          while (index < length) {
            sourceElement = parseSourceElement();
            if (typeof sourceElement === "undefined") {
              break;
            }
            sourceElements.push(sourceElement);
          }
          return sourceElements;
        }
        function parseProgram() {
          var body, startToken;
          skipComment();
          peek();
          startToken = lookahead;
          strict = false;
          body = parseSourceElements();
          return delegate.markEnd(delegate.createProgram(body), startToken);
        }
        function filterTokenLocation() {
          var i, entry, token, tokens = [];
          for (i = 0; i < extra.tokens.length; ++i) {
            entry = extra.tokens[i];
            token = {
              type: entry.type,
              value: entry.value
            };
            if (extra.range) {
              token.range = entry.range;
            }
            if (extra.loc) {
              token.loc = entry.loc;
            }
            tokens.push(token);
          }
          extra.tokens = tokens;
        }
        function tokenize(code, options) {
          var toString, token, tokens;
          toString = String;
          if (typeof code !== "string" && !(code instanceof String)) {
            code = toString(code);
          }
          delegate = SyntaxTreeDelegate;
          source = code;
          index = 0;
          lineNumber = source.length > 0 ? 1 : 0;
          lineStart = 0;
          length = source.length;
          lookahead = null;
          state = {
            allowIn: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1
          };
          extra = {};
          options = options || {};
          options.tokens = true;
          extra.tokens = [];
          extra.tokenize = true;
          extra.openParenToken = -1;
          extra.openCurlyToken = -1;
          extra.range = typeof options.range === "boolean" && options.range;
          extra.loc = typeof options.loc === "boolean" && options.loc;
          if (typeof options.comment === "boolean" && options.comment) {
            extra.comments = [];
          }
          if (typeof options.tolerant === "boolean" && options.tolerant) {
            extra.errors = [];
          }
          try {
            peek();
            if (lookahead.type === Token.EOF) {
              return extra.tokens;
            }
            token = lex();
            while (lookahead.type !== Token.EOF) {
              try {
                token = lex();
              } catch (lexError) {
                token = lookahead;
                if (extra.errors) {
                  extra.errors.push(lexError);
                  break;
                } else {
                  throw lexError;
                }
              }
            }
            filterTokenLocation();
            tokens = extra.tokens;
            if (typeof extra.comments !== "undefined") {
              tokens.comments = extra.comments;
            }
            if (typeof extra.errors !== "undefined") {
              tokens.errors = extra.errors;
            }
          } catch (e) {
            throw e;
          } finally {
            extra = {};
          }
          return tokens;
        }
        function parse(code, options) {
          var program, toString;
          toString = String;
          if (typeof code !== "string" && !(code instanceof String)) {
            code = toString(code);
          }
          delegate = SyntaxTreeDelegate;
          source = code;
          index = 0;
          lineNumber = source.length > 0 ? 1 : 0;
          lineStart = 0;
          length = source.length;
          lookahead = null;
          state = {
            allowIn: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1
          };
          extra = {};
          if (typeof options !== "undefined") {
            extra.range = typeof options.range === "boolean" && options.range;
            extra.loc = typeof options.loc === "boolean" && options.loc;
            extra.attachComment = typeof options.attachComment === "boolean" && options.attachComment;
            if (extra.loc && options.source !== null && options.source !== void 0) {
              extra.source = toString(options.source);
            }
            if (typeof options.tokens === "boolean" && options.tokens) {
              extra.tokens = [];
            }
            if (typeof options.comment === "boolean" && options.comment) {
              extra.comments = [];
            }
            if (typeof options.tolerant === "boolean" && options.tolerant) {
              extra.errors = [];
            }
            if (extra.attachComment) {
              extra.range = true;
              extra.comments = [];
              extra.bottomRightStack = [];
              extra.trailingComments = [];
              extra.leadingComments = [];
            }
          }
          try {
            program = parseProgram();
            if (typeof extra.comments !== "undefined") {
              program.comments = extra.comments;
            }
            if (typeof extra.tokens !== "undefined") {
              filterTokenLocation();
              program.tokens = extra.tokens;
            }
            if (typeof extra.errors !== "undefined") {
              program.errors = extra.errors;
            }
          } catch (e) {
            throw e;
          } finally {
            extra = {};
          }
          return program;
        }
        exports4.version = "1.2.2";
        exports4.tokenize = tokenize;
        exports4.parse = parse;
        exports4.Syntax = function() {
          var name, types = {};
          if (typeof Object.create === "function") {
            types = Object.create(null);
          }
          for (name in Syntax) {
            if (Syntax.hasOwnProperty(name)) {
              types[name] = Syntax[name];
            }
          }
          if (typeof Object.freeze === "function") {
            Object.freeze(types);
          }
          return types;
        }();
      });
    }, {}], 1: [function(require2, module4, exports3) {
      (function(process2) {
        var parser = function() {
          var parser2 = {
            trace: function trace() {
            },
            yy: {},
            symbols_: {error: 2, JSON_PATH: 3, DOLLAR: 4, PATH_COMPONENTS: 5, LEADING_CHILD_MEMBER_EXPRESSION: 6, PATH_COMPONENT: 7, MEMBER_COMPONENT: 8, SUBSCRIPT_COMPONENT: 9, CHILD_MEMBER_COMPONENT: 10, DESCENDANT_MEMBER_COMPONENT: 11, DOT: 12, MEMBER_EXPRESSION: 13, DOT_DOT: 14, STAR: 15, IDENTIFIER: 16, SCRIPT_EXPRESSION: 17, INTEGER: 18, END: 19, CHILD_SUBSCRIPT_COMPONENT: 20, DESCENDANT_SUBSCRIPT_COMPONENT: 21, "[": 22, SUBSCRIPT: 23, "]": 24, SUBSCRIPT_EXPRESSION: 25, SUBSCRIPT_EXPRESSION_LIST: 26, SUBSCRIPT_EXPRESSION_LISTABLE: 27, ",": 28, STRING_LITERAL: 29, ARRAY_SLICE: 30, FILTER_EXPRESSION: 31, QQ_STRING: 32, Q_STRING: 33, $accept: 0, $end: 1},
            terminals_: {2: "error", 4: "DOLLAR", 12: "DOT", 14: "DOT_DOT", 15: "STAR", 16: "IDENTIFIER", 17: "SCRIPT_EXPRESSION", 18: "INTEGER", 19: "END", 22: "[", 24: "]", 28: ",", 30: "ARRAY_SLICE", 31: "FILTER_EXPRESSION", 32: "QQ_STRING", 33: "Q_STRING"},
            productions_: [0, [3, 1], [3, 2], [3, 1], [3, 2], [5, 1], [5, 2], [7, 1], [7, 1], [8, 1], [8, 1], [10, 2], [6, 1], [11, 2], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [9, 1], [9, 1], [20, 3], [21, 4], [23, 1], [23, 1], [26, 1], [26, 3], [27, 1], [27, 1], [27, 1], [25, 1], [25, 1], [25, 1], [29, 1], [29, 1]],
            performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
              if (!yy.ast) {
                yy.ast = _ast;
                _ast.initialize();
              }
              var $0 = $$.length - 1;
              switch (yystate) {
                case 1:
                  yy.ast.set({expression: {type: "root", value: $$[$0]}});
                  yy.ast.unshift();
                  return yy.ast.yield();
                  break;
                case 2:
                  yy.ast.set({expression: {type: "root", value: $$[$0 - 1]}});
                  yy.ast.unshift();
                  return yy.ast.yield();
                  break;
                case 3:
                  yy.ast.unshift();
                  return yy.ast.yield();
                  break;
                case 4:
                  yy.ast.set({operation: "member", scope: "child", expression: {type: "identifier", value: $$[$0 - 1]}});
                  yy.ast.unshift();
                  return yy.ast.yield();
                  break;
                case 5:
                  break;
                case 6:
                  break;
                case 7:
                  yy.ast.set({operation: "member"});
                  yy.ast.push();
                  break;
                case 8:
                  yy.ast.set({operation: "subscript"});
                  yy.ast.push();
                  break;
                case 9:
                  yy.ast.set({scope: "child"});
                  break;
                case 10:
                  yy.ast.set({scope: "descendant"});
                  break;
                case 11:
                  break;
                case 12:
                  yy.ast.set({scope: "child", operation: "member"});
                  break;
                case 13:
                  break;
                case 14:
                  yy.ast.set({expression: {type: "wildcard", value: $$[$0]}});
                  break;
                case 15:
                  yy.ast.set({expression: {type: "identifier", value: $$[$0]}});
                  break;
                case 16:
                  yy.ast.set({expression: {type: "script_expression", value: $$[$0]}});
                  break;
                case 17:
                  yy.ast.set({expression: {type: "numeric_literal", value: parseInt($$[$0])}});
                  break;
                case 18:
                  break;
                case 19:
                  yy.ast.set({scope: "child"});
                  break;
                case 20:
                  yy.ast.set({scope: "descendant"});
                  break;
                case 21:
                  break;
                case 22:
                  break;
                case 23:
                  break;
                case 24:
                  $$[$0].length > 1 ? yy.ast.set({expression: {type: "union", value: $$[$0]}}) : this.$ = $$[$0];
                  break;
                case 25:
                  this.$ = [$$[$0]];
                  break;
                case 26:
                  this.$ = $$[$0 - 2].concat($$[$0]);
                  break;
                case 27:
                  this.$ = {expression: {type: "numeric_literal", value: parseInt($$[$0])}};
                  yy.ast.set(this.$);
                  break;
                case 28:
                  this.$ = {expression: {type: "string_literal", value: $$[$0]}};
                  yy.ast.set(this.$);
                  break;
                case 29:
                  this.$ = {expression: {type: "slice", value: $$[$0]}};
                  yy.ast.set(this.$);
                  break;
                case 30:
                  this.$ = {expression: {type: "wildcard", value: $$[$0]}};
                  yy.ast.set(this.$);
                  break;
                case 31:
                  this.$ = {expression: {type: "script_expression", value: $$[$0]}};
                  yy.ast.set(this.$);
                  break;
                case 32:
                  this.$ = {expression: {type: "filter_expression", value: $$[$0]}};
                  yy.ast.set(this.$);
                  break;
                case 33:
                  this.$ = $$[$0];
                  break;
                case 34:
                  this.$ = $$[$0];
                  break;
              }
            },
            table: [{3: 1, 4: [1, 2], 6: 3, 13: 4, 15: [1, 5], 16: [1, 6], 17: [1, 7], 18: [1, 8], 19: [1, 9]}, {1: [3]}, {1: [2, 1], 5: 10, 7: 11, 8: 12, 9: 13, 10: 14, 11: 15, 12: [1, 18], 14: [1, 19], 20: 16, 21: 17, 22: [1, 20]}, {1: [2, 3], 5: 21, 7: 11, 8: 12, 9: 13, 10: 14, 11: 15, 12: [1, 18], 14: [1, 19], 20: 16, 21: 17, 22: [1, 20]}, {1: [2, 12], 12: [2, 12], 14: [2, 12], 22: [2, 12]}, {1: [2, 14], 12: [2, 14], 14: [2, 14], 22: [2, 14]}, {1: [2, 15], 12: [2, 15], 14: [2, 15], 22: [2, 15]}, {1: [2, 16], 12: [2, 16], 14: [2, 16], 22: [2, 16]}, {1: [2, 17], 12: [2, 17], 14: [2, 17], 22: [2, 17]}, {1: [2, 18], 12: [2, 18], 14: [2, 18], 22: [2, 18]}, {1: [2, 2], 7: 22, 8: 12, 9: 13, 10: 14, 11: 15, 12: [1, 18], 14: [1, 19], 20: 16, 21: 17, 22: [1, 20]}, {1: [2, 5], 12: [2, 5], 14: [2, 5], 22: [2, 5]}, {1: [2, 7], 12: [2, 7], 14: [2, 7], 22: [2, 7]}, {1: [2, 8], 12: [2, 8], 14: [2, 8], 22: [2, 8]}, {1: [2, 9], 12: [2, 9], 14: [2, 9], 22: [2, 9]}, {1: [2, 10], 12: [2, 10], 14: [2, 10], 22: [2, 10]}, {1: [2, 19], 12: [2, 19], 14: [2, 19], 22: [2, 19]}, {1: [2, 20], 12: [2, 20], 14: [2, 20], 22: [2, 20]}, {13: 23, 15: [1, 5], 16: [1, 6], 17: [1, 7], 18: [1, 8], 19: [1, 9]}, {13: 24, 15: [1, 5], 16: [1, 6], 17: [1, 7], 18: [1, 8], 19: [1, 9], 22: [1, 25]}, {15: [1, 29], 17: [1, 30], 18: [1, 33], 23: 26, 25: 27, 26: 28, 27: 32, 29: 34, 30: [1, 35], 31: [1, 31], 32: [1, 36], 33: [1, 37]}, {1: [2, 4], 7: 22, 8: 12, 9: 13, 10: 14, 11: 15, 12: [1, 18], 14: [1, 19], 20: 16, 21: 17, 22: [1, 20]}, {1: [2, 6], 12: [2, 6], 14: [2, 6], 22: [2, 6]}, {1: [2, 11], 12: [2, 11], 14: [2, 11], 22: [2, 11]}, {1: [2, 13], 12: [2, 13], 14: [2, 13], 22: [2, 13]}, {15: [1, 29], 17: [1, 30], 18: [1, 33], 23: 38, 25: 27, 26: 28, 27: 32, 29: 34, 30: [1, 35], 31: [1, 31], 32: [1, 36], 33: [1, 37]}, {24: [1, 39]}, {24: [2, 23]}, {24: [2, 24], 28: [1, 40]}, {24: [2, 30]}, {24: [2, 31]}, {24: [2, 32]}, {24: [2, 25], 28: [2, 25]}, {24: [2, 27], 28: [2, 27]}, {24: [2, 28], 28: [2, 28]}, {24: [2, 29], 28: [2, 29]}, {24: [2, 33], 28: [2, 33]}, {24: [2, 34], 28: [2, 34]}, {24: [1, 41]}, {1: [2, 21], 12: [2, 21], 14: [2, 21], 22: [2, 21]}, {18: [1, 33], 27: 42, 29: 34, 30: [1, 35], 32: [1, 36], 33: [1, 37]}, {1: [2, 22], 12: [2, 22], 14: [2, 22], 22: [2, 22]}, {24: [2, 26], 28: [2, 26]}],
            defaultActions: {27: [2, 23], 29: [2, 30], 30: [2, 31], 31: [2, 32]},
            parseError: function parseError(str2, hash) {
              if (hash.recoverable) {
                this.trace(str2);
              } else {
                throw new Error(str2);
              }
            },
            parse: function parse(input) {
              var self2 = this, stack = [0], vstack = [null], lstack = [], table2 = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
              var args = lstack.slice.call(arguments, 1);
              this.lexer.setInput(input);
              this.lexer.yy = this.yy;
              this.yy.lexer = this.lexer;
              this.yy.parser = this;
              if (typeof this.lexer.yylloc == "undefined") {
                this.lexer.yylloc = {};
              }
              var yyloc = this.lexer.yylloc;
              lstack.push(yyloc);
              var ranges = this.lexer.options && this.lexer.options.ranges;
              if (typeof this.yy.parseError === "function") {
                this.parseError = this.yy.parseError;
              } else {
                this.parseError = Object.getPrototypeOf(this).parseError;
              }
              function popStack(n) {
                stack.length = stack.length - 2 * n;
                vstack.length = vstack.length - n;
                lstack.length = lstack.length - n;
              }
              function lex() {
                var token;
                token = self2.lexer.lex() || EOF;
                if (typeof token !== "number") {
                  token = self2.symbols_[token] || token;
                }
                return token;
              }
              var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
              while (true) {
                state = stack[stack.length - 1];
                if (this.defaultActions[state]) {
                  action = this.defaultActions[state];
                } else {
                  if (symbol === null || typeof symbol == "undefined") {
                    symbol = lex();
                  }
                  action = table2[state] && table2[state][symbol];
                }
                if (typeof action === "undefined" || !action.length || !action[0]) {
                  var errStr = "";
                  expected = [];
                  for (p in table2[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                      expected.push("'" + this.terminals_[p] + "'");
                    }
                  }
                  if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                  } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                  }
                  this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected
                  });
                }
                if (action[0] instanceof Array && action.length > 1) {
                  throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                }
                switch (action[0]) {
                  case 1:
                    stack.push(symbol);
                    vstack.push(this.lexer.yytext);
                    lstack.push(this.lexer.yylloc);
                    stack.push(action[1]);
                    symbol = null;
                    if (!preErrorSymbol) {
                      yyleng = this.lexer.yyleng;
                      yytext = this.lexer.yytext;
                      yylineno = this.lexer.yylineno;
                      yyloc = this.lexer.yylloc;
                      if (recovering > 0) {
                        recovering--;
                      }
                    } else {
                      symbol = preErrorSymbol;
                      preErrorSymbol = null;
                    }
                    break;
                  case 2:
                    len = this.productions_[action[1]][1];
                    yyval.$ = vstack[vstack.length - len];
                    yyval._$ = {
                      first_line: lstack[lstack.length - (len || 1)].first_line,
                      last_line: lstack[lstack.length - 1].last_line,
                      first_column: lstack[lstack.length - (len || 1)].first_column,
                      last_column: lstack[lstack.length - 1].last_column
                    };
                    if (ranges) {
                      yyval._$.range = [
                        lstack[lstack.length - (len || 1)].range[0],
                        lstack[lstack.length - 1].range[1]
                      ];
                    }
                    r = this.performAction.apply(yyval, [
                      yytext,
                      yyleng,
                      yylineno,
                      this.yy,
                      action[1],
                      vstack,
                      lstack
                    ].concat(args));
                    if (typeof r !== "undefined") {
                      return r;
                    }
                    if (len) {
                      stack = stack.slice(0, -1 * len * 2);
                      vstack = vstack.slice(0, -1 * len);
                      lstack = lstack.slice(0, -1 * len);
                    }
                    stack.push(this.productions_[action[1]][0]);
                    vstack.push(yyval.$);
                    lstack.push(yyval._$);
                    newState = table2[stack[stack.length - 2]][stack[stack.length - 1]];
                    stack.push(newState);
                    break;
                  case 3:
                    return true;
                }
              }
              return true;
            }
          };
          var _ast = {
            initialize: function() {
              this._nodes = [];
              this._node = {};
              this._stash = [];
            },
            set: function(props) {
              for (var k in props)
                this._node[k] = props[k];
              return this._node;
            },
            node: function(obj) {
              if (arguments.length)
                this._node = obj;
              return this._node;
            },
            push: function() {
              this._nodes.push(this._node);
              this._node = {};
            },
            unshift: function() {
              this._nodes.unshift(this._node);
              this._node = {};
            },
            yield: function() {
              var _nodes = this._nodes;
              this.initialize();
              return _nodes;
            }
          };
          var lexer = function() {
            var lexer2 = {
              EOF: 1,
              parseError: function parseError(str2, hash) {
                if (this.yy.parser) {
                  this.yy.parser.parseError(str2, hash);
                } else {
                  throw new Error(str2);
                }
              },
              setInput: function(input) {
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = "";
                this.conditionStack = ["INITIAL"];
                this.yylloc = {
                  first_line: 1,
                  first_column: 0,
                  last_line: 1,
                  last_column: 0
                };
                if (this.options.ranges) {
                  this.yylloc.range = [0, 0];
                }
                this.offset = 0;
                return this;
              },
              input: function() {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                  this.yylineno++;
                  this.yylloc.last_line++;
                } else {
                  this.yylloc.last_column++;
                }
                if (this.options.ranges) {
                  this.yylloc.range[1]++;
                }
                this._input = this._input.slice(1);
                return ch;
              },
              unput: function(ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);
                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);
                if (lines.length - 1) {
                  this.yylineno -= lines.length - 1;
                }
                var r = this.yylloc.range;
                this.yylloc = {
                  first_line: this.yylloc.first_line,
                  last_line: this.yylineno + 1,
                  first_column: this.yylloc.first_column,
                  last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                };
                if (this.options.ranges) {
                  this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                this.yyleng = this.yytext.length;
                return this;
              },
              more: function() {
                this._more = true;
                return this;
              },
              reject: function() {
                if (this.options.backtrack_lexer) {
                  this._backtrack = true;
                } else {
                  return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
                    text: "",
                    token: null,
                    line: this.yylineno
                  });
                }
                return this;
              },
              less: function(n) {
                this.unput(this.match.slice(n));
              },
              pastInput: function() {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
              },
              upcomingInput: function() {
                var next = this.match;
                if (next.length < 20) {
                  next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
              },
              showPosition: function() {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
              },
              test_match: function(match, indexed_rule) {
                var token, lines, backup;
                if (this.options.backtrack_lexer) {
                  backup = {
                    yylineno: this.yylineno,
                    yylloc: {
                      first_line: this.yylloc.first_line,
                      last_line: this.last_line,
                      first_column: this.yylloc.first_column,
                      last_column: this.yylloc.last_column
                    },
                    yytext: this.yytext,
                    match: this.match,
                    matches: this.matches,
                    matched: this.matched,
                    yyleng: this.yyleng,
                    offset: this.offset,
                    _more: this._more,
                    _input: this._input,
                    yy: this.yy,
                    conditionStack: this.conditionStack.slice(0),
                    done: this.done
                  };
                  if (this.options.ranges) {
                    backup.yylloc.range = this.yylloc.range.slice(0);
                  }
                }
                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                  this.yylineno += lines.length;
                }
                this.yylloc = {
                  first_line: this.yylloc.last_line,
                  last_line: this.yylineno + 1,
                  first_column: this.yylloc.last_column,
                  last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                  this.yylloc.range = [this.offset, this.offset += this.yyleng];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                  this.done = false;
                }
                if (token) {
                  return token;
                } else if (this._backtrack) {
                  for (var k in backup) {
                    this[k] = backup[k];
                  }
                  return false;
                }
                return false;
              },
              next: function() {
                if (this.done) {
                  return this.EOF;
                }
                if (!this._input) {
                  this.done = true;
                }
                var token, match, tempMatch, index;
                if (!this._more) {
                  this.yytext = "";
                  this.match = "";
                }
                var rules3 = this._currentRules();
                for (var i = 0; i < rules3.length; i++) {
                  tempMatch = this._input.match(this.rules[rules3[i]]);
                  if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                    match = tempMatch;
                    index = i;
                    if (this.options.backtrack_lexer) {
                      token = this.test_match(tempMatch, rules3[i]);
                      if (token !== false) {
                        return token;
                      } else if (this._backtrack) {
                        match = false;
                        continue;
                      } else {
                        return false;
                      }
                    } else if (!this.options.flex) {
                      break;
                    }
                  }
                }
                if (match) {
                  token = this.test_match(match, rules3[index]);
                  if (token !== false) {
                    return token;
                  }
                  return false;
                }
                if (this._input === "") {
                  return this.EOF;
                } else {
                  return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                    text: "",
                    token: null,
                    line: this.yylineno
                  });
                }
              },
              lex: function lex() {
                var r = this.next();
                if (r) {
                  return r;
                } else {
                  return this.lex();
                }
              },
              begin: function begin(condition) {
                this.conditionStack.push(condition);
              },
              popState: function popState() {
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                  return this.conditionStack.pop();
                } else {
                  return this.conditionStack[0];
                }
              },
              _currentRules: function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                  return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                } else {
                  return this.conditions["INITIAL"].rules;
                }
              },
              topState: function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                  return this.conditionStack[n];
                } else {
                  return "INITIAL";
                }
              },
              pushState: function pushState(condition) {
                this.begin(condition);
              },
              stateStackSize: function stateStackSize() {
                return this.conditionStack.length;
              },
              options: {},
              performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                  case 0:
                    return 4;
                    break;
                  case 1:
                    return 14;
                    break;
                  case 2:
                    return 12;
                    break;
                  case 3:
                    return 15;
                    break;
                  case 4:
                    return 16;
                    break;
                  case 5:
                    return 22;
                    break;
                  case 6:
                    return 24;
                    break;
                  case 7:
                    return 28;
                    break;
                  case 8:
                    return 30;
                    break;
                  case 9:
                    return 18;
                    break;
                  case 10:
                    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2);
                    return 32;
                    break;
                  case 11:
                    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2);
                    return 33;
                    break;
                  case 12:
                    return 17;
                    break;
                  case 13:
                    return 31;
                    break;
                }
              },
              rules: [/^(?:\$)/, /^(?:\.\.)/, /^(?:\.)/, /^(?:\*)/, /^(?:[a-zA-Z_]+[a-zA-Z0-9_]*)/, /^(?:\[)/, /^(?:\])/, /^(?:,)/, /^(?:((-?(?:0|[1-9][0-9]*)))?\:((-?(?:0|[1-9][0-9]*)))?(\:((-?(?:0|[1-9][0-9]*)))?)?)/, /^(?:(-?(?:0|[1-9][0-9]*)))/, /^(?:"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*")/, /^(?:'(?:\\['bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*')/, /^(?:\(.+?\)(?=\]))/, /^(?:\?\(.+?\)(?=\]))/],
              conditions: {INITIAL: {rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], inclusive: true}}
            };
            return lexer2;
          }();
          parser2.lexer = lexer;
          function Parser() {
            this.yy = {};
          }
          Parser.prototype = parser2;
          parser2.Parser = Parser;
          return new Parser();
        }();
        if (typeof require2 !== "undefined" && typeof exports3 !== "undefined") {
          exports3.parser = parser;
          exports3.Parser = parser.Parser;
          exports3.parse = function() {
            return parser.parse.apply(parser, arguments);
          };
          exports3.main = function commonjsMain(args) {
            if (!args[1]) {
              console.log("Usage: " + args[0] + " FILE");
              process2.exit(1);
            }
            var source = require2("fs").readFileSync(require2("path").normalize(args[1]), "utf8");
            return exports3.parser.parse(source);
          };
          if (typeof module4 !== "undefined" && require2.main === module4) {
            exports3.main(process2.argv.slice(1));
          }
        }
      }).call(this, require2("_process"));
    }, {_process: 14, fs: 12, path: 13}], 2: [function(require2, module4, exports3) {
      module4.exports = {
        identifier: "[a-zA-Z_]+[a-zA-Z0-9_]*",
        integer: "-?(?:0|[1-9][0-9]*)",
        qq_string: '"(?:\\\\["bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^"\\\\])*"',
        q_string: "'(?:\\\\['bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^'\\\\])*'"
      };
    }, {}], 3: [function(require2, module4, exports3) {
      var dict = require2("./dict");
      var fs2 = require2("fs");
      var grammar = {
        lex: {
          macros: {
            esc: "\\\\",
            int: dict.integer
          },
          rules: [
            ["\\$", "return 'DOLLAR'"],
            ["\\.\\.", "return 'DOT_DOT'"],
            ["\\.", "return 'DOT'"],
            ["\\*", "return 'STAR'"],
            [dict.identifier, "return 'IDENTIFIER'"],
            ["\\[", "return '['"],
            ["\\]", "return ']'"],
            [",", "return ','"],
            ["({int})?\\:({int})?(\\:({int})?)?", "return 'ARRAY_SLICE'"],
            ["{int}", "return 'INTEGER'"],
            [dict.qq_string, "yytext = yytext.substr(1,yyleng-2); return 'QQ_STRING';"],
            [dict.q_string, "yytext = yytext.substr(1,yyleng-2); return 'Q_STRING';"],
            ["\\(.+?\\)(?=\\])", "return 'SCRIPT_EXPRESSION'"],
            ["\\?\\(.+?\\)(?=\\])", "return 'FILTER_EXPRESSION'"]
          ]
        },
        start: "JSON_PATH",
        bnf: {
          JSON_PATH: [
            ["DOLLAR", 'yy.ast.set({ expression: { type: "root", value: $1 } }); yy.ast.unshift(); return yy.ast.yield()'],
            ["DOLLAR PATH_COMPONENTS", 'yy.ast.set({ expression: { type: "root", value: $1 } }); yy.ast.unshift(); return yy.ast.yield()'],
            ["LEADING_CHILD_MEMBER_EXPRESSION", "yy.ast.unshift(); return yy.ast.yield()"],
            ["LEADING_CHILD_MEMBER_EXPRESSION PATH_COMPONENTS", 'yy.ast.set({ operation: "member", scope: "child", expression: { type: "identifier", value: $1 }}); yy.ast.unshift(); return yy.ast.yield()']
          ],
          PATH_COMPONENTS: [
            ["PATH_COMPONENT", ""],
            ["PATH_COMPONENTS PATH_COMPONENT", ""]
          ],
          PATH_COMPONENT: [
            ["MEMBER_COMPONENT", 'yy.ast.set({ operation: "member" }); yy.ast.push()'],
            ["SUBSCRIPT_COMPONENT", 'yy.ast.set({ operation: "subscript" }); yy.ast.push() ']
          ],
          MEMBER_COMPONENT: [
            ["CHILD_MEMBER_COMPONENT", 'yy.ast.set({ scope: "child" })'],
            ["DESCENDANT_MEMBER_COMPONENT", 'yy.ast.set({ scope: "descendant" })']
          ],
          CHILD_MEMBER_COMPONENT: [
            ["DOT MEMBER_EXPRESSION", ""]
          ],
          LEADING_CHILD_MEMBER_EXPRESSION: [
            ["MEMBER_EXPRESSION", 'yy.ast.set({ scope: "child", operation: "member" })']
          ],
          DESCENDANT_MEMBER_COMPONENT: [
            ["DOT_DOT MEMBER_EXPRESSION", ""]
          ],
          MEMBER_EXPRESSION: [
            ["STAR", 'yy.ast.set({ expression: { type: "wildcard", value: $1 } })'],
            ["IDENTIFIER", 'yy.ast.set({ expression: { type: "identifier", value: $1 } })'],
            ["SCRIPT_EXPRESSION", 'yy.ast.set({ expression: { type: "script_expression", value: $1 } })'],
            ["INTEGER", 'yy.ast.set({ expression: { type: "numeric_literal", value: parseInt($1) } })'],
            ["END", ""]
          ],
          SUBSCRIPT_COMPONENT: [
            ["CHILD_SUBSCRIPT_COMPONENT", 'yy.ast.set({ scope: "child" })'],
            ["DESCENDANT_SUBSCRIPT_COMPONENT", 'yy.ast.set({ scope: "descendant" })']
          ],
          CHILD_SUBSCRIPT_COMPONENT: [
            ["[ SUBSCRIPT ]", ""]
          ],
          DESCENDANT_SUBSCRIPT_COMPONENT: [
            ["DOT_DOT [ SUBSCRIPT ]", ""]
          ],
          SUBSCRIPT: [
            ["SUBSCRIPT_EXPRESSION", ""],
            ["SUBSCRIPT_EXPRESSION_LIST", '$1.length > 1? yy.ast.set({ expression: { type: "union", value: $1 } }) : $$ = $1']
          ],
          SUBSCRIPT_EXPRESSION_LIST: [
            ["SUBSCRIPT_EXPRESSION_LISTABLE", "$$ = [$1]"],
            ["SUBSCRIPT_EXPRESSION_LIST , SUBSCRIPT_EXPRESSION_LISTABLE", "$$ = $1.concat($3)"]
          ],
          SUBSCRIPT_EXPRESSION_LISTABLE: [
            ["INTEGER", '$$ = { expression: { type: "numeric_literal", value: parseInt($1) } }; yy.ast.set($$)'],
            ["STRING_LITERAL", '$$ = { expression: { type: "string_literal", value: $1 } }; yy.ast.set($$)'],
            ["ARRAY_SLICE", '$$ = { expression: { type: "slice", value: $1 } }; yy.ast.set($$)']
          ],
          SUBSCRIPT_EXPRESSION: [
            ["STAR", '$$ = { expression: { type: "wildcard", value: $1 } }; yy.ast.set($$)'],
            ["SCRIPT_EXPRESSION", '$$ = { expression: { type: "script_expression", value: $1 } }; yy.ast.set($$)'],
            ["FILTER_EXPRESSION", '$$ = { expression: { type: "filter_expression", value: $1 } }; yy.ast.set($$)']
          ],
          STRING_LITERAL: [
            ["QQ_STRING", "$$ = $1"],
            ["Q_STRING", "$$ = $1"]
          ]
        }
      };
      if (fs2.readFileSync) {
        grammar.moduleInclude = fs2.readFileSync(require2.resolve("../include/module.js"));
        grammar.actionInclude = fs2.readFileSync(require2.resolve("../include/action.js"));
      }
      module4.exports = grammar;
    }, {"./dict": 2, fs: 12}], 4: [function(require2, module4, exports3) {
      var aesprim = require2("./aesprim");
      var slice = require2("./slice");
      var _evaluate = require2("static-eval");
      var _uniq = require2("underscore").uniq;
      var Handlers = function() {
        return this.initialize.apply(this, arguments);
      };
      Handlers.prototype.initialize = function() {
        this.traverse = traverser(true);
        this.descend = traverser();
      };
      Handlers.prototype.keys = Object.keys;
      Handlers.prototype.resolve = function(component) {
        var key = [component.operation, component.scope, component.expression.type].join("-");
        var method = this._fns[key];
        if (!method)
          throw new Error("couldn't resolve key: " + key);
        return method.bind(this);
      };
      Handlers.prototype.register = function(key, handler) {
        if (!handler instanceof Function) {
          throw new Error("handler must be a function");
        }
        this._fns[key] = handler;
      };
      Handlers.prototype._fns = {
        "member-child-identifier": function(component, partial) {
          var key = component.expression.value;
          var value = partial.value;
          if (value instanceof Object && key in value) {
            return [{value: value[key], path: partial.path.concat(key)}];
          }
        },
        "member-descendant-identifier": _traverse(function(key, value, ref) {
          return key == ref;
        }),
        "subscript-child-numeric_literal": _descend(function(key, value, ref) {
          return key === ref;
        }),
        "member-child-numeric_literal": _descend(function(key, value, ref) {
          return String(key) === String(ref);
        }),
        "subscript-descendant-numeric_literal": _traverse(function(key, value, ref) {
          return key === ref;
        }),
        "member-child-wildcard": _descend(function() {
          return true;
        }),
        "member-descendant-wildcard": _traverse(function() {
          return true;
        }),
        "subscript-descendant-wildcard": _traverse(function() {
          return true;
        }),
        "subscript-child-wildcard": _descend(function() {
          return true;
        }),
        "subscript-child-slice": function(component, partial) {
          if (is_array(partial.value)) {
            var args = component.expression.value.split(":").map(_parse_nullable_int);
            var values = partial.value.map(function(v, i) {
              return {value: v, path: partial.path.concat(i)};
            });
            return slice.apply(null, [values].concat(args));
          }
        },
        "subscript-child-union": function(component, partial) {
          var results = [];
          component.expression.value.forEach(function(component2) {
            var _component = {operation: "subscript", scope: "child", expression: component2.expression};
            var handler = this.resolve(_component);
            var _results = handler(_component, partial);
            if (_results) {
              results = results.concat(_results);
            }
          }, this);
          return unique(results);
        },
        "subscript-descendant-union": function(component, partial, count) {
          var jp = require2("..");
          var self2 = this;
          var results = [];
          var nodes = jp.nodes(partial, "$..*").slice(1);
          nodes.forEach(function(node) {
            if (results.length >= count)
              return;
            component.expression.value.forEach(function(component2) {
              var _component = {operation: "subscript", scope: "child", expression: component2.expression};
              var handler = self2.resolve(_component);
              var _results = handler(_component, node);
              results = results.concat(_results);
            });
          });
          return unique(results);
        },
        "subscript-child-filter_expression": function(component, partial, count) {
          var src2 = component.expression.value.slice(2, -1);
          var ast = aesprim.parse(src2).body[0].expression;
          var passable = function(key, value) {
            return evaluate(ast, {"@": value});
          };
          return this.descend(partial, null, passable, count);
        },
        "subscript-descendant-filter_expression": function(component, partial, count) {
          var src2 = component.expression.value.slice(2, -1);
          var ast = aesprim.parse(src2).body[0].expression;
          var passable = function(key, value) {
            return evaluate(ast, {"@": value});
          };
          return this.traverse(partial, null, passable, count);
        },
        "subscript-child-script_expression": function(component, partial) {
          var exp = component.expression.value.slice(1, -1);
          return eval_recurse(partial, exp, "$[{{value}}]");
        },
        "member-child-script_expression": function(component, partial) {
          var exp = component.expression.value.slice(1, -1);
          return eval_recurse(partial, exp, "$.{{value}}");
        },
        "member-descendant-script_expression": function(component, partial) {
          var exp = component.expression.value.slice(1, -1);
          return eval_recurse(partial, exp, "$..value");
        }
      };
      Handlers.prototype._fns["subscript-child-string_literal"] = Handlers.prototype._fns["member-child-identifier"];
      Handlers.prototype._fns["member-descendant-numeric_literal"] = Handlers.prototype._fns["subscript-descendant-string_literal"] = Handlers.prototype._fns["member-descendant-identifier"];
      function eval_recurse(partial, src2, template) {
        var jp = require2("./index");
        var ast = aesprim.parse(src2).body[0].expression;
        var value = evaluate(ast, {"@": partial.value});
        var path3 = template.replace(/\{\{\s*value\s*\}\}/g, value);
        var results = jp.nodes(partial.value, path3);
        results.forEach(function(r) {
          r.path = partial.path.concat(r.path.slice(1));
        });
        return results;
      }
      function is_array(val) {
        return Array.isArray(val);
      }
      function is_object(val) {
        return val && !(val instanceof Array) && val instanceof Object;
      }
      function traverser(recurse) {
        return function(partial, ref, passable, count) {
          var value = partial.value;
          var path3 = partial.path;
          var results = [];
          var descend = function(value2, path4) {
            if (is_array(value2)) {
              value2.forEach(function(element, index) {
                if (results.length >= count) {
                  return;
                }
                if (passable(index, element, ref)) {
                  results.push({path: path4.concat(index), value: element});
                }
              });
              value2.forEach(function(element, index) {
                if (results.length >= count) {
                  return;
                }
                if (recurse) {
                  descend(element, path4.concat(index));
                }
              });
            } else if (is_object(value2)) {
              this.keys(value2).forEach(function(k) {
                if (results.length >= count) {
                  return;
                }
                if (passable(k, value2[k], ref)) {
                  results.push({path: path4.concat(k), value: value2[k]});
                }
              });
              this.keys(value2).forEach(function(k) {
                if (results.length >= count) {
                  return;
                }
                if (recurse) {
                  descend(value2[k], path4.concat(k));
                }
              });
            }
          }.bind(this);
          descend(value, path3);
          return results;
        };
      }
      function _descend(passable) {
        return function(component, partial, count) {
          return this.descend(partial, component.expression.value, passable, count);
        };
      }
      function _traverse(passable) {
        return function(component, partial, count) {
          return this.traverse(partial, component.expression.value, passable, count);
        };
      }
      function evaluate() {
        try {
          return _evaluate.apply(this, arguments);
        } catch (e) {
        }
      }
      function unique(results) {
        results = results.filter(function(d) {
          return d;
        });
        return _uniq(results, function(r) {
          return r.path.map(function(c) {
            return String(c).replace("-", "--");
          }).join("-");
        });
      }
      function _parse_nullable_int(val) {
        var sval = String(val);
        return sval.match(/^-?[0-9]+$/) ? parseInt(sval) : null;
      }
      module4.exports = Handlers;
    }, {"..": "jsonpath", "./aesprim": "./aesprim", "./index": 5, "./slice": 7, "static-eval": 15, underscore: 12}], 5: [function(require2, module4, exports3) {
      var assert = require2("assert");
      var dict = require2("./dict");
      var Parser = require2("./parser");
      var Handlers = require2("./handlers");
      var JSONPath2 = function() {
        this.initialize.apply(this, arguments);
      };
      JSONPath2.prototype.initialize = function() {
        this.parser = new Parser();
        this.handlers = new Handlers();
      };
      JSONPath2.prototype.parse = function(string) {
        assert.ok(_is_string(string), "we need a path");
        return this.parser.parse(string);
      };
      JSONPath2.prototype.parent = function(obj, string) {
        assert.ok(obj instanceof Object, "obj needs to be an object");
        assert.ok(string, "we need a path");
        var node = this.nodes(obj, string)[0];
        var key = node.path.pop();
        return this.value(obj, node.path);
      };
      JSONPath2.prototype.apply = function(obj, string, fn) {
        assert.ok(obj instanceof Object, "obj needs to be an object");
        assert.ok(string, "we need a path");
        assert.equal(typeof fn, "function", "fn needs to be function");
        var nodes = this.nodes(obj, string).sort(function(a, b) {
          return b.path.length - a.path.length;
        });
        nodes.forEach(function(node) {
          var key = node.path.pop();
          var parent = this.value(obj, this.stringify(node.path));
          var val = node.value = fn.call(obj, parent[key]);
          parent[key] = val;
        }, this);
        return nodes;
      };
      JSONPath2.prototype.value = function(obj, path3, value) {
        assert.ok(obj instanceof Object, "obj needs to be an object");
        assert.ok(path3, "we need a path");
        if (arguments.length >= 3) {
          var node = this.nodes(obj, path3).shift();
          if (!node)
            return this._vivify(obj, path3, value);
          var key = node.path.slice(-1).shift();
          var parent = this.parent(obj, this.stringify(node.path));
          parent[key] = value;
        }
        return this.query(obj, this.stringify(path3), 1).shift();
      };
      JSONPath2.prototype._vivify = function(obj, string, value) {
        var self2 = this;
        assert.ok(obj instanceof Object, "obj needs to be an object");
        assert.ok(string, "we need a path");
        var path3 = this.parser.parse(string).map(function(component) {
          return component.expression.value;
        });
        var setValue = function(path4, value2) {
          var key = path4.pop();
          var node = self2.value(obj, path4);
          if (!node) {
            setValue(path4.concat(), typeof key === "string" ? {} : []);
            node = self2.value(obj, path4);
          }
          node[key] = value2;
        };
        setValue(path3, value);
        return this.query(obj, string)[0];
      };
      JSONPath2.prototype.query = function(obj, string, count) {
        assert.ok(obj instanceof Object, "obj needs to be an object");
        assert.ok(_is_string(string), "we need a path");
        var results = this.nodes(obj, string, count).map(function(r) {
          return r.value;
        });
        return results;
      };
      JSONPath2.prototype.paths = function(obj, string, count) {
        assert.ok(obj instanceof Object, "obj needs to be an object");
        assert.ok(string, "we need a path");
        var results = this.nodes(obj, string, count).map(function(r) {
          return r.path;
        });
        return results;
      };
      JSONPath2.prototype.nodes = function(obj, string, count) {
        assert.ok(obj instanceof Object, "obj needs to be an object");
        assert.ok(string, "we need a path");
        if (count === 0)
          return [];
        var path3 = this.parser.parse(string);
        var handlers = this.handlers;
        var partials = [{path: ["$"], value: obj}];
        var matches = [];
        if (path3.length && path3[0].expression.type == "root")
          path3.shift();
        if (!path3.length)
          return partials;
        path3.forEach(function(component, index) {
          if (matches.length >= count)
            return;
          var handler = handlers.resolve(component);
          var _partials = [];
          partials.forEach(function(p) {
            if (matches.length >= count)
              return;
            var results = handler(component, p, count);
            if (index == path3.length - 1) {
              matches = matches.concat(results || []);
            } else {
              _partials = _partials.concat(results || []);
            }
          });
          partials = _partials;
        });
        return count ? matches.slice(0, count) : matches;
      };
      JSONPath2.prototype.stringify = function(path3) {
        assert.ok(path3, "we need a path");
        var string = "$";
        var templates = {
          "descendant-member": "..{{value}}",
          "child-member": ".{{value}}",
          "descendant-subscript": "..[{{value}}]",
          "child-subscript": "[{{value}}]"
        };
        path3 = this._normalize(path3);
        path3.forEach(function(component) {
          if (component.expression.type == "root")
            return;
          var key = [component.scope, component.operation].join("-");
          var template = templates[key];
          var value;
          if (component.expression.type == "string_literal") {
            value = JSON.stringify(component.expression.value);
          } else {
            value = component.expression.value;
          }
          if (!template)
            throw new Error("couldn't find template " + key);
          string += template.replace(/{{value}}/, value);
        });
        return string;
      };
      JSONPath2.prototype._normalize = function(path3) {
        assert.ok(path3, "we need a path");
        if (typeof path3 == "string") {
          return this.parser.parse(path3);
        } else if (Array.isArray(path3) && typeof path3[0] == "string") {
          var _path = [{expression: {type: "root", value: "$"}}];
          path3.forEach(function(component, index) {
            if (component == "$" && index === 0)
              return;
            if (typeof component == "string" && component.match("^" + dict.identifier + "$")) {
              _path.push({
                operation: "member",
                scope: "child",
                expression: {value: component, type: "identifier"}
              });
            } else {
              var type = typeof component == "number" ? "numeric_literal" : "string_literal";
              _path.push({
                operation: "subscript",
                scope: "child",
                expression: {value: component, type}
              });
            }
          });
          return _path;
        } else if (Array.isArray(path3) && typeof path3[0] == "object") {
          return path3;
        }
        throw new Error("couldn't understand path " + path3);
      };
      function _is_string(obj) {
        return Object.prototype.toString.call(obj) == "[object String]";
      }
      JSONPath2.Handlers = Handlers;
      JSONPath2.Parser = Parser;
      var instance = new JSONPath2();
      instance.JSONPath = JSONPath2;
      module4.exports = instance;
    }, {"./dict": 2, "./handlers": 4, "./parser": 6, assert: 8}], 6: [function(require2, module4, exports3) {
      var grammar = require2("./grammar");
      var gparser = require2("../generated/parser");
      var Parser = function() {
        var parser = new gparser.Parser();
        var _parseError = parser.parseError;
        parser.yy.parseError = function() {
          if (parser.yy.ast) {
            parser.yy.ast.initialize();
          }
          _parseError.apply(parser, arguments);
        };
        return parser;
      };
      Parser.grammar = grammar;
      module4.exports = Parser;
    }, {"../generated/parser": 1, "./grammar": 3}], 7: [function(require2, module4, exports3) {
      module4.exports = function(arr, start, end, step) {
        if (typeof start == "string")
          throw new Error("start cannot be a string");
        if (typeof end == "string")
          throw new Error("end cannot be a string");
        if (typeof step == "string")
          throw new Error("step cannot be a string");
        var len = arr.length;
        if (step === 0)
          throw new Error("step cannot be zero");
        step = step ? integer(step) : 1;
        start = start < 0 ? len + start : start;
        end = end < 0 ? len + end : end;
        start = integer(start === 0 ? 0 : !start ? step > 0 ? 0 : len - 1 : start);
        end = integer(end === 0 ? 0 : !end ? step > 0 ? len : -1 : end);
        start = step > 0 ? Math.max(0, start) : Math.min(len, start);
        end = step > 0 ? Math.min(end, len) : Math.max(-1, end);
        if (step > 0 && end <= start)
          return [];
        if (step < 0 && start <= end)
          return [];
        var result = [];
        for (var i = start; i != end; i += step) {
          if (step < 0 && i <= end || step > 0 && i >= end)
            break;
          result.push(arr[i]);
        }
        return result;
      };
      function integer(val) {
        return String(val).match(/^[0-9]+$/) ? parseInt(val) : Number.isFinite(val) ? parseInt(val, 10) : 0;
      }
    }, {}], 8: [function(require2, module4, exports3) {
      var util = require2("util/");
      var pSlice = Array.prototype.slice;
      var hasOwn = Object.prototype.hasOwnProperty;
      var assert = module4.exports = ok;
      assert.AssertionError = function AssertionError(options) {
        this.name = "AssertionError";
        this.actual = options.actual;
        this.expected = options.expected;
        this.operator = options.operator;
        if (options.message) {
          this.message = options.message;
          this.generatedMessage = false;
        } else {
          this.message = getMessage(this);
          this.generatedMessage = true;
        }
        var stackStartFunction = options.stackStartFunction || fail;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, stackStartFunction);
        } else {
          var err = new Error();
          if (err.stack) {
            var out = err.stack;
            var fn_name = stackStartFunction.name;
            var idx = out.indexOf("\n" + fn_name);
            if (idx >= 0) {
              var next_line = out.indexOf("\n", idx + 1);
              out = out.substring(next_line + 1);
            }
            this.stack = out;
          }
        }
      };
      util.inherits(assert.AssertionError, Error);
      function replacer(key, value) {
        if (util.isUndefined(value)) {
          return "" + value;
        }
        if (util.isNumber(value) && !isFinite(value)) {
          return value.toString();
        }
        if (util.isFunction(value) || util.isRegExp(value)) {
          return value.toString();
        }
        return value;
      }
      function truncate(s, n) {
        if (util.isString(s)) {
          return s.length < n ? s : s.slice(0, n);
        } else {
          return s;
        }
      }
      function getMessage(self2) {
        return truncate(JSON.stringify(self2.actual, replacer), 128) + " " + self2.operator + " " + truncate(JSON.stringify(self2.expected, replacer), 128);
      }
      function fail(actual, expected, message, operator, stackStartFunction) {
        throw new assert.AssertionError({
          message,
          actual,
          expected,
          operator,
          stackStartFunction
        });
      }
      assert.fail = fail;
      function ok(value, message) {
        if (!value)
          fail(value, true, message, "==", assert.ok);
      }
      assert.ok = ok;
      assert.equal = function equal(actual, expected, message) {
        if (actual != expected)
          fail(actual, expected, message, "==", assert.equal);
      };
      assert.notEqual = function notEqual(actual, expected, message) {
        if (actual == expected) {
          fail(actual, expected, message, "!=", assert.notEqual);
        }
      };
      assert.deepEqual = function deepEqual(actual, expected, message) {
        if (!_deepEqual(actual, expected)) {
          fail(actual, expected, message, "deepEqual", assert.deepEqual);
        }
      };
      function _deepEqual(actual, expected) {
        if (actual === expected) {
          return true;
        } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
          if (actual.length != expected.length)
            return false;
          for (var i = 0; i < actual.length; i++) {
            if (actual[i] !== expected[i])
              return false;
          }
          return true;
        } else if (util.isDate(actual) && util.isDate(expected)) {
          return actual.getTime() === expected.getTime();
        } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
          return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase;
        } else if (!util.isObject(actual) && !util.isObject(expected)) {
          return actual == expected;
        } else {
          return objEquiv(actual, expected);
        }
      }
      function isArguments(object) {
        return Object.prototype.toString.call(object) == "[object Arguments]";
      }
      function objEquiv(a, b) {
        if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
          return false;
        if (a.prototype !== b.prototype)
          return false;
        if (util.isPrimitive(a) || util.isPrimitive(b)) {
          return a === b;
        }
        var aIsArgs = isArguments(a), bIsArgs = isArguments(b);
        if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs)
          return false;
        if (aIsArgs) {
          a = pSlice.call(a);
          b = pSlice.call(b);
          return _deepEqual(a, b);
        }
        var ka = objectKeys(a), kb = objectKeys(b), key, i;
        if (ka.length != kb.length)
          return false;
        ka.sort();
        kb.sort();
        for (i = ka.length - 1; i >= 0; i--) {
          if (ka[i] != kb[i])
            return false;
        }
        for (i = ka.length - 1; i >= 0; i--) {
          key = ka[i];
          if (!_deepEqual(a[key], b[key]))
            return false;
        }
        return true;
      }
      assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
        if (_deepEqual(actual, expected)) {
          fail(actual, expected, message, "notDeepEqual", assert.notDeepEqual);
        }
      };
      assert.strictEqual = function strictEqual(actual, expected, message) {
        if (actual !== expected) {
          fail(actual, expected, message, "===", assert.strictEqual);
        }
      };
      assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
        if (actual === expected) {
          fail(actual, expected, message, "!==", assert.notStrictEqual);
        }
      };
      function expectedException(actual, expected) {
        if (!actual || !expected) {
          return false;
        }
        if (Object.prototype.toString.call(expected) == "[object RegExp]") {
          return expected.test(actual);
        } else if (actual instanceof expected) {
          return true;
        } else if (expected.call({}, actual) === true) {
          return true;
        }
        return false;
      }
      function _throws(shouldThrow, block, expected, message) {
        var actual;
        if (util.isString(expected)) {
          message = expected;
          expected = null;
        }
        try {
          block();
        } catch (e) {
          actual = e;
        }
        message = (expected && expected.name ? " (" + expected.name + ")." : ".") + (message ? " " + message : ".");
        if (shouldThrow && !actual) {
          fail(actual, expected, "Missing expected exception" + message);
        }
        if (!shouldThrow && expectedException(actual, expected)) {
          fail(actual, expected, "Got unwanted exception" + message);
        }
        if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
          throw actual;
        }
      }
      assert.throws = function(block, error, message) {
        _throws.apply(this, [true].concat(pSlice.call(arguments)));
      };
      assert.doesNotThrow = function(block, message) {
        _throws.apply(this, [false].concat(pSlice.call(arguments)));
      };
      assert.ifError = function(err) {
        if (err) {
          throw err;
        }
      };
      var objectKeys = Object.keys || function(obj) {
        var keys = [];
        for (var key in obj) {
          if (hasOwn.call(obj, key))
            keys.push(key);
        }
        return keys;
      };
    }, {"util/": 11}], 9: [function(require2, module4, exports3) {
      if (typeof Object.create === "function") {
        module4.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        };
      } else {
        module4.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        };
      }
    }, {}], 10: [function(require2, module4, exports3) {
      module4.exports = function isBuffer(arg) {
        return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
      };
    }, {}], 11: [function(require2, module4, exports3) {
      (function(process2, global2) {
        var formatRegExp = /%[sdj%]/g;
        exports3.format = function(f) {
          if (!isString(f)) {
            var objects = [];
            for (var i = 0; i < arguments.length; i++) {
              objects.push(inspect(arguments[i]));
            }
            return objects.join(" ");
          }
          var i = 1;
          var args = arguments;
          var len = args.length;
          var str2 = String(f).replace(formatRegExp, function(x2) {
            if (x2 === "%%")
              return "%";
            if (i >= len)
              return x2;
            switch (x2) {
              case "%s":
                return String(args[i++]);
              case "%d":
                return Number(args[i++]);
              case "%j":
                try {
                  return JSON.stringify(args[i++]);
                } catch (_) {
                  return "[Circular]";
                }
              default:
                return x2;
            }
          });
          for (var x = args[i]; i < len; x = args[++i]) {
            if (isNull(x) || !isObject(x)) {
              str2 += " " + x;
            } else {
              str2 += " " + inspect(x);
            }
          }
          return str2;
        };
        exports3.deprecate = function(fn, msg) {
          if (isUndefined(global2.process)) {
            return function() {
              return exports3.deprecate(fn, msg).apply(this, arguments);
            };
          }
          if (process2.noDeprecation === true) {
            return fn;
          }
          var warned = false;
          function deprecated() {
            if (!warned) {
              if (process2.throwDeprecation) {
                throw new Error(msg);
              } else if (process2.traceDeprecation) {
                console.trace(msg);
              } else {
                console.error(msg);
              }
              warned = true;
            }
            return fn.apply(this, arguments);
          }
          return deprecated;
        };
        var debugs = {};
        var debugEnviron;
        exports3.debuglog = function(set) {
          if (isUndefined(debugEnviron))
            debugEnviron = process2.env.NODE_DEBUG || "";
          set = set.toUpperCase();
          if (!debugs[set]) {
            if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
              var pid = process2.pid;
              debugs[set] = function() {
                var msg = exports3.format.apply(exports3, arguments);
                console.error("%s %d: %s", set, pid, msg);
              };
            } else {
              debugs[set] = function() {
              };
            }
          }
          return debugs[set];
        };
        function inspect(obj, opts) {
          var ctx = {
            seen: [],
            stylize: stylizeNoColor
          };
          if (arguments.length >= 3)
            ctx.depth = arguments[2];
          if (arguments.length >= 4)
            ctx.colors = arguments[3];
          if (isBoolean(opts)) {
            ctx.showHidden = opts;
          } else if (opts) {
            exports3._extend(ctx, opts);
          }
          if (isUndefined(ctx.showHidden))
            ctx.showHidden = false;
          if (isUndefined(ctx.depth))
            ctx.depth = 2;
          if (isUndefined(ctx.colors))
            ctx.colors = false;
          if (isUndefined(ctx.customInspect))
            ctx.customInspect = true;
          if (ctx.colors)
            ctx.stylize = stylizeWithColor;
          return formatValue(ctx, obj, ctx.depth);
        }
        exports3.inspect = inspect;
        inspect.colors = {
          bold: [1, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          white: [37, 39],
          grey: [90, 39],
          black: [30, 39],
          blue: [34, 39],
          cyan: [36, 39],
          green: [32, 39],
          magenta: [35, 39],
          red: [31, 39],
          yellow: [33, 39]
        };
        inspect.styles = {
          special: "cyan",
          number: "yellow",
          boolean: "yellow",
          undefined: "grey",
          null: "bold",
          string: "green",
          date: "magenta",
          regexp: "red"
        };
        function stylizeWithColor(str2, styleType) {
          var style = inspect.styles[styleType];
          if (style) {
            return "[" + inspect.colors[style][0] + "m" + str2 + "[" + inspect.colors[style][1] + "m";
          } else {
            return str2;
          }
        }
        function stylizeNoColor(str2, styleType) {
          return str2;
        }
        function arrayToHash(array) {
          var hash = {};
          array.forEach(function(val, idx) {
            hash[val] = true;
          });
          return hash;
        }
        function formatValue(ctx, value, recurseTimes) {
          if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports3.inspect && !(value.constructor && value.constructor.prototype === value)) {
            var ret = value.inspect(recurseTimes, ctx);
            if (!isString(ret)) {
              ret = formatValue(ctx, ret, recurseTimes);
            }
            return ret;
          }
          var primitive = formatPrimitive(ctx, value);
          if (primitive) {
            return primitive;
          }
          var keys = Object.keys(value);
          var visibleKeys = arrayToHash(keys);
          if (ctx.showHidden) {
            keys = Object.getOwnPropertyNames(value);
          }
          if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
            return formatError(value);
          }
          if (keys.length === 0) {
            if (isFunction(value)) {
              var name = value.name ? ": " + value.name : "";
              return ctx.stylize("[Function" + name + "]", "special");
            }
            if (isRegExp(value)) {
              return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
            }
            if (isDate(value)) {
              return ctx.stylize(Date.prototype.toString.call(value), "date");
            }
            if (isError(value)) {
              return formatError(value);
            }
          }
          var base = "", array = false, braces = ["{", "}"];
          if (isArray(value)) {
            array = true;
            braces = ["[", "]"];
          }
          if (isFunction(value)) {
            var n = value.name ? ": " + value.name : "";
            base = " [Function" + n + "]";
          }
          if (isRegExp(value)) {
            base = " " + RegExp.prototype.toString.call(value);
          }
          if (isDate(value)) {
            base = " " + Date.prototype.toUTCString.call(value);
          }
          if (isError(value)) {
            base = " " + formatError(value);
          }
          if (keys.length === 0 && (!array || value.length == 0)) {
            return braces[0] + base + braces[1];
          }
          if (recurseTimes < 0) {
            if (isRegExp(value)) {
              return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
            } else {
              return ctx.stylize("[Object]", "special");
            }
          }
          ctx.seen.push(value);
          var output;
          if (array) {
            output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
          } else {
            output = keys.map(function(key) {
              return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
            });
          }
          ctx.seen.pop();
          return reduceToSingleString(output, base, braces);
        }
        function formatPrimitive(ctx, value) {
          if (isUndefined(value))
            return ctx.stylize("undefined", "undefined");
          if (isString(value)) {
            var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
            return ctx.stylize(simple, "string");
          }
          if (isNumber(value))
            return ctx.stylize("" + value, "number");
          if (isBoolean(value))
            return ctx.stylize("" + value, "boolean");
          if (isNull(value))
            return ctx.stylize("null", "null");
        }
        function formatError(value) {
          return "[" + Error.prototype.toString.call(value) + "]";
        }
        function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
          var output = [];
          for (var i = 0, l = value.length; i < l; ++i) {
            if (hasOwnProperty(value, String(i))) {
              output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
            } else {
              output.push("");
            }
          }
          keys.forEach(function(key) {
            if (!key.match(/^\d+$/)) {
              output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
            }
          });
          return output;
        }
        function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
          var name, str2, desc;
          desc = Object.getOwnPropertyDescriptor(value, key) || {value: value[key]};
          if (desc.get) {
            if (desc.set) {
              str2 = ctx.stylize("[Getter/Setter]", "special");
            } else {
              str2 = ctx.stylize("[Getter]", "special");
            }
          } else {
            if (desc.set) {
              str2 = ctx.stylize("[Setter]", "special");
            }
          }
          if (!hasOwnProperty(visibleKeys, key)) {
            name = "[" + key + "]";
          }
          if (!str2) {
            if (ctx.seen.indexOf(desc.value) < 0) {
              if (isNull(recurseTimes)) {
                str2 = formatValue(ctx, desc.value, null);
              } else {
                str2 = formatValue(ctx, desc.value, recurseTimes - 1);
              }
              if (str2.indexOf("\n") > -1) {
                if (array) {
                  str2 = str2.split("\n").map(function(line) {
                    return "  " + line;
                  }).join("\n").substr(2);
                } else {
                  str2 = "\n" + str2.split("\n").map(function(line) {
                    return "   " + line;
                  }).join("\n");
                }
              }
            } else {
              str2 = ctx.stylize("[Circular]", "special");
            }
          }
          if (isUndefined(name)) {
            if (array && key.match(/^\d+$/)) {
              return str2;
            }
            name = JSON.stringify("" + key);
            if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
              name = name.substr(1, name.length - 2);
              name = ctx.stylize(name, "name");
            } else {
              name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
              name = ctx.stylize(name, "string");
            }
          }
          return name + ": " + str2;
        }
        function reduceToSingleString(output, base, braces) {
          var numLinesEst = 0;
          var length = output.reduce(function(prev, cur) {
            numLinesEst++;
            if (cur.indexOf("\n") >= 0)
              numLinesEst++;
            return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
          }, 0);
          if (length > 60) {
            return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
          }
          return braces[0] + base + " " + output.join(", ") + " " + braces[1];
        }
        function isArray(ar) {
          return Array.isArray(ar);
        }
        exports3.isArray = isArray;
        function isBoolean(arg) {
          return typeof arg === "boolean";
        }
        exports3.isBoolean = isBoolean;
        function isNull(arg) {
          return arg === null;
        }
        exports3.isNull = isNull;
        function isNullOrUndefined(arg) {
          return arg == null;
        }
        exports3.isNullOrUndefined = isNullOrUndefined;
        function isNumber(arg) {
          return typeof arg === "number";
        }
        exports3.isNumber = isNumber;
        function isString(arg) {
          return typeof arg === "string";
        }
        exports3.isString = isString;
        function isSymbol(arg) {
          return typeof arg === "symbol";
        }
        exports3.isSymbol = isSymbol;
        function isUndefined(arg) {
          return arg === void 0;
        }
        exports3.isUndefined = isUndefined;
        function isRegExp(re) {
          return isObject(re) && objectToString(re) === "[object RegExp]";
        }
        exports3.isRegExp = isRegExp;
        function isObject(arg) {
          return typeof arg === "object" && arg !== null;
        }
        exports3.isObject = isObject;
        function isDate(d) {
          return isObject(d) && objectToString(d) === "[object Date]";
        }
        exports3.isDate = isDate;
        function isError(e) {
          return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
        }
        exports3.isError = isError;
        function isFunction(arg) {
          return typeof arg === "function";
        }
        exports3.isFunction = isFunction;
        function isPrimitive(arg) {
          return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
        }
        exports3.isPrimitive = isPrimitive;
        exports3.isBuffer = require2("./support/isBuffer");
        function objectToString(o) {
          return Object.prototype.toString.call(o);
        }
        function pad(n) {
          return n < 10 ? "0" + n.toString(10) : n.toString(10);
        }
        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];
        function timestamp() {
          var d = new Date();
          var time = [
            pad(d.getHours()),
            pad(d.getMinutes()),
            pad(d.getSeconds())
          ].join(":");
          return [d.getDate(), months[d.getMonth()], time].join(" ");
        }
        exports3.log = function() {
          console.log("%s - %s", timestamp(), exports3.format.apply(exports3, arguments));
        };
        exports3.inherits = require2("inherits");
        exports3._extend = function(origin, add) {
          if (!add || !isObject(add))
            return origin;
          var keys = Object.keys(add);
          var i = keys.length;
          while (i--) {
            origin[keys[i]] = add[keys[i]];
          }
          return origin;
        };
        function hasOwnProperty(obj, prop) {
          return Object.prototype.hasOwnProperty.call(obj, prop);
        }
      }).call(this, require2("_process"), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {"./support/isBuffer": 10, _process: 14, inherits: 9}], 12: [function(require2, module4, exports3) {
    }, {}], 13: [function(require2, module4, exports3) {
      (function(process2) {
        function normalizeArray(parts, allowAboveRoot) {
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
              parts.splice(i, 1);
            } else if (last === "..") {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          if (allowAboveRoot) {
            for (; up--; up) {
              parts.unshift("..");
            }
          }
          return parts;
        }
        exports3.resolve = function() {
          var resolvedPath = "", resolvedAbsolute = false;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path3 = i >= 0 ? arguments[i] : process2.cwd();
            if (typeof path3 !== "string") {
              throw new TypeError("Arguments to path.resolve must be strings");
            } else if (!path3) {
              continue;
            }
            resolvedPath = path3 + "/" + resolvedPath;
            resolvedAbsolute = path3.charAt(0) === "/";
          }
          resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(p) {
            return !!p;
          }), !resolvedAbsolute).join("/");
          return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
        };
        exports3.normalize = function(path3) {
          var isAbsolute = exports3.isAbsolute(path3), trailingSlash = substr(path3, -1) === "/";
          path3 = normalizeArray(filter(path3.split("/"), function(p) {
            return !!p;
          }), !isAbsolute).join("/");
          if (!path3 && !isAbsolute) {
            path3 = ".";
          }
          if (path3 && trailingSlash) {
            path3 += "/";
          }
          return (isAbsolute ? "/" : "") + path3;
        };
        exports3.isAbsolute = function(path3) {
          return path3.charAt(0) === "/";
        };
        exports3.join = function() {
          var paths = Array.prototype.slice.call(arguments, 0);
          return exports3.normalize(filter(paths, function(p, index) {
            if (typeof p !== "string") {
              throw new TypeError("Arguments to path.join must be strings");
            }
            return p;
          }).join("/"));
        };
        exports3.relative = function(from, to) {
          from = exports3.resolve(from).substr(1);
          to = exports3.resolve(to).substr(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== "")
                break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== "")
                break;
            }
            if (start > end)
              return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split("/"));
          var toParts = trim(to.split("/"));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break;
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..");
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join("/");
        };
        exports3.sep = "/";
        exports3.delimiter = ":";
        exports3.dirname = function(path3) {
          if (typeof path3 !== "string")
            path3 = path3 + "";
          if (path3.length === 0)
            return ".";
          var code = path3.charCodeAt(0);
          var hasRoot = code === 47;
          var end = -1;
          var matchedSlash = true;
          for (var i = path3.length - 1; i >= 1; --i) {
            code = path3.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                end = i;
                break;
              }
            } else {
              matchedSlash = false;
            }
          }
          if (end === -1)
            return hasRoot ? "/" : ".";
          if (hasRoot && end === 1) {
            return "/";
          }
          return path3.slice(0, end);
        };
        function basename2(path3) {
          if (typeof path3 !== "string")
            path3 = path3 + "";
          var start = 0;
          var end = -1;
          var matchedSlash = true;
          var i;
          for (i = path3.length - 1; i >= 0; --i) {
            if (path3.charCodeAt(i) === 47) {
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
          }
          if (end === -1)
            return "";
          return path3.slice(start, end);
        }
        exports3.basename = function(path3, ext) {
          var f = basename2(path3);
          if (ext && f.substr(-1 * ext.length) === ext) {
            f = f.substr(0, f.length - ext.length);
          }
          return f;
        };
        exports3.extname = function(path3) {
          if (typeof path3 !== "string")
            path3 = path3 + "";
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var preDotState = 0;
          for (var i = path3.length - 1; i >= 0; --i) {
            var code = path3.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return "";
          }
          return path3.slice(startDot, end);
        };
        function filter(xs, f) {
          if (xs.filter)
            return xs.filter(f);
          var res = [];
          for (var i = 0; i < xs.length; i++) {
            if (f(xs[i], i, xs))
              res.push(xs[i]);
          }
          return res;
        }
        var substr = "ab".substr(-1) === "b" ? function(str2, start, len) {
          return str2.substr(start, len);
        } : function(str2, start, len) {
          if (start < 0)
            start = str2.length + start;
          return str2.substr(start, len);
        };
      }).call(this, require2("_process"));
    }, {_process: 14}], 14: [function(require2, module4, exports3) {
      var process2 = module4.exports = {};
      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error("setTimeout has not been defined");
      }
      function defaultClearTimeout() {
        throw new Error("clearTimeout has not been defined");
      }
      (function() {
        try {
          if (typeof setTimeout === "function") {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === "function") {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          return setTimeout(fun, 0);
        }
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e2) {
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          return clearTimeout(marker);
        }
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            return cachedClearTimeout.call(null, marker);
          } catch (e2) {
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }
      process2.nextTick = function(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function() {
        this.fun.apply(null, this.array);
      };
      process2.title = "browser";
      process2.browser = true;
      process2.env = {};
      process2.argv = [];
      process2.version = "";
      process2.versions = {};
      function noop() {
      }
      process2.on = noop;
      process2.addListener = noop;
      process2.once = noop;
      process2.off = noop;
      process2.removeListener = noop;
      process2.removeAllListeners = noop;
      process2.emit = noop;
      process2.prependListener = noop;
      process2.prependOnceListener = noop;
      process2.listeners = function(name) {
        return [];
      };
      process2.binding = function(name) {
        throw new Error("process.binding is not supported");
      };
      process2.cwd = function() {
        return "/";
      };
      process2.chdir = function(dir) {
        throw new Error("process.chdir is not supported");
      };
      process2.umask = function() {
        return 0;
      };
    }, {}], 15: [function(require2, module4, exports3) {
      var unparse = require2("escodegen").generate;
      module4.exports = function(ast, vars) {
        if (!vars)
          vars = {};
        var FAIL = {};
        var result = function walk(node, scopeVars) {
          if (node.type === "Literal") {
            return node.value;
          } else if (node.type === "UnaryExpression") {
            var val = walk(node.argument);
            if (node.operator === "+")
              return +val;
            if (node.operator === "-")
              return -val;
            if (node.operator === "~")
              return ~val;
            if (node.operator === "!")
              return !val;
            return FAIL;
          } else if (node.type === "ArrayExpression") {
            var xs = [];
            for (var i = 0, l = node.elements.length; i < l; i++) {
              var x = walk(node.elements[i]);
              if (x === FAIL)
                return FAIL;
              xs.push(x);
            }
            return xs;
          } else if (node.type === "ObjectExpression") {
            var obj = {};
            for (var i = 0; i < node.properties.length; i++) {
              var prop = node.properties[i];
              var value = prop.value === null ? prop.value : walk(prop.value);
              if (value === FAIL)
                return FAIL;
              obj[prop.key.value || prop.key.name] = value;
            }
            return obj;
          } else if (node.type === "BinaryExpression" || node.type === "LogicalExpression") {
            var l = walk(node.left);
            if (l === FAIL)
              return FAIL;
            var r = walk(node.right);
            if (r === FAIL)
              return FAIL;
            var op = node.operator;
            if (op === "==")
              return l == r;
            if (op === "===")
              return l === r;
            if (op === "!=")
              return l != r;
            if (op === "!==")
              return l !== r;
            if (op === "+")
              return l + r;
            if (op === "-")
              return l - r;
            if (op === "*")
              return l * r;
            if (op === "/")
              return l / r;
            if (op === "%")
              return l % r;
            if (op === "<")
              return l < r;
            if (op === "<=")
              return l <= r;
            if (op === ">")
              return l > r;
            if (op === ">=")
              return l >= r;
            if (op === "|")
              return l | r;
            if (op === "&")
              return l & r;
            if (op === "^")
              return l ^ r;
            if (op === "&&")
              return l && r;
            if (op === "||")
              return l || r;
            return FAIL;
          } else if (node.type === "Identifier") {
            if ({}.hasOwnProperty.call(vars, node.name)) {
              return vars[node.name];
            } else
              return FAIL;
          } else if (node.type === "ThisExpression") {
            if ({}.hasOwnProperty.call(vars, "this")) {
              return vars["this"];
            } else
              return FAIL;
          } else if (node.type === "CallExpression") {
            var callee = walk(node.callee);
            if (callee === FAIL)
              return FAIL;
            if (typeof callee !== "function")
              return FAIL;
            var ctx = node.callee.object ? walk(node.callee.object) : FAIL;
            if (ctx === FAIL)
              ctx = null;
            var args = [];
            for (var i = 0, l = node.arguments.length; i < l; i++) {
              var x = walk(node.arguments[i]);
              if (x === FAIL)
                return FAIL;
              args.push(x);
            }
            return callee.apply(ctx, args);
          } else if (node.type === "MemberExpression") {
            var obj = walk(node.object);
            if (obj === FAIL || typeof obj == "function") {
              return FAIL;
            }
            if (node.property.type === "Identifier") {
              return obj[node.property.name];
            }
            var prop = walk(node.property);
            if (prop === FAIL)
              return FAIL;
            return obj[prop];
          } else if (node.type === "ConditionalExpression") {
            var val = walk(node.test);
            if (val === FAIL)
              return FAIL;
            return val ? walk(node.consequent) : walk(node.alternate);
          } else if (node.type === "ExpressionStatement") {
            var val = walk(node.expression);
            if (val === FAIL)
              return FAIL;
            return val;
          } else if (node.type === "ReturnStatement") {
            return walk(node.argument);
          } else if (node.type === "FunctionExpression") {
            var bodies = node.body.body;
            var oldVars = {};
            Object.keys(vars).forEach(function(element) {
              oldVars[element] = vars[element];
            });
            for (var i = 0; i < node.params.length; i++) {
              var key = node.params[i];
              if (key.type == "Identifier") {
                vars[key.name] = null;
              } else
                return FAIL;
            }
            for (var i in bodies) {
              if (walk(bodies[i]) === FAIL) {
                return FAIL;
              }
            }
            vars = oldVars;
            var keys = Object.keys(vars);
            var vals = keys.map(function(key2) {
              return vars[key2];
            });
            return Function(keys.join(", "), "return " + unparse(node)).apply(null, vals);
          } else if (node.type === "TemplateLiteral") {
            var str2 = "";
            for (var i = 0; i < node.expressions.length; i++) {
              str2 += walk(node.quasis[i]);
              str2 += walk(node.expressions[i]);
            }
            str2 += walk(node.quasis[i]);
            return str2;
          } else if (node.type === "TaggedTemplateExpression") {
            var tag = walk(node.tag);
            var quasi = node.quasi;
            var strings = quasi.quasis.map(walk);
            var values = quasi.expressions.map(walk);
            return tag.apply(null, [strings].concat(values));
          } else if (node.type === "TemplateElement") {
            return node.value.cooked;
          } else
            return FAIL;
        }(ast);
        return result === FAIL ? void 0 : result;
      };
    }, {escodegen: 12}], jsonpath: [function(require2, module4, exports3) {
      module4.exports = require2("./lib/index");
    }, {"./lib/index": 5}]}, {}, ["jsonpath"])("jsonpath");
  });
});

// node_modules/ms/index.js
var require_ms = __commonJS((exports, module2) => {
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  module2.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
  };
  function parse(str2) {
    str2 = String(str2);
    if (str2.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str2);
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return Math.round(ms / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + "s";
    }
    return ms + "ms";
  }
  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return plural(ms, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, "second");
    }
    return ms + " ms";
  }
  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
  }
});

// node_modules/debug/src/common.js
var require_common2 = __commonJS((exports, module2) => {
  function setup(env2) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = require_ms();
    createDebug.destroy = destroy;
    Object.keys(env2).forEach((key) => {
      createDebug[key] = env2[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      function debug19(...args) {
        if (!debug19.enabled) {
          return;
        }
        const self2 = debug19;
        const curr = Number(new Date());
        const ms = curr - (prevTime || curr);
        self2.diff = ms;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self2, args);
        const logFn = self2.log || createDebug.log;
        logFn.apply(self2, args);
      }
      debug19.namespace = namespace;
      debug19.useColors = createDebug.useColors();
      debug19.color = createDebug.selectColor(namespace);
      debug19.extend = extend;
      debug19.destroy = createDebug.destroy;
      Object.defineProperty(debug19, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug19);
      }
      return debug19;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.names = [];
      createDebug.skips = [];
      let i;
      const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      const len = split.length;
      for (i = 0; i < len; i++) {
        if (!split[i]) {
          continue;
        }
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          createDebug.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      const namespaces = [
        ...createDebug.names.map(toNamespace),
        ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      if (name[name.length - 1] === "*") {
        return true;
      }
      let i;
      let len;
      for (i = 0, len = createDebug.skips.length; i < len; i++) {
        if (createDebug.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = createDebug.names.length; i < len; i++) {
        if (createDebug.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function toNamespace(regexp) {
      return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  module2.exports = setup;
});

// node_modules/debug/src/browser.js
var require_browser2 = __commonJS((exports, module2) => {
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = localstorage();
  exports.destroy = (() => {
    let warned = false;
    return () => {
      if (!warned) {
        warned = true;
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
    };
  })();
  exports.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
  ];
  function useColors() {
    if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
      return true;
    }
    if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    }
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  function formatArgs(args) {
    args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
    if (!this.useColors) {
      return;
    }
    const c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match) => {
      if (match === "%%") {
        return;
      }
      index++;
      if (match === "%c") {
        lastC = index;
      }
    });
    args.splice(lastC, 0, c);
  }
  exports.log = console.debug || console.log || (() => {
  });
  function save(namespaces) {
    try {
      if (namespaces) {
        exports.storage.setItem("debug", namespaces);
      } else {
        exports.storage.removeItem("debug");
      }
    } catch (error) {
    }
  }
  function load() {
    let r;
    try {
      r = exports.storage.getItem("debug");
    } catch (error) {
    }
    if (!r && typeof process !== "undefined" && "env" in process) {
      r = process.env.DEBUG;
    }
    return r;
  }
  function localstorage() {
    try {
      return localStorage;
    } catch (error) {
    }
  }
  module2.exports = require_common2()(exports);
  const {formatters} = module2.exports;
  formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (error) {
      return "[UnexpectedJSONParseError]: " + error.message;
    }
  };
});

// node_modules/debug/src/node.js
var require_node = __commonJS((exports, module2) => {
  const tty = require("tty");
  const util = require("util");
  exports.init = init;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.destroy = util.deprecate(() => {
  }, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  exports.colors = [6, 2, 3, 4, 5, 1];
  try {
    const supportsColor = require_browser();
    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
      exports.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ];
    }
  } catch (error) {
  }
  exports.inspectOpts = Object.keys(process.env).filter((key) => {
    return /^debug_/i.test(key);
  }).reduce((obj, key) => {
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
      return k.toUpperCase();
    });
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
      val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
      val = false;
    } else if (val === "null") {
      val = null;
    } else {
      val = Number(val);
    }
    obj[prop] = val;
    return obj;
  }, {});
  function useColors() {
    return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
  }
  function formatArgs(args) {
    const {namespace: name, useColors: useColors2} = this;
    if (useColors2) {
      const c = this.color;
      const colorCode = "[3" + (c < 8 ? c : "8;5;" + c);
      const prefix = `  ${colorCode};1m${name} [0m`;
      args[0] = prefix + args[0].split("\n").join("\n" + prefix);
      args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "[0m");
    } else {
      args[0] = getDate() + name + " " + args[0];
    }
  }
  function getDate() {
    if (exports.inspectOpts.hideDate) {
      return "";
    }
    return new Date().toISOString() + " ";
  }
  function log(...args) {
    return process.stderr.write(util.format(...args) + "\n");
  }
  function save(namespaces) {
    if (namespaces) {
      process.env.DEBUG = namespaces;
    } else {
      delete process.env.DEBUG;
    }
  }
  function load() {
    return process.env.DEBUG;
  }
  function init(debug19) {
    debug19.inspectOpts = {};
    const keys = Object.keys(exports.inspectOpts);
    for (let i = 0; i < keys.length; i++) {
      debug19.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
  }
  module2.exports = require_common2()(exports);
  const {formatters} = module2.exports;
  formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).replace(/\s*\n\s*/g, " ");
  };
  formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
  };
});

// node_modules/debug/src/index.js
var require_src = __commonJS((exports, module2) => {
  if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
    module2.exports = require_browser2();
  } else {
    module2.exports = require_node();
  }
});

// node_modules/universal-user-agent/dist-node/index.js
var require_dist_node = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function getUserAgent() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
      return navigator.userAgent;
    }
    if (typeof process === "object" && "version" in process) {
      return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
  }
  exports.getUserAgent = getUserAgent;
});

// node_modules/before-after-hook/lib/register.js
var require_register = __commonJS((exports, module2) => {
  module2.exports = register;
  function register(state, name, method, options) {
    if (typeof method !== "function") {
      throw new Error("method for before hook must be a function");
    }
    if (!options) {
      options = {};
    }
    if (Array.isArray(name)) {
      return name.reverse().reduce(function(callback, name2) {
        return register.bind(null, state, name2, callback, options);
      }, method)();
    }
    return Promise.resolve().then(function() {
      if (!state.registry[name]) {
        return method(options);
      }
      return state.registry[name].reduce(function(method2, registered) {
        return registered.hook.bind(null, method2, options);
      }, method)();
    });
  }
});

// node_modules/before-after-hook/lib/add.js
var require_add = __commonJS((exports, module2) => {
  module2.exports = addHook;
  function addHook(state, kind, name, hook) {
    var orig = hook;
    if (!state.registry[name]) {
      state.registry[name] = [];
    }
    if (kind === "before") {
      hook = function(method, options) {
        return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
      };
    }
    if (kind === "after") {
      hook = function(method, options) {
        var result;
        return Promise.resolve().then(method.bind(null, options)).then(function(result_) {
          result = result_;
          return orig(result, options);
        }).then(function() {
          return result;
        });
      };
    }
    if (kind === "error") {
      hook = function(method, options) {
        return Promise.resolve().then(method.bind(null, options)).catch(function(error) {
          return orig(error, options);
        });
      };
    }
    state.registry[name].push({
      hook,
      orig
    });
  }
});

// node_modules/before-after-hook/lib/remove.js
var require_remove = __commonJS((exports, module2) => {
  module2.exports = removeHook;
  function removeHook(state, name, method) {
    if (!state.registry[name]) {
      return;
    }
    var index = state.registry[name].map(function(registered) {
      return registered.orig;
    }).indexOf(method);
    if (index === -1) {
      return;
    }
    state.registry[name].splice(index, 1);
  }
});

// node_modules/before-after-hook/index.js
var require_before_after_hook = __commonJS((exports, module2) => {
  var register = require_register();
  var addHook = require_add();
  var removeHook = require_remove();
  var bind = Function.bind;
  var bindable = bind.bind(bind);
  function bindApi(hook, state, name) {
    var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state]);
    hook.api = {remove: removeHookRef};
    hook.remove = removeHookRef;
    ["before", "error", "after", "wrap"].forEach(function(kind) {
      var args = name ? [state, kind, name] : [state, kind];
      hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
    });
  }
  function HookSingular() {
    var singularHookName = "h";
    var singularHookState = {
      registry: {}
    };
    var singularHook = register.bind(null, singularHookState, singularHookName);
    bindApi(singularHook, singularHookState, singularHookName);
    return singularHook;
  }
  function HookCollection() {
    var state = {
      registry: {}
    };
    var hook = register.bind(null, state);
    bindApi(hook, state);
    return hook;
  }
  var collectionHookDeprecationMessageDisplayed = false;
  function Hook() {
    if (!collectionHookDeprecationMessageDisplayed) {
      console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4');
      collectionHookDeprecationMessageDisplayed = true;
    }
    return HookCollection();
  }
  Hook.Singular = HookSingular.bind();
  Hook.Collection = HookCollection.bind();
  module2.exports = Hook;
  module2.exports.Hook = Hook;
  module2.exports.Singular = Hook.Singular;
  module2.exports.Collection = Hook.Collection;
});

// node_modules/@octokit/endpoint/node_modules/is-plain-object/dist/is-plain-object.js
var require_is_plain_object = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  /*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  function isObject(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }
  function isPlainObject(o) {
    var ctor, prot;
    if (isObject(o) === false)
      return false;
    ctor = o.constructor;
    if (ctor === void 0)
      return true;
    prot = ctor.prototype;
    if (isObject(prot) === false)
      return false;
    if (prot.hasOwnProperty("isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  exports.isPlainObject = isPlainObject;
});

// node_modules/@octokit/endpoint/dist-node/index.js
var require_dist_node2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var isPlainObject = require_is_plain_object();
  var universalUserAgent = require_dist_node();
  function lowercaseKeys(object) {
    if (!object) {
      return {};
    }
    return Object.keys(object).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = object[key];
      return newObj;
    }, {});
  }
  function mergeDeep(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach((key) => {
      if (isPlainObject.isPlainObject(options[key])) {
        if (!(key in defaults))
          Object.assign(result, {
            [key]: options[key]
          });
        else
          result[key] = mergeDeep(defaults[key], options[key]);
      } else {
        Object.assign(result, {
          [key]: options[key]
        });
      }
    });
    return result;
  }
  function removeUndefinedProperties(obj) {
    for (const key in obj) {
      if (obj[key] === void 0) {
        delete obj[key];
      }
    }
    return obj;
  }
  function merge(defaults, route, options) {
    if (typeof route === "string") {
      let [method, url] = route.split(" ");
      options = Object.assign(url ? {
        method,
        url
      } : {
        url: method
      }, options);
    } else {
      options = Object.assign({}, route);
    }
    options.headers = lowercaseKeys(options.headers);
    removeUndefinedProperties(options);
    removeUndefinedProperties(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    if (defaults && defaults.mediaType.previews.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews.filter((preview) => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
    return mergedOptions;
  }
  function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
      return url;
    }
    return url + separator + names.map((name) => {
      if (name === "q") {
        return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
      }
      return `${name}=${encodeURIComponent(parameters[name])}`;
    }).join("&");
  }
  const urlVariableRegex = /\{[^}]+\}/g;
  function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
  }
  function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
      return [];
    }
    return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
  }
  function omit(object, keysToOmit) {
    return Object.keys(object).filter((option) => !keysToOmit.includes(option)).reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  }
  function encodeReserved(str2) {
    return str2.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
      }
      return part;
    }).join("");
  }
  function encodeUnreserved(str2) {
    return encodeURIComponent(str2).replace(/[!'()*]/g, function(c) {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  function encodeValue(operator, value, key) {
    value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
    if (key) {
      return encodeUnreserved(key) + "=" + value;
    } else {
      return value;
    }
  }
  function isDefined(value) {
    return value !== void 0 && value !== null;
  }
  function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
  }
  function getValues(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        value = value.toString();
        if (modifier && modifier !== "*") {
          value = value.substring(0, parseInt(modifier, 10));
        }
        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
      } else {
        if (modifier === "*") {
          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function(value2) {
              result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ""));
            });
          } else {
            Object.keys(value).forEach(function(k) {
              if (isDefined(value[k])) {
                result.push(encodeValue(operator, value[k], k));
              }
            });
          }
        } else {
          const tmp = [];
          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function(value2) {
              tmp.push(encodeValue(operator, value2));
            });
          } else {
            Object.keys(value).forEach(function(k) {
              if (isDefined(value[k])) {
                tmp.push(encodeUnreserved(k));
                tmp.push(encodeValue(operator, value[k].toString()));
              }
            });
          }
          if (isKeyOperator(operator)) {
            result.push(encodeUnreserved(key) + "=" + tmp.join(","));
          } else if (tmp.length !== 0) {
            result.push(tmp.join(","));
          }
        }
      }
    } else {
      if (operator === ";") {
        if (isDefined(value)) {
          result.push(encodeUnreserved(key));
        }
      } else if (value === "" && (operator === "&" || operator === "?")) {
        result.push(encodeUnreserved(key) + "=");
      } else if (value === "") {
        result.push("");
      }
    }
    return result;
  }
  function parseUrl(template) {
    return {
      expand: expand.bind(null, template)
    };
  }
  function expand(template, context) {
    var operators = ["+", "#", ".", "/", ";", "?", "&"];
    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }
        expression.split(/,/g).forEach(function(variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
        });
        if (operator && operator !== "+") {
          var separator = ",";
          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    });
  }
  function parse(options) {
    let method = options.method.toUpperCase();
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]);
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
      url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequest) {
      if (options.mediaType.format) {
        headers.accept = headers.accept.split(/,/).map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
      }
      if (options.mediaType.previews.length) {
        const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
          const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        }).join(",");
      }
    }
    if (["GET", "HEAD"].includes(method)) {
      url = addQueryParameters(url, remainingParameters);
    } else {
      if ("data" in remainingParameters) {
        body = remainingParameters.data;
      } else {
        if (Object.keys(remainingParameters).length) {
          body = remainingParameters;
        } else {
          headers["content-length"] = 0;
        }
      }
    }
    if (!headers["content-type"] && typeof body !== "undefined") {
      headers["content-type"] = "application/json; charset=utf-8";
    }
    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
      body = "";
    }
    return Object.assign({
      method,
      url,
      headers
    }, typeof body !== "undefined" ? {
      body
    } : null, options.request ? {
      request: options.request
    } : null);
  }
  function endpointWithDefaults(defaults, route, options) {
    return parse(merge(defaults, route, options));
  }
  function withDefaults(oldDefaults, newDefaults) {
    const DEFAULTS2 = merge(oldDefaults, newDefaults);
    const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
    return Object.assign(endpoint2, {
      DEFAULTS: DEFAULTS2,
      defaults: withDefaults.bind(null, DEFAULTS2),
      merge: merge.bind(null, DEFAULTS2),
      parse
    });
  }
  const VERSION = "6.0.9";
  const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`;
  const DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent
    },
    mediaType: {
      format: "",
      previews: []
    }
  };
  const endpoint = withDefaults(null, DEFAULTS);
  exports.endpoint = endpoint;
});

// node_modules/@octokit/request/node_modules/is-plain-object/dist/is-plain-object.js
var require_is_plain_object2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  /*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  function isObject(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }
  function isPlainObject(o) {
    var ctor, prot;
    if (isObject(o) === false)
      return false;
    ctor = o.constructor;
    if (ctor === void 0)
      return true;
    prot = ctor.prototype;
    if (isObject(prot) === false)
      return false;
    if (prot.hasOwnProperty("isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  exports.isPlainObject = isPlainObject;
});

// node_modules/node-fetch/lib/index.mjs
var require_lib = __commonJS((exports) => {
  __export(exports, {
    FetchError: () => FetchError,
    Headers: () => Headers,
    Request: () => Request,
    Response: () => Response,
    default: () => lib_default
  });
  const stream = __toModule(require("stream"));
  const http2 = __toModule(require("http"));
  const url = __toModule(require("url"));
  const https2 = __toModule(require("https"));
  const zlib2 = __toModule(require("zlib"));
  const Readable = stream.default.Readable;
  const BUFFER = Symbol("buffer");
  const TYPE = Symbol("type");
  class Blob {
    constructor() {
      this[TYPE] = "";
      const blobParts = arguments[0];
      const options = arguments[1];
      const buffers = [];
      let size = 0;
      if (blobParts) {
        const a = blobParts;
        const length = Number(a.length);
        for (let i = 0; i < length; i++) {
          const element = a[i];
          let buffer;
          if (element instanceof Buffer) {
            buffer = element;
          } else if (ArrayBuffer.isView(element)) {
            buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
          } else if (element instanceof ArrayBuffer) {
            buffer = Buffer.from(element);
          } else if (element instanceof Blob) {
            buffer = element[BUFFER];
          } else {
            buffer = Buffer.from(typeof element === "string" ? element : String(element));
          }
          size += buffer.length;
          buffers.push(buffer);
        }
      }
      this[BUFFER] = Buffer.concat(buffers);
      let type = options && options.type !== void 0 && String(options.type).toLowerCase();
      if (type && !/[^\u0020-\u007E]/.test(type)) {
        this[TYPE] = type;
      }
    }
    get size() {
      return this[BUFFER].length;
    }
    get type() {
      return this[TYPE];
    }
    text() {
      return Promise.resolve(this[BUFFER].toString());
    }
    arrayBuffer() {
      const buf = this[BUFFER];
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      return Promise.resolve(ab);
    }
    stream() {
      const readable = new Readable();
      readable._read = function() {
      };
      readable.push(this[BUFFER]);
      readable.push(null);
      return readable;
    }
    toString() {
      return "[object Blob]";
    }
    slice() {
      const size = this.size;
      const start = arguments[0];
      const end = arguments[1];
      let relativeStart, relativeEnd;
      if (start === void 0) {
        relativeStart = 0;
      } else if (start < 0) {
        relativeStart = Math.max(size + start, 0);
      } else {
        relativeStart = Math.min(start, size);
      }
      if (end === void 0) {
        relativeEnd = size;
      } else if (end < 0) {
        relativeEnd = Math.max(size + end, 0);
      } else {
        relativeEnd = Math.min(end, size);
      }
      const span = Math.max(relativeEnd - relativeStart, 0);
      const buffer = this[BUFFER];
      const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
      const blob = new Blob([], {type: arguments[2]});
      blob[BUFFER] = slicedBuffer;
      return blob;
    }
  }
  Object.defineProperties(Blob.prototype, {
    size: {enumerable: true},
    type: {enumerable: true},
    slice: {enumerable: true}
  });
  Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
    value: "Blob",
    writable: false,
    enumerable: false,
    configurable: true
  });
  function FetchError(message, type, systemError) {
    Error.call(this, message);
    this.message = message;
    this.type = type;
    if (systemError) {
      this.code = this.errno = systemError.code;
    }
    Error.captureStackTrace(this, this.constructor);
  }
  FetchError.prototype = Object.create(Error.prototype);
  FetchError.prototype.constructor = FetchError;
  FetchError.prototype.name = "FetchError";
  let convert;
  try {
    convert = require("encoding").convert;
  } catch (e) {
  }
  const INTERNALS = Symbol("Body internals");
  const PassThrough = stream.default.PassThrough;
  function Body(body) {
    var _this = this;
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
    let size = _ref$size === void 0 ? 0 : _ref$size;
    var _ref$timeout = _ref.timeout;
    let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
    if (body == null) {
      body = null;
    } else if (isURLSearchParams(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof stream.default)
      ;
    else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS] = {
      body,
      disturbed: false,
      error: null
    };
    this.size = size;
    this.timeout = timeout;
    if (body instanceof stream.default) {
      body.on("error", function(err) {
        const error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
        _this[INTERNALS].error = error;
      });
    }
  }
  Body.prototype = {
    get body() {
      return this[INTERNALS].body;
    },
    get bodyUsed() {
      return this[INTERNALS].disturbed;
    },
    arrayBuffer() {
      return consumeBody.call(this).then(function(buf) {
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      });
    },
    blob() {
      let ct = this.headers && this.headers.get("content-type") || "";
      return consumeBody.call(this).then(function(buf) {
        return Object.assign(new Blob([], {
          type: ct.toLowerCase()
        }), {
          [BUFFER]: buf
        });
      });
    },
    json() {
      var _this2 = this;
      return consumeBody.call(this).then(function(buffer) {
        try {
          return JSON.parse(buffer.toString());
        } catch (err) {
          return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
        }
      });
    },
    text() {
      return consumeBody.call(this).then(function(buffer) {
        return buffer.toString();
      });
    },
    buffer() {
      return consumeBody.call(this);
    },
    textConverted() {
      var _this3 = this;
      return consumeBody.call(this).then(function(buffer) {
        return convertBody(buffer, _this3.headers);
      });
    }
  };
  Object.defineProperties(Body.prototype, {
    body: {enumerable: true},
    bodyUsed: {enumerable: true},
    arrayBuffer: {enumerable: true},
    blob: {enumerable: true},
    json: {enumerable: true},
    text: {enumerable: true}
  });
  Body.mixIn = function(proto) {
    for (const name of Object.getOwnPropertyNames(Body.prototype)) {
      if (!(name in proto)) {
        const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
        Object.defineProperty(proto, name, desc);
      }
    }
  };
  function consumeBody() {
    var _this4 = this;
    if (this[INTERNALS].disturbed) {
      return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
    }
    this[INTERNALS].disturbed = true;
    if (this[INTERNALS].error) {
      return Body.Promise.reject(this[INTERNALS].error);
    }
    let body = this.body;
    if (body === null) {
      return Body.Promise.resolve(Buffer.alloc(0));
    }
    if (isBlob(body)) {
      body = body.stream();
    }
    if (Buffer.isBuffer(body)) {
      return Body.Promise.resolve(body);
    }
    if (!(body instanceof stream.default)) {
      return Body.Promise.resolve(Buffer.alloc(0));
    }
    let accum = [];
    let accumBytes = 0;
    let abort = false;
    return new Body.Promise(function(resolve, reject) {
      let resTimeout;
      if (_this4.timeout) {
        resTimeout = setTimeout(function() {
          abort = true;
          reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
        }, _this4.timeout);
      }
      body.on("error", function(err) {
        if (err.name === "AbortError") {
          abort = true;
          reject(err);
        } else {
          reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
        }
      });
      body.on("data", function(chunk) {
        if (abort || chunk === null) {
          return;
        }
        if (_this4.size && accumBytes + chunk.length > _this4.size) {
          abort = true;
          reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
          return;
        }
        accumBytes += chunk.length;
        accum.push(chunk);
      });
      body.on("end", function() {
        if (abort) {
          return;
        }
        clearTimeout(resTimeout);
        try {
          resolve(Buffer.concat(accum, accumBytes));
        } catch (err) {
          reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
        }
      });
    });
  }
  function convertBody(buffer, headers) {
    if (typeof convert !== "function") {
      throw new Error("The package `encoding` must be installed to use the textConverted() function");
    }
    const ct = headers.get("content-type");
    let charset = "utf-8";
    let res, str2;
    if (ct) {
      res = /charset=([^;]*)/i.exec(ct);
    }
    str2 = buffer.slice(0, 1024).toString();
    if (!res && str2) {
      res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str2);
    }
    if (!res && str2) {
      res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str2);
      if (!res) {
        res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str2);
        if (res) {
          res.pop();
        }
      }
      if (res) {
        res = /charset=(.*)/i.exec(res.pop());
      }
    }
    if (!res && str2) {
      res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str2);
    }
    if (res) {
      charset = res.pop();
      if (charset === "gb2312" || charset === "gbk") {
        charset = "gb18030";
      }
    }
    return convert(buffer, "UTF-8", charset).toString();
  }
  function isURLSearchParams(obj) {
    if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
      return false;
    }
    return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
  }
  function isBlob(obj) {
    return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
  }
  function clone(instance) {
    let p1, p2;
    let body = instance.body;
    if (instance.bodyUsed) {
      throw new Error("cannot clone body after it is used");
    }
    if (body instanceof stream.default && typeof body.getBoundary !== "function") {
      p1 = new PassThrough();
      p2 = new PassThrough();
      body.pipe(p1);
      body.pipe(p2);
      instance[INTERNALS].body = p1;
      body = p2;
    }
    return body;
  }
  function extractContentType(body) {
    if (body === null) {
      return null;
    } else if (typeof body === "string") {
      return "text/plain;charset=UTF-8";
    } else if (isURLSearchParams(body)) {
      return "application/x-www-form-urlencoded;charset=UTF-8";
    } else if (isBlob(body)) {
      return body.type || null;
    } else if (Buffer.isBuffer(body)) {
      return null;
    } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
      return null;
    } else if (ArrayBuffer.isView(body)) {
      return null;
    } else if (typeof body.getBoundary === "function") {
      return `multipart/form-data;boundary=${body.getBoundary()}`;
    } else if (body instanceof stream.default) {
      return null;
    } else {
      return "text/plain;charset=UTF-8";
    }
  }
  function getTotalBytes(instance) {
    const body = instance.body;
    if (body === null) {
      return 0;
    } else if (isBlob(body)) {
      return body.size;
    } else if (Buffer.isBuffer(body)) {
      return body.length;
    } else if (body && typeof body.getLengthSync === "function") {
      if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
        return body.getLengthSync();
      }
      return null;
    } else {
      return null;
    }
  }
  function writeToStream(dest, instance) {
    const body = instance.body;
    if (body === null) {
      dest.end();
    } else if (isBlob(body)) {
      body.stream().pipe(dest);
    } else if (Buffer.isBuffer(body)) {
      dest.write(body);
      dest.end();
    } else {
      body.pipe(dest);
    }
  }
  Body.Promise = global.Promise;
  const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
  const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
  function validateName(name) {
    name = `${name}`;
    if (invalidTokenRegex.test(name) || name === "") {
      throw new TypeError(`${name} is not a legal HTTP header name`);
    }
  }
  function validateValue(value) {
    value = `${value}`;
    if (invalidHeaderCharRegex.test(value)) {
      throw new TypeError(`${value} is not a legal HTTP header value`);
    }
  }
  function find(map, name) {
    name = name.toLowerCase();
    for (const key in map) {
      if (key.toLowerCase() === name) {
        return key;
      }
    }
    return void 0;
  }
  const MAP = Symbol("map");
  class Headers {
    constructor() {
      let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
      this[MAP] = Object.create(null);
      if (init instanceof Headers) {
        const rawHeaders = init.raw();
        const headerNames = Object.keys(rawHeaders);
        for (const headerName of headerNames) {
          for (const value of rawHeaders[headerName]) {
            this.append(headerName, value);
          }
        }
        return;
      }
      if (init == null)
        ;
      else if (typeof init === "object") {
        const method = init[Symbol.iterator];
        if (method != null) {
          if (typeof method !== "function") {
            throw new TypeError("Header pairs must be iterable");
          }
          const pairs = [];
          for (const pair of init) {
            if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
              throw new TypeError("Each header pair must be iterable");
            }
            pairs.push(Array.from(pair));
          }
          for (const pair of pairs) {
            if (pair.length !== 2) {
              throw new TypeError("Each header pair must be a name/value tuple");
            }
            this.append(pair[0], pair[1]);
          }
        } else {
          for (const key of Object.keys(init)) {
            const value = init[key];
            this.append(key, value);
          }
        }
      } else {
        throw new TypeError("Provided initializer must be an object");
      }
    }
    get(name) {
      name = `${name}`;
      validateName(name);
      const key = find(this[MAP], name);
      if (key === void 0) {
        return null;
      }
      return this[MAP][key].join(", ");
    }
    forEach(callback) {
      let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
      let pairs = getHeaders(this);
      let i = 0;
      while (i < pairs.length) {
        var _pairs$i = pairs[i];
        const name = _pairs$i[0], value = _pairs$i[1];
        callback.call(thisArg, value, name, this);
        pairs = getHeaders(this);
        i++;
      }
    }
    set(name, value) {
      name = `${name}`;
      value = `${value}`;
      validateName(name);
      validateValue(value);
      const key = find(this[MAP], name);
      this[MAP][key !== void 0 ? key : name] = [value];
    }
    append(name, value) {
      name = `${name}`;
      value = `${value}`;
      validateName(name);
      validateValue(value);
      const key = find(this[MAP], name);
      if (key !== void 0) {
        this[MAP][key].push(value);
      } else {
        this[MAP][name] = [value];
      }
    }
    has(name) {
      name = `${name}`;
      validateName(name);
      return find(this[MAP], name) !== void 0;
    }
    delete(name) {
      name = `${name}`;
      validateName(name);
      const key = find(this[MAP], name);
      if (key !== void 0) {
        delete this[MAP][key];
      }
    }
    raw() {
      return this[MAP];
    }
    keys() {
      return createHeadersIterator(this, "key");
    }
    values() {
      return createHeadersIterator(this, "value");
    }
    [Symbol.iterator]() {
      return createHeadersIterator(this, "key+value");
    }
  }
  Headers.prototype.entries = Headers.prototype[Symbol.iterator];
  Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
    value: "Headers",
    writable: false,
    enumerable: false,
    configurable: true
  });
  Object.defineProperties(Headers.prototype, {
    get: {enumerable: true},
    forEach: {enumerable: true},
    set: {enumerable: true},
    append: {enumerable: true},
    has: {enumerable: true},
    delete: {enumerable: true},
    keys: {enumerable: true},
    values: {enumerable: true},
    entries: {enumerable: true}
  });
  function getHeaders(headers) {
    let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
    const keys = Object.keys(headers[MAP]).sort();
    return keys.map(kind === "key" ? function(k) {
      return k.toLowerCase();
    } : kind === "value" ? function(k) {
      return headers[MAP][k].join(", ");
    } : function(k) {
      return [k.toLowerCase(), headers[MAP][k].join(", ")];
    });
  }
  const INTERNAL = Symbol("internal");
  function createHeadersIterator(target, kind) {
    const iterator = Object.create(HeadersIteratorPrototype);
    iterator[INTERNAL] = {
      target,
      kind,
      index: 0
    };
    return iterator;
  }
  const HeadersIteratorPrototype = Object.setPrototypeOf({
    next() {
      if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
        throw new TypeError("Value of `this` is not a HeadersIterator");
      }
      var _INTERNAL = this[INTERNAL];
      const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
      const values = getHeaders(target, kind);
      const len = values.length;
      if (index >= len) {
        return {
          value: void 0,
          done: true
        };
      }
      this[INTERNAL].index = index + 1;
      return {
        value: values[index],
        done: false
      };
    }
  }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
  Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
    value: "HeadersIterator",
    writable: false,
    enumerable: false,
    configurable: true
  });
  function exportNodeCompatibleHeaders(headers) {
    const obj = Object.assign({__proto__: null}, headers[MAP]);
    const hostHeaderKey = find(headers[MAP], "Host");
    if (hostHeaderKey !== void 0) {
      obj[hostHeaderKey] = obj[hostHeaderKey][0];
    }
    return obj;
  }
  function createHeadersLenient(obj) {
    const headers = new Headers();
    for (const name of Object.keys(obj)) {
      if (invalidTokenRegex.test(name)) {
        continue;
      }
      if (Array.isArray(obj[name])) {
        for (const val of obj[name]) {
          if (invalidHeaderCharRegex.test(val)) {
            continue;
          }
          if (headers[MAP][name] === void 0) {
            headers[MAP][name] = [val];
          } else {
            headers[MAP][name].push(val);
          }
        }
      } else if (!invalidHeaderCharRegex.test(obj[name])) {
        headers[MAP][name] = [obj[name]];
      }
    }
    return headers;
  }
  const INTERNALS$1 = Symbol("Response internals");
  const STATUS_CODES = http2.default.STATUS_CODES;
  class Response {
    constructor() {
      let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      Body.call(this, body, opts);
      const status = opts.status || 200;
      const headers = new Headers(opts.headers);
      if (body != null && !headers.has("Content-Type")) {
        const contentType = extractContentType(body);
        if (contentType) {
          headers.append("Content-Type", contentType);
        }
      }
      this[INTERNALS$1] = {
        url: opts.url,
        status,
        statusText: opts.statusText || STATUS_CODES[status],
        headers,
        counter: opts.counter
      };
    }
    get url() {
      return this[INTERNALS$1].url || "";
    }
    get status() {
      return this[INTERNALS$1].status;
    }
    get ok() {
      return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
    }
    get redirected() {
      return this[INTERNALS$1].counter > 0;
    }
    get statusText() {
      return this[INTERNALS$1].statusText;
    }
    get headers() {
      return this[INTERNALS$1].headers;
    }
    clone() {
      return new Response(clone(this), {
        url: this.url,
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        ok: this.ok,
        redirected: this.redirected
      });
    }
  }
  Body.mixIn(Response.prototype);
  Object.defineProperties(Response.prototype, {
    url: {enumerable: true},
    status: {enumerable: true},
    ok: {enumerable: true},
    redirected: {enumerable: true},
    statusText: {enumerable: true},
    headers: {enumerable: true},
    clone: {enumerable: true}
  });
  Object.defineProperty(Response.prototype, Symbol.toStringTag, {
    value: "Response",
    writable: false,
    enumerable: false,
    configurable: true
  });
  const INTERNALS$2 = Symbol("Request internals");
  const parse_url = url.default.parse;
  const format_url = url.default.format;
  const streamDestructionSupported = "destroy" in stream.default.Readable.prototype;
  function isRequest(input) {
    return typeof input === "object" && typeof input[INTERNALS$2] === "object";
  }
  function isAbortSignal(signal) {
    const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
    return !!(proto && proto.constructor.name === "AbortSignal");
  }
  class Request {
    constructor(input) {
      let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let parsedURL;
      if (!isRequest(input)) {
        if (input && input.href) {
          parsedURL = parse_url(input.href);
        } else {
          parsedURL = parse_url(`${input}`);
        }
        input = {};
      } else {
        parsedURL = parse_url(input.url);
      }
      let method = init.method || input.method || "GET";
      method = method.toUpperCase();
      if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
        throw new TypeError("Request with GET/HEAD method cannot have body");
      }
      let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
      Body.call(this, inputBody, {
        timeout: init.timeout || input.timeout || 0,
        size: init.size || input.size || 0
      });
      const headers = new Headers(init.headers || input.headers || {});
      if (inputBody != null && !headers.has("Content-Type")) {
        const contentType = extractContentType(inputBody);
        if (contentType) {
          headers.append("Content-Type", contentType);
        }
      }
      let signal = isRequest(input) ? input.signal : null;
      if ("signal" in init)
        signal = init.signal;
      if (signal != null && !isAbortSignal(signal)) {
        throw new TypeError("Expected signal to be an instanceof AbortSignal");
      }
      this[INTERNALS$2] = {
        method,
        redirect: init.redirect || input.redirect || "follow",
        headers,
        parsedURL,
        signal
      };
      this.follow = init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20;
      this.compress = init.compress !== void 0 ? init.compress : input.compress !== void 0 ? input.compress : true;
      this.counter = init.counter || input.counter || 0;
      this.agent = init.agent || input.agent;
    }
    get method() {
      return this[INTERNALS$2].method;
    }
    get url() {
      return format_url(this[INTERNALS$2].parsedURL);
    }
    get headers() {
      return this[INTERNALS$2].headers;
    }
    get redirect() {
      return this[INTERNALS$2].redirect;
    }
    get signal() {
      return this[INTERNALS$2].signal;
    }
    clone() {
      return new Request(this);
    }
  }
  Body.mixIn(Request.prototype);
  Object.defineProperty(Request.prototype, Symbol.toStringTag, {
    value: "Request",
    writable: false,
    enumerable: false,
    configurable: true
  });
  Object.defineProperties(Request.prototype, {
    method: {enumerable: true},
    url: {enumerable: true},
    headers: {enumerable: true},
    redirect: {enumerable: true},
    clone: {enumerable: true},
    signal: {enumerable: true}
  });
  function getNodeRequestOptions(request) {
    const parsedURL = request[INTERNALS$2].parsedURL;
    const headers = new Headers(request[INTERNALS$2].headers);
    if (!headers.has("Accept")) {
      headers.set("Accept", "*/*");
    }
    if (!parsedURL.protocol || !parsedURL.hostname) {
      throw new TypeError("Only absolute URLs are supported");
    }
    if (!/^https?:$/.test(parsedURL.protocol)) {
      throw new TypeError("Only HTTP(S) protocols are supported");
    }
    if (request.signal && request.body instanceof stream.default.Readable && !streamDestructionSupported) {
      throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
    }
    let contentLengthValue = null;
    if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
      contentLengthValue = "0";
    }
    if (request.body != null) {
      const totalBytes = getTotalBytes(request);
      if (typeof totalBytes === "number") {
        contentLengthValue = String(totalBytes);
      }
    }
    if (contentLengthValue) {
      headers.set("Content-Length", contentLengthValue);
    }
    if (!headers.has("User-Agent")) {
      headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
    }
    if (request.compress && !headers.has("Accept-Encoding")) {
      headers.set("Accept-Encoding", "gzip,deflate");
    }
    let agent = request.agent;
    if (typeof agent === "function") {
      agent = agent(parsedURL);
    }
    if (!headers.has("Connection") && !agent) {
      headers.set("Connection", "close");
    }
    return Object.assign({}, parsedURL, {
      method: request.method,
      headers: exportNodeCompatibleHeaders(headers),
      agent
    });
  }
  function AbortError(message) {
    Error.call(this, message);
    this.type = "aborted";
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
  AbortError.prototype = Object.create(Error.prototype);
  AbortError.prototype.constructor = AbortError;
  AbortError.prototype.name = "AbortError";
  const PassThrough$1 = stream.default.PassThrough;
  const resolve_url = url.default.resolve;
  function fetch(url2, opts) {
    if (!fetch.Promise) {
      throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
    }
    Body.Promise = fetch.Promise;
    return new fetch.Promise(function(resolve, reject) {
      const request = new Request(url2, opts);
      const options = getNodeRequestOptions(request);
      const send = (options.protocol === "https:" ? https2.default : http2.default).request;
      const signal = request.signal;
      let response = null;
      const abort = function abort2() {
        let error = new AbortError("The user aborted a request.");
        reject(error);
        if (request.body && request.body instanceof stream.default.Readable) {
          request.body.destroy(error);
        }
        if (!response || !response.body)
          return;
        response.body.emit("error", error);
      };
      if (signal && signal.aborted) {
        abort();
        return;
      }
      const abortAndFinalize = function abortAndFinalize2() {
        abort();
        finalize();
      };
      const req = send(options);
      let reqTimeout;
      if (signal) {
        signal.addEventListener("abort", abortAndFinalize);
      }
      function finalize() {
        req.abort();
        if (signal)
          signal.removeEventListener("abort", abortAndFinalize);
        clearTimeout(reqTimeout);
      }
      if (request.timeout) {
        req.once("socket", function(socket) {
          reqTimeout = setTimeout(function() {
            reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
            finalize();
          }, request.timeout);
        });
      }
      req.on("error", function(err) {
        reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
        finalize();
      });
      req.on("response", function(res) {
        clearTimeout(reqTimeout);
        const headers = createHeadersLenient(res.headers);
        if (fetch.isRedirect(res.statusCode)) {
          const location = headers.get("Location");
          const locationURL = location === null ? null : resolve_url(request.url, location);
          switch (request.redirect) {
            case "error":
              reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
              finalize();
              return;
            case "manual":
              if (locationURL !== null) {
                try {
                  headers.set("Location", locationURL);
                } catch (err) {
                  reject(err);
                }
              }
              break;
            case "follow":
              if (locationURL === null) {
                break;
              }
              if (request.counter >= request.follow) {
                reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                finalize();
                return;
              }
              const requestOpts = {
                headers: new Headers(request.headers),
                follow: request.follow,
                counter: request.counter + 1,
                agent: request.agent,
                compress: request.compress,
                method: request.method,
                body: request.body,
                signal: request.signal,
                timeout: request.timeout,
                size: request.size
              };
              if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                finalize();
                return;
              }
              if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                requestOpts.method = "GET";
                requestOpts.body = void 0;
                requestOpts.headers.delete("content-length");
              }
              resolve(fetch(new Request(locationURL, requestOpts)));
              finalize();
              return;
          }
        }
        res.once("end", function() {
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
        });
        let body = res.pipe(new PassThrough$1());
        const response_options = {
          url: request.url,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers,
          size: request.size,
          timeout: request.timeout,
          counter: request.counter
        };
        const codings = headers.get("Content-Encoding");
        if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
          response = new Response(body, response_options);
          resolve(response);
          return;
        }
        const zlibOptions = {
          flush: zlib2.default.Z_SYNC_FLUSH,
          finishFlush: zlib2.default.Z_SYNC_FLUSH
        };
        if (codings == "gzip" || codings == "x-gzip") {
          body = body.pipe(zlib2.default.createGunzip(zlibOptions));
          response = new Response(body, response_options);
          resolve(response);
          return;
        }
        if (codings == "deflate" || codings == "x-deflate") {
          const raw = res.pipe(new PassThrough$1());
          raw.once("data", function(chunk) {
            if ((chunk[0] & 15) === 8) {
              body = body.pipe(zlib2.default.createInflate());
            } else {
              body = body.pipe(zlib2.default.createInflateRaw());
            }
            response = new Response(body, response_options);
            resolve(response);
          });
          return;
        }
        if (codings == "br" && typeof zlib2.default.createBrotliDecompress === "function") {
          body = body.pipe(zlib2.default.createBrotliDecompress());
          response = new Response(body, response_options);
          resolve(response);
          return;
        }
        response = new Response(body, response_options);
        resolve(response);
      });
      writeToStream(req, request);
    });
  }
  fetch.isRedirect = function(code) {
    return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
  };
  fetch.Promise = global.Promise;
  var lib_default = fetch;
});

// node_modules/deprecation/dist-node/index.js
var require_dist_node3 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  class Deprecation extends Error {
    constructor(message) {
      super(message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = "Deprecation";
    }
  }
  exports.Deprecation = Deprecation;
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS((exports, module2) => {
  module2.exports = wrappy;
  function wrappy(fn, cb) {
    if (fn && cb)
      return wrappy(fn)(cb);
    if (typeof fn !== "function")
      throw new TypeError("need wrapper function");
    Object.keys(fn).forEach(function(k) {
      wrapper[k] = fn[k];
    });
    return wrapper;
    function wrapper() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      var ret = fn.apply(this, args);
      var cb2 = args[args.length - 1];
      if (typeof ret === "function" && ret !== cb2) {
        Object.keys(cb2).forEach(function(k) {
          ret[k] = cb2[k];
        });
      }
      return ret;
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS((exports, module2) => {
  var wrappy = require_wrappy();
  module2.exports = wrappy(once);
  module2.exports.strict = wrappy(onceStrict);
  once.proto = once(function() {
    Object.defineProperty(Function.prototype, "once", {
      value: function() {
        return once(this);
      },
      configurable: true
    });
    Object.defineProperty(Function.prototype, "onceStrict", {
      value: function() {
        return onceStrict(this);
      },
      configurable: true
    });
  });
  function once(fn) {
    var f = function() {
      if (f.called)
        return f.value;
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    f.called = false;
    return f;
  }
  function onceStrict(fn) {
    var f = function() {
      if (f.called)
        throw new Error(f.onceError);
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    var name = fn.name || "Function wrapped with `once`";
    f.onceError = name + " shouldn't be called more than once";
    f.called = false;
    return f;
  }
});

// node_modules/@octokit/request-error/dist-node/index.js
var require_dist_node4 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
  }
  var deprecation = require_dist_node3();
  var once = _interopDefault(require_once());
  const logOnce = once((deprecation2) => console.warn(deprecation2));
  class RequestError extends Error {
    constructor(message, statusCode, options) {
      super(message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = "HttpError";
      this.status = statusCode;
      Object.defineProperty(this, "code", {
        get() {
          logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
          return statusCode;
        }
      });
      this.headers = options.headers || {};
      const requestCopy = Object.assign({}, options.request);
      if (options.request.headers.authorization) {
        requestCopy.headers = Object.assign({}, options.request.headers, {
          authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
        });
      }
      requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
      this.request = requestCopy;
    }
  }
  exports.RequestError = RequestError;
});

// node_modules/@octokit/request/dist-node/index.js
var require_dist_node5 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
  }
  var endpoint = require_dist_node2();
  var universalUserAgent = require_dist_node();
  var isPlainObject = require_is_plain_object2();
  var nodeFetch = _interopDefault(require_lib());
  var requestError = require_dist_node4();
  const VERSION = "5.4.10";
  function getBufferResponse(response) {
    return response.arrayBuffer();
  }
  function fetchWrapper(requestOptions) {
    if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
    return fetch(requestOptions.url, Object.assign({
      method: requestOptions.method,
      body: requestOptions.body,
      headers: requestOptions.headers,
      redirect: requestOptions.redirect
    }, requestOptions.request)).then((response) => {
      url = response.url;
      status = response.status;
      for (const keyAndValue of response.headers) {
        headers[keyAndValue[0]] = keyAndValue[1];
      }
      if (status === 204 || status === 205) {
        return;
      }
      if (requestOptions.method === "HEAD") {
        if (status < 400) {
          return;
        }
        throw new requestError.RequestError(response.statusText, status, {
          headers,
          request: requestOptions
        });
      }
      if (status === 304) {
        throw new requestError.RequestError("Not modified", status, {
          headers,
          request: requestOptions
        });
      }
      if (status >= 400) {
        return response.text().then((message) => {
          const error = new requestError.RequestError(message, status, {
            headers,
            request: requestOptions
          });
          try {
            let responseBody = JSON.parse(error.message);
            Object.assign(error, responseBody);
            let errors = responseBody.errors;
            error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
          } catch (e) {
          }
          throw error;
        });
      }
      const contentType = response.headers.get("content-type");
      if (/application\/json/.test(contentType)) {
        return response.json();
      }
      if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
        return response.text();
      }
      return getBufferResponse(response);
    }).then((data) => {
      return {
        status,
        url,
        headers,
        data
      };
    }).catch((error) => {
      if (error instanceof requestError.RequestError) {
        throw error;
      }
      throw new requestError.RequestError(error.message, 500, {
        headers,
        request: requestOptions
      });
    });
  }
  function withDefaults(oldEndpoint, newDefaults) {
    const endpoint2 = oldEndpoint.defaults(newDefaults);
    const newApi = function(route, parameters) {
      const endpointOptions = endpoint2.merge(route, parameters);
      if (!endpointOptions.request || !endpointOptions.request.hook) {
        return fetchWrapper(endpoint2.parse(endpointOptions));
      }
      const request2 = (route2, parameters2) => {
        return fetchWrapper(endpoint2.parse(endpoint2.merge(route2, parameters2)));
      };
      Object.assign(request2, {
        endpoint: endpoint2,
        defaults: withDefaults.bind(null, endpoint2)
      });
      return endpointOptions.request.hook(request2, endpointOptions);
    };
    return Object.assign(newApi, {
      endpoint: endpoint2,
      defaults: withDefaults.bind(null, endpoint2)
    });
  }
  const request = withDefaults(endpoint.endpoint, {
    headers: {
      "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
    }
  });
  exports.request = request;
});

// node_modules/@octokit/graphql/dist-node/index.js
var require_dist_node6 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var request = require_dist_node5();
  var universalUserAgent = require_dist_node();
  const VERSION = "4.5.7";
  class GraphqlError extends Error {
    constructor(request2, response) {
      const message = response.data.errors[0].message;
      super(message);
      Object.assign(this, response.data);
      Object.assign(this, {
        headers: response.headers
      });
      this.name = "GraphqlError";
      this.request = request2;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
  const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
  function graphql(request2, query, options) {
    if (typeof query === "string" && options && "query" in options) {
      return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
    }
    const parsedOptions = typeof query === "string" ? Object.assign({
      query
    }, options) : query;
    const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
      if (NON_VARIABLE_OPTIONS.includes(key)) {
        result[key] = parsedOptions[key];
        return result;
      }
      if (!result.variables) {
        result.variables = {};
      }
      result.variables[key] = parsedOptions[key];
      return result;
    }, {});
    const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
    if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
      requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
    }
    return request2(requestOptions).then((response) => {
      if (response.data.errors) {
        const headers = {};
        for (const key of Object.keys(response.headers)) {
          headers[key] = response.headers[key];
        }
        throw new GraphqlError(requestOptions, {
          headers,
          data: response.data
        });
      }
      return response.data.data;
    });
  }
  function withDefaults(request$1, newDefaults) {
    const newRequest = request$1.defaults(newDefaults);
    const newApi = (query, options) => {
      return graphql(newRequest, query, options);
    };
    return Object.assign(newApi, {
      defaults: withDefaults.bind(null, newRequest),
      endpoint: request.request.endpoint
    });
  }
  const graphql$1 = withDefaults(request.request, {
    headers: {
      "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
    },
    method: "POST",
    url: "/graphql"
  });
  function withCustomRequest(customRequest) {
    return withDefaults(customRequest, {
      method: "POST",
      url: "/graphql"
    });
  }
  exports.graphql = graphql$1;
  exports.withCustomRequest = withCustomRequest;
});

// node_modules/@octokit/auth-token/dist-node/index.js
var require_dist_node7 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  async function auth(token) {
    const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
    return {
      type: "token",
      token,
      tokenType
    };
  }
  function withAuthorizationPrefix(token) {
    if (token.split(/\./).length === 3) {
      return `bearer ${token}`;
    }
    return `token ${token}`;
  }
  async function hook(token, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    endpoint.headers.authorization = withAuthorizationPrefix(token);
    return request(endpoint);
  }
  const createTokenAuth = function createTokenAuth2(token) {
    if (!token) {
      throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
    }
    if (typeof token !== "string") {
      throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
    }
    token = token.replace(/^(token|bearer) +/i, "");
    return Object.assign(auth.bind(null, token), {
      hook: hook.bind(null, token)
    });
  };
  exports.createTokenAuth = createTokenAuth;
});

// node_modules/@octokit/core/dist-node/index.js
var require_dist_node8 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var universalUserAgent = require_dist_node();
  var beforeAfterHook = require_before_after_hook();
  var request = require_dist_node5();
  var graphql = require_dist_node6();
  var authToken = require_dist_node7();
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null)
      return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
          continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  const VERSION = "3.2.1";
  class Octokit2 {
    constructor(options = {}) {
      const hook = new beforeAfterHook.Collection();
      const requestDefaults = {
        baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
        headers: {},
        request: Object.assign({}, options.request, {
          hook: hook.bind(null, "request")
        }),
        mediaType: {
          previews: [],
          format: ""
        }
      };
      requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");
      if (options.baseUrl) {
        requestDefaults.baseUrl = options.baseUrl;
      }
      if (options.previews) {
        requestDefaults.mediaType.previews = options.previews;
      }
      if (options.timeZone) {
        requestDefaults.headers["time-zone"] = options.timeZone;
      }
      this.request = request.request.defaults(requestDefaults);
      this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
      this.log = Object.assign({
        debug: () => {
        },
        info: () => {
        },
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      }, options.log);
      this.hook = hook;
      if (!options.authStrategy) {
        if (!options.auth) {
          this.auth = async () => ({
            type: "unauthenticated"
          });
        } else {
          const auth = authToken.createTokenAuth(options.auth);
          hook.wrap("request", auth.hook);
          this.auth = auth;
        }
      } else {
        const {
          authStrategy
        } = options, otherOptions = _objectWithoutProperties(options, ["authStrategy"]);
        const auth = authStrategy(Object.assign({
          request: this.request,
          log: this.log,
          octokit: this,
          octokitOptions: otherOptions
        }, options.auth));
        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
      const classConstructor = this.constructor;
      classConstructor.plugins.forEach((plugin) => {
        Object.assign(this, plugin(this, options));
      });
    }
    static defaults(defaults) {
      const OctokitWithDefaults = class extends this {
        constructor(...args) {
          const options = args[0] || {};
          if (typeof defaults === "function") {
            super(defaults(options));
            return;
          }
          super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
            userAgent: `${options.userAgent} ${defaults.userAgent}`
          } : null));
        }
      };
      return OctokitWithDefaults;
    }
    static plugin(...newPlugins) {
      var _a2;
      const currentPlugins = this.plugins;
      const NewOctokit = (_a2 = class extends this {
      }, _a2.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))), _a2);
      return NewOctokit;
    }
  }
  Octokit2.VERSION = VERSION;
  Octokit2.plugins = [];
  exports.Octokit = Octokit2;
});

// node_modules/@octokit/plugin-request-log/dist-node/index.js
var require_dist_node9 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const VERSION = "1.0.2";
  function requestLog(octokit) {
    octokit.hook.wrap("request", (request, options) => {
      octokit.log.debug("request", options);
      const start = Date.now();
      const requestOptions = octokit.request.endpoint.parse(options);
      const path3 = requestOptions.url.replace(options.baseUrl, "");
      return request(options).then((response) => {
        octokit.log.info(`${requestOptions.method} ${path3} - ${response.status} in ${Date.now() - start}ms`);
        return response;
      }).catch((error) => {
        octokit.log.info(`${requestOptions.method} ${path3} - ${error.status} in ${Date.now() - start}ms`);
        throw error;
      });
    });
  }
  requestLog.VERSION = VERSION;
  exports.requestLog = requestLog;
});

// node_modules/@octokit/plugin-paginate-rest/dist-node/index.js
var require_dist_node10 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const VERSION = "2.6.0";
  function normalizePaginatedListResponse(response) {
    const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
    if (!responseNeedsNormalization)
      return response;
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
      response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
      response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    return response;
  }
  function iterator(octokit, route, parameters) {
    const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
    const requestMethod = typeof route === "function" ? route : octokit.request;
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
      [Symbol.asyncIterator]: () => ({
        async next() {
          if (!url)
            return {
              done: true
            };
          const response = await requestMethod({
            method,
            url,
            headers
          });
          const normalizedResponse = normalizePaginatedListResponse(response);
          url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return {
            value: normalizedResponse
          };
        }
      })
    };
  }
  function paginate(octokit, route, parameters, mapFn) {
    if (typeof parameters === "function") {
      mapFn = parameters;
      parameters = void 0;
    }
    return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
  }
  function gather(octokit, results, iterator2, mapFn) {
    return iterator2.next().then((result) => {
      if (result.done) {
        return results;
      }
      let earlyExit = false;
      function done() {
        earlyExit = true;
      }
      results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
      if (earlyExit) {
        return results;
      }
      return gather(octokit, results, iterator2, mapFn);
    });
  }
  const composePaginateRest = Object.assign(paginate, {
    iterator
  });
  function paginateRest(octokit) {
    return {
      paginate: Object.assign(paginate.bind(null, octokit), {
        iterator: iterator.bind(null, octokit)
      })
    };
  }
  paginateRest.VERSION = VERSION;
  exports.composePaginateRest = composePaginateRest;
  exports.paginateRest = paginateRest;
});

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js
var require_dist_node11 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const Endpoints = {
    actions: {
      addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
      cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
      createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
      createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
      createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
      createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
      createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
      createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
      createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
      deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
      deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
      deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
      deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
      deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
      deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
      deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
      downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
      downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
      downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
      getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
      getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
      getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
      getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
      getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
      getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
      getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
      getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
      getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
      getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
      getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
      getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
      listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
      listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
      listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
      listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
      listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
      listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
      listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
      listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
      listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
      listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
      listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
      listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
      listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
      reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
      removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
      setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"]
    },
    activity: {
      checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
      deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
      deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
      getFeeds: ["GET /feeds"],
      getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
      getThread: ["GET /notifications/threads/{thread_id}"],
      getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
      listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
      listNotificationsForAuthenticatedUser: ["GET /notifications"],
      listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
      listPublicEvents: ["GET /events"],
      listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
      listPublicEventsForUser: ["GET /users/{username}/events/public"],
      listPublicOrgEvents: ["GET /orgs/{org}/events"],
      listReceivedEventsForUser: ["GET /users/{username}/received_events"],
      listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
      listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
      listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
      listReposStarredByAuthenticatedUser: ["GET /user/starred"],
      listReposStarredByUser: ["GET /users/{username}/starred"],
      listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
      listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
      listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
      listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
      markNotificationsAsRead: ["PUT /notifications"],
      markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
      markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
      setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
      setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
      starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
      unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
    },
    apps: {
      addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}"],
      checkToken: ["POST /applications/{client_id}/token"],
      createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
        mediaType: {
          previews: ["corsair"]
        }
      }],
      createFromManifest: ["POST /app-manifests/{code}/conversions"],
      createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
      deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
      deleteInstallation: ["DELETE /app/installations/{installation_id}"],
      deleteToken: ["DELETE /applications/{client_id}/token"],
      getAuthenticated: ["GET /app"],
      getBySlug: ["GET /apps/{app_slug}"],
      getInstallation: ["GET /app/installations/{installation_id}"],
      getOrgInstallation: ["GET /orgs/{org}/installation"],
      getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
      getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
      getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
      getUserInstallation: ["GET /users/{username}/installation"],
      listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
      listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
      listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories"],
      listInstallations: ["GET /app/installations"],
      listInstallationsForAuthenticatedUser: ["GET /user/installations"],
      listPlans: ["GET /marketplace_listing/plans"],
      listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
      listReposAccessibleToInstallation: ["GET /installation/repositories"],
      listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
      listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
      removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],
      resetToken: ["PATCH /applications/{client_id}/token"],
      revokeInstallationAccessToken: ["DELETE /installation/token"],
      suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
      unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"]
    },
    billing: {
      getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
      getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
      getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
      getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
      getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
      getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
    },
    checks: {
      create: ["POST /repos/{owner}/{repo}/check-runs", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      createSuite: ["POST /repos/{owner}/{repo}/check-suites", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}", {
        mediaType: {
          previews: ["antiope"]
        }
      }]
    },
    codeScanning: {
      getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}", {}, {
        renamedParameters: {
          alert_id: "alert_number"
        }
      }],
      listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
      listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
      updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
      uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
    },
    codesOfConduct: {
      getAllCodesOfConduct: ["GET /codes_of_conduct", {
        mediaType: {
          previews: ["scarlet-witch"]
        }
      }],
      getConductCode: ["GET /codes_of_conduct/{key}", {
        mediaType: {
          previews: ["scarlet-witch"]
        }
      }],
      getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
        mediaType: {
          previews: ["scarlet-witch"]
        }
      }]
    },
    emojis: {
      get: ["GET /emojis"]
    },
    gists: {
      checkIsStarred: ["GET /gists/{gist_id}/star"],
      create: ["POST /gists"],
      createComment: ["POST /gists/{gist_id}/comments"],
      delete: ["DELETE /gists/{gist_id}"],
      deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
      fork: ["POST /gists/{gist_id}/forks"],
      get: ["GET /gists/{gist_id}"],
      getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
      getRevision: ["GET /gists/{gist_id}/{sha}"],
      list: ["GET /gists"],
      listComments: ["GET /gists/{gist_id}/comments"],
      listCommits: ["GET /gists/{gist_id}/commits"],
      listForUser: ["GET /users/{username}/gists"],
      listForks: ["GET /gists/{gist_id}/forks"],
      listPublic: ["GET /gists/public"],
      listStarred: ["GET /gists/starred"],
      star: ["PUT /gists/{gist_id}/star"],
      unstar: ["DELETE /gists/{gist_id}/star"],
      update: ["PATCH /gists/{gist_id}"],
      updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
    },
    git: {
      createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
      createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
      createRef: ["POST /repos/{owner}/{repo}/git/refs"],
      createTag: ["POST /repos/{owner}/{repo}/git/tags"],
      createTree: ["POST /repos/{owner}/{repo}/git/trees"],
      deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
      getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
      getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
      getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
      getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
      getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
      listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
      updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
    },
    gitignore: {
      getAllTemplates: ["GET /gitignore/templates"],
      getTemplate: ["GET /gitignore/templates/{name}"]
    },
    interactions: {
      getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }]
    },
    issues: {
      addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
      addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
      create: ["POST /repos/{owner}/{repo}/issues"],
      createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
      createLabel: ["POST /repos/{owner}/{repo}/labels"],
      createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
      deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
      deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
      get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
      getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
      getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
      getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
      list: ["GET /issues"],
      listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
      listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
      listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
      listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
      listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
      listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
        mediaType: {
          previews: ["mockingbird"]
        }
      }],
      listForAuthenticatedUser: ["GET /user/issues"],
      listForOrg: ["GET /orgs/{org}/issues"],
      listForRepo: ["GET /repos/{owner}/{repo}/issues"],
      listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
      listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
      listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
      lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
      removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
      removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
      setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
      update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
      updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
      updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
    },
    licenses: {
      get: ["GET /licenses/{license}"],
      getAllCommonlyUsed: ["GET /licenses"],
      getForRepo: ["GET /repos/{owner}/{repo}/license"]
    },
    markdown: {
      render: ["POST /markdown"],
      renderRaw: ["POST /markdown/raw", {
        headers: {
          "content-type": "text/plain; charset=utf-8"
        }
      }]
    },
    meta: {
      get: ["GET /meta"]
    },
    migrations: {
      cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
      deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
      getImportStatus: ["GET /repos/{owner}/{repo}/import"],
      getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
      getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      listForAuthenticatedUser: ["GET /user/migrations", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      listForOrg: ["GET /orgs/{org}/migrations", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
      setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
      startForAuthenticatedUser: ["POST /user/migrations"],
      startForOrg: ["POST /orgs/{org}/migrations"],
      startImport: ["PUT /repos/{owner}/{repo}/import"],
      unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      updateImport: ["PATCH /repos/{owner}/{repo}/import"]
    },
    orgs: {
      blockUser: ["PUT /orgs/{org}/blocks/{username}"],
      checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
      checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
      checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
      convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
      createInvitation: ["POST /orgs/{org}/invitations"],
      createWebhook: ["POST /orgs/{org}/hooks"],
      deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
      get: ["GET /orgs/{org}"],
      getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
      getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
      getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
      list: ["GET /organizations"],
      listAppInstallations: ["GET /orgs/{org}/installations"],
      listBlockedUsers: ["GET /orgs/{org}/blocks"],
      listForAuthenticatedUser: ["GET /user/orgs"],
      listForUser: ["GET /users/{username}/orgs"],
      listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
      listMembers: ["GET /orgs/{org}/members"],
      listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
      listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
      listPendingInvitations: ["GET /orgs/{org}/invitations"],
      listPublicMembers: ["GET /orgs/{org}/public_members"],
      listWebhooks: ["GET /orgs/{org}/hooks"],
      pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
      removeMember: ["DELETE /orgs/{org}/members/{username}"],
      removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
      removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
      removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
      setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
      setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
      unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
      update: ["PATCH /orgs/{org}"],
      updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
      updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"]
    },
    projects: {
      addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createCard: ["POST /projects/columns/{column_id}/cards", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createColumn: ["POST /projects/{project_id}/columns", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createForAuthenticatedUser: ["POST /user/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createForOrg: ["POST /orgs/{org}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createForRepo: ["POST /repos/{owner}/{repo}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      delete: ["DELETE /projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      deleteColumn: ["DELETE /projects/columns/{column_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      get: ["GET /projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      getCard: ["GET /projects/columns/cards/{card_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      getColumn: ["GET /projects/columns/{column_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listCards: ["GET /projects/columns/{column_id}/cards", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listCollaborators: ["GET /projects/{project_id}/collaborators", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listColumns: ["GET /projects/{project_id}/columns", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listForOrg: ["GET /orgs/{org}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listForRepo: ["GET /repos/{owner}/{repo}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listForUser: ["GET /users/{username}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      moveColumn: ["POST /projects/columns/{column_id}/moves", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      update: ["PATCH /projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      updateCard: ["PATCH /projects/columns/cards/{card_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      updateColumn: ["PATCH /projects/columns/{column_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }]
    },
    pulls: {
      checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
      create: ["POST /repos/{owner}/{repo}/pulls"],
      createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
      createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
      createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
      deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
      deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
      dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
      get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
      getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
      getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
      list: ["GET /repos/{owner}/{repo}/pulls"],
      listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
      listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
      listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
      listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
      listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
      listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
      listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
      merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
      removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
      requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
      submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
      update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
      updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
        mediaType: {
          previews: ["lydian"]
        }
      }],
      updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
      updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
    },
    rateLimit: {
      get: ["GET /rate_limit"]
    },
    reactions: {
      createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteLegacy: ["DELETE /reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }, {
        deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy"
      }],
      listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }]
    },
    repos: {
      acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
      addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
        mapToData: "apps"
      }],
      addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
      addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
        mapToData: "contexts"
      }],
      addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
        mapToData: "teams"
      }],
      addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
        mapToData: "users"
      }],
      checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
      checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
        mediaType: {
          previews: ["dorian"]
        }
      }],
      compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
      createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
      createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
        mediaType: {
          previews: ["zzzax"]
        }
      }],
      createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
      createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
      createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
      createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
      createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
      createForAuthenticatedUser: ["POST /user/repos"],
      createFork: ["POST /repos/{owner}/{repo}/forks"],
      createInOrg: ["POST /orgs/{org}/repos"],
      createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
      createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
        mediaType: {
          previews: ["switcheroo"]
        }
      }],
      createRelease: ["POST /repos/{owner}/{repo}/releases"],
      createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
        mediaType: {
          previews: ["baptiste"]
        }
      }],
      createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
      declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
      delete: ["DELETE /repos/{owner}/{repo}"],
      deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
      deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
      deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
      deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
      deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
        mediaType: {
          previews: ["zzzax"]
        }
      }],
      deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
      deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
      deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
      deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
      deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
        mediaType: {
          previews: ["switcheroo"]
        }
      }],
      deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
      deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
      deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
      deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
      disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
        mediaType: {
          previews: ["london"]
        }
      }],
      disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
        mediaType: {
          previews: ["dorian"]
        }
      }],
      downloadArchive: ["GET /repos/{owner}/{repo}/{archive_format}/{ref}"],
      enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
        mediaType: {
          previews: ["london"]
        }
      }],
      enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
        mediaType: {
          previews: ["dorian"]
        }
      }],
      get: ["GET /repos/{owner}/{repo}"],
      getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
      getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
      getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
      getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
        mediaType: {
          previews: ["mercy"]
        }
      }],
      getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
      getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
      getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
      getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
      getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
      getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
      getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
      getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
      getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
      getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
      getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
        mediaType: {
          previews: ["zzzax"]
        }
      }],
      getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile", {
        mediaType: {
          previews: ["black-panther"]
        }
      }],
      getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
      getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
      getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
      getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
      getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
      getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
      getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
      getPages: ["GET /repos/{owner}/{repo}/pages"],
      getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
      getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
      getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
      getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
      getReadme: ["GET /repos/{owner}/{repo}/readme"],
      getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
      getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
      getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
      getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
      getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
      getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
      getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
      getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
      getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
      getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
      listBranches: ["GET /repos/{owner}/{repo}/branches"],
      listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
        mediaType: {
          previews: ["groot"]
        }
      }],
      listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
      listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
      listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
      listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
      listCommits: ["GET /repos/{owner}/{repo}/commits"],
      listContributors: ["GET /repos/{owner}/{repo}/contributors"],
      listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
      listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
      listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
      listForAuthenticatedUser: ["GET /user/repos"],
      listForOrg: ["GET /orgs/{org}/repos"],
      listForUser: ["GET /users/{username}/repos"],
      listForks: ["GET /repos/{owner}/{repo}/forks"],
      listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
      listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
      listLanguages: ["GET /repos/{owner}/{repo}/languages"],
      listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
      listPublic: ["GET /repositories"],
      listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
        mediaType: {
          previews: ["groot"]
        }
      }],
      listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
      listReleases: ["GET /repos/{owner}/{repo}/releases"],
      listTags: ["GET /repos/{owner}/{repo}/tags"],
      listTeams: ["GET /repos/{owner}/{repo}/teams"],
      listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
      merge: ["POST /repos/{owner}/{repo}/merges"],
      pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
      removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
        mapToData: "apps"
      }],
      removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
      removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
        mapToData: "contexts"
      }],
      removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
      removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
        mapToData: "teams"
      }],
      removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
        mapToData: "users"
      }],
      replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
        mediaType: {
          previews: ["mercy"]
        }
      }],
      requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
      setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
      setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
        mapToData: "apps"
      }],
      setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
        mapToData: "contexts"
      }],
      setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
        mapToData: "teams"
      }],
      setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
        mapToData: "users"
      }],
      testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
      transfer: ["POST /repos/{owner}/{repo}/transfer"],
      update: ["PATCH /repos/{owner}/{repo}"],
      updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
      updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
      updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
      updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
      updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
      updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
      updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
      updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
      updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
      uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
        baseUrl: "https://uploads.github.com"
      }]
    },
    search: {
      code: ["GET /search/code"],
      commits: ["GET /search/commits", {
        mediaType: {
          previews: ["cloak"]
        }
      }],
      issuesAndPullRequests: ["GET /search/issues"],
      labels: ["GET /search/labels"],
      repos: ["GET /search/repositories"],
      topics: ["GET /search/topics", {
        mediaType: {
          previews: ["mercy"]
        }
      }],
      users: ["GET /search/users"]
    },
    teams: {
      addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
      addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
      checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
      create: ["POST /orgs/{org}/teams"],
      createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
      createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
      deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
      deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
      deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
      getByName: ["GET /orgs/{org}/teams/{team_slug}"],
      getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
      getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
      getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
      list: ["GET /orgs/{org}/teams"],
      listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
      listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
      listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
      listForAuthenticatedUser: ["GET /user/teams"],
      listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
      listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
      listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
      removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
      removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
      removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
      updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
      updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
      updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
    },
    users: {
      addEmailForAuthenticated: ["POST /user/emails"],
      block: ["PUT /user/blocks/{username}"],
      checkBlocked: ["GET /user/blocks/{username}"],
      checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
      checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
      createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
      createPublicSshKeyForAuthenticated: ["POST /user/keys"],
      deleteEmailForAuthenticated: ["DELETE /user/emails"],
      deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
      deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
      follow: ["PUT /user/following/{username}"],
      getAuthenticated: ["GET /user"],
      getByUsername: ["GET /users/{username}"],
      getContextForUser: ["GET /users/{username}/hovercard"],
      getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
      getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
      list: ["GET /users"],
      listBlockedByAuthenticated: ["GET /user/blocks"],
      listEmailsForAuthenticated: ["GET /user/emails"],
      listFollowedByAuthenticated: ["GET /user/following"],
      listFollowersForAuthenticatedUser: ["GET /user/followers"],
      listFollowersForUser: ["GET /users/{username}/followers"],
      listFollowingForUser: ["GET /users/{username}/following"],
      listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
      listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
      listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
      listPublicKeysForUser: ["GET /users/{username}/keys"],
      listPublicSshKeysForAuthenticated: ["GET /user/keys"],
      setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
      unblock: ["DELETE /user/blocks/{username}"],
      unfollow: ["DELETE /user/following/{username}"],
      updateAuthenticated: ["PATCH /user"]
    }
  };
  const VERSION = "4.2.1";
  function endpointsToMethods(octokit, endpointsMap) {
    const newMethods = {};
    for (const [scope, endpoints] of Object.entries(endpointsMap)) {
      for (const [methodName, endpoint] of Object.entries(endpoints)) {
        const [route, defaults, decorations] = endpoint;
        const [method, url] = route.split(/ /);
        const endpointDefaults = Object.assign({
          method,
          url
        }, defaults);
        if (!newMethods[scope]) {
          newMethods[scope] = {};
        }
        const scopeMethods = newMethods[scope];
        if (decorations) {
          scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
          continue;
        }
        scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
      }
    }
    return newMethods;
  }
  function decorate(octokit, scope, methodName, defaults, decorations) {
    const requestWithDefaults = octokit.request.defaults(defaults);
    function withDecorations(...args) {
      let options = requestWithDefaults.endpoint.merge(...args);
      if (decorations.mapToData) {
        options = Object.assign({}, options, {
          data: options[decorations.mapToData],
          [decorations.mapToData]: void 0
        });
        return requestWithDefaults(options);
      }
      if (decorations.renamed) {
        const [newScope, newMethodName] = decorations.renamed;
        octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
      }
      if (decorations.deprecated) {
        octokit.log.warn(decorations.deprecated);
      }
      if (decorations.renamedParameters) {
        const options2 = requestWithDefaults.endpoint.merge(...args);
        for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
          if (name in options2) {
            octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);
            if (!(alias in options2)) {
              options2[alias] = options2[name];
            }
            delete options2[name];
          }
        }
        return requestWithDefaults(options2);
      }
      return requestWithDefaults(...args);
    }
    return Object.assign(withDecorations, requestWithDefaults);
  }
  function restEndpointMethods(octokit) {
    return endpointsToMethods(octokit, Endpoints);
  }
  restEndpointMethods.VERSION = VERSION;
  exports.restEndpointMethods = restEndpointMethods;
});

// node_modules/@octokit/rest/dist-node/index.js
var require_dist_node12 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var core3 = require_dist_node8();
  var pluginRequestLog = require_dist_node9();
  var pluginPaginateRest = require_dist_node10();
  var pluginRestEndpointMethods = require_dist_node11();
  const VERSION = "18.0.9";
  const Octokit2 = core3.Octokit.plugin(pluginRequestLog.requestLog, pluginRestEndpointMethods.restEndpointMethods, pluginPaginateRest.paginateRest).defaults({
    userAgent: `octokit-rest.js/${VERSION}`
  });
  exports.Octokit = Octokit2;
});

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS((exports, module2) => {
  "use strict";
  var has = Object.prototype.hasOwnProperty;
  var prefix = "~";
  function Events() {
  }
  if (Object.create) {
    Events.prototype = Object.create(null);
    if (!new Events().__proto__)
      prefix = false;
  }
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }
  function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt])
      emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn)
      emitter._events[evt].push(listener);
    else
      emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
  }
  function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0)
      emitter._events = new Events();
    else
      delete emitter._events[evt];
  }
  function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0)
      return names;
    for (name in events = this._events) {
      if (has.call(events, name))
        names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
  };
  EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers)
      return [];
    if (handlers.fn)
      return [handlers.fn];
    for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
      ee[i] = handlers[i].fn;
    }
    return ee;
  };
  EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners)
      return 0;
    if (listeners.fn)
      return 1;
    return listeners.length;
  };
  EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
      if (listeners.once)
        this.removeListener(event, listeners.fn, void 0, true);
      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1); i < len; i++) {
        args[i - 1] = arguments[i];
      }
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j;
      for (i = 0; i < length; i++) {
        if (listeners[i].once)
          this.removeListener(event, listeners[i].fn, void 0, true);
        switch (len) {
          case 1:
            listeners[i].fn.call(listeners[i].context);
            break;
          case 2:
            listeners[i].fn.call(listeners[i].context, a1);
            break;
          case 3:
            listeners[i].fn.call(listeners[i].context, a1, a2);
            break;
          case 4:
            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
            break;
          default:
            if (!args)
              for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
    return true;
  };
  EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
  };
  EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
  };
  EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        clearEvent(this, evt);
      }
    } else {
      for (var i = 0, events = [], length = listeners.length; i < length; i++) {
        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
          events.push(listeners[i]);
        }
      }
      if (events.length)
        this._events[evt] = events.length === 1 ? events[0] : events;
      else
        clearEvent(this, evt);
    }
    return this;
  };
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt])
        clearEvent(this, evt);
    } else {
      this._events = new Events();
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  EventEmitter.prefixed = prefix;
  EventEmitter.EventEmitter = EventEmitter;
  if (typeof module2 !== "undefined") {
    module2.exports = EventEmitter;
  }
});

// node_modules/p-finally/index.js
var require_p_finally = __commonJS((exports, module2) => {
  "use strict";
  module2.exports = (promise, onFinally) => {
    onFinally = onFinally || (() => {
    });
    return promise.then((val) => new Promise((resolve) => {
      resolve(onFinally());
    }).then(() => val), (err) => new Promise((resolve) => {
      resolve(onFinally());
    }).then(() => {
      throw err;
    }));
  };
});

// node_modules/p-timeout/index.js
var require_p_timeout = __commonJS((exports, module2) => {
  "use strict";
  const pFinally = require_p_finally();
  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      this.name = "TimeoutError";
    }
  }
  const pTimeout = (promise, milliseconds, fallback) => new Promise((resolve, reject) => {
    if (typeof milliseconds !== "number" || milliseconds < 0) {
      throw new TypeError("Expected `milliseconds` to be a positive number");
    }
    if (milliseconds === Infinity) {
      resolve(promise);
      return;
    }
    const timer = setTimeout(() => {
      if (typeof fallback === "function") {
        try {
          resolve(fallback());
        } catch (error) {
          reject(error);
        }
        return;
      }
      const message = typeof fallback === "string" ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
      const timeoutError = fallback instanceof Error ? fallback : new TimeoutError(message);
      if (typeof promise.cancel === "function") {
        promise.cancel();
      }
      reject(timeoutError);
    }, milliseconds);
    pFinally(promise.then(resolve, reject), () => {
      clearTimeout(timer);
    });
  });
  module2.exports = pTimeout;
  module2.exports.default = pTimeout;
  module2.exports.TimeoutError = TimeoutError;
});

// node_modules/p-queue/dist/lower-bound.js
var require_lower_bound = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function lowerBound(array, value, comparator) {
    let first = 0;
    let count = array.length;
    while (count > 0) {
      const step = count / 2 | 0;
      let it = first + step;
      if (comparator(array[it], value) <= 0) {
        first = ++it;
        count -= step + 1;
      } else {
        count = step;
      }
    }
    return first;
  }
  exports.default = lowerBound;
});

// node_modules/p-queue/dist/priority-queue.js
var require_priority_queue = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const lower_bound_1 = require_lower_bound();
  class PriorityQueue {
    constructor() {
      this._queue = [];
    }
    enqueue(run, options) {
      options = Object.assign({priority: 0}, options);
      const element = {
        priority: options.priority,
        run
      };
      if (this.size && this._queue[this.size - 1].priority >= options.priority) {
        this._queue.push(element);
        return;
      }
      const index = lower_bound_1.default(this._queue, element, (a, b) => b.priority - a.priority);
      this._queue.splice(index, 0, element);
    }
    dequeue() {
      const item = this._queue.shift();
      return item === null || item === void 0 ? void 0 : item.run;
    }
    filter(options) {
      return this._queue.filter((element) => element.priority === options.priority).map((element) => element.run);
    }
    get size() {
      return this._queue.length;
    }
  }
  exports.default = PriorityQueue;
});

// node_modules/p-queue/dist/index.js
var require_dist = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  const EventEmitter = require_eventemitter3();
  const p_timeout_1 = require_p_timeout();
  const priority_queue_1 = require_priority_queue();
  const empty = () => {
  };
  const timeoutError = new p_timeout_1.TimeoutError();
  class PQueue3 extends EventEmitter {
    constructor(options) {
      var _a2, _b, _c, _d;
      super();
      this._intervalCount = 0;
      this._intervalEnd = 0;
      this._pendingCount = 0;
      this._resolveEmpty = empty;
      this._resolveIdle = empty;
      options = Object.assign({carryoverConcurrencyCount: false, intervalCap: Infinity, interval: 0, concurrency: Infinity, autoStart: true, queueClass: priority_queue_1.default}, options);
      if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) {
        throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${(_b = (_a2 = options.intervalCap) === null || _a2 === void 0 ? void 0 : _a2.toString()) !== null && _b !== void 0 ? _b : ""}\` (${typeof options.intervalCap})`);
      }
      if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) {
        throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${(_d = (_c = options.interval) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""}\` (${typeof options.interval})`);
      }
      this._carryoverConcurrencyCount = options.carryoverConcurrencyCount;
      this._isIntervalIgnored = options.intervalCap === Infinity || options.interval === 0;
      this._intervalCap = options.intervalCap;
      this._interval = options.interval;
      this._queue = new options.queueClass();
      this._queueClass = options.queueClass;
      this.concurrency = options.concurrency;
      this._timeout = options.timeout;
      this._throwOnTimeout = options.throwOnTimeout === true;
      this._isPaused = options.autoStart === false;
    }
    get _doesIntervalAllowAnother() {
      return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
    }
    get _doesConcurrentAllowAnother() {
      return this._pendingCount < this._concurrency;
    }
    _next() {
      this._pendingCount--;
      this._tryToStartAnother();
      this.emit("next");
    }
    _resolvePromises() {
      this._resolveEmpty();
      this._resolveEmpty = empty;
      if (this._pendingCount === 0) {
        this._resolveIdle();
        this._resolveIdle = empty;
        this.emit("idle");
      }
    }
    _onResumeInterval() {
      this._onInterval();
      this._initializeIntervalIfNeeded();
      this._timeoutId = void 0;
    }
    _isIntervalPaused() {
      const now = Date.now();
      if (this._intervalId === void 0) {
        const delay = this._intervalEnd - now;
        if (delay < 0) {
          this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
        } else {
          if (this._timeoutId === void 0) {
            this._timeoutId = setTimeout(() => {
              this._onResumeInterval();
            }, delay);
          }
          return true;
        }
      }
      return false;
    }
    _tryToStartAnother() {
      if (this._queue.size === 0) {
        if (this._intervalId) {
          clearInterval(this._intervalId);
        }
        this._intervalId = void 0;
        this._resolvePromises();
        return false;
      }
      if (!this._isPaused) {
        const canInitializeInterval = !this._isIntervalPaused();
        if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
          const job = this._queue.dequeue();
          if (!job) {
            return false;
          }
          this.emit("active");
          job();
          if (canInitializeInterval) {
            this._initializeIntervalIfNeeded();
          }
          return true;
        }
      }
      return false;
    }
    _initializeIntervalIfNeeded() {
      if (this._isIntervalIgnored || this._intervalId !== void 0) {
        return;
      }
      this._intervalId = setInterval(() => {
        this._onInterval();
      }, this._interval);
      this._intervalEnd = Date.now() + this._interval;
    }
    _onInterval() {
      if (this._intervalCount === 0 && this._pendingCount === 0 && this._intervalId) {
        clearInterval(this._intervalId);
        this._intervalId = void 0;
      }
      this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
      this._processQueue();
    }
    _processQueue() {
      while (this._tryToStartAnother()) {
      }
    }
    get concurrency() {
      return this._concurrency;
    }
    set concurrency(newConcurrency) {
      if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) {
        throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
      }
      this._concurrency = newConcurrency;
      this._processQueue();
    }
    async add(fn, options = {}) {
      return new Promise((resolve, reject) => {
        const run = async () => {
          this._pendingCount++;
          this._intervalCount++;
          try {
            const operation = this._timeout === void 0 && options.timeout === void 0 ? fn() : p_timeout_1.default(Promise.resolve(fn()), options.timeout === void 0 ? this._timeout : options.timeout, () => {
              if (options.throwOnTimeout === void 0 ? this._throwOnTimeout : options.throwOnTimeout) {
                reject(timeoutError);
              }
              return void 0;
            });
            resolve(await operation);
          } catch (error) {
            reject(error);
          }
          this._next();
        };
        this._queue.enqueue(run, options);
        this._tryToStartAnother();
        this.emit("add");
      });
    }
    async addAll(functions, options) {
      return Promise.all(functions.map(async (function_) => this.add(function_, options)));
    }
    start() {
      if (!this._isPaused) {
        return this;
      }
      this._isPaused = false;
      this._processQueue();
      return this;
    }
    pause() {
      this._isPaused = true;
    }
    clear() {
      this._queue = new this._queueClass();
    }
    async onEmpty() {
      if (this._queue.size === 0) {
        return;
      }
      return new Promise((resolve) => {
        const existingResolve = this._resolveEmpty;
        this._resolveEmpty = () => {
          existingResolve();
          resolve();
        };
      });
    }
    async onIdle() {
      if (this._pendingCount === 0 && this._queue.size === 0) {
        return;
      }
      return new Promise((resolve) => {
        const existingResolve = this._resolveIdle;
        this._resolveIdle = () => {
          existingResolve();
          resolve();
        };
      });
    }
    get size() {
      return this._queue.size;
    }
    sizeBy(options) {
      return this._queue.filter(options).length;
    }
    get pending() {
      return this._pendingCount;
    }
    get isPaused() {
      return this._isPaused;
    }
    get timeout() {
      return this._timeout;
    }
    set timeout(milliseconds) {
      this._timeout = milliseconds;
    }
  }
  exports.default = PQueue3;
});

// node_modules/repeat-string/index.js
var require_repeat_string = __commonJS((exports, module2) => {
  /*!
   * repeat-string <https://github.com/jonschlinkert/repeat-string>
   *
   * Copyright (c) 2014-2015, Jon Schlinkert.
   * Licensed under the MIT License.
   */
  "use strict";
  var res = "";
  var cache;
  module2.exports = repeat;
  function repeat(str2, num) {
    if (typeof str2 !== "string") {
      throw new TypeError("expected a string");
    }
    if (num === 1)
      return str2;
    if (num === 2)
      return str2 + str2;
    var max = str2.length * num;
    if (cache !== str2 || typeof cache === "undefined") {
      cache = str2;
      res = "";
    } else if (res.length >= max) {
      return res.substr(0, max);
    }
    while (max > res.length && num > 1) {
      if (num & 1) {
        res += str2;
      }
      num >>= 1;
      str2 += str2;
    }
    res += str2;
    res = res.substr(0, max);
    return res;
  }
});

// node_modules/markdown-table/index.js
var require_markdown_table = __commonJS((exports, module2) => {
  "use strict";
  var repeat = require_repeat_string();
  module2.exports = markdownTable;
  var trailingWhitespace = / +$/;
  var space = " ";
  var lineFeed = "\n";
  var dash = "-";
  var colon = ":";
  var verticalBar = "|";
  var x = 0;
  var C = 67;
  var L = 76;
  var R = 82;
  var c = 99;
  var l = 108;
  var r = 114;
  function markdownTable(table2, options) {
    var settings = options || {};
    var padding = settings.padding !== false;
    var start = settings.delimiterStart !== false;
    var end = settings.delimiterEnd !== false;
    var align = (settings.align || []).concat();
    var alignDelimiters = settings.alignDelimiters !== false;
    var alignments = [];
    var stringLength = settings.stringLength || defaultStringLength;
    var rowIndex = -1;
    var rowLength = table2.length;
    var cellMatrix = [];
    var sizeMatrix = [];
    var row = [];
    var sizes = [];
    var longestCellByColumn = [];
    var mostCellsPerRow = 0;
    var cells;
    var columnIndex;
    var columnLength;
    var largest;
    var size;
    var cell;
    var lines;
    var line;
    var before;
    var after;
    var code;
    while (++rowIndex < rowLength) {
      cells = table2[rowIndex];
      columnIndex = -1;
      columnLength = cells.length;
      row = [];
      sizes = [];
      if (columnLength > mostCellsPerRow) {
        mostCellsPerRow = columnLength;
      }
      while (++columnIndex < columnLength) {
        cell = serialize(cells[columnIndex]);
        if (alignDelimiters === true) {
          size = stringLength(cell);
          sizes[columnIndex] = size;
          largest = longestCellByColumn[columnIndex];
          if (largest === void 0 || size > largest) {
            longestCellByColumn[columnIndex] = size;
          }
        }
        row.push(cell);
      }
      cellMatrix[rowIndex] = row;
      sizeMatrix[rowIndex] = sizes;
    }
    columnIndex = -1;
    columnLength = mostCellsPerRow;
    if (typeof align === "object" && "length" in align) {
      while (++columnIndex < columnLength) {
        alignments[columnIndex] = toAlignment(align[columnIndex]);
      }
    } else {
      code = toAlignment(align);
      while (++columnIndex < columnLength) {
        alignments[columnIndex] = code;
      }
    }
    columnIndex = -1;
    columnLength = mostCellsPerRow;
    row = [];
    sizes = [];
    while (++columnIndex < columnLength) {
      code = alignments[columnIndex];
      before = "";
      after = "";
      if (code === l) {
        before = colon;
      } else if (code === r) {
        after = colon;
      } else if (code === c) {
        before = colon;
        after = colon;
      }
      size = alignDelimiters ? Math.max(1, longestCellByColumn[columnIndex] - before.length - after.length) : 1;
      cell = before + repeat(dash, size) + after;
      if (alignDelimiters === true) {
        size = before.length + size + after.length;
        if (size > longestCellByColumn[columnIndex]) {
          longestCellByColumn[columnIndex] = size;
        }
        sizes[columnIndex] = size;
      }
      row[columnIndex] = cell;
    }
    cellMatrix.splice(1, 0, row);
    sizeMatrix.splice(1, 0, sizes);
    rowIndex = -1;
    rowLength = cellMatrix.length;
    lines = [];
    while (++rowIndex < rowLength) {
      row = cellMatrix[rowIndex];
      sizes = sizeMatrix[rowIndex];
      columnIndex = -1;
      columnLength = mostCellsPerRow;
      line = [];
      while (++columnIndex < columnLength) {
        cell = row[columnIndex] || "";
        before = "";
        after = "";
        if (alignDelimiters === true) {
          size = longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0);
          code = alignments[columnIndex];
          if (code === r) {
            before = repeat(space, size);
          } else if (code === c) {
            if (size % 2 === 0) {
              before = repeat(space, size / 2);
              after = before;
            } else {
              before = repeat(space, size / 2 + 0.5);
              after = repeat(space, size / 2 - 0.5);
            }
          } else {
            after = repeat(space, size);
          }
        }
        if (start === true && columnIndex === 0) {
          line.push(verticalBar);
        }
        if (padding === true && !(alignDelimiters === false && cell === "") && (start === true || columnIndex !== 0)) {
          line.push(space);
        }
        if (alignDelimiters === true) {
          line.push(before);
        }
        line.push(cell);
        if (alignDelimiters === true) {
          line.push(after);
        }
        if (padding === true) {
          line.push(space);
        }
        if (end === true || columnIndex !== columnLength - 1) {
          line.push(verticalBar);
        }
      }
      line = line.join("");
      if (end === false) {
        line = line.replace(trailingWhitespace, "");
      }
      lines.push(line);
    }
    return lines.join(lineFeed);
  }
  function serialize(value) {
    return value === null || value === void 0 ? "" : String(value);
  }
  function defaultStringLength(value) {
    return value.length;
  }
  function toAlignment(value) {
    var code = typeof value === "string" ? value.charCodeAt(0) : x;
    return code === L || code === l ? l : code === R || code === r ? r : code === C || code === c ? c : x;
  }
});

// src/index.ts
const core2 = __toModule(require_core());
const lodash2 = __toModule(require_lodash());

// src/rules.ts
const fast_glob = __toModule(require_out4());
const path2 = __toModule(require("path"));

// src/environment.ts
const path = __toModule(require("path"));
const envalid = __toModule(require_envalid());
const environment = () => envalid.default.cleanEnv(process.env, {
  GITHUB_EVENT_PATH: envalid.str({
    devDefault: envalid.testOnly("__mocks__/event.json")
  }),
  GITHUB_WORKSPACE: envalid.str({
    devDefault: envalid.testOnly(path.join(__dirname, ".."))
  }),
  GITHUB_EVENT_NAME: envalid.str({devDefault: "pull_request"}),
  GITHUB_REPOSITORY: envalid.str({devDefault: envalid.testOnly("someRepo")}),
  GITHUB_SHA: envalid.str({
    devDefault: envalid.testOnly("ffac537e6cbbf934b08745a378932722df287a53")
  }),
  TASK_ID: envalid.str({default: "use-herald-action"})
}, {dotEnvPath: null});
const env = environment();

// src/rules.ts
const minimatch = __toModule(require_minimatch());
const jsonpath = __toModule(require_jsonpath());

// src/util/constants.ts
const maxPerPage = 100;
const OUTPUT_NAME = "appliedRules";
const FILE_ENCODING = "utf8";
const STATUS_DESCRIPTION_COPY = "You can see the rule by clicking on Details";
const COMBINED_TAG_KEY = "_combined";
const LINE_BREAK = "<br/>";
const USE_HERALD_ACTION_TAG_REGEX = /^<!-- USE_HERALD_ACTION (.*) -->$/;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var CommitStatus;
(function(CommitStatus2) {
  CommitStatus2["SUCCESS"] = "success";
  CommitStatus2["FAILURE"] = "failure";
})(CommitStatus || (CommitStatus = {}));
var SUPPORTED_EVENT_TYPES;
(function(SUPPORTED_EVENT_TYPES2) {
  SUPPORTED_EVENT_TYPES2["PULL_REQUEST"] = "pull_request";
  SUPPORTED_EVENT_TYPES2["PULL_REQUEST_TARGET"] = "pull_request_target";
  SUPPORTED_EVENT_TYPES2["push"] = "push";
})(SUPPORTED_EVENT_TYPES || (SUPPORTED_EVENT_TYPES = {}));
var AllowedHttpErrors;
(function(AllowedHttpErrors2) {
  AllowedHttpErrors2[AllowedHttpErrors2["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
})(AllowedHttpErrors || (AllowedHttpErrors = {}));
var HttpErrors;
(function(HttpErrors2) {
  HttpErrors2[HttpErrors2["RESOURCE_NOT_ACCESSIBLE"] = 403] = "RESOURCE_NOT_ACCESSIBLE";
  HttpErrors2[HttpErrors2["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(HttpErrors || (HttpErrors = {}));

// src/util/loadJSONFile.ts
const fs = __toModule(require("fs"));
const loadJSONFile = (filePath) => {
  const file = fs.readFileSync(filePath, {encoding: FILE_ENCODING});
  const content = JSON.parse(file);
  return content;
};

// src/util/debug.ts
const debug = __toModule(require_src());
const core = __toModule(require_core());
var _a;
const DEBUG = (_a = core.getInput("DEBUG")) != null ? _a : false;
if (DEBUG) {
  console.log("debug is enabled, provided pattern:", DEBUG);
}
function logger(nameSpace) {
  const {TASK_ID} = env;
  const log = debug.default(`${TASK_ID}:${nameSpace}`);
  log.log = console.log.bind(console);
  if (DEBUG) {
    log.enabled = true;
  }
  return log;
}

// src/util/makeArray.ts
const makeArray = (field) => field && Array.isArray(field) ? field : [field].filter(Boolean);

// src/rules.ts
const debug4 = logger("rules");
var RuleActors;
(function(RuleActors2) {
  RuleActors2["users"] = "users";
  RuleActors2["teams"] = "teams";
})(RuleActors || (RuleActors = {}));
var RuleExtras;
(function(RuleExtras2) {
  RuleExtras2["customMessage"] = "customMessage";
  RuleExtras2["name"] = "name";
  RuleExtras2["errorLevel"] = "errorLevel";
  RuleExtras2["labels"] = "labels";
  RuleExtras2["description"] = "description";
  RuleExtras2["targetURL"] = "targetURL";
})(RuleExtras || (RuleExtras = {}));
var RuleMatchers;
(function(RuleMatchers2) {
  RuleMatchers2["includesInPatch"] = "includesInPatch";
  RuleMatchers2["eventJsonPath"] = "eventJsonPath";
  RuleMatchers2["includes"] = "includes";
})(RuleMatchers || (RuleMatchers = {}));
var RuleActions;
(function(RuleActions2) {
  RuleActions2["comment"] = "comment";
  RuleActions2["review"] = "review";
  RuleActions2["status"] = "status";
  RuleActions2["assign"] = "assign";
  RuleActions2["label"] = "label";
})(RuleActions || (RuleActions = {}));
var ErrorLevels;
(function(ErrorLevels2) {
  ErrorLevels2["none"] = "none";
  ErrorLevels2["error"] = "error";
})(ErrorLevels || (ErrorLevels = {}));
const sanitize = (content) => {
  const attrs = {...RuleMatchers, ...RuleActors, ...RuleExtras};
  const rule = ["action", ...Object.keys(attrs)].reduce((memo, attr) => {
    return content[attr] ? {...memo, [attr]: content[attr]} : memo;
  }, {});
  return {
    ...rule,
    users: rule.users ? rule.users : [],
    teams: rule.teams ? rule.teams : [],
    includes: makeArray(rule.includes),
    excludes: makeArray(rule.excludes),
    includesInPatch: makeArray(rule.includesInPatch),
    eventJsonPath: makeArray(rule.eventJsonPath)
  };
};
const hasAttribute = (attr, content) => attr in content;
const isValidRawRule = (content) => {
  if (typeof content !== "object" || content === null) {
    return false;
  }
  const hasValidActionValues = hasAttribute("action", content) && Object.keys(RuleActions).includes(content.action);
  const hasTeams = hasAttribute("teams", content) && Array.isArray(content.teams);
  const hasUsers = hasAttribute("users", content) && Array.isArray(content.users);
  const hasActors = hasTeams || hasUsers || hasAttribute("customMessage", content) && !!content.customMessage && content.action === RuleActions.comment || hasAttribute("labels", content) && !!content.labels && content.action === RuleActions.label || hasAttribute("action", content) && content.action === RuleActions.status;
  const matchers2 = Object.keys(RuleMatchers).some((attr) => attr in content);
  debug4("validation:", {
    rule: content,
    hasActors,
    hasValidActionValues,
    matchers: matchers2
  });
  return hasValidActionValues && hasActors && matchers2;
};
const loadRules = (rulesLocation) => {
  const matches = fast_glob.sync(rulesLocation, {
    onlyFiles: true,
    cwd: env.GITHUB_WORKSPACE,
    absolute: true
  });
  debug4("files found:", matches);
  const rules3 = matches.reduce((memo, filePath) => {
    try {
      const rule = loadJSONFile(filePath);
      return isValidRawRule(rule) ? [...memo, {name: path2.basename(filePath), ...sanitize(rule), path: filePath}] : memo;
    } catch (e) {
      console.error(`${filePath} can't be parsed, it will be ignored`);
      return memo;
    }
  }, []);
  return rules3;
};
const handleIncludeExcludeFiles = ({includes, excludes, fileNames}) => {
  debug4("includeExcludeFiles...");
  let results = [];
  if (includes == null ? void 0 : includes.length) {
    results = includes.reduce((memo, include) => {
      const matches = minimatch.default.match(fileNames, include, {matchBase: true});
      return [...memo, ...matches];
    }, []);
    results = [...new Set(results)];
    debug4("includes matches", {results, includes});
    if ((excludes == null ? void 0 : excludes.length) && results.length) {
      const toExclude = excludes.reduce((memo, exclude) => {
        const matches = minimatch.default.match(results, exclude, {matchBase: true});
        return [...memo, ...matches];
      }, []);
      results = results.filter((filename) => !toExclude.includes(filename));
      debug4("excludes matches:", {results, excludes});
    }
  }
  return !!results.length;
};
const handleIncludesInPatch = ({patterns, patch}) => {
  debug4("handleIncludesInPath...");
  const matches = patterns == null ? void 0 : patterns.reduce((memo, pattern) => {
    try {
      const rex = new RegExp(pattern);
      const matches2 = patch == null ? void 0 : patch.find((content) => content.match(rex));
      return matches2 ? [...memo, matches2] : memo;
    } catch (e) {
      debug4(`pattern: ${pattern} failed to parse`, e);
      return memo;
    }
  }, []);
  return !!(matches == null ? void 0 : matches.length);
};
const allRequiredRulesHaveMatched = (rules3, matchingRules) => {
  const requiredRules = rules3.filter((rule) => rule.errorLevel && rule.errorLevel === ErrorLevels.error);
  if (!requiredRules.length) {
    return true;
  }
  const matchingRulesNames = matchingRules.map((rule) => rule.name);
  return requiredRules.every((rule) => matchingRulesNames.includes(rule.name));
};
const handleEventJsonPath = ({event, patterns}) => {
  debug4("eventJsonPath", patterns);
  try {
    let results;
    patterns == null ? void 0 : patterns.find((pattern) => {
      const matches = jsonpath.default.query(event, pattern);
      if (matches.length) {
        results = matches;
      }
      return matches.length;
    });
    debug4("eventJSONPath matches:", results);
    return !!results;
  } catch (e) {
    debug4("eventJsonPath:Error:", e);
  }
  return false;
};
const matchers = {
  [RuleMatchers.includes]: (rule, {fileNames}) => handleIncludeExcludeFiles({includes: rule.includes, excludes: rule.excludes, fileNames}),
  [RuleMatchers.eventJsonPath]: (rule, {event}) => handleEventJsonPath({patterns: rule.eventJsonPath, event}),
  [RuleMatchers.includesInPatch]: (rule, {patch}) => handleIncludesInPatch({patterns: rule.includesInPatch, patch})
};
const isMatch = (rule, options) => {
  const keyMatchers = Object.keys(RuleMatchers);
  const matches = keyMatchers.filter((matcher) => {
    var _a2;
    return (_a2 = rule[matcher]) == null ? void 0 : _a2.length;
  }).map((matcher) => matchers[matcher](rule, options));
  debug4("isMatch:", {rule, matches});
  return matches.length ? matches.every((match) => match === true) : false;
};
const getMatchingRules = (rules3, files, event, patchContent) => {
  const fileNames = files.map(({filename}) => filename);
  const matchingRules = rules3.reduce((memo, rule) => {
    if (isMatch(rule, {event, patch: patchContent, fileNames})) {
      return [...memo, {...rule, matched: true}];
    } else {
      return memo;
    }
  }, []);
  return matchingRules;
};

// src/index.ts
const rest = __toModule(require_dist_node12());

// src/util/catchHandler.ts
const catchHandler = (debug19) => (error) => {
  if (Object.values(AllowedHttpErrors).includes(error.status)) {
    debug19(`Request failed with status ${error.status}, We do not consider this a fatal error`, error);
    return Promise.resolve({});
  }
  debug19("Request Failed", error);
  return Promise.reject(error);
};

// src/assignees.ts
const debug6 = logger("assignees");
const handleAssignees = async (client, {owner, repo, prNumber, matchingRules}) => {
  debug6("handleAssignees called with:", matchingRules);
  const assignees2 = matchingRules.reduce((memo, rule) => {
    return [...memo, ...rule.users.map((user) => user.replace("@", ""))];
  }, []);
  debug6("assignees found:", assignees2);
  return client.issues.addAssignees({
    owner,
    repo,
    issue_number: prNumber,
    assignees: assignees2
  }).catch(catchHandler(debug6));
};

// src/labels.ts
const debug8 = logger("labels");
const handleLabels = async (client, {owner, repo, prNumber, matchingRules}) => {
  debug8("called with:", matchingRules);
  const labels2 = matchingRules.filter(({labels: labels3}) => labels3).reduce((memo, {labels: labels3}) => [...memo, ...makeArray(labels3)], []);
  debug8("labels", labels2);
  if (!labels2.length) {
    debug8("no labels where found");
    return void 0;
  }
  const result = client.issues.addLabels({
    owner,
    repo,
    issue_number: prNumber,
    labels: labels2
  }).catch(catchHandler(debug8));
  debug8("result:", result);
  return result;
};

// src/reviewers.ts
const debug10 = logger("reviewers");
const sanitizeTeam = (team) => {
  const splitTeam = team.replace("@", "").split("/");
  return splitTeam[splitTeam.length - 1];
};
const handleReviewers = async (client, {owner, repo, prNumber, matchingRules}) => {
  debug10("handleReviewers called with:", matchingRules);
  const {reviewers: reviewers2, teamReviewers} = matchingRules.reduce((memo, rule) => {
    const reviewers3 = [...memo.reviewers, ...rule.users.map((user) => user.replace("@", ""))];
    const teamReviewers2 = [...memo.teamReviewers, ...rule.teams.map(sanitizeTeam)];
    return {reviewers: reviewers3, teamReviewers: teamReviewers2};
  }, {reviewers: [], teamReviewers: []});
  const result = await client.pulls.requestReviewers({
    owner,
    repo,
    pull_number: prNumber,
    reviewers: reviewers2,
    team_reviewers: teamReviewers
  }).catch(catchHandler(debug10));
  debug10("result:", result);
  return result;
};

// src/statuses.ts
const p_queue = __toModule(require_dist());

// src/util/getBlobURL.ts
const debug12 = logger("getBlobURL");
const getBlobURL = (filename, files, owner, repo, base) => {
  const baseBlobPath = `https://github.com/${owner}/${repo}/blob`;
  debug12("getBlobURL", filename, files, baseBlobPath, base);
  const file = files.find((file2) => filename.match(file2.filename));
  return file ? file.blob_url : `${baseBlobPath}/${base}/${filename.replace(`${env.GITHUB_WORKSPACE}/`, "")}`;
};

// src/statuses.ts
const debug14 = logger("statuses");
const handleStatus = async (client, {owner, repo, matchingRules, rules: rules3, base, sha, files}, requestConcurrency = 1) => {
  debug14("called with:", matchingRules.map((rule) => rule.path));
  const queue = new p_queue.default({concurrency: requestConcurrency});
  const statusActionRules = rules3.filter(({action}) => action == RuleActions.status);
  const statuses2 = statusActionRules.map((rule) => ({
    owner,
    repo,
    sha,
    context: `Herald \u203A ${rule.name}`,
    description: rule.description ? rule.description : STATUS_DESCRIPTION_COPY,
    target_url: rule.targetURL ? rule.targetURL : getBlobURL(rule.path, files, owner, repo, base),
    state: matchingRules.find((matchingRule) => matchingRule.path === rule.path) ? CommitStatus.SUCCESS : CommitStatus.FAILURE
  }));
  debug14("statuses", statuses2);
  const result = await Promise.all(statuses2.map((status) => queue.add(() => client.repos.createCommitStatus(status)))).catch(catchHandler(debug14));
  debug14("result:", result);
  return result;
};

// src/comment.ts
const lodash = __toModule(require_lodash());
const markdown_table = __toModule(require_markdown_table());
const p_queue2 = __toModule(require_dist());
const debug16 = logger("comment");
var TypeOfComments;
(function(TypeOfComments2) {
  TypeOfComments2["standalone"] = "standalone";
  TypeOfComments2["combined"] = "combined";
})(TypeOfComments || (TypeOfComments = {}));
const formatUser = (handleOrEmail) => {
  return EMAIL_REGEX.test(handleOrEmail.toLowerCase()) ? handleOrEmail : `@${handleOrEmail}`;
};
const tagComment = (body, path3) => `<!-- USE_HERALD_ACTION ${path3} -->
${body}`;
const commentTemplate = (mentions) => `
   <details open>

   <summary> Hi there, given these changes, Herald thinks that these users should take a look! </summary>

   ${markdown_table.default([
  ["Rule", "Mention"],
  ...mentions.map(({rule, URL, mentions: mentions2}) => [
    `[${rule.replace(`${env.GITHUB_WORKSPACE}/`, "")}](${URL})`,
    mentions2.map((user) => formatUser(user)).join(LINE_BREAK)
  ])
], {align: ["l", "c"]})}

  </details>
  `;
const composeCommentsForUsers = (matchingRules) => {
  const groups = lodash.default(matchingRules, (rule) => rule.customMessage ? TypeOfComments.standalone : TypeOfComments.combined);
  let comments = {};
  if (groups[TypeOfComments.combined]) {
    const mentions = groups[TypeOfComments.combined].reduce((memo, {name, path: path3, users, teams, blobURL}) => memo.concat({URL: blobURL, rule: name || path3, mentions: [...users, ...teams]}), []);
    comments = {...comments, [COMBINED_TAG_KEY]: commentTemplate([...new Set(mentions)])};
  }
  if (groups[TypeOfComments.standalone]) {
    const customMessages = groups[TypeOfComments.standalone].filter((rule) => rule.customMessage).reduce((memo, {path: path3, customMessage}) => ({...memo, [path3]: customMessage}), {});
    comments = {...comments, ...customMessages};
  }
  return comments;
};
const getAllComments = async (client, params) => {
  const page = 1;
  const {data: comments} = await client.issues.listComments({
    ...params,
    per_page: maxPerPage,
    page
  });
  if (comments.length < maxPerPage) {
    return comments;
  } else {
    const {data: moreComments} = await client.issues.listComments({
      ...params,
      page: page + 1,
      per_page: maxPerPage
    });
    return [...comments, ...moreComments];
  }
};
const handleComment = async (client, {owner, repo, prNumber, matchingRules, files, base}, requestConcurrency = 1) => {
  debug16("handleComment called with:", matchingRules);
  const queue = new p_queue2.default({concurrency: requestConcurrency});
  const rulesWithBlobURL = matchingRules.map((mRule) => ({
    ...mRule,
    blobURL: getBlobURL(mRule.path, files, owner, repo, base)
  }));
  const commentsFromRules = composeCommentsForUsers(rulesWithBlobURL);
  debug16("comments from matching rules:", commentsFromRules);
  const rawComments = await getAllComments(client, {
    owner,
    repo,
    issue_number: prNumber
  });
  const useHeraldActionComments = rawComments.reduce((memo, comment2) => {
    const pathMatch = USE_HERALD_ACTION_TAG_REGEX.exec(comment2.body.split("\n")[0]);
    return pathMatch ? {...memo, [pathMatch[1]]: comment2} : memo;
  }, {});
  debug16("existing UHA comments:", useHeraldActionComments);
  const updateCommentPromises = Object.keys(commentsFromRules).filter((key) => key in useHeraldActionComments).map((key) => {
    const comment_id = useHeraldActionComments[key].id;
    const body = tagComment(commentsFromRules[key], key);
    return queue.add(() => client.issues.updateComment({
      owner,
      repo,
      comment_id,
      body
    }));
  });
  const createCommentPromises = Object.keys(commentsFromRules).filter((key) => !(key in useHeraldActionComments)).map((key) => {
    const body = tagComment(commentsFromRules[key], key);
    return queue.add(() => client.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body
    }));
  });
  return Promise.all([...updateCommentPromises, ...createCommentPromises]).catch(catchHandler(debug16));
};

// src/util/isEventSupported.ts
const isEventSupported = (event) => {
  return Object.values(SUPPORTED_EVENT_TYPES).some((e) => event === e);
};

// src/index.ts
const debug18 = logger("index");
const EnhancedOctokit = rest.Octokit;
var Props;
(function(Props2) {
  Props2["GITHUB_TOKEN"] = "GITHUB_TOKEN";
  Props2["rulesLocation"] = "rulesLocation";
  Props2["dryRun"] = "dryRun";
  Props2["base"] = "base";
})(Props || (Props = {}));
const actionsMap = {
  [RuleActions.status]: handleStatus,
  [RuleActions.comment]: handleComment,
  [RuleActions.assign]: handleAssignees,
  [RuleActions.review]: handleReviewers,
  [RuleActions.label]: handleLabels
};
const getParams = () => {
  return Object.keys(Props).reduce((memo, prop) => {
    const value = core2.getInput(prop);
    return value ? {...memo, [prop]: value} : memo;
  }, {});
};
const main = async () => {
  try {
    if (isEventSupported(env.GITHUB_EVENT_NAME)) {
      const event = loadJSONFile(env.GITHUB_EVENT_PATH);
      const {
        pull_request: {
          head: {sha: headSha},
          base: {sha: baseSha}
        },
        number: prNumber,
        repository: {
          name: repo,
          owner: {login: owner}
        }
      } = event;
      const {GITHUB_TOKEN, rulesLocation, base = baseSha, dryRun} = getParams();
      debug18("params:", {rulesLocation, base, dryRun});
      if (!rulesLocation) {
        const message = `${Props.rulesLocation} is required`;
        core2.setFailed(message);
        throw new Error(message);
      }
      const rules3 = loadRules(rulesLocation);
      debug18("loaded rules and locations", {
        rules: rules3,
        dir: env.GITHUB_WORKSPACE,
        rulesLocation
      });
      const client = new EnhancedOctokit({auth: GITHUB_TOKEN});
      const {
        data: {files}
      } = await client.repos.compareCommits({
        base,
        head: headSha,
        owner,
        repo
      });
      const matchingRules = getMatchingRules(rules3, files, event, files.map(({patch}) => patch));
      debug18("matchingRules:", matchingRules);
      if (!allRequiredRulesHaveMatched(rules3, matchingRules)) {
        throw new Error(`Not all Rules with errorLevel set to error have matched. Please double check that these rules apply: ${rules3.filter((rule) => rule.errorLevel && rule.errorLevel === "error").map((rule) => rule.name).join(", ")}`);
      }
      const groupedRulesByAction = lodash2.default(matchingRules, (rule) => rule.action);
      if (dryRun !== "true") {
        debug18("not a dry Run");
        if (matchingRules.length) {
          const groupNames = Object.keys(groupedRulesByAction);
          debug18("groupNames", groupNames);
          await Promise.all(groupNames.map((actionName) => {
            const action = actionsMap[RuleActions[actionName]];
            const options = {
              owner,
              repo,
              prNumber,
              matchingRules: groupedRulesByAction[RuleActions[actionName]],
              rules: rules3,
              sha: headSha,
              base: baseSha,
              files
            };
            return action(client, options);
          })).catch((error) => {
            debug18("We found an error calling GitHub:", error);
            throw error;
          });
        }
      }
      core2.setOutput(OUTPUT_NAME, groupedRulesByAction);
    } else {
      core2.setOutput(OUTPUT_NAME, []);
      throw new Error(`use-herald-action only supports [${Object.values(SUPPORTED_EVENT_TYPES).join(", ")}] events for now, event found: ${env.GITHUB_EVENT_NAME}`);
    }
  } catch (e) {
    core2.setFailed(e.message);
  }
};

// index.ts
main();
