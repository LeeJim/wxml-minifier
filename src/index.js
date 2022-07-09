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
            let attrStr = attribs.map(item => typeof item === 'string' ? item : `${item.key}="${item.value.replace(/"/g, '\'')}"`).join(' ');
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