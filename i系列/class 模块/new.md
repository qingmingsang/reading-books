1. 不用创建临时对象，因为 new 会帮你做（你使用「this」就可以访问到临时对象）；
2. 不用绑定原型，因为new 会帮你做(new 为了知道原型在哪，所以指定原型的名字 prototype);
3. 不用 return 临时对象，因为 new 会帮你做；
4. 不要给原型想名字了，因为 new 指定名字为 prototype。

constructor里面默认return this

new 的作用，就是省那么几行代码。（也就是所谓的语法糖）

```
function 士兵(ID){
  this.ID = ID
  this.生命值 = 42
}

士兵.prototype = {
  兵种:"美国大兵",
  攻击力:5,
  行走:function(){ /*走俩步的代码*/},
  奔跑:function(){ /*狂奔的代码*/  },
  死亡:function(){ /*Go die*/    },
  攻击:function(){ /*糊他熊脸*/   },
  防御:function(){ /*护脸*/       }
}

// 保存为文件：士兵.js
然后是创建士兵（加了一个 new 关键字）：

var 士兵们 = []
for(var i=0; i<100; i++){
  士兵们.push(new 士兵(i))
}

兵营.批量制造(士兵们)
```
注意 constructor 属性
new 操作为了记录「临时对象是由哪个函数创建的」，所以预先给「士兵.prototype」加了一个 constructor 属性：
```
士兵.prototype = {
  constructor: 士兵
}
```

如果你重新对「士兵.prototype」赋值，那么这个 constructor 属性就没了，所以你应该这么写：
```
士兵.prototype.兵种 = "美国大兵"
士兵.prototype.攻击力 = 5
士兵.prototype.行走 = function(){ /*走俩步的代码*/}
士兵.prototype.奔跑 = function(){ /*狂奔的代码*/  }
士兵.prototype.死亡 = function(){ /*Go die*/    }
士兵.prototype.攻击 = function(){ /*糊他熊脸*/   }
士兵.prototype.防御 = function(){ /*护脸*/       }
```
或者你也可以自己给 constructor 重新赋值：
```
士兵.prototype = {
  constructor: 士兵,
  兵种:"美国大兵",
  攻击力:5,
  行走:function(){ /*走俩步的代码*/},
  奔跑:function(){ /*狂奔的代码*/  },
  死亡:function(){ /*Go die*/    },
  攻击:function(){ /*糊他熊脸*/   },
  防御:function(){ /*护脸*/       }
}
```
