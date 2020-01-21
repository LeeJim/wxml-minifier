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