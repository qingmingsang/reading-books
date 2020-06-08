
__proto__ 指向构造函数的 prototype
constructor用来指向引用它的函数对象??

引用数据类型
```
      let a = new Array();//与let a = [];意义一致
      console.log(a);
      console.log(a.constructor);//ƒ Array() { [native code] }
      console.log(a.__proto__.constructor);//ƒ Array() { [native code] }
      console.log(a.prototype);//undefined
      console.log(a.__proto__.prototype);//undefined
      console.log(Array)//ƒ Array() { [native code] }
      console.log(a.constructor === Array)//true
      console.log(a.__proto__.constructor === Array)//true
      console.log('111111111111')

      let b = new Object();//与let b = {};意义一致
      console.log(b);
      console.log(b.constructor);//ƒ Object() { [native code] }
      console.log(b.__proto__.constructor);//ƒ Object() { [native code] }
      console.log(b.prototype);//undefined
      console.log(b.__proto__.prototype);//undefined
      console.log(Object)//ƒ Object() { [native code] }
      console.log(b.constructor === Object)//true
      console.log(b.__proto__.constructor === Object)//true
      console.log('2222222222')
```	  
	  
子类的上级是父类,父类的上级是Function,Function的上级是Object,到null结束
这里的constructor和class里写的不是一回事
```
	  class father { }
      console.log(father)//class father {}
      console.log(father.__proto__)//ƒ () { [native code] }
      console.log(father.__proto__.constructor)//ƒ Function() { [native code] }
      console.log(father.__proto__.prototype)//undefined
      console.log(father.constructor)//ƒ Function() { [native code] }
      console.log(father.prototype)//{constructor: class father}指向自己的constructor??
      console.log(father.__proto__.constructor === Function)//true
      console.log(father.constructor === Function)//true
      console.log(father.__proto__.__proto__.constructor)//ƒ Object() { [native code] }
      console.log(father.__proto__.__proto__.prototype)//undefined
      console.log(father.__proto__.__proto__.constructor === Object)//true
      console.log(father.__proto__.__proto__.__proto__)//null
      console.log('111111111111')
	  
      class son extends father { }
      console.log(son)//class son extends father { }
      console.log(son.__proto__)//class father { }
      console.log(son.__proto__.constructor)//ƒ Function() { [native code] }
      console.log(son.__proto__.prototype)//{constructor: class father}
      console.log(son.constructor)//ƒ Function() { [native code] }
      console.log(son.prototype)//{constructor: class father}指向父类的constructor??
      console.log(son.__proto__.constructor === Function)//true
      console.log(son.constructor === Function)//true
      console.log(son.__proto__.__proto__.__proto__.constructor)//ƒ Object() { [native code] }
      console.log(son.__proto__.__proto__.__proto__.prototype)//undefined
      console.log(son.__proto__.__proto__.__proto__.constructor === Object)//true
      console.log(son.__proto__.__proto__.__proto__.__proto__)//null
	  console.log('2222222222')
```


实例化
```
      class ff { }
      const father = new ff();
      console.log(father)//ff {}
      console.log(father.__proto__)//{constructor: class ff}
      console.log(father.__proto__.constructor)//class ff { }
      console.log(father.__proto__.prototype)//undefined
      console.log(father.constructor)//class ff { }
      console.log(father.prototype)//undefined
      console.log(father.__proto__.constructor === ff)//true
      console.log(father.constructor === ff)//true
      console.log(father.__proto__.__proto__.constructor)//ƒ Object() { [native code] }
      console.log(father.__proto__.__proto__.prototype)//undefined
      console.log(father.__proto__.__proto__.constructor === Object)//true
      console.log(father.__proto__.__proto__.__proto__)//null
      console.log('11111111111111111111')
	  
      class ss extends ff { }
      const son = new ss();
      console.log(son)//ss {}
      console.log(son.__proto__)//ff {constructor: ƒ}
      console.log(son.__proto__.constructor)//class ss extends ff { }
      console.log(son.__proto__.prototype)//undefined
      console.log(son.constructor)//lass ss extends ff { }
      console.log(son.prototype)//undefined
      console.log(son.__proto__.constructor === ss)//true
      console.log(son.constructor === ss)//true
      console.log(son.__proto__.__proto__.__proto__.constructor)//ƒ Object() { [native code] }
      console.log(son.__proto__.__proto__.__proto__.prototype)//undefined
      console.log(son.__proto__.__proto__.__proto__.constructor === Object)//true
      console.log(son.__proto__.__proto__.__proto__.__proto__)//null
      console.log('222222222222222222')
```