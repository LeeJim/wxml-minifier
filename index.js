let WXMLParser = require('@leejim/wxml-parser');

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
        }
    });
    parser.write(source);
    return str;
}

module.exports = minifier;