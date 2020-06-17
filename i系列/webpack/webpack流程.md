loader : 能转换各类资源，并处理成对应模块的加载器。loader 间可以串行使用。
chunk : code splitting后的产物，也就是按需加载的分块，装载了不同的module。
plugin : webpack 的插件实体

# 1. shell 与 config 解析
每次在命令行输入 webpack 后，操作系统都会去调用 `./node_modules/.bin/webpack` 这个 shell 脚本。这个脚本会去调用`./node_modules/webpack/bin/webpack.js` 并追加输入的参数，如 -p , -w 。

## 1.1. optimist
和 commander 一样，optimist 实现了 node 命令行的解析，其 API 调用非常方便。
获取到后缀参数后，optimist 分析参数并以键值对的形式把参数对象保存在 optimist.argv 中.

## 1.2. config 合并与插件加载
在加载插件之前，webpack 将 webpack.config.js 中的各个配置项拷贝到 options 对象中，并加载用户配置在 webpack.config.js 的 plugins 。接着 optimist.argv 会被传入到 `./node_modules/webpack/bin/convert-argv.js` 中，通过判断 argv 中参数的值决定是否去加载对应插件。

options 作为最后返回结果，包含了之后构建阶段所需的重要信息。

这和 webpack.config.js 的配置非常相似，只是多了一些经 shell 传入的插件对象。插件对象一初始化完毕， options 也就传入到了下个流程中。

# 2. 编译与构建流程
在加载配置文件和 shell 后缀参数申明的插件，并传入构建信息 options 对象后，开始整个 webpack 打包最漫长的一步。而这个时候，真正的 webpack 对象才刚被初始化，具体的初始化逻辑在 `lib/webpack.js` 中
webpack 的实际入口是 Compiler 中的 run 方法，run 一旦执行后，就开始了编译和构建流程 ，其中有几个比较关键的 webpack 事件节点。
- compile 开始编译
- make 从入口点分析模块及其依赖的模块，创建这些模块对象
- build-module 构建模块
- after-compile 完成构建
- seal 封装构建结果
- emit 把各个chunk输出到结果文件
- after-emit 完成输出

## 2.1. 核心对象 Compilation
compiler.run 后首先会触发 compile ，这一步会构建出 Compilation 对象:
这个对象有两个作用，
一是负责组织整个打包过程，包含了每个构建环节及输出环节所对应的方法，比较关键的步骤，如 addEntry() , _addModuleChain() , buildModule() , seal() , createChunkAssets() (在每一个节点都会触发 webpack 事件(hook)去调用各插件)。
二是该对象内部存放着所有 module ，chunk，生成的 asset 以及用来生成最后打包文件的 template 的信息。

## 2.2. 编译与构建主流程
在创建 module 之前，Compiler 会触发 make，并调用 Compilation.addEntry 方法，通过 options 对象的 entry 字段找到我们的入口js文件。之后，在 addEntry 中调用私有方法 _addModuleChain ，这个方法主要做了两件事情。
一是根据模块的类型获取对应的模块工厂并创建模块;
二是构建模块。

而构建模块作为最耗时的一步，又可细化为三步:

### 2.2.1. 调用各 loader 处理模块之间的依赖
webpack 提供的一个很大的便利就是能将所有资源都整合成模块，不仅仅是 js 文件。所以需要一些 loader ，比如 url-loader ，jsx-loader ， css-loader 等等来让我们可以直接在源文件中引用各类资源。webpack 调用 doBuild() ，对每一个 require() 用对应的 loader 进行加工，最后生成一个 js module。

### 2.2.2. 调用 acorn 解析经 loader 处理后的源文件生成抽象语法树 AST

### 2.2.3. 遍历 AST，构建该模块所依赖的模块
对于当前模块，或许存在着多个依赖模块。当前模块会开辟一个依赖模块的数组，在遍历 AST 时，将 require() 中的模块通过addDependency() 添加到数组中。
当前模块构建完成后，webpack 调用 processModuleDependencies 开始递归处理依赖的 module，接着就会重复之前的构建步骤。

## 2.3. 构建细节
module 是 webpack 构建的核心实体，也是所有 module的 父类，它有几种不同子类：NormalModule , MultiModule ,ContextModule , DelegatedModule 等。
但这些核心实体都是在构建中都会去调用对应方法，也就是 build() 。

对于每一个 module ，它都会有这样一个构建方法。当然，它还包括了从构建到输出的一系列的有关 module 生命周期的函数.
无论是构建流程，处理依赖流程，包括后面的封装流程都是与 module 密切相关的。

# 3. 打包输出
在所有模块及其依赖模块 build 完成后，webpack 会监听 seal 事件调用各插件对构建后的结果进行封装，要逐次对每个 module 和 chunk 进行整理，生成编译后的源码，合并，拆分，生成 hash 。 同时这是我们在开发时进行代码优化和功能添加的关键环节。

## 3.1. 生成最终 assets
在封装过程中，webpack 会调用 Compilation 中的 createChunkAssets 方法进行打包后代码的生成。 

### 3.1.1. 不同的 Template
通过判断是入口 js 还是需要异步加载的 js 来选择不同的模板对象进行封装，入口 js 会采用webpack 事件流的 render 事件来触发 Template类 中的 renderChunkModules() (异步加载的 js 会调用 chunkTemplate 中的 render 方法)。

在 webpack 中有四个 Template 的子类，分别是 MainTemplate.js ， ChunkTemplate.js ，ModuleTemplate.js ，HotUpdateChunkTemplate.js ，前两者先前已大致有介绍，而 ModuleTemplate 是对所有模块进行一个代码生成，HotUpdateChunkTemplate 是对热替换模块的一个处理。

### 3.1.2. 模块封装
模块在封装的时候和它在构建时一样，都是调用各模块类中的方法。封装通过调用 module.source() 来进行各操作，比如说 require() 的替换。

### 3.1.3. 生成 assets
各模块进行 doBlock 后，把 module 的最终代码循环添加到 source 中。一个 source 对应着一个 asset 对象，该对象保存了单个文件的文件名( name )和最终代码( value )。

## 3.2. 输出
最后一步，webpack 调用 Compiler 中的 emitAssets() ，按照 output 中的配置项将文件输出到了对应的 path 中，从而 webpack 整个打包过程结束。要注意的是，若想对结果进行处理，则需要在 emit 触发后对自定义插件进行扩展。

https://www.cnblogs.com/yxy99/p/5852987.html