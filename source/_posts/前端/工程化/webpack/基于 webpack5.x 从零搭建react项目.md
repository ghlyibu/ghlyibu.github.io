---
title: 基于 webpack5.x 从零搭建react项目
date: 2023-03-15 08:50:50
tags:
  - webpack
---
## 概述
本文基于webpack5.x,pnpm包管理器 从零搭建一个 js 项目的基础开发模板

## 一. 文件结构
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

## 二. 初始化wepack

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

## 三. 添加es6语法兼容支持
### 1. 安装babel
```bash
pnpm i -D babel-loader @babel/core @babel/plugin-transform-runtime @babel/preset-env
```
### 2. 修改配置
1）在根目录创建 `.babelrc`或者`babel.config.js` 文件, 写入配置
```js
{
    "presets": [
      "@babel/preset-env" // 根据配置的目标浏览器或者运行环境，选择对应的语法包，从而将代码进行转换
    ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime", // 作用是减少冗余的代码
        {
          "regenerator": true
        }
      ]
    ]
}
```
修改webpack.base.js 配置
```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader:'babel-loader',
            options: {
              cacheCompression: false,
            }
          }
        ]
      }
    ]
  },
  // ...
}
```
## 四. 添加typescript支持
### 1. 安装typescript依赖
```bash
pnpm i -D typescript @babel/preset-typescript
```
### 2. 修改配置
修改webpack.base.js 配置
```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader:'babel-loader',
            options: {
              cacheCompression: false,
            }
          }
        ]
      }
    ]
  },
  // ...
}
```
修改babel配置
```js
{
    "presets": [
      "@babel/preset-env",
      "@babel/preset-typescript"
    ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          "regenerator": true
        }
      ]
    ]
}
```
创建 `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src"
      ]
    },
    "target": "es2016",
    "jsx": "react-jsx",
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": true,
    "noEmit": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ],
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
```
## 五. react支持
```bash
pnpm i -D react react-dom
```
修改Babel配置
```js
{
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          "regenerator": true
        }
      ]
    ]
}
```
在src/index.tsx，src/App.tsx 文件
src/App.tsx 写入
```tsx
import React from "react";
const App = () => {
  return (
    <div>Webacpk5</div>
  )
}
export default App;
```
src/index.tsx 写入
```tsx
import React from "react";
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
const dom = document.getElementById("root")

const root = ReactDOMClient.createRoot(dom as HTMLElement)
root.render(<App />);
```
修改webpack配置
```js
module.exports = {
  entry: resolve("../src/index.tsx"),
  // ...
}
```
## 六. 媒体文件配置
### todo
## 七. eslint+prettier+husky+jest
### todo