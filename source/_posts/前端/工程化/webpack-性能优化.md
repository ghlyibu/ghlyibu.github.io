---
title: webpack 性能优化
date: 2023-03-15 22:04:52
tags:
  - webpack
---

webpack性能优化目的主要是两个方面：
- 提升开发效率
- 编译后浏览器运行效率

## 提升开发效率

### 一、提⾼webpack的构建速度
#### 1. 开启多进程并行编译loader，利⽤缓存来使得 rebuild 更快
1. happypack （作者已不在更新）
Happypack 只是作用在 loader 上，使用多个进程同时对文件进行编译。
- 安装
```bash
npm install happypack --save-dev
```
- 使用
```js
const HappyPack = require('happypack');
module.exports = {
    ...
    module: {
        rules: [
            test: /\.js$/,
            // use: ['babel-loader?cacheDirectory'] 之前是使用这种方式直接使用 loader
            // 现在用下面的方式替换成 happypack/loader，并使用 id 指定创建的 HappyPack 插件
            use: ['happypack/loader?id=babel'],
            // 排除 node_modules 目录下的文件
            exclude: /node_modules/
        ]
    },
    plugins: [
        ...,
        new HappyPack({
            // 必须配置
            // id 标识符，要和 rules 中指定的 id 对应起来
            id: 'babel',
            // 需要使用的 loader，用法和 rules 中 Loader 配置一样
            // 可以直接是字符串，也可以是对象形式
            loaders: ['babel-loader?cacheDirectory']
        })
    ]
}
```
2. thread-loader (wepack5 官方推荐)
- 安装
```bash
npm install --save-dev thread-loader
```
- 使用,更多使用可参照 [官网](https://www.webpackjs.com/loaders/thread-loader/)
```js
module.exports = {
    ...,
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve('src'),
          use: [
            "thread-loader",
            // 耗时的 loader （例如 babel-loader）
          ],
        },
      ],
    },
};
```
#### 外部扩展(externals)
  通过将稳定的第三⽅库脱离webpack打包，不被打⼊bundle中，从⽽减少打包时间，然后通过script标签引入(cdn也是这种用法),如：
```js
module.exports = {
  //...
  externals: {
    axios: "axios",
    echarts: "echarts"
  },
};

```
如此 `axios` 与 `echarts` 剥离出了依赖模块，然后在html中通过`script`标签引入
```html
<script src="https://cdn.bootcdn.net/ajax/libs/axios/1.3.4/axios.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.4.1/echarts.common.min.js"></script>

```
以下代码认可继续使用，`axios` 与 `echarts` 的值将用检索全局变量来获取
```js
import axios from "axios";
import * as echarts from "echarts";
```
3.  dll
采⽤webpack的 DllPlugin 和 DllReferencePlugin 引⼊dll，让⼀些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间
4.  利⽤缓存
webpack.cache 、babel-loader.cacheDirectory、 HappyPack.cache 都可以利⽤缓存提⾼rebuild效率缩⼩⽂件搜索范围: ⽐如babel-loader插件,如果你的⽂件仅存在于src中,那么可以 include: path.resolve(__dirname,'src') ,当然绝⼤多数情况下这种操作的提升有限，除⾮不⼩⼼build了node_modules⽂件