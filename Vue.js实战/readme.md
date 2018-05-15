[随书代码](https://github.com/icarusion/vue-book)

# 1. 初始Vue.js
MVVM(Model-View-View Model):当View(视图层)变化时，会自动更新到ViewModel(视图模型)，反之亦然。View 和ViewModel 之间通过双向绑定(data-binding)建立联系.

![](https://images2018.cnblogs.com/blog/771172/201805/771172-20180511232115090-1106441045.jpg)



# 2. 数据绑定和第一个Vue 应用
在 `{{}}` 中，除了简单的绑定属性值外，还可以使用JavaScript 表达式进行简单的运算、三元运算等.
只支持单个表达式，不支持语句和流控制。另外，在表达式中，不能使用用户自定义的全局变量， 只能使用Vue 白名单内的全局变量， 例如Math 和Date 。

# 3. 计算属性
computed可以依赖其他计算属性,
不仅可以依赖当前Vue 实例的数据，还可以依赖其他实例的数据.

# 4. v-bind 及class 与style 绑定
当:class 的表达式过长或逻辑复杂时，可以使用data 或computed.

# 5. 内置指令
v-once 作用是定义它的元素或组件只渲染一次，包括元素或
组件的所有子节点。首次渲染后，不再随数据的变化重新渲染，将被视为静态内容.

进行切换时,如果希望组件不被复用,可以给他们加不同的key.

v-show 不能在`<template>`中用.

v-if 更适合条件不经常改变的场景，因为它切换开销相对较大，而v-show 适用于频繁切换条件。


在模板上绑定的事件,当ViewModel 销毁时，所有的事件处理器都会自动删除，无须自己清理。

Vue 提供了一个特殊变量$event ，用于访问原生DOM 事件.
```
//template
<div id="app">
  <div @click="handleClick('禁止打开',$event)">a</div>
  <div @click="(e)=>handleClick('禁止打开',e)">a</div>
</div>

//js
methods: {
  handleClick:function(message, event){
    event.preventDefault();
    console.log(message);
  }
}
```

# 6. 表单与v-model
略

# 7. 组件详解
JavaScript 对象是引用关系， 所以如果return 出的对象引用了外部的一个对象， 那这个对象就是共享的， 任何一方修改都会同步。所以组件才需要返回一个新的data 对象来独立.

在js中数组和对象是引用类型，指向同一个内存空间，所以props 是对象和数组时，在子组件内改变是会影响父纽件的。

爷孙通信:
1. 使用一个空的Vue实例作为中央事件总线(bus).?给一个中介组件加$on?
2. $parent,$refs

$slots.default不是必须的
```
<slot>
  <p>如果父组件没有插入内容，将作为默认出现</p>
</slot>
```

可以通过scope slot 作用域插槽读取子组件的插槽内的数据

组件内可以通过设置的name，在组件模板内就递归调用自己，不过需要注意限制递归数量，否则会抛出错误： max stack size exceeded 。

inline-template可自定义某组件的template内容.

`<component>`配合:is用来动态地挂载不同的组件.

异步组件?

异步更新队列:
Vue在观察到数据变化时并不是直接更新DOM，而是开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。
在缓冲时会去除重复数据，从而避免不必要的计算和DOM 操作。然后，在下一个事件循环tick 中， Vue 刷新队列并执行实际（己去重的）工作。
所以如果用一个for循环来动态改变数据100次，其实它只会应用最后一次改变，如果没有这种机制， DOM 就要重绘100次，这是一个很大的开销。

Vue 提供了Vue.extend 和$mount 两个方法来手动挂载一个实例。
Vue.extend 是基础Vue 构造器，创建一个'子类'，参数是一个包含组件选项的对象。
如果Vue 实例在实例化时没有收到el 选项，它就处于'未挂载'状态，没有关联的DOM 元素。可以使用$mount()手动地挂载一个未挂载的实例。这个方法返回实例自身，因而可以链式调用其他实例方法。

# 8. 自定义指令

[作者有些代码应该是直接出自iview](https://github.com/iview/iview)

v-clickoutside
```
export default {
    bind (el, binding, vnode) {
        function documentHandler (e) {
            if (el.contains(e.target)) {
              //判断点击的区域是否是指令所在的元素内部
                return false;
            }
            if (binding.expression) {//字符串形式的指令表达式
              //当前的指令v-clickoutside 有没有写表达式(函数),//binding.value就是用来执行当前上下文methods 中指定函数的。
                binding.value(e);
            }
        }
        //el.__vueClickOutside__保存docurnentHandlerd的引用,便于销毁
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update () {},
    unbind (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
};
```

time.js
```
var Time = {
     //获取当前时间戳
     getUnix:function(){
       var date = new Date();
       return date.getTime();
     },
     //获取今天0点0分0秒的时间戳
     getTodayUnix:function(){
       var date = new Date();
       date.setHours(0);
       date.setMinutes(0);
       date.setSeconds(0);
       date.setMilliseconds(0);
       return date.getTime();
     },
     //获取今年1月1日0点0分0秒的时间戳
     getYearUnix:function(){
       var date = new Date();
       date.setMonth(0);
       date.setDate(1);
       date.setHours(0);
       date.setMinutes(0);
       date.setSeconds(0);
       date.setMilliseconds(0);
       return date.getTime();
     },
     //获取标准年月日
     getLastDate:function(time){
       var date = new Date(time);
       var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
       var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
       return date.getFullYear() + '-' + month + '-' + day;
     },
     //转换时间
     getFormatTime:function(timestamp){
       var now = this.getUnix(); // 当前时间戳
       var today = this.getTodayUnix(); // 今天0点的时间戳
       var year = this.getYearUnix(); // 今年0点的时间戳
       var timer = (now - timestamp) / 1000; // 转换为秒级时间戳
       var tip = '';
 
       if(timer <= 0){
         tip = '刚刚';
       }else if(Math.floor(timer/60) <= 0){
         tip = '刚刚';
       }else if(timer < 3600){
         tip = Math.floor(timer/60) + '分钟前';
       }else if(timer >= 3600 && (timestamp - today >= 0)){
         tip = Math.floor(timer/3600) + '小时前';
       }else if(timer/86400 <= 31){
         tip = Math.ceil(timer/86400) + '天前';
       }else{
         tip = this.getLastDate(timestamp);
       }
       return tip;
     }
   }
```

v-time
将表达式传入的时间戳实时转换为相对时间
```
Vue.directive('time',{
  bind:function(el, binding){
    //binding.value代表指令的绑定值
    el.innerHTML = Time.getFormatTime(binding.value);
    el.__timeout__ = setInterval(function(){
      el.innerHTML = Time.getFormatTime(binding.value);
    }, 60000)
  },
  unbind:function(el){
    clearInterval(el.__timeout__);
    delete el.__timeout__;
  }
})
```


# 9. Render函数


![](https://images2018.cnblogs.com/blog/771172/201805/771172-20180511232140119-666532366.jpg)



![](https://images2018.cnblogs.com/blog/771172/201805/771172-20180511232132632-984201203.jpg)



所有的组件树中，如果VNode 是组件或含有组件的slot，那么VNode 必须唯一.


```
on: {
  '!click' : this.doThisinCapturingMode,
  '~keyup' : this.doThisOnce,
  '~!mouseover' : this.doThisOnceinCapturingMode
}
```

Vue. 提供了一个functional 的布尔值选项，设置为true 可以使组件无状态和无实例，也就是没有data 和this 上下哀。这样用render 函数返回虚拟节点可以更容易渲染，因为函数化组件只是一个函数，渲染开销要小很多。

使用函数化组件时， Render 函数提供了第二个参数context 来提供临时上下文。组件需要的data 、props 、slots 、children 、parent 都是通过这个上下文来传递的， 比如this.level 要改写为context. props.level, this.$slots.default 改写为context.children 。

# 10. 使用webpack
略

# 11. 插件

前端路由，即由前端来维护一个路由规则。
实现有两种，一种是利用url的hash, 就是常说的锚(`#`),JavaScript通过hashChange事件来监听url 的改变,IE7及以下需要用轮询;
另一种就是HTML5 的History模式，它使url 看起来像普通网站那样，以`/`分剖，没有`#`，但页面并没有跳转，不过使用这种模式需要服务端支持，服务端在接收到所有的请求后，都指向同一个html 文件，不然会出现404 。因此， SPA 只有一个html，整个网站所有的内容都在这一个html 里，通过JavaScript 来处理。



$bus.on应该在created 钩子内使用，如果在mounted使用,它可能接收不到其他组件来自created 钩子内发出的事件.
使用了$bus.on,在beforeDestroy 钩子里应该再使用$bus.off解除，因为组件销毁后，就没必要把监听的句柄储存在vue-bus里了.
```
//vue-bus

const install = function (Vue) {
    const Bus = new Vue({
        methods: {
            emit (event, ...args) {
                this.$emit(event, ...args);
            },
            on (event, callback) {
                this.$on(event, callback);
            },
            off (event, callback) {
                this.$off(event, callback);
            }
        }
    });
    Vue.prototype.$bus = Bus;
};

export default install;

//Vue.use(VueBus);
```

# 12. iView 经典组件剖析

emitter使用递归向上或向下的方式查找指定的组件名称(name),找到后触发$emit.
```
//emitter.js

function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        const name = child.$options.name;

        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            //@todo 如果 params 是空数组，接收到的会是 undefined
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}
export default {
    methods: {
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.name;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        }
    }
};
```

findComponentUpward方法以当前实例为参照点，向上寻找出指定name 或几个name 中的一
个组件实例，找到后立即返回该实例。
findComponentsUpward找所有.
```
// Find components upward
function findComponentUpward (context, componentName, componentNames) {
    if (typeof componentName === 'string') {
        componentNames = [componentName];
    } else {
        componentNames = componentName;
    }

    let parent = context.$parent;
    let name = parent.$options.name;
    while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
    }
    return parent;
}
//findComponentUpward(this, 'Cascader')

// Find components upward
export function findComponentsUpward (context, componentName) {
    let parents = [];
    const parent = context.$parent;
    if (parent) {
        if (parent.$options.name === componentName) parents.push(parent);
        return parents.concat(findComponentsUpward(parent, componentName));
    } else {
        return [];
    }
}
//findComponentsUpward(this, 'Submenu')
```

向下寻找指定的组件，findComponentsDownward 会找到所有匹配的子组件，而
findComponentDownward 只会找到第一个匹配的。
```
// Find component downward
export function findComponentDownward (context, componentName) {
    const childrens = context.$children;
    let children = null;

    if (childrens.length) {
        for (const child of childrens) {
            const name = child.$options.name;
            if (name === componentName) {
                children = child;
                break;
            } else {
                children = findComponentDownward(child, componentName);
                if (children) break;
            }
        }
    }
    return children;
}

// Find components downward
export function findComponentsDownward (context, componentName) {
    return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) components.push(child);
        const foundChilds = findComponentsDownward(child, componentName);
        return components.concat(foundChilds);
    }, []);
}
```

```
// Find brothers components
export function findBrothersComponents (context, componentName) {
    let res = context.$parent.$children.filter(item => {
        return item.$options.name === componentName;
    });
    let index = res.indexOf(context);
    res.splice(index, 1);
    return res;
}
```


scrollTop animation
```
export function scrollTop(el, from = 0, to, duration = 500) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000/60);
            }
        );
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) return;

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
}

//const sTop = document.documentElement.scrollTop || document.body.scrollTop;
//scrollTop(window, sTop, 0, this.duration);
```

[v-transfer-dom](https://github.com/airyland/vux/blob/v2/src/directives/transfer-dom/index.js)


# 13. 
略

# 14.
略

# 15.
略

***
(完)

***