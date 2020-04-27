
# class基础版
```
      class MyPromise {
      constructor(fn) {
        // 定义Promise 三种状态
        this.states = {
          PENDING: 'PENDING', RESOLVED: 'RESOLVED', REJECTED: 'REJECTED'
        }
        // 定义传递到then的value
        this.value = null
        // 定义当前Promise运行状态
        this.state = this.states.PENDING
        // 定义Promise成功状态的回调函数集合
        this.resolvedCallBacks = []
        // 定义Promise失败状态的回调函数集合
        this.rejectedCallBacks = []
        // 为静态方法定义其内部使用的指向实例的that  
        MyPromise.that = this
        try {
          // 执行 new MyPromise() 内传入的方法
          fn(MyPromise.resolve, MyPromise.reject)
        } catch (error) {
          MyPromise.reject(this.value)
        }
      }
      // 静态resolve方法，MyPromise实例不可访问；
      //支持类MyPromise访问，例：MyPromise.resolve('success').then(e=>e)
      static resolve(value) {
        // 由于静态方法内部的this指向 类 而不是 实例，所以用下面的方法访问实例对象
        const that = MyPromise.that
        // MyPromise实例对象访问resolve
        that.state = that.states.RESOLVED
        that.value = value
        that.resolvedCallBacks.map(cb => (that.value = cb(that.value)))
      }
      // 静态reject方法，MyPromise实例不可访问；
      //支持类MyPromise访问，例：MyPromise.reject('fail').then(e=>e)
      static reject(value) {
        const that = MyPromise.that
        that.state = that.states.REJECTED
        that.value = value
        that.rejectedCallBacks.map(cb => (that.value = cb(that.value)))
      }
      // 定义在MyPromise原型上的then方法
      then(onFulfilled, onRejected) {
        const { PENDING, RESOLVED, REJECTED } = this.states
        const f = typeof onFulfilled == "function" ? onFulfilled : c => c;
        const r = typeof onRejected == "function" ? onRejected : c => { throw c; };
        switch (this.state) {
          case PENDING:
            // ‘PENDING’状态下向回调函数集合添加callback
            this.resolvedCallBacks.push(f)
            this.rejectedCallBacks.push(r)
            break;
          case RESOLVED:
            // 将回调函数的返回值赋值给 实例的 value，满足链式调用then方法时传递value
            this.value = f(this.value)
            break;
          case REJECTED:
            // 同上
            this.value = r(this.value)
            break;
          default:
            break;
        }
        // 满足链式调用then，返回MyPromise实例对象
        return this
      }
    }

        new MyPromise(resolve => {
      setTimeout(() => {
        resolve(1);
      }, 2000);
    })
      .then(res1 => {
        console.log(res1);
        return 2;
      })
      .then(res2 => console.log(res2));
```

# class实现Promise与Promise.resolve()、Promise.reject()
```
  class MyPromise {
      constructor(fn) {
        // 定义Promise 三种状态
        this.states = {
          PENDING: 'PENDING', RESOLVED: 'RESOLVED', REJECTED: 'REJECTED'
        }
        // 定义传递到then的value
        this.value = null
        // 定义当前Promise运行状态
        this.state = this.states.PENDING
        // 定义Promise成功状态的回调函数集合
        this.resolvedCallBacks = []
        // 定义Promise失败状态的回调函数集合
        this.rejectedCallBacks = []
        // 为静态方法定义其内部使用的指向实例的that  
        MyPromise.that = this
        try {
          // 执行 new MyPromise() 内传入的方法
          fn(MyPromise.resolve, MyPromise.reject)
        } catch (error) {
          MyPromise.reject(this.value)
        }
      }
      // 静态resolve方法，MyPromise实例不可访问；
      //支持类MyPromise访问，例：MyPromise.resolve('success').then(e=>e)
      static resolve(value) {
        // 由于静态方法内部的this指向 类 而不是 实例，所以用下面的方法访问实例对象
        const that = MyPromise.that
        // 判断是否是MyPromise实例访问resolve
        const f = that instanceof MyPromise
        // MyPromise实例对象访问resolve
        if (f && that.state == that.states.PENDING) {
          that.state = that.states.RESOLVED
          that.value = value
          that.resolvedCallBacks.map(cb => (that.value = cb(that.value)))
        }
        // MyPromise类访问resolve
        if (!f) {
          const obj = new MyPromise()
          return Object.assign(obj, {
            state: obj.states.RESOLVED,
            value
          })
        }
      }
      // 静态reject方法，MyPromise实例不可访问；
      //支持类MyPromise访问，例：MyPromise.reject('fail').then(e=>e)
      static reject(value) {
        const that = MyPromise.that
        const f = that instanceof MyPromise
        if (f && that.state == that.states.PENDING) {
          that.state = that.states.REJECTED
          that.value = value
          that.rejectedCallBacks.map(cb => (that.value = cb(that.value)))
        }
        if (!f) {
          const obj = new MyPromise()
          return Object.assign(obj, {
            state: obj.states.REJECTED,
            value
          })
        }
      }
      // 定义在MyPromise原型上的then方法
      then(onFulfilled, onRejected) {
        const { PENDING, RESOLVED, REJECTED } = this.states
        const f = typeof onFulfilled == "function" ? onFulfilled : c => c;
        const r =
          typeof onRejected == "function"
            ? onRejected
            : c => {
              throw c;
            };

        switch (this.state) {
          case PENDING:
            // ‘PENDING’状态下向回调函数集合添加callback
            this.resolvedCallBacks.push(f)
            this.rejectedCallBacks.push(r)
            break;
          case RESOLVED:
            // 将回调函数的返回值赋值给 实例的 value，满足链式调用then方法时传递value
            this.value = f(this.value)
            break;
          case REJECTED:
            // 同上
            this.value = r(this.value)
            break;
          default:
            break;
        }
        // 满足链式调用then，返回MyPromise实例对象
        return this
      }
    }

    MyPromise.resolve('success').then((e) => {
      console.log(e);
      return e + 1
    }).then(res => {
      console.log(res);
    })
    new MyPromise(resolve => {
      setTimeout(() => {
        resolve(1);
      }, 2000);
    })
      .then(res1 => {
        console.log(res1);
        return 2;
      })
      .then(res2 => console.log(res2));
      
```

# es5
```
    function Promise(executor) {
      let self = this
      this.status = 'pending' //当前状态
      this.value = undefined  //存储成功的值
      this.reason = undefined //存储失败的原因
      this.onResolvedCallbacks = []//存储成功的回调
      this.onRejectedCallbacks = []//存储失败的回调
      function resolve(value) {
        if (self.status == 'pending') {
          self.status = 'resolved'
          self.value = value
          self.onResolvedCallbacks.forEach(fn => fn());
        }
      }
      function reject(error) {
        if (self.status == 'pending') {
          self.status = 'rejected'
          self.reason = error
          self.onRejectedCallbacks.forEach(fn => fn())
        }
      }
      try {
        executor(resolve, reject)
      } catch (error) {
        reject(error)
      }
    }
    Promise.prototype.then = function (infulfilled, inrejected) {
      let self = this
      let promise2
      infulfilled = typeof infulfilled === 'function' ? infulfilled : function (val) {
        return val
      }
      inrejected = typeof inrejected === 'function' ? inrejected : function (err) {
        throw err
      }
      if (this.status == 'resolved') {
        promise2 = new Promise(function (resolve, reject) {
          //x可能是一个promise，也可能是个普通值
          setTimeout(function () {
            try {
              let x = infulfilled(self.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          });

        })
      }
      if (this.status == 'rejected') {

        promise2 = new Promise(function (resolve, reject) {
          //x可能是一个promise，也可能是个普通值
          setTimeout(function () {
            try {
              let x = inrejected(self.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          });
        })
      }
      if (this.status == 'pending') {
        promise2 = new Promise(function (resolve, reject) {
          self.onResolvedCallbacks.push(function () {
            //x可能是一个promise，也可能是个普通值
            setTimeout(function () {
              try {
                let x = infulfilled(self.value)
                resolvePromise(promise2, x, resolve, reject)
              } catch (err) {
                reject(err)
              }
            });
          })
          self.onRejectedCallbacks.push(function () {
            //x可能是一个promise，也可能是个普通值
            setTimeout(function () {
              try {
                let x = inrejected(self.reason)
                resolvePromise(promise2, x, resolve, reject)
              } catch (err) {
                reject(err)
              }
            });
          })
        })
      }
      return promise2
    }
    function resolvePromise(p2, x, resolve, reject) {
      if (p2 === x && x != undefined) {
        reject(new TypeError('类型错误'))
      }
      //可能是promise,看下对象中是否有then方法，如果有~那就是个promise
      if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {//为了防止出现 {then:11}这种情况,需要判断then是不是一个函数
          let then = x.then
          if (typeof then === 'function') {
            then.call(x, function (y) {
              //y 可能还是一个promise,那就再去解析，知道返回一个普通值为止
              resolvePromise(p2, y, resolve, reject)
            }, function (err) {
              reject(err)
            })
          } else {//如果then不是function 那可能是对象或常量
            resolve(x)
          }
        } catch (e) {
          reject(e)
        }
      } else {//说明是一个普通值 
        resolve(x)
      }
    }
```



# 比较完整的一个版本
```
    const Promise = (() => {
      const PENDING = "pending",
        RESOLVED = "resolved",
        REJECTED = "rejected",
        PromiveValue = Symbol("PromiseValue"), // 状态数据
        PromiseStatus = Symbol("PromiseStatus"),
        thenables = Symbol("thenables"), //thenable
        catchables = Symbol("catchbles"), //catchables
        changeStatus = Symbol("changeStatus"),// 改变状态
        settleHandle = Symbol("settleHandle"), //后续处理的通用函数
        linkPromise = Symbol("linkPromise");  //创建串联的Promise

      return class Promise {

        /**
         * 改变当前Promise的状态
         * @param {*} newStatus 
         * @param {*} newValue 
         * @param {*} queue 执行的作业队列
         */
        [changeStatus](newStatus, newValue, queue) {
          if (this[PromiseStatus] !== PENDING) {
            //状态无法变更
            return;
          }
          this[PromiseStatus] = newStatus;
          this[PromiveValue] = newValue;
          //执行相应队列中的函数
          queue.forEach(handler => handler(newValue));
        }

        /**
         * 
         * @param {*} executor 未决阶段（pending状态）下的处理函数
         */
        constructor(executor) {
          this[PromiseStatus] = PENDING;
          this[PromiveValue] = undefined;
          this[thenables] = []; //后续处理函数的数组 -> resolved
          this[catchables] = []; //后续处理函数的数组 -> rejected

          const resolve = data => {
            this[changeStatus](RESOLVED, data, this[thenables]);
          }

          const reject = reason => {
            this[changeStatus](REJECTED, reason, this[catchables]);
          }
          try {
            executor(resolve, reject)
          }
          catch (err) {
            reject(err);
          }
        }

        /**
         * 处理 后续处理函数
         * @param {*} handler 后续处理函数
         * @param {*} immediatelyStatus 需要立即执行的状态
         * @param {*} queue 作业队列
         */
        [settleHandle](handler, immediatelyStatus, queue) {
          if (typeof handler !== "function") {
            return;
          }
          if (this[PromiseStatus] === immediatelyStatus) {
            //直接运行
            setTimeout(() => {
              handler(this[PromiveValue]);
            }, 0);
          }
          else {
            queue.push(handler);
          }
        }

        [linkPromise](thenalbe, catchable) {
          function exec(data, handler, resolve, reject) {
            try {
              const result = handler(data); //得到当前Promise的处理结果
              if (result instanceof Promise) {
                result.then(d => {
                  resolve(d)
                }, err => {
                  reject(err);
                })
              }
              else {
                resolve(result);
              }
            }
            catch (err) {
              reject(err);
            }
          }

          return new Promise((resolve, reject) => {
            this[settleHandle](data => {
              exec(data, thenalbe, resolve, reject);
            }, RESOLVED, this[thenables])

            this[settleHandle](reason => {
              exec(reason, catchable, resolve, reject);
            }, REJECTED, this[catchables])
          })
        }

        then(thenable, catchable) {
          return this[linkPromise](thenable, catchable);
        }

        catch(catchable) {

          return this[linkPromise](undefined, catchable);
        }


        static all(proms) {
          return new Promise((resolve, reject) => {
            const results = proms.map(p => {
              const obj = {
                result: undefined,
                isResolved: false
              }
              p.then(data => {
                obj.result = data;
                obj.isResolved = true;
                //判断是否所有的全部完成
                const unResolved = results.filter(r => !r.isResolved)
                if (unResolved.length === 0) {
                  //全部完成
                  resolve(results.map(r => r.result));
                }
              }, reason => {
                reject(reason);
              })
              return obj;
            })
          })
        }

        static race(proms) {
          return new Promise((resolve, reject) => {
            proms.forEach(p => {
              p.then(data => {
                resolve(data);
              }, err => {
                reject(err);
              })
            })
          })
        }

        static resolve(data) {
          if (data instanceof Promise) {
            return data;
          }
          else {
            return new Promise(resolve => {
              resolve(data);
            })
          }
        }

        static reject(reason) {
          return new Promise((resolve, reject) => {
            reject(reason);
          })
        }
      }
    })();
```


# all
```
function isPromise(x) {
    if (typeof x === 'function' || (typeof x === 'object' && x != null)) {
        if (typeof x.then === 'function') {
            return true;
        }
    }
    return false;
}

Promise.all = function (values){
    return new Promise((resolve, reject) => {
        let arr = [];
        let i = 0;
        let processData = (key, data) => {
            arr[i] = data;
            if (++i === values.length) {
                resolve(arr);
            }
        };
        for (let i = 0; i < values.length; i++) {
            let current = values[i];
            if (isPromise(current)) {
                current.then(y => {
                    processData(i, y);
                }, reject);
            } else {
                processData(i, current);
            }
        }
    });
};
```

# race
```
function isPromise(x) {
    if (typeof x === 'function' || (typeof x === 'object' && x != null)) {
        if (typeof x.then === 'function') {
            return true;
        }
    }
    return false;
}
Promise.race = function (values){
    return new Promise((resolve, reject) => {
        for (let i = 0; i < values.length; i++) {
            let current = values[i];
            if (isPromise(current)) {
                current.then(resolve, reject);
            } else {
                resolve(current);
            }
        }
    }});
};
```


# x
```
class Promise{
  constructor(executor){
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };
    try{
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled,onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        });
      };
    });
    return promise2;
  }
  catch(fn){
    return this.then(null,fn);
  }
}
function resolvePromise(promise2, x, resolve, reject){
  if(x === promise2){
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  let called;
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if (typeof then === 'function') { 
        then.call(x, y => {
          if(called)return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, err => {
          if(called)return;
          called = true;
          reject(err);
        })
      } else {
        resolve(x);
      }
    } catch (e) {
      if(called)return;
      called = true;
      reject(e); 
    }
  } else {
    resolve(x);
  }
}
//resolve方法
Promise.resolve = function(val){
  return new Promise((resolve,reject)=>{
    resolve(val)
  });
}
//reject方法
Promise.reject = function(val){
  return new Promise((resolve,reject)=>{
    reject(val)
  });
}
//race方法 
Promise.race = function(promises){
  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      promises[i].then(resolve,reject)
    };
  })
}
//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = function(promises){
  let arr = [];
  let i = 0;
  function processData(index,data){
    arr[index] = data;
    i++;
    if(i == promises.length){
      resolve(arr);
    };
  };
  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      promises[i].then(data=>{
        processData(i,data);
      },reject);
    };
  });
}
```

