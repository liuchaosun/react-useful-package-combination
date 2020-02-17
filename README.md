[toc]

# react-useful-package-combination

Combine some useful dependencies to produce a unified DLL file for deployment to support the react project

平时在使用 react 框架开发项目时，总是会提到一个“全家桶”的概念，意思是使用这相关联的一整套技术就可以构建一个完整的 react 生态，那么“全家桶”里，到底包含哪些呢？本项目就是基于此问题思考，对零散的“全家桶”进行整合，通过构建工具生成一个经过编译压缩的 dll 文件在生产环境部署。

理解此项目你需要具有以下的基本知识：

1. nodejs 和 npm 使用
1. webpack、webpack.DllPlugin 和 webpack.DllReferencePlugin 如何使用
1. html-webpack-plugin 是什么？如何使用？
1. react 全家桶

## 项目构建的流程

首先，先介绍本项目的构建创立过程，如果你是一个有经验的开发者，或者你仅仅想使用此项目构建后的结果，你可以忽略此部分直接 [查看使用部分](##使用)。

1. 开始，生成 package.json

   ```bash
     npm init -y
   ```

   使用命令生成默认文档，可以按自己想法对生成后的文档进行更改

1. 安装 webpack 和 webpack-cli

   ```bash
     npm install -S webpack webpack-cli
   ```

   本项目采用的构建工具是 webpack,目前此构建工具较为流行且本项目就是基于此工具完成功能目标

1. 安装 react "全家桶"

   ```bash
   npm install -S react react-dom react-router react-router-dom redux react-redux redux-thunk redux-logger
   ```

   - react 是 react 框架的核心依赖
   - react-dom 主要用来解析虚拟 dom 渲染真实 dom
   - react-router react-router-dom 用来管理 react 项目的路由跳转功能，目前仅仅使用 react-router-dom 也可以完成 web 项目的路由设置
   - redux react-redux 围绕着 react 提供全局的状态管理（store），可以方便在任何组件中获取数据
   - redux 提供与 store 的环境有关的 api, 如 Provider， connect。
   - react-redux 提供操作和修改 store 相关的 api, 如 createStore（创建）,combineReducers（整合操作方法），applyMiddleware（集成中间件）
   - redux-thunk 用来支持模块化的 reducers 使用，基于开发人员的开发习惯，很多人喜欢将不同功能的 state 维护在不同的模块中，在使用 createStore 生成 store 时，需要 combineReducers 和 applyMiddleware 一起使用
   - redux-logger 用来打印 store 中的数据变化情况，一般只在开发环境使用

1. 编写 webpack 配置文件 webpack.config.dll.js

   ```javascript
   const path = require("path");
   const webpack = require("webpack");
   const { CleanWebpackPlugin } = require("clean-webpack-plugin");
   module.exports = {
     mode: "production",
     entry: {
       // react-redux 会将 redux 一起带入， react-router-dom 会将 react-router 一起带入
       commonLibrary: [
         "react",
         "react-dom",
         "react-router-dom",
         "react-redux",
         "redux-thunk",
         "redux-logger"
       ]
     },
     output: {
       filename: "[name].dll.js",
       path: path.join(__dirname, "lib"),
       library: "[name]"
     },
     plugins: [
       new CleanWebpackPlugin(),
       new webpack.DllPlugin({
         name: "[name]",
         path: path.join(__dirname, "lib/[name].json")
       })
     ]
   };
   ```

   配置文件中，额外使用了一个插件 clean-webpack-plugin，此插件主要用来对目标目录的清理，以保证每次执行构建后生成的文件都是最新的，安装它

   ```bash
   npm install -S clean-webpack-plugin
   ```

1. 添加 npm scripts

   ```javascript
   "build": "webpack --config webpack.config.dll.js"
   ```

   至此，在控制台使用命令已经可以进行文件构建，执行后会在当前目录下生成新的 lib 目录，其中有两个新的文件 commonLibrary.dll.xxx.js 和 commonLibrary.json

1. 几个重要的解释说明

   ```text
   有几个地方需要解释一下
   1. mode 设置为 production，开启代码压缩
   2. entry 中配置一个数组对象，数组对象的key值即为后面使用的关键值 name
   3. output 中需要制定 library 为 [name] ,目的是对外提供一个统一的变量
   4. DllPlugin 是最主要的插件，用来完成整合这一步操作，output 中配置的文件会生成到 path 位置去，这里生成的对照文件 .json 最好和 整合文件放在一起，json文件用来描述本次整合具体整合了哪些东西
   ```

## 使用

1. 将本项目 clone 到本地

   ```bash
   git clone https://github.com/liuchaosun/react-useful-package-combination.git
   ```

2. 执行 npm install 下载所有依赖

   ```bash
   cd react-useful-package-combination && npm install
   ```

3. 执行 npm run test 检查是否正常生成文件

   ```bash
   npm run test
   ```

4. 将生成的两个文件拷贝到自己项目的 lib 目录中，其中需要设置此目录不经过编译，但是需要保证此目录也在生产部署包中，可以使用 copy-webpack-plugin 完成此功能

5. 生产环境的 webpack 配置中加入插件引入

   ```javascript
   new webpack.DllReferencePlugin({
     manifest: "./lib/commonLibrary.json"
   });
   ```

6. 在模板 html 文件 中正确引入此编译文件 dll.js

   ```javascript
   <script src="./lib/commonLibrary.dll.js"></script>
   ```

## 注意事项

1. 预编译公共基础包配置,使用这种方式可以预先编译出一个不会轻易改动的基础包，如框架代码等,抽取出的公共文件使用 DllPlugin 进行文件描述解释

2. 在需要使用此基础包的项目中使用 DllReferencePlugin 读取这个描述文件,通过描述文件可以知道当前这个基础包内集成了哪些资源,这些资源被集成后统一对外暴露一个入口

3. 当使用项目将要编译某些资源时，会与描述文件中的内容进行对比，如果发现内容存在，则不再进行编译打包,所以需要我们自己手动将基础包引入到 html 中

4. dll 的功能与 splitchunks 的功能有重复的地方，而区别在于 dll 更容易控制,
   并且通过 dll 可以构建出一个包含所有集成项目共同需要的外部资源，方便使用

5. 预编译包也有一个缺陷，那就是在开发模式下不能很好的打印错误日志，此时如果发生错误会报错：

   ```javascript
   Uncaught Error: Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.
   ```

   因此请保证此配置 webpack.DllReferencePlugin 始终仅作用于生产环境
