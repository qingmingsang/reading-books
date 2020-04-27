从Web容器方案到以React Native、Weex为代表的泛Web容器方案,最后再到以Flutter为代表的自绘引擎方案

React Native与传统的HybirdApp最大区别就是抛开WebView，使用JSC+原生组件的方式进行渲染

# weex工作原理
Weex 表面上是一个客户端技术，但实际上它串联起了从本地开发、云端部署到分发的整个链路。开发者首先可在本地像编写 web 页面一样编写一个 app 的界面，然后通过命令行工具将之编译成一段 JavaScript 代码，生成一个 Weex 的 JS bundle；
同时，开发者可以将生成的 JS bundle 部署至云端，然后通过网络请求或预下发的方式加载至用户的移动应用客户端；在移动应用客户端里，Weex SDK 会准备好一个 JavaScript 执行环境，并且在用户打开一个 Weex 页面时在这个执行环境中执行相应的 JS bundle，并将执行过程中产生的各种命令发送到 native 端进行界面渲染、数据存储、网络通信、调用设备功能及用户交互响应等功能；同时，如果用户希望使用浏览器访问这个界面，那么他可以在浏览器里打开一个相同的 web 页面，这个页面和移动应用使用相同的页面源代码，但被编译成适合Web展示的JS Bundle，通过浏览器里的 JavaScript 引擎及 Weex SDK 运行起来的。

