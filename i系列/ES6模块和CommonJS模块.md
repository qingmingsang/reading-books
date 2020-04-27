- ES6模块在编译时，就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 模块，运行时加载。
- ES6 模块自动采用严格模式，无论模块头部是否写了 "use strict";
- require 可以做动态加载，import 语句做不到，import 语句必须位于顶层作用域中。
- ES6 模块中顶层的 this 指向 undefined，CommonJS 模块的顶层 this 指向当前模块。
- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用

扩展： CommonJS 中的 require/exports 和 ES6 中的 import/export 区别
- CommonJS 模块的重要特性是加载时执行，即脚本代码在 require 的时候，就会全部执行。一旦出现某个模块被”循环加载”，就只输出已经执行的部分，还未执行的部分不会输出。
- ES6 模块是动态引用，如果使用 import 从一个模块加载变量，那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。
- import/export 最终都是编译为 require/exports 来执行的。
- CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports ）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。
- export 命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。

