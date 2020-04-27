https://zhuanlan.zhihu.com/p/98295862

fiber架构代表了用时间分片异步化diff流程(Reconciler/调和 层)以及patch流程的一种实现方式(Renderer 层)

基于浏览器的 requestIdleCallback和requestAnimationFrame两个API。

requestAnimationFrame的回调会在每一帧确定执行，属于高优先级任务，而requestIdleCallback的回调则不一定，属于低优先级任务。

ReactFiber 会将整个更新任务分成若干个小的更新任务，然后设置一些任务默认的优先级。每执行完一个小任务之后，会释放主线程。

window.requestIdleCallback()会在浏览器空闲时期依次调用函数，这就可以让开发者在主事件循环中执行后台或低优先级的任务，而且不会对像动画和用户交互这些延迟触发但关键的事件产生影响。函数一般会按先进先调用的顺序执行，除非函数在浏览器调用它之前就到了它的超时时间。


React 框架内部的运作可以分为 3 层：
Virtual DOM 层，描述页面长什么样。
Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

# Fiber 是如何工作的
为不同类型的任务赋予优先级
任务的暂停与恢复
如果任务不再需要，可以中止
复用之前已完成的工作

简而言之，一个fiber 就代表一个携带虚拟栈帧的任务单元。在之前的调和算法的实现中，React 创建了一个不可变得对象（React 元素）树，然后递归的遍历它们。

fiber 节点的单向链表
一个 fiber 节点就代表一个栈帧，但是也代表一个 React 组件的一个实例。一个 fiber 节点有下列成员组成：


一段关于 fiber 如何工作的 伪代码
```
    const a1 = { name: 'a1', child: null, sibling: null, return: null };
    const b1 = { name: 'b1', child: null, sibling: null, return: null };
    const b2 = { name: 'b2', child: null, sibling: null, return: null };
    const b3 = { name: 'b3', child: null, sibling: null, return: null };
    const c1 = { name: 'c1', child: null, sibling: null, return: null };
    const c2 = { name: 'c2', child: null, sibling: null, return: null };
    const d1 = { name: 'd1', child: null, sibling: null, return: null };
    const d2 = { name: 'd2', child: null, sibling: null, return: null };

    a1.child = b1;
    b1.sibling = b2;
    b2.sibling = b3;
    b2.child = c1;
    b3.child = c2;
    c1.child = d1;
    d1.sibling = d2;

    b1.return = b2.return = b3.return = a1;
    c1.return = b2;
    d1.return = d2.return = c1;
    c2.return = b3;

    let nextUnitOfWork = a1;
    workLoop();

    function workLoop() {
      while (nextUnitOfWork !== null) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      }
    }

    function performUnitOfWork(workInProgress) {
      let next = beginWork(workInProgress);
      if (next === null) {
        next = completeUnitOfWork(workInProgress);
      }
      return next;
    }

    function beginWork(workInProgress) {
      log('work performed for ' + workInProgress.name);
      return workInProgress.child;
    }

    function completeUnitOfWork(workInProgress) {
      while (true) {
        let returnFiber = workInProgress.return;
        let siblingFiber = workInProgress.sibling;

        nextUnitOfWork = completeWork(workInProgress);

        if (siblingFiber !== null) {
          // If there is a sibling, return it 
          // to perform work for this sibling
          return siblingFiber;
        } else if (returnFiber !== null) {
          // If there's no more work in this returnFiber, 
          // continue the loop to complete the returnFiber.
          workInProgress = returnFiber;
          continue;
        } else {
          // We've reached the root.
          return null;
        }
      }
    }

    function completeWork(workInProgress) {
      log('work completed for ' + workInProgress.name);
      return null;
    }

    function log(message) {
      let node = document.createElement('div');
      node.textContent = message;
      document.body.appendChild(node);
    }
```

