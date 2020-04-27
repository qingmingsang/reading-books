http://blog.poetries.top/2019/10/02/rn-yuanli/

# React
React是一个纯JS库，所有的React代码和所有其它的js代码都需要JS Engine来解释执行。因为种种原因，浏览器里面的JS代码是不允许调用自定义的原生代码的，而React又是为浏览器JS开发的一套库，所以，比较容易理解的事实是React是一个纯JS库，它封装了一套Virtual Dom的概念，实现了数据驱动编程的模式，为复杂的Web UI实现了一种无状态管理的机制, 标准的HTML/CSS之外的事情，它无能为力。调用原生控件，驱动声卡显卡，读写磁盘文件，自定义网络库等等，这是JS/React无能为力的

# React Native它可不一样
第一点，驱动关系不一样。前面我们说的是, JS Engine来解析执行React脚本, 所以，React由浏览器(最终还是JS Engine)来驱动. 到了React Native这里，RN的原生代码(Timer和用户事件)驱动JS Engine, 然后JS Engine解析执行React或者相关的JS代码，然后把计算好的结果返回给Native code. 然后, Native code 根据JS计算出来的结果驱动设备上所有能驱动的硬件。重点，所有的硬件。也就是说，在RN这里，JS代码已经摆脱JS Engine(浏览器)的限制，可以调用所有原生接口啦
第二点, 它利用React的Virtual Dom和数据驱动编程概念，简化了我们原生应用的开发, 同时，它不由浏览器去绘制，只计算出绘制指令，最终的绘制还是由原生控件去负责，保证了原生的用户体验

在一定程度上，React Native和NodeJS有异曲同工之妙。它们都是通过扩展JavaScript Engine, 使它具备强大的本地资源和原生接口调用能力，然后结合JavaScript丰富的库和社区和及其稳定的跨平台能力，把javascript的魔力在浏览器之外的地方充分发挥出来

# JavaScriptCore + ReactJS + Bridges 就成了React Native
- JavaScriptCore负责JS代码解释执行
- ReactJS负责描述和管理VirtualDom,指挥原生组件进行绘制和更新，同时很多计算逻辑也在js里面进行。ReactJS自身是不直接绘制UI的，UI绘制是非常耗时的操作，原生组件最擅长这事情。
- Bridges用来翻译ReactJS的绘制指令给原生组件进行绘制，同时把原生组件接收到的用户事件反馈给ReactJS。
- 要在不同的平台实现不同的效果就可以通过定制Bridges来实现

Bridge的作用就是给RN内嵌的JS Engine提供原生接口的扩展供JS调用。所有的本地存储、图片资源访问、图形图像绘制、3D加速、网络访问、震动效果、NFC、原生控件绘制、地图、定位、通知等都是通过Bridge封装成JS接口以后注入JS Engine供JS调用。理论上，任何原生代码能实现的效果都可以通过Bridge封装成JS可以调用的组件和方法, 以JS模块的形式提供给RN使用。
每一个支持RN的原生功能必须同时有一个原生模块和一个JS模块，JS模块是原生模块的封装，方便Javascript调用其接口。Bridge会负责管理原生模块和对应JS模块之间的沟通, 通过Bridge, JS代码能够驱动所有原生接口，实现各种原生酷炫的效果。

RN中JS和Native分隔非常清晰，JS不会直接引用Native层的对象实例，Native也不会直接引用JS层的对象实例(所有Native和JS互掉都是通过Bridge层会几个最基础的方法衔接的)。
Bridge 原生代码负责管理原生模块并生成对应的JS模块信息供JS代码调用。每个功能JS层的封装主要是针对ReactJS做适配，让原生模块的功能能够更加容易被用ReactJS调用。MessageQueue.js是Bridge在JS层的代理，所有JS2N和N2JS的调用都会经过MessageQueue.js来转发。JS和Native之间不存在任何指针传递，所有参数都是字符串传递。所有的instance都会被在JS和Native两边分别编号，然后做一个映射,然后那个数字/字符串编号会做为一个查找依据来定位跨界对象。





