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
