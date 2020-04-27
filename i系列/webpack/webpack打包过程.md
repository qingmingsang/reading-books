https://www.cnblogs.com/yxy99/p/5852987.html

shell 与 config 解析
1. optimist
2. config 合并与插件加载

编译与构建流程
- compile 开始编译
- make 从入口点分析模块及其依赖的模块，创建这些模块对象
- build-module 构建模块
- after-compile 完成构建
- seal 封装构建结果
- emit 把各个chunk输出到结果文件
- after-emit 完成输出

1. 核心对象 Compilation
2. 编译与构建主流程
3. 构建细节

打包输出

1. 生成最终 assets
2. 输出


## Webpack和grunt和gulp 区别
### Grunt
Grunt 的出现早于 Gulp，Gulp 是后起之秀。他们本质都是通过 JavaScript 语法实现了 shell script 命令的一些功能。比如利用 jshint 插件实现 JavaScript 代码格式检查这一功能。早期需要手动在命令行中输入  jshint test.js，而 Grunt 则通过 Gruntfile.js 进行配置
### Gulp
Gulp 吸取了 Grunt 的优点，拥有更简便的写法，通过流（stream）的概念来简化多任务之间的配置和输出，让任务更加简洁和容易上手。Gulp 还是工具链、构建工具，可以配合各种插件做js压缩，css压缩，less编译，替代手工实现自动化工作。通过配置 gulpfile.js 文件来实现，一个简单的 gulpfile.js 配置如下
### browserify
browserify 是早期的模块打包工具，是先驱者，它使得浏览器端使用 CommonJS 规范的格式组织代码成为可能。在这之前，因为 CommonJS 与浏览器特性的不兼容问题，更多使用的是 AMD 规范，当然后来又发展了ES6模块规范
### webpack
webpack 是后起之秀，它支持了 AMD 和 CommonJS 类型，通过 loader 机制也可以使用 ES6 模块格式。还有强大的 code splitting 。webpack 还是文件打包工具，可以把项目的各种js文、css文件等打包合并成一个或多个文件，主要用于模块化方案，预编译模块的方案。webpack 是一个十分强大的工具，它正在向一个全能型的构建工具发展。

### 区别
Gulp 应该和 Grunt比较，他们的区别我就不说了，说说用处吧。Gulp / Grunt 是一种工具，能够优化前端工作流程。比如自动刷新页面、combo、压缩css、js、编译less等等。简单来说，就是使用Gulp/Grunt，然后配置你需要的插件，就可以把以前需要手工做的事情让它帮你做了。

说到 browserify / webpack ，那还要说到 seajs / requirejs 。这四个都是JS模块化的方案。其中seajs / require 是一种类型，browserify / webpack 是另一种类型。

seajs / requirejs：是一种在线“编译”模块的方案，相当于在页面加载一个 CMD/AMD 解释器。这样浏览器就认识了 define、exports、module 这些东西，也就实现了模块化。

browserify / webpack：是一种预编译模块的方案，相比较上面，这个方案更加智能。没用过 browserify，这里以 webpack 为例。首先，它是预编译的，不需要在浏览器中加载解释器。另外，你在本地直接写 JS ，不管是 AMD/CMD/ES6 风格的模块化，它都能认识并且编译成浏览器认识的 JS。

他们的工作方式也有较大区别：
grunt和gulp是基于任务和流（Task、Stream）的。类似jQuery，找到一个（或一类）文件，对其做一系列链式操作，更新流上的数据， 整条链式操作构成了一个任务，多个任务就构成了整个web的构建流程

webpack是基于入口的。会自动地递归解析入口所需要加载的所有资源文件，然后用不同的Loader来处理不同的文件，用Plugin来扩展webpack功能

从构建思路来说，gulp和grunt需要开发者将整个前端构建过程拆分成多个 Task，并合理控制所有 Task的调用关系 ，webpack需要开发者找到入口，并需要清楚对于不同的资源应该使用什么Loader做何种解析和加工


gulp,grunt是web构建工具
webpack是模块化方案
gulp,grunt是基于任务和流
webpack基于入口文件


## 什么是bundle，什么是chunk，什么是module：
bundle是由webpack打包出来的文件，chunk是指webpack在进行模块依赖分析的时候，代码分割出来的代码块，module是开发中的单个模块

## 什么是loader，什么是plugin：
loader是用来告诉webpack如何转化处理某一类型的文件，并且引入到打包出的文件中
plugin是用来自定义webpack打包过程中的方式，一个插件是含有apply方法的一个对象，通过这个方法可以参与到整个webpack打包的各个流程（生命周期）

## webpack-dev-server和http服务器如nginx有什么不同：
？
webpack-dev-server使用内存来存储webpack开发环境下的打包文件，并且可以使用模块热更新，他比传统的http服务器对开发更加简单高效

## 什么是模块热更新：
模块热更新是webpack的一个功能，他可以使得代码修改过后不用刷新浏览器就可以更新，是高级版的自动刷新浏览器（将代码重新执行而不整体刷新浏览器）



