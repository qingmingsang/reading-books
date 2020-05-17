用户点击了一次A，然后点击一次B，又点击一次A，输入框显示结果的顺序为先显示A异步请求结果，再次显示B的请求结果，最后再次显示A的请求结果。
```
    //dom元素
    var a = document.querySelector("#a")
    var b = document.querySelector("#b")
    var i = document.querySelector("#ipt");
    //全局变量p保存promie实例
    var P = Promise.resolve();
    a.onclick  = function(){
        //将事件过程包装成一个promise并通过then链连接到
        //全局的Promise实例上，并更新全局变量，这样其他点击
        //就可以拿到最新的Promies执行链
        P = P.then(function(){
            //then链里面的函数返回一个新的promise实例
            return new Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve()
                    i.value = "a";
                },1000)
            })
        })
    }
    b.onclick  = function(){
        P = P.then(function(){
            return new Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve()
                    console.log("b")
                    i.value = "b"
                },2000)
            })
        })
    }
```
