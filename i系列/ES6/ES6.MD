# let
let不存在变量提升
```
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

#解构赋值
```
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []

let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: 'aaa', bar: 'bbb' };
baz // undefined

let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'

const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

let {length : len} = 'hello';
len // 5
```

报错
```
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};

// 错误的写法
let x;
{x} = {x: 1};
// SyntaxError: syntax error

// 全部报错
let [(a)] = [1];

let {x: (c)} = {};
let ({x: c}) = {};
let {(x: c)} = {};
let {(x): c} = {};

let { o: ({ p: p }) } = { o: { p: 2 } };
```

默认值
```
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
```

交换变量的值
```
let x = 1;
let y = 2;

[x, y] = [y, x];
```

函数参数的定义
```
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

遍历 Map 结构
```
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world


// 获取键名
for (let [key] of map) {
  // ...
}

// 获取键值
for (let [,value] of map) {
  // ...
}
```

# 字符串
ES6 为字符串添加了遍历器接口，使得字符串可以被`for...of`循环遍历。
除了遍历字符串，这个遍历器最大的优点是可以识别大于0xFFFF的码点，传统的`for`循环无法识别这样的码点。

模板字符串默认会将字符串转义，导致无法嵌入其他语言。

## 模板字符串
清除首尾空格
```
$('#list').html(`
<ul>
  <li>first</li>
  <li>second</li>
</ul>
`.trim());
```
模板字符串甚至还能嵌套。
```
const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
`;
```

标签模板
```
alert`123`
// 等同于
alert(123)
```

## 新增方法
`String.raw()`
ES6 还为原生的 String 对象，提供了一个`raw()`方法。该方法返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，往往用于模板字符串的处理方法。

`String.raw()`的代码实现基本如下。
```
String.raw = function (strings, ...values) {
  let output = '';
  let index;
  for (index = 0; index < values.length; index++) {
    output += strings.raw[index] + values[index];
  }

  output += strings.raw[index]
  return output;
}
```

`ormalize()`
ES6 提供字符串实例的`normalize()`方法，用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化。
```
'\u01D1'.normalize() === '\u004F\u030C'.normalize()
// true
```

`includes()`：返回布尔值，表示是否找到了参数字符串。
`startsWith()`：返回布尔值，表示参数字符串是否在原字符串的头部。
`endsWith()`：返回布尔值，表示参数字符串是否在原字符串的尾部。
```
let s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
```

`repeat()`
repeat方法返回一个新字符串，表示将原字符串重复n次。
```
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""
```


ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。
`padStart()`用于头部补全，`padEnd()`用于尾部补全。
```
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
```
`padStart()`的常见用途是为数值补全指定位数。下面代码生成 10 位的数值字符串。
```
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"
```
另一个用途是提示字符串格式。
```
'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```


ES2019 对字符串实例新增了`trimStart()`和`trimEnd()`这两个方法。它们的行为与`trim()`一致，`trimStart()`消除字符串头部的空格，`trimEnd()`消除尾部的空格。它们返回的都是新字符串，不会修改原始字符串。
```
const s = '  abc  ';

s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"
```

# 正则
ES2018(ES9)引入了后行断言


# 对象

全部冻结
```
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};
```

freeze
```
const keyCode = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
});
```




# Math
Math.log10(),Math.log2() 

Math.sign()
Math.sign方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。
```
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN

Math.sign('')  // 0
Math.sign(true)  // +1
Math.sign(false)  // 0
Math.sign(null)  // 0
Math.sign('9')  // +1
Math.sign('foo')  // NaN
Math.sign()  // NaN
Math.sign(undefined)  // NaN
```

Math.sign 的 pollyfill
```
Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};
```

# Function
设置某参数不能省略
```
function throwIfMissing() {
  throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}
```


# 尾调用（Tail Call）
```
function f(x){
  return g(x);
}
```

以下三种情况，都不属于尾调用。
```
// 情况一
function f(x){
  let y = g(x);
  return y;
}

// 情况二
function f(x){
  return g(x) + 1;
}

// 情况三
function f(x){
  g(x);
}
```

# 尾递归

这是一个阶乘函数，计算n的阶乘.
`5*4*3*2*1`
普通递归最多需要保存n个调用记录，复杂度 O(n) 
```
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // 120
```

改写成尾递归，只保留一个调用记录，复杂度 O(1) 。
```
function factorial(n, total=1) {
  'use strict'
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120
```

Fibonacci普通递归
```
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};

  return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(10) // 89
Fibonacci(100) // 堆栈溢出
Fibonacci(500) // 堆栈溢出
```

Fibonacci尾递归
```
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
  'use strict'
  if( n <= 1 ) {return ac2};

  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}

Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
Fibonacci2(10000) // Infinity
```

“尾调用优化”对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6第一次明确规定，所有 ECMAScript 的实现，都必须部署“尾调用优化”。这就是说，ES6 中只要使用尾递归，就不会发生栈溢出，相对节省内存。

递归本质上是一种循环操作。纯粹的函数式编程语言没有循环操作命令，所有的循环都用递归实现，这就是为什么尾递归对这些语言极其重要。对于其他支持“尾调用优化”的语言（比如 Lua，ES6），只需要知道循环可以用递归代替，而一旦使用递归，就最好使用尾递归。

ES6 的尾调用优化只在严格模式下开启，正常模式是无效的。`'use strict'`

如果在非ES6环境进行尾调用优化,
有2种方式

原始
```
function sum(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

sum(1, 100000)
// Uncaught RangeError: Maximum call stack size exceeded(…)
```

第一种
```
//蹦床函数
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}

function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}

trampoline(sum(1, 100000))
// 100001
```

第二种(推荐)
```
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];

  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}

var sum = tco(function(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1)
  }
  else {
    return x
  }
});

sum(1, 100000)
// 100001
```


# Class
类的数据类型就是函数，类本身就指向构造函数。
```
class B {}
let b = new B();
B === B.prototype.constructor // true
b.constructor === B.prototype.constructor // true
```

构造函数的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。
```
class Point {
  constructor() {}
  toString() {}
  toValue() {}
}
// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```


Class的内部所有定义的方法，都是不可枚举的（non-enumerable）。
这一点与 ES5 的行为不一致。
```
class Point {
  constructor(x, y) {}
  toString() {}
}
Object.keys(Point.prototype)// []
Object.getOwnPropertyNames(Point.prototype)// ["constructor","toString"]

//ES5
var Point = function (x, y) {};
Point.prototype.toString = function() {};
Object.keys(Point.prototype)// ["toString"]
Object.getOwnPropertyNames(Point.prototype)// ["constructor","toString"]
```

## 严格模式
类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。

## constructor
constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。

constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
```
//constructor函数返回一个全新的对象，结果导致实例对象不是Foo类的实例。
class Foo {
  constructor() {
    return Object.create(null);
  }
}
new Foo() instanceof Foo// false
```

## 类的实例对象
实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。
x和y都是实例对象point自身的属性（因为定义在this变量上），所以hasOwnProperty方法返回true，而toString是原型对象的属性（因为定义在Point类上），所以hasOwnProperty方法返回false。这些都与 ES5 的行为保持一致。
```
//定义类
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```

可以通过实例的`__proto__`属性或`getPrototypeOf`为“类”添加方法。
不推荐这种用法.
```
class Point{}

var p1 = new Point(2,3);
var p2 = new Point(3,2);

//p1.__proto__.printName = function () { return 'Oops' };
Object.getPrototypeOf(p1).printName = function () { return 'Oops' };

p1.printName() // "Oops"
p2.printName() // "Oops"
var p3 = new Point(4,2);
p3.printName() // "Oops"
```


## Class表达式
采用 Class 表达式，可以写出立即执行的 Class。
```
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

## 不存在变量提升
类不存在变量提升（hoist），这一点与 ES5 完全不同。

## this的指向
类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
```
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }
  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```


可以使用Proxy，获取方法的时候，自动绑定this。
```
function selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

const logger = selfish(new Logger());
```

## Class-的取值函数（getter）和存值函数（setter）
存值函数和取值函数是设置在属性的 Descriptor 对象上的。
```
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true
```

## Class的静态方法
静态方法不会被实例继承，而是直接通过类来调用。
静态方法可以与非静态方法重名。
父类的静态方法，可以被子类继承。
静态方法也是可以从super对象上调用的。


## new.target属性
new是从构造函数生成实例对象的命令。ES6 为new命令引入了一个new.target属性，该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。如果构造函数不是通过new命令调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。

确保构造函数只能通过new命令调用。
```
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}
// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}
var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```

Class 内部调用new.target，返回当前 Class。
在函数外部，使用new.target会报错。

子类继承父类时，new.target会返回子类。
利用这个特点，可以写出不能独立使用、必须继承后才能使用的类。
```
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```

## Class的继承
子类必须在constructor方法中调用super方法，否则新建实例时会报错。
这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。
所以在子类的构造函数中，只有调用super之后，才可以使用this关键字.
```
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }
  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```

ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。

如果子类没有定义constructor方法，这个方法会被默认添加，
```
class ColorPoint extends Point {
}
// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```

## Object.getPrototypeOf
Object.getPrototypeOf方法可以用来从子类上获取父类。

## super
super()只能用在子类的构造函数之中，用在其他地方就会报错。
super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
但如果属性定义在父类的原型对象上，super就可以取到。

super()在这里相当于`A.prototype.constructor.call(this)`。
```
class A {
  constructor() {
	this.x = 'x';
  }
  p() {
    return 2;
  }
}

A.prototype.y = 'y';
class B extends A {
  constructor() {
    super(); 
	  //属性定义在父类的原型对象上，super就可以取到。
	  console.log(super.y); //y

    //子类B当中的super.p()，就是将super当作一个对象使用。
    //这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()。
    console.log(super.p()); // 2

    this.x = 'xx';
    super.x = 'xxx';
    //定义在父类实例上的方法或属性，是无法通过super调用的
	  console.log(super.x);  //undefined
    console.log(this.x); // 'xxx'
  }
}
let b = new B();
```

在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。

由于对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字。
```
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};
obj.toString(); // MyObject: [object Object]
```


## Class的 prototype 属性和__proto__属性
大多数浏览器的 ES5 实现之中，每一个对象都有`__proto__`属性，指向对应的构造函数的prototype属性。
Class 作为构造函数的语法糖，同时有prototype属性和`__proto__`属性，因此同时存在两条继承链。
1. 子类的`__proto__`属性，表示构造函数的继承，总是指向父类。
2. 子类prototype属性的`__proto__`属性，表示方法的继承，总是指向父类的prototype属性。

```
class A {}
class B extends A {}
B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

这样的结果是因为，类的继承是按照下面的模式实现的。
```
class A {}
class B {}
// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);
// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);
```

Object.setPrototypeOf方法的实现:
```
Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```

因此，就得到了上面的结果。
```
Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;


Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;
// 等同于
Object.create(A.prototype);//???
```


## extends 的继承目标
extends关键字后面可以跟多种类型的值。

子类继承Object类。
这种情况下，A其实就是构造函数Object的复制，A的实例就是Object的实例。
```
class A extends Object {}
A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```

不存在任何继承。
A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性。
```
class A {}
A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```

子类继承null。
A也是一个普通函数，所以直接继承Function.prototype。但是，A调用后返回的对象不继承任何方法，所以它的__proto__指向Function.prototype。
```
class A extends null {}
//等同于
class C extends null {
  constructor() { return Object.create(null); }
}
A.__proto__ === Function.prototype // true
A.prototype.__proto__ === undefined // true
```

## 实例的`__proto__`属性
子类实例的`__proto__`属性的`__proto__`属性，指向父类实例的`__proto__`属性。也就是说，子类的原型的原型，是父类的原型。
```
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');
p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
```

因此，通过子类实例的`__proto__.__proto__`属性，可以修改父类实例的行为。
```
p2.__proto__.__proto__.printName = function () {
  console.log('Ha');
};

p1.printName() // "Ha"
```

## 原生构造函数的继承
```
    Boolean()
    Number()
    String()
    Array()
    Date()
    Function()
    RegExp()
    Error()
    Object()
```
ES6 可以自定义原生数据结构（比如Array、String等）的子类，这是 ES5 无法做到的。

ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承.
```
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```

extends关键字不仅可以用来继承类，还可以用来继承原生的构造函数。
因此可以在原生数据结构的基础上，定义自己的数据结构。

VersionedArray会通过commit方法，将自己的当前状态生成一个版本快照，存入history属性。revert方法用来将数组重置为最新一次保存的版本。除此之外，VersionedArray依然是一个普通数组，所有原生的数组方法都可以在它上面调用。
```
class VersionedArray extends Array {
  constructor() {
    super();
    this.history = [[]];
  }
  commit() {
    this.history.push(this.slice());
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length - 1]);
  }
}

var x = new VersionedArray();

x.push(1);
x.push(2);
x // [1, 2]
x.history // [[]]

x.commit();
x.history // [[], [1, 2]]

x.push(3);
x // [1, 2, 3]
x.history // [[], [1, 2]]

x.revert();
x // [1, 2]
```


自定义Error子类用来定制报错时的行为。
```
class ExtendableError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}

class MyError extends ExtendableError {
  constructor(m) {
    super(m);
  }
}

var myerror = new MyError('ll');
myerror.message // "ll"
myerror instanceof Error // true
myerror.name // "MyError"
myerror.stack
// Error
//     at MyError.ExtendableError
//     ...
```


## Mixin模式的实现
Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。

c对象是a对象和b对象的合成，具有两者的接口。
```
const a = {
  a: 'a'
};
const b = {
  b: 'b'
};
const c = {...a, ...b}; // {a: 'a', b: 'b'}
```

将多个类的接口“混入”（mix in）另一个类。
```
function mix(...mixins) {
  class Mix {}

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝实例属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== "constructor"
      && key !== "prototype"
      && key !== "name"
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```
上面代码的mix函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可。
```
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```

# 










