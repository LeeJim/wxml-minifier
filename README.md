![image](https://user-images.githubusercontent.com/7017290/147433768-424237a5-b136-4cc1-9ea0-e11722fc732b.png)

<p align="center">
    <a href="https://www.npmjs.com/package/wxml-minifier"><img alt="npm" src="https://img.shields.io/npm/v/wxml-minifier"></a>
    <a href="https://www.npmjs.com/package/wxml-minifier"><img alt="npm" src="https://img.shields.io/npm/dm/wxml-minifier"></a>
    <a href="https://www.npmjs.com/package/wxml-minifier"><img alt="NPM" src="https://img.shields.io/npm/l/wxml-minifier"></a>
    <a><img alt="coverage" src="./coverage/badge-lines.svg"></a>
</p>

# wxml-minifier

微信小程序 WXML 压缩工具

## 安装

```bash
npm i -D wxml-minifier
```

## 使用

minifier(resource[, options])

### 基础使用

```js
const minifier = require('wxml-minifier')
const wxmlStr = `
<view class="home"         >
<!-- test -->
</view>
`
const minified = minifier(wxmlStr)

console.log(minified) // <view class="home></view>
```

## 选项

 名称 | 类型 | 默认值 | 功能
 :-- | :-- | :-- | :--
whitespace | `Boolean` | `true` | 移除 wxml 多余的空格
comment | `Boolean` | `true` | 移除所有的注释

