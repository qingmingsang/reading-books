new的实现
原理
Javascript在new一个新对象的过程中经历了以下几个过程：

生成一个新对象
链接到原型
绑定this的指向
返回新对象（如果构造函数有自己的返回值，则返回这个值）

实现
```
function create() {
    const obj = new Object();  // 1
    const Con = Array.prototype.shift.call(arguments);
    obj.__proto__ = Con.prototype; // 2
    const ret = Con.apply(obj, arguments); // 3
    return ret instanceof Object ? ret : obj;  // 4
}
```

