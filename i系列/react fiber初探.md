React Fiber是对React核心算法的重构，2年重构的产物就是Fiber Reconciler。

# 1 为什么需要React Fiber


![](https://images2018.cnblogs.com/blog/771172/201806/771172-20180604092120746-2132258333.jpg)


在React Fiber之前的版本,当React决定要加载或者更新组件树时，会做很多事，但主要是两个阶段:
1. 调度阶段(Reconciler)。这个阶段React用新数据生成新的Virtual DOM，遍历Virtual DOM，然后通过Diff算法，快速找出需要更新的元素，放到更新队列中去。
2. 渲染阶段(Renderer)。这个阶段 React 根据所在的渲染环境，遍历更新队列，将对应元素更新。在浏览器中，就是跟新对应的DOM元素。除浏览器外，渲染环境还可以是 Native、硬件、VR 、WebGL等等。



表面上看，这样的设计也是挺合理的，因为更新过程不会有任何I/O操作，完全是CPU计算，所以无需异步操作，的确执行到结束即可。主要问题出现在，React之前的调度策略[Stack Reconciler](https://reactjs.org/docs/codebase-overview.html#stack-reconciler)。这个策略像函数调用栈一样，会深度优先遍历所有的Virtual DOM节点，进行Diff。它一定要等整棵Virtual DOM计算完成之后，才将任务出栈释放主线程。而浏览器中的渲染引擎是单线程的，几乎所有的操作都在这个单线程中执行:解析渲染DOM Tree和CSS Tree、解析执行JavaScript(除了网络操作)，这个线程就是浏览器的主线程。

假设更新一个组件需要1毫秒，如果有200个组件要更新，那就需要200毫秒，在这200毫秒的更新过程中，浏览器那个唯一的主线程都在专心运行更新操作，无暇去做任何其他的事情。想象一下，在这200毫秒内，用户往一个input元素中输入点什么，敲击键盘也不会获得响应，因为渲染输入按键结果也是浏览器主线程的工作，但是浏览器主线程被React占用，抽不出空，最后的结果就是用户敲了按键看不到反应，等React更新过程结束之后，那些按键会一下出现在input元素里,这就是所谓的界面卡顿。

React这样的调度策略对动画的支持也不好。如果React更新一次状态，占用浏览器主线程的时间超过16.6ms，就会被人眼发觉前后两帧不连续，呈现出动画卡顿。

![](https://images2018.cnblogs.com/blog/771172/201806/771172-20180604091948601-139845132.jpg) 


过去的优化都是停留于JS层面(VDOM的 create/diff)：如减少组件的复杂度(Stateless)、减少向下diff的规模(SCU)、减少diff的成本(immutable.js)...这些都并不能解决线程的问题。React希望通过Fiber重构来改变这种现状，进一步提升交互体验。

# 2 什么是React Fiber

## 2.1 fiber tree
React Fiber之前的Stack Reconciler，是自顶向下的递归mount/update，无法中断(持续占用主线程)，这样主线程上的布局、动画等周期性任务以及交互响应就无法立即得到处理，影响体验。
其运行时存在3种实例：
- DOM: 真实的DOM节点。
- Elements：主要是描述UI长什么样子(type, props)。
- Instances: 根据Elements创建的，对组件及DOM节点的抽象表示，VDOM tree维护了组件状态以及组件与DOM树的关系。

在首次渲染过程中构建出VDOM tree，后续需要更新时(setState())，diff VDOM tree得到DOM change，并把DOM change应用(patch)到DOM树。

React Fiber解决过去Reconciler存在的问题的思路是把渲染/更新过程(递归diff)拆分成一系列小任务，每次检查树上的一小部分，做完看是否还有时间继续下一个任务，有的话继续，没有的话把自己挂起，主线程不忙的时候再继续。

![](https://images2018.cnblogs.com/blog/771172/201806/771172-20180604092730269-848383064.jpg)



之前的VDOM tree显然难以满足，因此React Fiber将组件的递归更新，改成链表的依次执行，扩展出了fiber tree(即Fiber上下文的VDOM tree)，更新过程就是根据输入数据以及现有的fiber tree构造出新的fiber tree(workInProgress tree)。因此，Instance层新增了这些实例：
- DOM: 真实的DOM节点。
- effect: 每个workInProgress tree节点上都有一个effect list用来存放diff结果，当前节点更新完毕会向上merge effect list(queue收集diff结果)。
- workInProgress：workInProgress tree是reconcile过程中从fiber tree建立的当前进度快照，用于断点恢复。
- fiber：fiber tree与VDOM tree类似，用来描述增量更新所需的上下文信息。
- Elements：主要是描述UI长什么样子(type, props)。

fiber tree实际上是个单链表(Singly Linked List)树结构。


![](https://images2018.cnblogs.com/blog/771172/201806/771172-20180604092139676-48867713.jpg)





Fiber的拆分单位是fiber(fiber tree上的一个节点)，实际上就是按虚拟DOM节点拆，因为fiber tree是根据VDOM tree构造出来的，树结构一模一样，只是节点携带的信息有差异。
所以，实际上是VDOM node粒度的拆分(以fiber为工作单元)，每个组件实例和每个DOM节点抽象表示的实例都是一个工作单元。工作循环中，每次处理一个fiber，处理完可以中断/挂起整个工作循环。

## 2.2 reconcile
React Fiber把渲染/更新过程分为两个阶段(Phase):
1. (可中断)render/reconciliation 通过构造workInProgress tree得出change。
2. (不可中断)commit 应用这些DOM change。


![](https://images2018.cnblogs.com/blog/771172/201806/771172-20180604092206991-1822228176.jpg)




第一阶段render/reconciliation具体实现为以fiber tree为蓝本，把每个fiber作为一个工作单元，自顶向下逐节点构造workInProgress tree(构建中的新fiber tree)。

具体过程如下(以组件节点为例)：
1. 如果当前节点不需要更新，直接把子节点clone过来，跳到5；要更新的话打个tag。
2. 更新当前节点状态(props, state, context等)。
3. 调用shouldComponentUpdate()，false的话，跳到5。
4. 调用render()获得新的子节点，并为子节点创建fiber(创建过程会尽量复用现有fiber，子节点增删也发生在这里)。
5. 如果没有产生child fiber，该工作单元结束，把effect list归并到return，并把当前节点的sibling作为下一个工作单元；否则把child作为下一个工作单元。
6. 如果没有剩余可用时间了，等到下一次主线程空闲时才开始下一个工作单元；否则，立即开始做。
7. 如果没有下一个工作单元了(回到了workInProgress tree的根节点)，第1阶段结束，进入pendingCommit状态。

实际上是1-6的工作循环，7是出口，工作循环每次只做一件事，做完看要不要休息。工作循环结束时，workInProgress tree的根节点身上的effect list就是收集到的所有side effect(因为每做完一个都向上归并)。

所以，构建workInProgress tree的过程就是diff的过程，通过[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)来调度执行一组任务，每完成一个任务后回来看看有没有插队的(更紧急的)，每完成一组任务，把时间控制权交还给主线程，直到下一次requestIdleCallback回调再继续构建workInProgress tree。

这一阶段是没有副作用的，因此这个过程可以被打断，然后恢复执行。

第二阶段commit阶段：第一阶段产生的effect list只有在commit之后才会生效，也就是真正应用到DOM中。这一阶段往往不会执行太长时间，因此是同步(所谓的一次性)的，这样也避免了组件内视图层结构和DOM不一致。

## 2.3 workInProgress tree


![](https://images2018.cnblogs.com/blog/771172/201806/771172-20180604092236371-1776340243.jpg)



在React Fiber中使用了双缓冲技术(double buffering)，像redux里的nextListeners，以fiber tree为主，workInProgress tree为辅
双缓冲具体指的是workInProgress tree构造完毕，得到的就是新的fiber tree，每个fiber上都有个alternate属性，也指向一个fiber，创建workInProgress节点时优先取alternate，没有的话就创建一个。

fiber与workInProgress互相持有引用，把current指针指向workInProgress tree，丢掉旧的fiber tree。旧fiber就作为新fiber更新的预留空间，达到复用fiber实例的目的。


## 2.4 优先级策略
React Fiber为了更好的进行任务调度，会给不同的任务设置不同优先级。
React Fiber切分任务并调用[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)和requestAnimationFrame API，保证渲染任务和其他任务，在不影响应用交互，不掉帧的前提下，稳定执行，而实现调度的方式正是给每一个fiber实例设置到期执行时间，不同时间即代表不同优先级，到期时间越短，则代表优先级越高，需要尽早执行。


![](https://images2018.cnblogs.com/blog/771172/201806/771172-20180604092341730-1864892032.jpg)





synchronous首屏(首次渲染)用，要求尽量快，不管会不会阻塞UI线程。animation通过requestAnimationFrame来调度，这样在下一帧就能立即开始动画过程；后3个都是由requestIdleCallback回调执行的；offscreen指的是当前隐藏的、屏幕外的(看不见的)元素。
高优先级的比如键盘输入(希望立即得到反馈)，低优先级的比如网络请求，让评论显示出来等等。另外，紧急的事件允许插队。

## 2.5 生命周期
因为render/reconciliation阶段可能执行多次，会导致willXXX钩子执行多次。所以getDerivedStateFromProps取代了原本的componentWillMount与componentWillReceiveProps方法，而componentWillUpdate本来就是可有可无所以也被废弃了。

进入commit阶段时，组件多了一个新钩子叫getSnapshotBeforeUpdate，它与commit阶段的钩子一样只执行一次。

出错时，在componentDidMount/Update后，可以使用componentDidCatch方法。





# 3 总结
React Fiber最终提供的新功能主要是：
- 可切分，可中断任务。
- 可重用各分阶段任务，且可以设置优先级。
- 可以在父子组件任务间前进后退切换任务。
- render方法可以返回多元素(即可以返回数组)。
- 支持异常边界处理异常。

通过本文主要了解了React Fiber的基本实现和其产生的原因，其本身还有更多的优化和实现细节，可以查看[源码](https://github.com/facebook/react/tree/master/packages/react-reconciler)或参考其他文章进行更深入的了解。

# 4 参考文章
[react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)
[Lin Clark](http://conf.reactjs.org/speakers/lin)