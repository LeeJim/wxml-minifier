const minifier = require('../dist')

test('base use', () => {
    const wxml = `
        <view class="home"         >
        <!-- test -->
        </view>
        <wxs module="_"  src="index.wxs" />
        <wxs module="util"> module.exports.format = function() {} </wxs>
    `
    const minWxml = minifier(wxml)
    expect(minWxml).toEqual('<view class="home"></view><wxs module="_" src="index.wxs"/><wxs module="util"> module.exports.format = function() {} </wxs>')
})

test('not value attr', () => {
    const wxml = `<button disabled > Button </button>`
    const minWxml = minifier(wxml)

    expect(minWxml).toEqual('<button disabled>Button</button>')
})

test('template', () => {
    const wxml = `<view>{{ variable }}</view>`
    const minWxml = minifier(wxml)

    expect(minWxml).toEqual('<view>{{ variable }}</view>')
})

test('all options is false', () => {
    const wxml = `<view>{{ variable }}</view>`
    const minWxml = minifier(wxml, {
        whitespace: false,
        comment: false
    })

    expect(minWxml).toEqual('<view>{{ variable }}</view>')
})

test('attribute: only key and with empty string', () => {
    const wxml = `<view disabled name=""></view>`
    const minWxml = minifier(wxml, {
        whitespace: false,
        comment: false
    })
    console.log(minWxml);

    expect(minWxml).toEqual('<view disabled name=""></view>')
})