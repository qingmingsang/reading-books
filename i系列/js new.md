# js构造函数创建对象加new与不加new的问题

## new操作符做了些什么呢？
- 创建一个新对象；
- 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象） ；
- 执行构造函数中的代码（为这个新对象添加属性） ；
- 返回新对象。


## 不加new操作符直接执行构造函数会发生什么呢？
```
function Obj(name){
    this.name = name;
    console.log(this); // 严格模式下是undefined 非严格模式下是window对象
}

var a = Obj("name1");
console.log(a); // 结果 => undefined
```
当作正常的函数调用来执行，Obj没有返回值，故a是undefined。

## 两者区别总结
使用new操作符创建对象，并且构造函数没有返回值或者返回为基本数据类型，那么返回该对象，如下例：
```
        function Obj(name) {
            this.name = name;
        }
        var b = new Obj;
        console.log(b);  // Obj { name: undefined }
        var c = new Obj('aa');
        console.log(c);  // Obj { name: 'aa' }

        function Obj2(name) {
            this.name = name;
            return 'chic';
        }
        var b = new Obj2;
        console.log(b); // 同上
```

如果构造函数返回一个引用类型：
```
function Obj(name){
      this.name = name;
    return {};
}
var b = new Obj;
console.log(b); // {}
```

## 总结
对于不加new来执行构造函数来说，返回值就是构造函数的执行结果；
对于加new关键字来执行构造函数而言，如果return的是基本数据类型，那么忽视掉该return值，如果返回的是一个引用类型，那么返回该引用类型。


填写"TO DO"处的内容让下面代码支持`a.name = "name1"; b.name = "name2";`
```
function Obj(name){
      // TO DO
}
obj. /* TO DO  */ = "name2";
var a = Obj("name1");
var b = new Obj;
```

```
function Obj(name){
    this.name = name;
    return this;
}
Obj.prototype.name = "name2";
var a = Obj("name1");
var b = new Obj;
```



