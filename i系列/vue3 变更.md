# setup()


# Function-based API
## 与 React Hooks 的对比
这里提出的 API 和 React Hooks 有一定的相似性，具有同等的基于函数抽取和复用逻辑的能力，但也有很本质的区别。React Hooks 在每次组件渲染时都会调用，通过隐式地将状态挂载在当前的内部组件节点上，在下一次渲染时根据调用顺序取出。而 Vue 的 setup() 每个组件实例只会在初始化时调用一次 ，状态通过引用储存在 setup() 的闭包内。这意味着基于 Vue 的函数 API 的代码：

整体上更符合 JavaScript 的直觉；
不受调用顺序的限制，可以有条件地被调用；
不会在后续更新时不断产生大量的内联函数而影响引擎优化或是导致 GC 压力；
不需要总是使用 useCallback 来缓存传给子组件的回调以防止过度更新；
不需要担心传了错误的依赖数组给 useEffect/useMemo/useCallback 从而导致回调中使用了过期的值 —— Vue 的依赖追踪是全自动的。


# 优化预编译
Vue3.0 提出的动静结合的 DOM diff 思想，是因为 Vue core 可以静态分析 template，在解析模版时，整个 parse 的过程是利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的回调函数，来达到构造 AST 树的目的。

在react还没做这方面的优化。Prepack是一个方向。
Prepack 同样是 FaceBook 团队的作品。它让你编写普通的 JavaScript 代码，它在构建阶段就试图了解代码将做什么，然后生成等价的代码，减少了运行时的计算量，就相当于 JavaScript 的部分求值器。



# Object.defineProperty改为Proxy
Proxy / Object.defineProperty 两者的区别：
- 当使用 defineProperty，我们修改原来的 obj 对象就可以触发拦截，而使用 proxy，就必须修改代理对象，即 Proxy 的实例才可以触发拦截
- defineProperty 必须深层遍历嵌套的对象。 Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的

Proxy对比defineProperty的优势
- Proxy 的第二个参数可以有 13 种拦截方法，这比起 Object.defineProperty() 要更加丰富
- Proxy 作为新标准受到浏览器厂商的重点关注和性能优化，相比之下 Object.defineProperty() 是一个已有的老方法
- Proxy 的兼容性不如 Object.defineProperty() (caniuse 的数据表明，QQ 浏览器和百度浏览器并不支持 Proxy，这对国内移动开发来说估计无法接受，但两者都支持 Object.defineProperty())
- 不能使用 polyfill 来处理兼容性

