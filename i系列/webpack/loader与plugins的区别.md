Loader和Plugin的区别？
Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。
因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

Hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
Chunkhash：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
Contenthash：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

https://juejin.im/post/5e6f4b4e6fb9a07cd443d4a5


