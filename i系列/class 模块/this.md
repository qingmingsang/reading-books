this取决于运行时的上下文(context)

# this 的值到底是什么
this取决于运行时的上下文
```
var obj = {
  foo: function(){
    console.log(this)
  }
}

var bar = obj.foo
obj.foo() // 打印出的 this 是 obj
bar() // 打印出的 this 是 window   
```

## 函数调用
JS（ES5）里面有三种函数调用形式：
```
func(p1, p2) 
obj.child.method(p1, p2)
func.call(context, p1, p2) // 先不讲 apply
```
一般，初学者都知道前两种形式，而且认为前两种形式「优于」第三种形式。

第三种调用形式，才是正常调用形式：
```
func.call(context, p1, p2)
```

其他两种都是语法糖，可以等价地变为 call 形式：
```
func(p1, p2)等价于 func.call(undefined, p1, p2);

obj.child.method(p1, p2) 等价于 obj.child.method.call(obj.child, p1, p2);
```

至此我们的函数调用只有一种形式：
```
func.call(context, p1, p2)
```
这样，this 就好解释了 this就是上面 context。

this 是你 call 一个函数时传的 context，由于你从来不用 call 形式的函数调用，所以你一直不知道。

先看 `func(p1, p2)` 中的 this 如何确定：

当你写下面代码时
```
function func(){
  console.log(this)//window
}

func()
```
等价于
```
function func(){
  console.log(this)//window
}

func.call(undefined) // 可以简写为 func.call()
```
按理说打印出来的 this 应该就是 undefined 了吧，但是浏览器里有一条规则：

如果你传的 context 就 null 或者 undefined，那么 window 对象就是默认的 context（严格模式下默认 context 是 undefined）
因此上面的打印结果是 window。如果你希望这里的 this 不是 window，很简单：
`func.call(obj) // 那么里面的 this 就是 obj 对象了     `

```
var obj = {
    foo: function () {
        console.log(this)
    }
}

var bar = obj.foo
obj.foo() // 转换为 obj.foo.call(obj)，this 就是 obj  {foo: ƒ}
bar() 
// 转换为 bar.call()
// 由于没有传 context
// 所以 this 就是 undefined
// 最后浏览器给你一个默认的 this —— window 对象    
```

## [ ] 语法
```
const fn2 = () => { console.log(this) }
function fn() { console.log(this) }
var arr = [fn, fn2]
arr[0]() // 这里面的 this 又是什么呢？ 
//是[ƒ, ƒ]
```
我们可以把 `arr[0]()` 想象为`arr.0()`，虽然后者的语法错了，但是形式与转换代码里的 `obj.child.method(p1, p2)` 对应上了，于是就可以愉快的转换了：
```
arr[0]() 
假想为    arr.0()
然后转换为 arr.0.call(arr)
那么里面的 this 就是 arr 了
```

## 小结：
this 就是你 call 一个函数时，传入的第一个参数。
如果你的函数调用不是 call 形式， 请将其转换为 call 形式


```
        class Test {
            constructor() {
                console.log('1', this);
                return function () {
                    console.log('2', this);//undefined || window
                }
                //constructor里面默认return this
            }
            a() {
                console.log('3', this); //  
            }
        }
        let xx = new Test();//Test {}
        console.log('4', xx)
        // ƒ () {
        // console.log('2', this);//undefined || window
        // }
        xx();
        //xx.a();//error


        class Test2 {
            constructor() {
                console.log('11', this);
                return {}
                //constructor里面默认return this
            }
            a() {
                console.log('33', this); //  
            }
        }
        let yy = new Test2();//Test2 {}
        console.log('44', yy)//{}
        yy();
        //yy.a();//error
```

