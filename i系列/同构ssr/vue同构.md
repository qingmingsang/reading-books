# vue SSR的实现原理
客户端请求服务器，服务器根据请求地址获得匹配的组件，在调用匹配到的组件返回 Promise (官方是preFetch方法)来将需要的数据拿到。最后再通过
`<script>window.__initial_state=data</script>`
将其写入网页，最后将服务端渲染好的网页返回回去。

接下来客户端会将vuex将写入的 `__initial_state__` 替换为当前的全局状态树，再用这个状态树去检查服务端渲染好的数据有没有问题。遇到没被服务端渲染的组件，再去发异步请求拿数据。说白了就是一个类似React的 shouldComponentUpdate 的Diff操作。

Vue2使用的是单向数据流，用了它，就可以通过 SSR 返回唯一一个全局状态，并确认某个组件是否已经SSR过了。


# 构建过程
入口文件二：entry-server。需要依次作如下逻辑处理
- 新建 vue、vue-router、vuex 实例（注意不能复用实例）
- app 挂载 router 和 store 插件
- router 根据当前请求即 req.url，根据路由匹配到 Components，如果存在 - asyncData 则异步获取所有数据后 resolve app 实例
- registerModule 并存在 state 时，将 state 挂载到 context.state 下，并由 renderer 将其序列化
- renderer 可以在 HTML 中收集并内联组件 css，并自动注入首屏关键 css（critical css）
- renderer 通过 app 实例 render 为 HTML string，并返回给 client 端

入口文件一：entry-client。需要依次作如下逻辑处理
- 同样的，初始化 app 实例并挂载 router,store 插件
- 当路由 onReady 后，挂载`<div id="app" data-server-rendered="true">...</div>`真实 DOM，由于此时通过data-server-rendered已知晓由服务端渲染完毕，因此客户端走激活（hydrate）流程而不是重新渲染替换节点#app
- 另外数据预取逻辑和服务端略有不同，我用的是按需加载策略也就是通过 mixin 混入 beforeMount 生命周期去预取数据。为了防止 double-fetch 数据，这里需要作出调整即在挂载 app 之后再混入。
- 然后 webpack 通过不同入口分别打包 client-manifest.json 以及 server-bundle.json，应用于 renderer
- 其中 client-manifest 主要用于标记程序依赖 chunk，server-bundle 中则存储并映射打包后所有的 bundle 用于渲染。renderer 具有程序的所有构建信息，因此它可以自动推断和注入资源 prefetch 与 preload 指令，以及 css、javascript 标签到 HTML 中。与此同时，为避免 client 瀑布式请求（waterfull request）以及达到最快的 TTI（Time-To Interactive），只有应用程序首屏依赖的 chunk 会以 preload 形式注入，暂未使用的异步 chunk 通过 prefetch 形式注入。

# 运行流程概述
server 端负责渲染首屏的工作比如预取数据，全局 state 初始化（不包括 actions,mutations 以及 getters），直出首屏完整 DOM
client 端负责 hydrate（激活）SPA，比如 store replaceState，注册 store 模块

# react的同构与vue的同构
都有一个服务端渲染的方法
vue是vue-server-renderer提供的，
react是react-dom/server提供的。
vue需要客户端和服务端各打一次包，react只需要一次。
vue还需要在webpack里加入’vue-server-renderer/client-plugin’和’vue-server-renderer/server-plugin’,而react只需要’webpack-manifest-plugin’.
这里很大可能是vue的该插件做了其他整合和优化。

react对redux的处理比较复杂，特别是对懒加载和ssr，而vue也应该是整合过了比较简单。


# vue ssr 独特之处
在SSR中，创建Vue实例、创建store和创建router都是套了一层工厂函数的，目的就是避免数据的交叉污染。
在服务端只能执行生命周期中的created和beforeCreate，原因是在服务端是无法操纵dom的，所以可想而知其他的周期也就是不能执行的了。
服务端渲染和客户端渲染不同，需要创建两个entry分别跑在服务端和客户端，并且需要webpack对其分别打包；
SSR服务端请求不带cookie，需要手动拿到浏览器的cookie传给服务端的请求。
SSR要求dom结构规范，因为浏览器会自动给HTML添加一些结构比如tbody，但是客户端进行混淆服务端放回的HTML时，不会添加这些标签，导致混淆后的HTML和浏览器渲染的HTML不匹配。
性能问题需要多加关注。
vue.mixin、axios拦截请求使用不当，会内存泄漏。
lru-cache向内存中缓存数据，需要合理缓存改动不频繁的资源。