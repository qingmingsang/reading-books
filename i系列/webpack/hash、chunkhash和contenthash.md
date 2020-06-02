# hash -- 编译产生
webpack在实例化的时候会在全局创建一个Tapable子类Compiler, 该实例掌握了初始化配置信息，运行编译入口函数，注册和调用插件等等。
每次编译的时候都会实例化一个对象compilation, 该对象掌控着从编译开始到编译结束文件，模块的加载，封闭，优化，分块，哈希，重建等等都是由其负责， 此时的hash是由compilation来创建的，也就是说每次编译都会创建一个新的hash值, 并且所有文件的hash都是一样的，因为是同一个compilation生成

# chunkhash -- 构建chunk生成
首先, 什么是chunk?

我们知道，每个入口文件都是一个chunk，每个chunk是由入口文件与其依赖所构成，异步加载的文件也被视为是一个chunk, chunkhash是由每次编译模块，根据模块及其依赖模块构成chunk生成对应的chunkhash, 这也就表明了每个chunk的chunkhash值都不一样， 也就是说每个chunk都是独立开来的，互不影响，每个chunk的更新不会影响其他chunk的编译构建

但是, 在打包的时候我们会在js中导入css文件，因为他们是同一个入口文件，如果我只改了js得代码，但是他的css抽取生成css文件时候hash也会跟着变换。这个时候contenthash的作用就出来了。

# contenthash -- 由文件内容计算产生
contenthash表示由文件内容产生的hash值，内容不同产生的contenthash值也不一样。

webpack中是如何进行文件内容计算的呢？ 
是根据moduleId.content来计算的，然后生成对应的hash值。

问题又来了，moduleId是怎么来的呢？
`eg:module.id === require.resolve('./file.js');`
它是根据模块排序方法计算的，这是因为每个 module.id 会默认地基于解析顺序(resolve order)进行增量（module是全局的，是为了不同的入口文件，引入同一个module时可以使用缓存，而不必打重复的包）。也就是说，当解析顺序发生变化，ID 也会随之改变，极其不稳定。
解决办法 固定moduleId,使用NamedModulesPlugin 插件来固定moduleId.

还有一个Webpack 内部维护了一个自增的 id，每个 chunk 都有一个 id。所以entry新增或者减少入口文件时，也会导致 contenthash变化，因为对应的chunkId变了，解决办法就是固定chunkId。使用HashedModuleIdsPlugin插件。

contenthash在webpack4 之前都只能在css上使用，并不能在js上使用，并且现在(webpack4+)也只是在production 环境上才能使用，开发环境上我们更多地希望没有缓存，所以会给打包出来的文件，都使用hash值.

# 总结
hash受所有代码影响，只要有变化，hash就变了。

chunkhash，受到它自身chunk内容的影响，以及chunkId moduleId的影响。

contenthash,受到它自身文件内容的影响，以及chunkId moduleId的影响。

他们受影响的范围，依次递减。






