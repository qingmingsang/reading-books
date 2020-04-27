# call
可以继承constructor里的所有数据，包括方法，但是无法继承方法prototype的方法。
可以向父类的构造函数传递参数。
instanceof 指向有问题。
`SuperT.call(this)`
```
        function SuperT() {
            this.name = '父类';
            this.colors = ["red", "blue", "green"];
            this.sayName = function () {
                console.log(this.name);
                this.inner = 'inner';
            };
        }
        SuperT.prototype.init = function () {
            console.warn('init')
            this.ruok = 'are you ok?';
        };

        function SubT() {
            //继承所有属性(不严谨的说法)
            //call super constructor.
            SuperT.call(this);
            this.age = 26;
        }
        let ins = new SubT();
        console.log(ins.name)//父类
        console.log(ins.colors)//["red", "blue", "green"]
        console.log(ins.age)//26

        console.log(ins.inner)//undefined
        ins.sayName()//父类
        console.log(ins.inner)//inner

        //ins.init()//error
        console.log(ins.ruok)//undefined
```

# prototype
缺点：
- 重写子类的原型 等于 父类的一个实例，（父类的实例属相变成子类的原型属性）如果父类包含引用类型的属性，那么子类所有实例都会共享该属性 （包含引用类型的原型属性会被实例共享） 。
- 在创建子类实例时，不能向父类的构造函数传递参数。
`SubT.prototype = new SuperT()`
`SubT.prototype.constructor = SubT`
```
       function SuperT() {
            this.name = '父类';
            this.colors = ["red", "blue", "green"];
            this.sayName = function () {
                console.log(this.name);
                this.inner = 'inner';
            };
        }
        SuperT.prototype.init = function () {
            console.warn('init')
            this.ruok = 'are you ok?';
        };
        SuperT.prototype.init1 = function () {
            console.warn('init 1')
            this.ruok1 = '1 are you ok?';
        };

        SuperT.prototype.init2 = function () {
            console.warn('init 2')
            this.ruok2 = '2 are you ok?';
        };

        function SubT() {
            this.age = 26;
            console.log(this.name)//父类
            console.log(this.colors)//["red", "blue", "green"]
            console.log(this.ruok)//undefined

            console.warn(this.inner)//undefined
            this.sayName();//父类
            console.warn(this.inner)//inner

            this.init();//init
            console.log(this.ruok)//are you ok?

            SuperT.prototype.init1();//init 1
            console.log(this.ruok1)//1 are you ok?

            SuperT.prototype.init2.call(this);//init 2
            console.log(this.ruok2)//2 are you ok?
        }
        SubT.prototype = new SuperT();
        SubT.prototype.constructor = SubT;
        let ins = new SubT();
```

# 组合继承
缺点：
- 两次调用父类构造函数：（第一次是在创建子类原型的时候，第二次是在子类构造函数内部）
- 子类继承父类的属性，一组在子类实例上，一组在子类原型上（在子类原型上创建不必要的多余的属性）（实例上的屏蔽原型上的同名属性）
- 效率低
`father.apply(this, [])`
`child.prototype = new father()`
`child.prototype.constructor = child`
```
function father(name) {
    this.faName = 'father';
}
father.prototype.getfaName = function () {
    console.log(this.faName);
};
function child(args) {
    this.chName = 'child';
    father.apply(this, []); //第二次调用父类构造函数  
}
child.prototype = new father(); //第一次调用父类构造函数  
child.prototype.constructor = child;
child.prototype.getchName = function () {
    console.log(this.chName);
};
```

# 寄生组合继承(推荐)
优点：
- 只调用一次父类的构造函数,避免了在子类原型上创建不必要的，多余的属性.
- 原型链保持不变 .
`Person.call(this, name);`
```
        function inherit(subClass, superClass) {
            function F() { }
            F.prototype = superClass.prototype;
            subClass.prototype = new F();//子类的原型等于父类的原型 
            subClass.prototype.constructor = subClass.constructor;//增强子类
            //子类的原型等于new 空函数(), 而new 空函数()出来的对象的原型等于父类的原型  
        }
```

```
       function Person(name) {
            this.name = name;
        }
        Person.prototype.getName = function () {
            return this.name;
        }
        function Chinese(name, nation) {
            Person.call(this, name);
            this.nation = nation;
        }
        //Object.create()内部就是原型式继承
        //核心继承方法  
        //下面这写法是错的
        function inherit(subClass, superClass) {
            function F() { }
            F.prototype = superClass.prototype;
            subClass.prototype = new F();//子类的原型等于父类的原型 
            subClass.prototype.constructor = subClass.constructor;//增强子类
            //子类的原型等于new 空函数(), 而new 空函数()出来的对象的原型等于父类的原型  
        }
        // 寄生组合式继承的核心方法
        function inherit(child, parent) {
            // 继承父类的原型
            const p = Object.create(parent.prototype)
            // 重写子类的原型
            child.prototype = p
            // 重写被污染的子类的constructor
            p.constructor = child
        }

        inherit(Chinese, Person);

        Chinese.prototype.getNation = function () {
            return this.nation;
        };

        var p = new Person('qm');
        var c = new Chinese("sh", "China");

        console.log(p); // Person {name: "qm", getName: function}  
        console.log(c); // Chinese {name: "sh", nation: "China", constructor: function, getNation: function, getName: function}  


        console.log(p.constructor); // function Person(name){}  
        console.log(c.constructor); // function Chinese(){}  

        console.log(c instanceof Chinese); // true  
        console.log(c instanceof Person); // true
```
