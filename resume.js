/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 入口
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _css = __webpack_require__(1);

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var endOfSentence = /[\.\!\?]\s$/;
var commentRegex = /(\/\*(?:[^](?!\/\*))*\*)$/;
var keyRegex = /([a-zA-Z- ^\n]*)$/;
var valueRegex = /([^:]*)$/;
var selectorRegex = /(.*)$/;
var pxRegex = /\dp/;
var pxRegex2 = /p$/;

var Index = function () {
    function Index() {
        var _this = this;

        _classCallCheck(this, Index);

        console.log(_css2.default);
        this.styleDiv = document.querySelector('#style-text');
        this.style = document.querySelector('#style-tag');
        this.styleBuffer = '';
        this.commentFlag = false; // 注释的开始结束的标志
        document.addEventListener('DOMContentLoaded', function () {
            return _this.writeTo(_this.styleDiv, _css2.default, 0, 20, false, 1);
        });
    }

    _createClass(Index, [{
        key: 'writeTo',
        value: function writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval) {
            var _this2 = this;

            var chars = message.slice(index, index + charsPerInterval);
            index = index + charsPerInterval;
            this.writeCSSChar(el, chars, this.style);
            if (index < message.length) {
                var thisInterval = interval;
                var thisSliceChars = message.slice(index - 2, index);
                if (endOfSentence.test(thisSliceChars)) {
                    console.log(thisSliceChars);
                    thisInterval = interval * 50;
                }
                setTimeout(function () {
                    return _this2.writeTo(_this2.styleDiv, _css2.default, index, interval, mirrorToStyle, charsPerInterval);
                }, thisInterval);
            }
        }
    }, {
        key: 'writeChar',
        value: function writeChar(el, chars) {
            el.innerHTML += chars;
        }
    }, {
        key: 'writeCSSChar',
        value: function writeCSSChar(el, char, style) {
            var text = el.innerHTML;
            var htmlStr = this.handleChar(text, char);
            el.innerHTML = htmlStr;
            this.styleBuffer += char;
            if (char === ';') {
                style.textContent += this.styleBuffer;
                this.styleBuffer = '';
            }
        }
    }, {
        key: 'handleChar',
        value: function handleChar(text, char) {
            if (char === '/' && this.commentFlag === false) {
                this.commentFlag = true; // 如果标记为假且碰到「/」则说明注释开始
                text += char;
            } else if (char === '/' && this.commentFlag === true && text.slice(-1) === '*') {
                this.commentFlag = false; // 如果标记为真且碰到「/」则说明注释结束
                // text += char;
                console.log('asdasdasdasd');
                console.log(commentRegex.test(text));
                text = text.replace(commentRegex, '<span class="comment">$1/</span>');
                console.log(text);
            } else if (char !== '/' && this.commentFlag) {
                text += char; // 注释部分的文字
            } else if (char === ':') {
                text = text.replace(keyRegex, '<span class="key">$1</span>:');
            } else if (char === ';') {
                text = text.replace(valueRegex, '<span class="value">$1</span>:');
            } else if (char === '{') {
                text = text.replace(selectorRegex, '<span class="selector">$1</span>{');
            } else if (char === 'x' && pxRegex.test(text.slice(-2))) {
                text = text.replace(pxRegex2, '<span class="value px">px</span>');
            } else {
                text += char;
            }
            return text;
        }
    }]);

    return Index;
}();

exports.default = Index;

new Index();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "/*\n * hello !\n * 我是李彦傧.\n */\n\n* {\n    padding: 0;\n    margin: 0;\n    transition: all 1s;\n}\n\nbody {\n    background-color: #244E6E;\n}\n\n.comment {\n    color: #857F6B;\n    font-style: italic;\n}\n\n/*\n * hello !\n * end\n */\n"

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);