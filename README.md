![image](https://user-images.githubusercontent.com/7017290/147433768-424237a5-b136-4cc1-9ea0-e11722fc732b.png)

<p align="center">
    <a><img alt="npm" src="https://img.shields.io/npm/v/wxml-minifier"></a>
    <a><img alt="npm" src="https://img.shields.io/npm/dm/wxml-minifier"></a>
    <a><img alt="NPM" src="https://img.shields.io/npm/l/wxml-minifier"></a>
</p>

# wxml-minifier
微信小程序WXML压缩工具

# 安装

```bash
npm i -D wxml-minifier
```

# 使用

- minifier(resource[, options])

基础使用：

```js
var minifier = require('wxml-minifier')
var wxmlStr = `
<view class="home"         >
<!-- test -->
</view>
`
var minified = minifier(wxmlStr)

console.log(minified) // <view class="home></view>
```

# 选项

- whitespace

    Type: `Boolean`
    Default: `true`
    移除WXML多余的空格

- comment
    Type: `Boolean`
    Default: `true`
    移除所有的注释

- 更多
