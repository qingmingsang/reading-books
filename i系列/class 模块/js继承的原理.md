为什么即使你没有给你的类添加toString()方法却也能够调用

当我们创建了myobj类的一个实例o,js引擎会从原型链开始搜索o应该具有的方法

首先从o本身开始搜索,没有,那么从o.__proto__所指向的对象也就是myobj.prototype(所以如果console.info(o.__proto__===myobj.prototype)会打出true)搜索,也咩有

而myobj.prototype本身也是一个一般对象,所以也有__proto__属性,所以继续沿着__proto__所指的对象进行搜索,而myobj.prototype.__proto__则指向了Object.prototype

对象,如果你用(console.info(Object.prototype)),你就发现在这个对象下面有个属性叫toString,是一个方法属性.这也就是为什么你创建的类,即便没有添加toString方法却依然

能够调用这个方法.(如果console.info(o.toString)会打出function(){[native code]}和object.toString相同).



二.两个特殊的类Function和Object
```
Object.prototype.__proto__ ==>null

Object.__proto__ ==>Functon.prototype


Function.protype.__proto__ ==>Object.prototype

Function.__proto__==>Function.prototype
```
由上可以看出最后原型链都指向了null对象,也就是正常的结束,不会死循环


