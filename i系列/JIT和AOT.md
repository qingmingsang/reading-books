1、动态编译（dynamic compilation）指的是“在运行时进行编译”；与之相对的是事前编译（ahead-of-time compilation，简称AOT），也叫静态编译（static compilation）。

2、JIT编译（just-in-time compilation）狭义来说是当某段代码即将第一次被执行时进行编译，因而叫“即时编译”。JIT编译是动态编译的一种特例。JIT编译一词后来被泛化，时常与动态编译等价；但要注意广义与狭义的JIT编译所指的区别。
3、自适应动态编译（adaptive dynamic compilation）也是一种动态编译，但它通常执行的时机比JIT编译迟，先让程序“以某种式”先运行起来，收集一些信息之后再做动态编译。这样的编译可以更加优化。




AOT Compiler和JIT Compiler就是针对编译形式做的分类： 
AOT：Ahead Of Time，指在运行前编译，比如普通的静态编译 
JIT：Just In Time，指在运行时编译，边运行边编译，比如java虚拟机在运行时就用到JIT技术 

目前，程序主要有两种运行方式：
静态编译与动态解释。
静态编译的程序在执行前全部被翻译为机器码，通常将这种类型称为AOT （Ahead of time compiler）即 “提前编译”；如C、C++。判断标准是：程序执行前是否需要编译。
而解释执行的则是一句一句边翻译边运行，通常将这种类型称为JIT（Just-in-time）即“即时编译”。如JavaScript、Python。

程序运行的方式和具体的语言没有强制关系，比如Java、Python，既可以JIT，也可以AOT。

Java首先将代码编译成字节码，在运行时，虚拟机再把字节码解释（interpret）成机器码。机器码是特定机器的语言，因此跟平台相关。

Dart中的JIT和AOT：
dart在开发过程中使用JIT，因此每次改都不需要再编译成字节码。节省了大量时间。
在部署中使用AOT生成高效的ARM代码以保证高效的性能。
