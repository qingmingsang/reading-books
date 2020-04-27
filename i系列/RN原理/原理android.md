# RN工作原理
RN需要一个JS的运行环境， 
在IOS上直接使用内置的javascriptcore， 
在Android 则使用webkit.org官方开源的jsc.so。 
此外还集成了其他开源组件，如fresco图片组件，okhttp网络组件等。

RN 会把应用的JS代码（包括依赖的framework）编译成一个js文件（一般命名为index.android.bundle), **RN的整体框架目标就是为了解释运行这个js 脚本文件**，
如果是js 扩展的API， 则直接通过bridge调用native方法; 
如果是UI界面， 则映射到virtual DOM这个虚拟的JS数据结构中，通过bridge 传递到native ， 然后根据数据属性设置各个对应的真实native的View。 
bridge是一种JS 和 JAVA代码通信的机制， 用bridge函数传入对方module 和 method即可得到异步回调的结果。

对于JS开发者来说， 画UI只需要画到virtual DOM 中，不需要特别关心具体的平台, 还是原来的单线程开发，还是原来HTML 组装UI（JSX），还是原来的样式模型（部分兼容 )。
RN的界面处理除了实现View 增删改查的接口之外，还自定义一套样式表达CSSLayout，这套CSSLayout也是跨平台实现。 
RN 拥有画UI的跨平台能力，主要是加入Virtual DOM编程模型，该方法一方面可以照顾到JS开发者在html DOM的部分传承， 让JS 开发者可以用类似DOM编程模型就可以开发原生APP ， 另一方面则可以让Virtual DOM适配实现到各个平台，实现跨平台的能力，并且为未来增加更多的想象空间， 比如react-cavas, react-openGL。而实际上react-native也是从react-js演变而来

对于 Android 开发者来说， RN是一个普通的安卓程序加上一堆事件响应， 事件来源主要是JS的命令。
主要有二个线程，UI main thread, JS thread。
 UI thread创建一个APP的事件循环后，就挂在looper等待事件 , 事件驱动各自的对象执行命令。 
 JS thread 运行的脚本相当于底层数据采集器， 不断上传数据，转化成UI 事件， 通过bridge转发到UI thread, 从而改变真实的View。 
 后面再深一层发现， UI main thread 跟 JS thread更像是CS 模型，JS thread更像服务端， UI main thread是客户端， UI main thread 不断询问JS thread并且请求数据，如果数据有变，则更新UI界面。


# 通信机制
RN框架最主要的就是实现了一套JAVA和 JS通信的方案，该方案可以做到比较简便的互调对方的接口。
一般的JS运行环境是直接扩展JS接口，然后JS通过扩展接口发送信息到主线程。但RN的通信的实现机制是单向调用，Native线程定期向JS线程拉取数据， 然后转成JS的调用预期，最后转交给Native对应的调用模块。这样最终同样也可以达到Java和 JS 定义的Module互相调用的目的。

JS调用java
JS调用java 使用通过扩展模块require('NativeModules')获取native模块，然后直接调用native公开的方法，比如require('NativeModules').UIManager.manageChildren()。 JS 调用require('NativeModules')实际上是获取MessageQueue里面的一个native模块列表的属性

java调用JS
之前ReactInstanceManager 中运行JS APP组件，JAVA 是调用catalystInstance.getJSModule 方法获取JS 对象，然后直接访问对象方法runApplication。实际上getJSModule 返回的是js对象在java层的映射对象。

# 扩展机制
因为react模块加载主要在ReactPackage类配置，因此扩展可以通过反射、外部依赖注入等机制，可以做到跟H5容器一样实现动态插拔的插件式扩展。比如API扩展， 通过外部传入扩展模块的类名即可反射构造函数创建新的API：







