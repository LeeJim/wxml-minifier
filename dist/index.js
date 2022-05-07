/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 939:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

let assert = (__nccwpck_require__(491).strict);

let handlerCompany = function(type, ...args) {
    if (typeof this.handlers['on' + type] === 'function') {
        this.handlers['on' + type](...args);
    }
};

class WXMLParser {
    constructor(handlers) {
        this.handlers = handlers || {};
    }

    write(source) {
        this.inputs = source;
        this.len = source.length || 0;
        this.pos = 0;
        this.parseNodes();
    }

    getNextChar() {
        return this.inputs[this.pos];
    }

    getNextString(len) {
        return this.inputs.substr(this.pos, len)
    }

    startWiths(str) {
        return this.inputs.substr(this.pos, str.length) === str;
    }

    isEOF() {
        return this.pos >= this.len;
    }

    // consume

    consumeChar() {
        return this.inputs[this.pos++];
    }

    consumeCharIgnoreWhitespace() {
        const text = this.consumeWhitespace()
        // if (text) {
        //     handlerCompany.call(this, 'text', text);
        // }
        return this.inputs[this.pos++];
    }

    consumeWhile(matchFunc, len) {
        let result = '';

        while (!this.isEOF() && matchFunc(len ? this.getNextString(len) : this.getNextChar())) {
            result += this.consumeChar();
        }
        return result;
    }

    consumeWhitespace() {
        return this.consumeWhile((char) => /\s/.test(char));
    }

    // parse
    parseNodes() {
        while (!this.isEOF() && !this.startWiths('</')) {
            this.parseNode();
        }
    }

    parseNode() {
        let nextChar = this.getNextChar();
        switch (nextChar) {
            case '{':
                this.parseTemplate();
                break;
            case '<':
                if (this.startWiths('<!--')) {
                    this.parseComment();
                    return;
                }
                // open tag
                this.parseElement();
                break;
            default:
                this.parseText();
        }
    }

    parseTemplate() {
        assert.ok(this.consumeChar() === '{');
        assert.ok(this.consumeChar() === '{');
        let template = this.consumeWhile((char) => char !== '}');
        handlerCompany.call(this, 'template', template);
        assert.ok(this.consumeChar() === '}');
        assert.ok(this.consumeChar() === '}');
    }

    parseText() {
        let text = this.consumeWhile((char) => /[^<{]/.test(char));
        handlerCompany.call(this, 'text', text);
        return text;
    }

    parseComment() {
        assert.ok(this.consumeChar() === '<');
        assert.ok(this.consumeChar() === '!');
        assert.ok(this.consumeChar() === '-');
        assert.ok(this.consumeChar() === '-');
        let comment = this.consumeWhile((char) => char !== '-' || !this.startWiths('-->'));
        handlerCompany.call(this, 'comment', comment);
        assert.ok(this.consumeChar() === '-');
        assert.ok(this.consumeChar() === '-');
        assert.ok(this.consumeChar() === '>');
        return comment;
    }

    parseElement() {
        // open tag
        assert.ok(this.consumeChar() === '<');
        let tagName = this.parseTagName();
        let attrs = this.parseAttrs();
        let isSelfClosing = false;

        this.consumeWhitespace();
        if (this.getNextChar() === '/') {
            // selfClosing
            isSelfClosing = true;
        }
        handlerCompany.call(this, 'opentag', tagName, attrs, isSelfClosing);
        this.consumeWhile((char) => char !== '>');
        assert.ok(this.consumeChar() === '>');
        if (isSelfClosing) {
            // handlerCompany.call(this, 'closetag', tagName, true);
            return;
        }

        if (tagName === 'wxs') {
            const wxs = this.consumeWhile(str => str !== '</wxs', 5);
            handlerCompany.call(this, 'wxs', wxs);
        } else {
            this.parseNodes();
        }

        assert.ok(this.consumeCharIgnoreWhitespace() === '<');
        assert.ok(this.consumeCharIgnoreWhitespace() === '/');
        let closeTagName = this.parseTagName();
        handlerCompany.call(this, 'closetag', closeTagName, false);
        assert.ok(this.consumeCharIgnoreWhitespace() === '>');
    }

    parseTagName() {
        return this.consumeWhile((char) => /[\w-]/.test(char));
    }

    parseAttrs() {
        this.consumeWhitespace();
        let attrs = {};
        while (/[^/>]/.test(this.getNextChar())) {
            let key = this.consumeWhile((char) => /[^=/>\s]/.test(char));
            this.consumeWhitespace();
            if (this.getNextChar() !== '=') {
                attrs[key] = '';
                continue;
            }
            assert.ok(this.consumeChar() === '=');
            this.consumeWhitespace();
            let quoteMark = this.consumeChar(); // single or double quote marks
            assert.ok(/['"]/.test(quoteMark));
            let val = this.consumeWhile((char) => char !== quoteMark);
            assert.ok(this.consumeChar() === quoteMark);
            attrs[key] = val;
            this.consumeWhitespace();
        }
        return attrs;
    }
}

module.exports = WXMLParser;


/***/ }),

/***/ 351:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

let WXMLParser = __nccwpck_require__(939);

let defaultConfig = {
    comment: true,
    whitespace: true,
}

let minifier = function(source, options) {
    let str = '';
    let isAllSpace = (str) => /^\s+$/.test(str);

    options = Object.assign({}, defaultConfig, options);
    var parser = new WXMLParser({
        onopentag(name, attribs, isSelfClosing) {
            let attrStr = Object.entries(attribs).map(([key, val]) => val === '' ? key : `${key}="${val.replace(/"/g, '\'')}"`).join(' ');
            let hasAttr = attrStr.length > 0;
            str += `<${name}${hasAttr || isSelfClosing ? ' ' : ''}${attrStr}${isSelfClosing ? '/' : ''}>`;
        },
        oncomment(cmt) {
            if (!options.comment) {
                str += `<!--${cmt}-->`;
            }
        },
        ontemplate(tmp) {
            str += `{{${tmp}}}`;
        },
        ontext(text) {
            if (!options.whitespace) {
                str += text;
                return; 
            }
            if (!isAllSpace(text)) {
                str += text.trim();
            }
        },
        onclosetag(tagname) {
            str += `</${tagname}>`;
        },
        onwxs(wxs) {
            str += wxs;
        }
    });
    parser.write(source);
    return str;
}

module.exports = minifier;

/***/ }),

/***/ 491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(351);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;