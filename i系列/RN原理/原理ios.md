# 性能
尽管业务逻辑代码使用JavaScript，但由于JavaScript是即时编译的，也就是第一次使用时会将JavaScript代码编译成二进制文件，所以JavaScript得运行效率比较高。因此，React Native的运行效率要比基于HTML5、CSS等技术的PhoneGap、AppCan高很多，因为这些技术直接使用HTML5进行渲染，而HTML5会大量使用DOM技术，DOM的操作是很消耗性能的。

# React-Native与原生的交互（通讯机制Eg：ios）
上面我们提到React Native使用的是Android或iOS的本地控件来做UI渲染的，因此我们需要 UIKit 等原生框架，需要调用 Objective-C 代码或者Java代码，同时我们也需要在原生代码中运行js代码，比如UI控件上注册的事件，这就需要在js端和原生端有对应的通讯机制。

我们都知道 JavaScript 是一种脚本语言，它不会经过编译、链接等操作，而是在运行时才动态的进行词法、语法分析，生成抽象语法树(AST)和字节码，然后由解释器负责执行或者使用 JIT 将字节码转化为机器码再执行。整个流程由 JavaScript 引擎负责完成的，IOS提供了一个叫做 JavaScript Core 的框架，这是一个 JavaScript 引擎。通过下面这段代码可以简单的感受一下 Objective-C 如何调用 JavaScript 代码的：

JavaScript 是一种单线程的语言，它不具备自运行的能力，因此总是被动调用，Objective-C 创建了一个单独的线程，这个线程只用于执行 JavaScript 代码，而且 JavaScript 代码只会在这个线程中执行。

# 交互流程
在 React Native 中，Objective-C 和 JavaScript 的交互都是通过传递 ModuleId、MethodId 和 Arguments 进行的。
Objective-C 和 JavaScript 两端都保存了一份配置表，里面标记了所有 Objective-C 暴露给 JavaScript 的模块和方法。
这样，无论是哪一方调用另一方的方法，实际上传递的数据只有 ModuleId、MethodId 和 Arguments 这三个元素，它们分别表示类、方法和方法参数，当 Objective-C 接收到这三个值后，就可以通过 runtime 唯一确定要调用的是哪个函数，然后调用这个函数。
Objective-C 和 JavaScript 的交互总是由Objective-C发起的。
Object-C与js的交互是通过各端的Bridge和ModuleConfig来进行的，
实际过程可分为两个阶段：

## 初始化阶段和方法调用阶段。
### 初始化 React Native
在RN（ios）项目中都会有 AppDelegate.m 这个文件,用户能看到的一切内容都来源于这个 RootView，所有的初始化工作也都在这个方法内完成。在这个方法内部，在创建 RootView 之前，React Native 实际上先创建了一个 Bridge 对象。它是 Objective-C 与 JavaScript 交互的桥梁，后续的方法交互完全依赖于它，而整个初始化过程的最终目的其实也就是创建这个桥梁对象。

初始化方法的核心是 setUp 方法，而 setUp 方法的主要任务则是创建 BatchedBridge。BatchedBridge 的作用是批量读取 JavaScript 对 Objective-C 的方法调用，同时它内部持有一个 JavaScriptExecutor，顾名思义，这个对象用来执行 JavaScript 代码。创建 BatchedBridge 的关键是 start 方法，
它可以分为五个步骤：

1.读取 JavaScript 源码
JavaScript 的代码是在 Objective-C 提供的环境下运行的，所以第一步就是把 JavaScript 加载进内存中，对于一个空的项目来说，所有的 JavaScript 代码大约占用 1.5 Mb 的内存空间。在这一步中，JSX 代码已经被转化成原生的 JavaScript 代码。

2.初始化模块信息
主要任务是找到所有需要暴露给 JavaScript 的类（Module）

初始化 JavaScript 代码的执行器，即 RCTJSCExecutor 对象

初始化JavaScript代码执行器，同时向 JavaScript 上下文中添加了一些 Block(Object-c中对闭包的实现) 作为全局变量。

Block--nativeRequireModuleConfig ： 它在 JavaScript 注册新的模块时调用：

Block--nativeFlushQueueImmediate：一般情况下，Objective-C 会定时、主动的调用JS放到MessageQueue 中的方法，实际上（由于卡顿或某些特殊原因），JavaScript 也可以主动调用 Objective-C 的方法，目前，React Native 的逻辑是，如果消息队列中有等待 Objective-C 处理的逻辑，而且 Objective-C 超过 5ms 都没有来取走，那么 JavaScript 就会主动调用 Objective-C 的方法。

请牢牢记住这个 5ms，它告诉我们 JavaScript 与 Objective-C 的交互是存在一定开销的，不然就不会等待而是每次都立刻发起请求。其次，这个时间开销大约是毫秒级的，不会比 5ms 小太多，否则等待这么久就意义不大了。

生成模块列表并写入 JavaScript 端

让 JavaScript 获取所有模块的名字，作为一个全局变量存储

执行 JavaScript 源码

运行代码时，第三步中所添加的 Block（nativeRequireModuleConfig ） 就会被执行，从而向 JavaScript 端写入配置信息。

OC调用 JS代码
OC不会直接调用实际的js函数，而是会去调用维系的中转函数，中转函数接收到 的参数包含了 ModuleId、MethodId 和 Arguments，就可以查找自己的模块配置表，找到真正要调用的 JavaScript 函数。

JS调用OC代码
在调用 Objective-C 代码时，JavaScript 会解析出方法的 ModuleId、MethodId 和 Arguments 并放入到 MessageQueue 中，等待 Objective-C 主动拿走，或者超时后主动发送给 Objective-C。

函数内部在每一次方调用中查找模块配置表找出要调用的方法，并通过 runtime 动态的调用。

React Native 优缺点分析

优点：
复用了 React 的思想，有利于前端开发者涉足移动端。
能够利用 JavaScript 动态更新的特性，快速迭代。
相比于原生平台，开发速度更快，相比于 Hybrid 框架，性能更好。

缺点：
做不到Write once, Run everywhere，也就是说开发者依然需要为 iOS 和 Android 平台提供两套不同的代码，比如参考官方文档可以发现不少组件和API都区分了 Android 和 iOS 版本。即使是共用组件，也会有平台独享的函数。

不能做到完全屏蔽 iOS 端或 Android 的细节，前端开发者必须对原生平台有所了解。加重了学习成本。对于移动端开发者来说，完全不具备用 React Native 开发的能力。

由于 Objective-C 与 JavaScript 之间切换存在固定的时间开销，所以性能必定不及原生。比如目前的官方版本无法做到 UItableview(ListView) 的视图重用，因为滑动过程中，视图重用需要在异步线程中执行，速度太慢。这也就导致随着 Cell 数量的增加，占用的内存也线性增加。







