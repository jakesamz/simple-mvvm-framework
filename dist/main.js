/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/compiler.js":
/*!*************************!*\
  !*** ./src/compiler.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Compiler; });\n/* harmony import */ var _watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watcher */ \"./src/watcher.js\");\n\r\n\r\nclass Compiler {\r\n  constructor(context) {\r\n\r\n    //读取模板，并存储下来\r\n    this.context = context;\r\n\r\n    //解析表达式，求值并添加响应的订阅者 watcher\r\n    this.compileNodes(this.context.$el);\r\n\r\n  }\r\n\r\n  compileNodes(dom) {\r\n    if (!dom) {\r\n      return;\r\n    }\r\n    let children = this.excludeNodes(dom);\r\n\r\n    //console.log(children);\r\n\r\n    for (let node of children) {\r\n      //console.log(node.nodeType)\r\n      if (node.nodeType === 1) {\r\n        this.compileElementNode(node);\r\n      } else if (node.nodeType === 3) {\r\n        this.compileTextNode(node);\r\n      }\r\n    }\r\n  }\r\n\r\n  excludeNodes(nodes) {\r\n    return [...nodes.childNodes].filter(node => !this.exclude(node));\r\n  }\r\n\r\n  exclude(node) {\r\n    let regExp = /^[\\t\\n\\r]+/;\r\n    return node.nodeType === 8 || (node.nodeType === 3 && regExp.test(node.textContent))\r\n  }\r\n\r\n  /**\r\n   * 编译文本标签：\r\n   * 1. 解析表达式\r\n   * 2. 运行表达式求值并替换表达式\r\n   * 3. 增加一个订阅者作为监听依赖监听值的改变\r\n   * @param {} node \r\n   */\r\n  compileTextNode(node) {\r\n    const exp = this.parseExp(node.textContent);\r\n\r\n    let watcher = new _watcher__WEBPACK_IMPORTED_MODULE_0__[\"default\"](exp, this.context, function(newValue) {\r\n      node.textContent = newValue;\r\n    }, true)\r\n  }\r\n\r\n  /**\r\n   * 解析表达式 比如 {{msg}} 转换为 (msg)\r\n   * @param {*} exp \r\n   */\r\n  parseExp(exp) {\r\n    // let regExp = /\\{\\{(.+?)\\}\\}/g;\r\n    // const pieces = text.split(regExp);\r\n    // const matches = text.match(regExp);\r\n    return exp.replace('{{', '(').replace('}}', ')');//先用简单的方法实现表达式转换\r\n  }\r\n\r\n\r\n  //指令标签\r\n  compileElementNode(node) {\r\n    this.compileNodes(node);\r\n    //console.log('compile element node', node.textContent);\r\n    const attrs = node.getAttributeNames();\r\n    //console.log(attrs)\r\n    for(let attr of attrs) {\r\n      if(attr.indexOf('v-text') !== -1) {\r\n        //console.log(node.getAttribute(attrs));\r\n        new _watcher__WEBPACK_IMPORTED_MODULE_0__[\"default\"](node.getAttribute(attrs), this.context, (newValue) => {\r\n          node.textContent = newValue;\r\n        }, true);\r\n      }else if(attr.indexOf('v-model') !== -1){\r\n        new _watcher__WEBPACK_IMPORTED_MODULE_0__[\"default\"](node.getAttribute(attrs), this.context, (newValue) => {\r\n          node.value = newValue;\r\n        }, true);\r\n        node.addEventListener('input', (event) => {\r\n          this.context[node.getAttribute(attrs)] = event.target.value;\r\n        })\r\n      }\r\n      \r\n    }\r\n\r\n  }\r\n\r\n\r\n\r\n}\n\n//# sourceURL=webpack:///./src/compiler.js?");

/***/ }),

/***/ "./src/dep.js":
/*!********************!*\
  !*** ./src/dep.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Dep; });\n/* harmony import */ var _watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watcher */ \"./src/watcher.js\");\n\r\n\r\nclass Dep {\r\n\r\n\r\n  constructor(context) {\r\n    this.subs = []; //订阅者 watcher 名单\r\n  }\r\n\r\n  addSub(watcher) {\r\n    this.subs.push(watcher);\r\n  }\r\n\r\n  notify() {\r\n    this.subs.forEach(sub => {\r\n      sub.update();\r\n    })\r\n  }\r\n\r\n  /**\r\n   * 订阅者名单是否包含 watcher\r\n   * @param {} dep \r\n   */\r\n  includes(watcher) {\r\n    return this.subs.includes(watcher);\r\n  }\r\n\r\n}\n\n//# sourceURL=webpack:///./src/dep.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer */ \"./src/observer.js\");\n/* harmony import */ var _compiler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compiler */ \"./src/compiler.js\");\n\r\n\r\n\r\nclass Vue {\r\n\r\n\r\n  constructor(options = {}) {\r\n    \r\n    //得到$el\r\n    this.$el = document.querySelector(options.el);\r\n\r\n    this.$data = options.data();\r\n    this.$methods = options.methods;\r\n    \r\n    //代理数据\r\n    this.proxyData(this.$data);\r\n\r\n    //代理方法\r\n    this.proxyMethods(this.$methods)\r\n\r\n    //劫持数据\r\n    new _observer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this);\r\n\r\n    //解析模板\r\n    new _compiler__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this);\r\n\r\n  }\r\n\r\n  proxyData(data) {\r\n    data = data || {};\r\n    Object.keys(data).forEach(key => {\r\n      Object.defineProperty(this, key, {\r\n        get() {\r\n          return data[key];\r\n        },\r\n        set(newValue) {\r\n          data[key] = newValue;\r\n        }\r\n      })\r\n    })\r\n  }\r\n\r\n  proxyMethods(methods) {\r\n    methods = methods || {};\r\n    Object.keys(methods).forEach(fn => {\r\n      this[fn] = methods[fn].bind(this);\r\n    })\r\n  }\r\n\r\n}\r\n\r\nwindow.Vue = Vue;\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/observer.js":
/*!*************************!*\
  !*** ./src/observer.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Observer; });\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ \"./src/dep.js\");\n\r\n\r\nclass Observer {\r\n\r\n  constructor(context) {\r\n    this.context = context;\r\n    this.data = this.context.$data;\r\n    this.walk(this.data);\r\n  }\r\n\r\n  walk(data) {\r\n    Object.keys(data).forEach(key => {\r\n      //劫持数据\r\n      this.defineReactive(data, key, data[key])\r\n    });\r\n  }\r\n\r\n  defineReactive(data, key, value) {\r\n    let dep = new _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\r\n    Object.defineProperty(data, key, {\r\n\r\n      enumerable: true,\r\n      configurable: false,\r\n      get() {\r\n        //添加依赖\r\n        if(!dep.includes(_dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target)) {//已存在的无需再次添加\r\n          _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target && dep.addSub(_dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target);\r\n        }\r\n        return value;\r\n      },\r\n      set(newValue) {\r\n        value = newValue;\r\n        dep.notify();//通知依赖更新\r\n      }\r\n\r\n    })\r\n  }\r\n\r\n\r\n\r\n}\n\n//# sourceURL=webpack:///./src/observer.js?");

/***/ }),

/***/ "./src/watcher.js":
/*!************************!*\
  !*** ./src/watcher.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Watcher; });\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ \"./src/dep.js\");\n\r\n\r\nvar uid = 0;\r\n\r\n/**\r\n * 订阅者 Watcher\r\n */\r\nclass Watcher {\r\n\r\n  constructor(exp, context, cb, immediate) {\r\n    this.context = context;\r\n    this.exp = exp;\r\n    this.cb = cb;\r\n    this.immediate = immediate;\r\n    this.uid = uid++; //为每个 watcher 设置一个id;\r\n    immediate && this.update();\r\n  }\r\n\r\n  /**\r\n   * 计算指, 并调用属性的 get 方法\r\n   */\r\n  get() {\r\n    _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = this;\r\n    let value = Watcher.computeExp(this.exp, this.context);\r\n    _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = null;\r\n    return value;\r\n  }\r\n\r\n  /**\r\n   * 如果有值更新，通知对应的订阅者更新状态\r\n   */\r\n  update() {\r\n    let value = this.get();\r\n    //console.debug('update value', value)\r\n    this.cb && this.cb.call(this, value);\r\n  }\r\n\r\n  /**\r\n   * 根据表达式求值\r\n   * @param {*} exp \r\n   * @param {*} context \r\n   */\r\n  static computeExp(exp, context) {\r\n    return new Function('with(this){ return ' + exp + '}').call(context);\r\n  }\r\n\r\n}\n\n//# sourceURL=webpack:///./src/watcher.js?");

/***/ })

/******/ });