---
title: 从零搭建webpack项目
date: 2023-03-15 08:50:50
tags:
  - webpack
---
## 概述
本文基于webpack5.x,pnpm包管理器 从零搭建一个 js 项目的基础开发模板

## 目录
[toc]

## 1. 文件结构
```
├─config
│      ├─ webpack.base.js // webpack 基本配置
│      ├─ webpack.dev.js // webpack 开发环境配置
│      └─ webpack.prod.js // webpack 打包配置
├─public
│      └─index.html // 模板文件
├─src
│   └─index.js // 入口文件
├─.gitignore // git忽略文件配置
├─ package.json
└─ pnpm-lock.yaml
```

## 2. 初始化wepack

### 1. 安装webpack
```bash
pnpm i -D webpack@5.76.2 webpack-cli@5.0.1 webpack-dev-server@4.13.1 webpack-merge@5.8.0
```
### 2. 说明

| 包名      | 作用 |
| ----------- | ----------- |
| webpack      | Title       |
| webpack-cli   | 命令行接口（CLI） |
| webpack-dev-server   | node服务器 |
| webpack-merge   | 用于合并配置  |

### 3. 配置

#### （1）webpack.base.js 公共基本配置
```js
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const resolve = function (dir) {
    return path.resolve(__dirname, dir);
}
module.exports = {
    entry: resolve("../src/index.js"),
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "js/[name].js",
        clean: true, // webpack 5.x 在生成文件之前清空 output 目录
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "../src")
        },
        extensions: [".ts", ".tsx", ".js", ".jsx", ".vue", ".json"]
    },
    plugins: [
        // HTML模板
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../public/index.html")
        }),
        // 配置copy public下的文件
        new CopyPlugin(
            {
              patterns: [
                {
                  from: path.resolve(__dirname, "../public"),
                  to: path.resolve(__dirname, "../dist"),
                  toType: 'dir',
                  noErrorOnMissing: true,
                  globOptions: {
                    // 过滤 index.html
                    ignore: [
                      '**/.DS_Store',
                      path.join(__dirname, "../public/index.html").replace(/\\/g, '/')
                    ]
                  },
                  info: {
                    minimized: true
                  }
                }
              ]
            }
          )
    ],
}
```
#### （2）webpack.dev.js 开发环境配置
```js
const { merge } =  require("webpack-merge");
const base =  require("./webpack.base.js");
const path = require('path');
module.exports = merge(base,{
    mode: 'development',
    devServer: {
        port: 8080,
        static: {
            directory: path.join(__dirname, "../public")
        }
    }
})
```
#### (3) webpack.prod.js 生产环境配置

```js
const { merge } =  require("webpack-merge");
const base =  require("./webpack.base.js");
module.exports = merge(base,{
    mode: 'production'
})
```
#### (4) 修改`package.json` 文件中启动命令
```json
{
  "scripts": {
    "dev": "webpack serve --config ./config/webpack.dev.js",
    "build": "webpack build --config ./config/webpack.prod.js"
  },
}
```

## 3. 添加es6语法支持
## 4. css文件支持
## 5. 媒体文件配置
## 6. 添加typescript支持
## 7. eslint+prettier
## 8. husky