nodejs高并发大流量的设计实现
原理：非阻塞事件驱动实现异步开发,通过事件驱动的异步I/O来操作完成跨平台数据密集型实时应用
传统的server 每个请求生成一个线程， nodejs是一个单线程的，使用libuv保持数万并发

# 1. 单线程
我们先来明确一个概念，即：node是单线程的，这一点与JavaScript在浏览器中的特性相同，并且在node中JavaScript主线程与其他线程（例如I/O线程）是无法共享状态的。
主线程一个，底层工作线程多个。

单线程的好处就是：
- 无需像多线程那样去关注线程之间的状态同步问题
- 没有线程切换所带来的开销
- 没有死锁存在
- 当然单线程也有许多坏处：

当然单线程也有许多坏处：
- 无法充分利用多核CPU
- 大量计算占用CPU会导致应用阻塞(即不适用CPU密集型)
- 错误会引起整个应用的退出
  
不过在今天看来，这些坏处都已经不再是问题或者得到了适当的解决：

(1) 创建进程 or 细分实例
关于第一个问题，最直白解决方案就是使用child_process核心模块或者cluster：child_process 和 net 组合应用。我们可以通过在一台多核服务器上创建多个进程（通常使用fork操作）来充分利用每个核心，不过要处理好进程间通信问题。
另一个方案是，我们可以将物理机器划分为多台单核的虚拟机，并通过pm2等工具，管理多台虚拟机形成一个集群架构，高效运行所需服务.

(2) 时间片轮转
关于第二点，可以通过时间片轮转方式，在单线程上模拟多线程，适当减少应用阻塞的感觉（虽然这种方法不会真的像多线程那样节约时间）

(3) 负载均衡、坏点监控/隔离
至于第三点node不同于JAVA，它所实现的逻辑是以异步为主的。
这就导致了node无法像JAVA一样方便地使用 try/catch 来来捕获并绕过错误，因为无法确定异步任务会何时传回异常。而在单线程环境下，绕不过错误就意味着导致应用退出，重启恢复的间隙会导致服务中断，这是我们不愿意看到的。

当然，在服务器资源丰富的当下，我们可以通过 pm2 或 nginx 这些工具，动态的判断服务状态。在服务出错时隔离坏点服务器，将请求转发到正常服务器上，并重启坏点服务器以继续提供服务。这也是Node分布式架构的一部分。


# 2. 异步I/O
你可能会问，既然node是单线程的，事件全部在一个线程上处理，那不是应该效率很低、与高并发相悖吗？

恰恰相反，node的性能很高。原因之一就是node具有异步I/O特性，每当有I/O请求发生时，node会提供给该请求一个I/O线程。然后node就不管这个I/O的操作过程了，而是继续执行主线程上的事件，只需要在该请求返回回调时在处理即可。也就是node省去了许多等待请求的时间。

这也是node支持高并发的重要原因之一

实际上不光是I/O操作，node的绝大多数操作都是以这种异步的方式进行的。它就像是一个组织者，无需事必躬亲，只需要告诉成员们如何正确的进行操作并接受反馈、处理关键步骤，就能使得整个团队高效运行。

# 3. 事务驱动
你可能又要问了，node怎么知道请求返回了回调，又应该何时去处理这些回调呢？

答案就是node的另一特性：事务驱动，即主线程通过event loop事件循环触发的方式来运行程序

这是node支持高并发的另一重要原因

图解node环境下的Event loop：
```
   ┌───────────────────────┐
┌─>│        timers         │<————— 执行 setTimeout()、setInterval() 的回调
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │<————— 执行几乎所有的回调，除了 close callbacks 以及 timers 调度的回调和 setImmediate() 调度的回调
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
│  ┌──────────┴────────────┐
│  │     idle, prepare     │<————— 内部调用，可忽略
│  └──────────┬────────────┘     
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
|             |                   ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │ - (retrieve new I/O events; node will block here when appropriate)
│  │         poll          │<─────┤  connections, │ 
│  └──────────┬────────────┘      │   data, etc.  │ 
│             |                   |               | 
|             |                   └───────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
|  ┌──────────┴────────────┐      
│  │        check          │<————— setImmediate() 的回调将会在这个阶段执行
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
│  ┌──────────┴────────────┐
└──┤    close callbacks    │<————— socket.on('close', ...)
   └───────────────────────┘
```

# 4. poll阶段：
当进入到poll阶段，并且没有timers被调用的时候，会发生下面的情况:
（1）如果poll队列不为空：
Event Loop 将同步的执行poll queue里的callback（新的I/O事件），直到queue为空或者执行的callback到达上线。

（2）如果poll队列为空:
- 如果脚本调用了setImmediate(), Event Loop将会结束poll阶段并且进入到check阶段执行setImmediate()的回调。
- 如果脚本没有setImmediate()调用，Event Loop将会等待回调（新的I/O事件）被添加到队列中，然后立即执行它们。


当进入到poll阶段，并且调用了timers的话，会发生下面的情况:
一旦poll queue是空的话，Event Loop会检查是否timers, 如果有1个或多个timers时间已经到达，Event Loop将会回到timer阶段并执行那些timer的callback(即进入到下一次tick)。


# 5. 优先级：
根据上面的图，我们不难得出：
`Next Tick Queue > MicroTask Queue`

那么setTimeout、setInterval和setImmediate谁快呢？
答案是：不确定

单单从执行图上看，如果两者都是在mian module里定义的，那么：`setTimeout、setInterval > setImmediate`

但是有两个条件制约了这一结论：
- event loop初始化需要一定时间
- setTimeout有最小毫秒数（一般认为最少1ms）


所以当 `event loop准备时间 > setTimeout毫秒数`时，进入timers检查时已有setTimeout的任务，故timeout先输出。反之则immediate先输出。

如果是在poll阶段定义的setTimeout和setImmediate，那么immediate先于timeout输出。原因是在poll阶段，会先进入check阶段再进入timers阶段。例如：
```
const fs = require('fs');

fs.readFile('./test.txt', 'utf8', (err, data) => {
    setTimeout( () => {
        console.log('setTimeout');
    }, 0);
    setImmediate( () => {
        console.log('setImmediate');
    })
})

/**
 *
 * console:
 * > setImmediate
 * > setTimeout
 *
 **/
```

# 6. 分布式Node架构
`Nginx(负载均衡、调度) -> Node集群 -> Redis(同步状态)`


https://zhuanlan.zhihu.com/p/41118827
https://www.cnblogs.com/linzhanfly/p/9082895.html

