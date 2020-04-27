# 什么是 JS 原型链？

```
var obj = { name: 'obj' }
```
- obj本身有一个属性 name (这是我们给它加的)
- obj还有一个属性叫做 __proto__(它是一个对象)
- obj还有一个属性，包括 valueOf, toString, constructor等
- obj.__proto__其实也有一个叫做__proto__的属性(console.log没有显示)，值为 null

## obj 为什么会拥有 valueOf / toString / constructor 这几个属性？
当我们「读取」 obj.toString 时，JS 引擎会做下面的事情：
1. 看看 obj 对象本身有没有 toString 属性。没有就走到下一步。
2. 看看 obj.__proto__ 对象有没有 toString 属性， 发现 obj.__proto__ 有 toString 属性， 于是找到了，所以 obj.toString实际就是第2步中找到的 obj.__proto__.toString。
3. 如果 obj.__proto__没有，那么浏览器会继续查看 obj.__proto__.__proto__。
4. 如果 obj.__proto__.__proto__ 也没有，那么浏览器会继续查看 obj.__proto__.__proto__.__proto__。
5. 直到找到 toString 或者 __proto__ 为 null。

上面的过程，就是「读」属性的「搜索过程」。而这个「搜索过程」，是连着由 proto 组成的链子一直走的。这个链子，就叫做「原型链」。

## 共享原型链
```
var obj2 = { name: 'obj2' }
```
那么 obj.toString 和 obj2.toString 其实是同一东西， 也就是 obj2.__proto__.toString。
说白了，我们改其中的一个 __proto__.toString ，那么另外一个其实也会变.

## 差异化
如果我们想让 obj.toString 和 obj2.toString 的行为不同怎么做呢？
直接赋值就好了：
`obj.toString = function(){ return '新的 toString 方法' } `   

## 小结
[读]属性时会沿着原型链搜索
[新增]属性时不会去看原型链






