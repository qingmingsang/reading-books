

* 事件处理 (比如调用了一个不存在的方法this.abc(),并不会执行componentDidCatch)
* 异步代码 （例如 setTimeout 或 requestAnimationFrame 回调函数）
* 服务端渲染
* 错误边界自身抛出来的错误 （而不是其子组件）
