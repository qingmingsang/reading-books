# React Native 工作原理
React Native 渲染 在 React 框架中，JSX 源码通过 React 框架最终渲染到了浏览器的真实 DOM 中，而在 React Native 框架中，JSX 源码通过 React Native 框架编译后，通过对应平台的 Bridge 实现了与原生框架的通信。
如果我们在程序中调用了 React Native 提供的 API，那么 React Native 框架就通过 Bridge 调用原生框架中的方法。 因为 React Native 的底层为 React 框架，所以如果是 UI 层的变更，那么就映射为虚拟 DOM 后进行 diff 算法，diff 算法计算出变动后的 JSON 映射文件，最终由 Native 层将此 JSON 文件映射渲染到原生 App 的页面元素上，最终实现了在项目中只需要控制 state 以及 props 的变更来引起 iOS 与 Android 平台的 UI 变更。 编写的 React Native代码最终会打包生成一个 main.bundle.js 文件供 App 加载，此文件可以在 App 设备本地，也可以存放于服务器上供 App 下载更新

# React Native 与原生平台通信
在与原生框架通信中，React Native 采用了 JavaScriptCore 作为 JS VM，中间通过 JSON 文件与 Bridge 进行通信。而如果在使用 Chrome 浏览器进行调试时，那么所有的 JavaScript 代码都将运行在 Chrome 的 V8 引擎中，与原生代码通过 WebSocket 进行通信。



# React Native 结构
- Native Code对应着原生代码，例如android的原生Java代码，ios的原生C++代码
- Bridge用于将JS和原生Native Code连接起来
- JS VM用于运行JS代码，React Native采用的是JavaScriptCore,在Android上，需要应用自己附带JavaScriptCore，Ios上JavaScriptCore属于系统的一部分，不需要应用附带。

# React Native线程模型
React Native应用中存在三个线程队列，它们工作的流程大概如下：UI Event Queue触发事件，通过Bridge调用JS代码在JS Event Queue中运行，JS运行后将视图更新分发给Native Module Event Queue中的线程,Native Module Event Queue负责计算，然后将最后的结果交给UI Event Queue中的线程去更新。 其中UI Event Queue为主线程。

React Native中有一个基本的概念就是模块，一个模块有状态和方法，我们可以通过JS调用一个Module,如上图中以Android为例，可以通过JS调用Dialog module,然后转化成原生代码对应的是Android中的DialogModule。

React Native中的另一个概念是组件，一个组件可以通过映射关系和原生的API相对应，我们也可以自定义组件，例如上图中的`<Text/>`和原生代码中的 new TextView(getContext())相对应。



