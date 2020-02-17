# react-useful-package-combination
Combine some useful dependencies to produce a unified DLL file for deployment to support the react project

平时在使用 react 框架开发项目时，总是会提到一个“全家桶”的概念，意思是使用这相关联的一整套技术就可以构建一个完整的 react 生态，那么“全家桶”里，到底包含哪些呢？本项目就是基于此问题思考，对零散的“全家桶”进行整合，通过构建工具生成一个经过编译压缩的 dll 文件在生产环境部署。

理解此项目你需要具有以下的基本知识：

1. nodejs 和 npm 使用
1. webpack、webpack.DllPlugin 和 webpack.DllReferencePlugin 如何使用
1. html-webpack-plugin 是什么？如何使用？
1. react 全家桶
