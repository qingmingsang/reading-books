# SSR 之所以能够实现，本质上是因为虚拟 DOM 的存在
SSR 的工程中，React 代码会在客户端和服务器端各执行一次。
你可能会想，这没什么问题，都是 JavaScript 代码，既可以在浏览器上运行，又可以在 Node 环境下运行。但事实并非如此，如果你的 React 代码里，存在直接操作 DOM 的代码，那么就无法实现 SSR 这种技术了，因为在 Node 环境下，是没有 DOM 这个概念存在的，所以这些代码在 Node 环境下是会报错的。
好在 React 框架中引入了一个概念叫做虚拟 DOM，虚拟 DOM 是真实 DOM 的一个 JavaScript 对象映射，React 在做页面操作时，实际上不是直接操作 DOM，而是操作虚拟 DOM，也就是操作普通的 JavaScript 对象，这就使得 SSR 成为了可能。
在服务器，我可以操作 JavaScript 对象，判断环境是服务器环境，我们把虚拟 DOM 映射成字符串输出；在客户端，我也可以操作 JavaScript 对象，判断环境是客户端环境，我就直接将虚拟 DOM 映射成真实 DOM，完成页面挂载。
其他的一些框架，比如 Vue，它能够实现 SSR 也是因为引入了和 React 中一样的虚拟 DOM 技术。

# 客服端和服务端的路由不同

# 数据的注水和脱水
首先，在服务端获取获取之后，在返回的 html 代码中加入这样一个 script 标签：
```
<script>	
  window.context = {	
    state: ${JSON.stringify(store.getState())}	
  }	
</script>
```
这叫做数据的“注水”操作，即把服务端的 store 数据注入到 window 全局环境中。接下来是“脱水”处理，换句话说也就是把 window 上绑定的数据给到客户端的 store，可以在客户端 store 产生的源头进行，即在全局的 `store/index.js` 中进行。

至此，数据的脱水和注水操作完成。

https://juejin.im/post/5d7deef6e51d453bb13b66cd