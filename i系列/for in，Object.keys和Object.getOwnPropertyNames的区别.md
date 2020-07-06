# for in，Object.keys和Object.getOwnPropertyNames的区别

有一个父对象。
```
var parent = Object.create(Object.prototype, {
    a: {
        value: 1,
        writable: true,
        enumerable: true,
        configurable: true            
    }
});
```

parent继承自`Object.prototype`，有一个可枚举的属性a。

下面我们再创建一个继承自parent的对象child。
```
var child = Object.create(parent, {
    b: {
        value: 2,
        writable: true,
        enumerable: true,
        configurable: true
    },
    c: {
        value: 3,
        writable: true,
        enumerable: false,
        configurable: true
    }
});
```
child有两个属性b和c，其中b为可枚举属性，c为不可枚举属性。

下面我们将用四种方法遍历child对象，来比较四种方法的不同。

# for in
for in是es3中就存在，最早用来遍历对象（集合）的方法。
```
for (var key in child) {
    console.log(key);
}
// > b
// > a
```
从输出可以看出，for in会输出**自身以及原型链上可枚举的属性**。

注意：不同的浏览器对for in属性输出的顺序可能不同。

如果仅想输出自身的属性可以借助 hasOwnProperty。可以过滤掉原型链上的属性。
```
for (var key in child) {
    if (child.hasOwnProperty(key)) {
        console.log(key);
    }
}
// > b
```
上面的代码，仅输出了child自己的可枚举属性b，而没有输出原型parent中的属性。

# Object.keys
Object.keys是es5中新增的方法，**用来获取对象自身可枚举的属性键**。
```
console.log(Object.keys(child));
// > ["b"]
```
可以看出Object.keys的效果和`for in + hasOwnProperty`的效果是一样的。

# Object.getOwnPropertyNames
Object.getOwnPropertyNames也是es5中新增的方法，**用来获取对象自身的全部属性名**。
```
console.log(Object.getOwnPropertyNames(child));
// > ["b", "c"]
```
从输出可以看出其和Object.keys的区别。
