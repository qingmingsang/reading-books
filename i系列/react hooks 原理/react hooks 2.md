hooks
当函数组件里面，有多个 effect 的时候，默认的 effect 将在每次 UI render 之后被调用。

需要把 useEffect 内部引用到的方式，声明为当前 effect 的依赖

理解每一次的 Rendering
每一次渲染都有它自己的 Props and State
每一次渲染都有它自己的事件处理函数
每次渲染都有它自己的 Effects

在 hooks 组件里面，每一次的渲染，都相当于记录当前次的『快照』

useEffect是异步的，useLayoutEffect是同步的

useLayoutEffect: 在大多数情况下，我们都可以使用useEffect处理副作用，但是，如果副作用是跟DOM相关的，就需要使用useLayoutEffect。useLayoutEffect中的副作用会在DOM更新之后同步执行。

useEffect是异步的，所谓的异步就是利用requestIdleCallback，在浏览器空闲时间执行传入的callback。
大部分情况下，用哪一个都是一样的，如果副作用执行比较长，比如大量计算，如果是useLayoutEffect就会造成渲染阻塞。


useEffect不会阻碍函数组件的渲染，从代码上理解是指，React完成函数组件的渲染，浏览器完成对应dom绘制后，才会去运行useEffect内的函数。
即便是函数组件进行第二次渲染的时候，也是先完成渲染工作后，才去运行useEffect中返回的清理副作用的函数，最后再运行useEffect内的函数。(requestIdleCallback)

```
//第一次渲染："render 10" => "Effect 10"

//第二次渲染： "render 20" => "Clearup effect 10" => "Effect 20"

function Example(props) {
    useEffect(
        () => {
            consle.log('Effect', props.id);
            ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
            // 返回清理副作用的函数
            return () => {
                consle.log('Clearup effect', props.id);
                ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
            };
        }
    );
    console.log('render', props.id);
    return (
        <div></div>
    )
};
```


```
useMemo(() => {
	//只执行一次,比useEffect前
}, [])
useEffect(() => {
      //每次渲染都会执行
})
useEffect(() => {
      //第一次渲染后执行,有且只会执行一次,相当于componentDidMount
},[])
useEffect(() => {
      //初始化执行一次,后续只有变量变化时才会执行
},[x])
```

```
setCount(c => c + 1); //  在这不依赖于外部的 `count` 变量,稳定取得上一次的count值
```

方便起见，useMemo 允许你跳过一次子节点的昂贵的重新渲染：
```
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```
注意这种方式在循环中是无效的，因为 Hook 调用 不能 被放在循环中。
但你可以为列表项抽取一个单独的组件，并在其中调用 useMemo。


如果依赖数组的值相同，useMemo 允许你 记住一次昂贵的计算。
但是，这仅作为一种提示，并不 保证 计算不会重新运行。
但有时候需要确保一个对象仅被创建一次。
```
// 传入初始值，作为 state
const [state, setState] = useState(initialState)

//  `惰性初始 state`；传入函数，由函数计算出的值作为 state
// 此函数只在初始渲染时被调用
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props)
  return initialState
})
```
func每重新执行一次,get每次都会同时重新执行一次,但是不会将y的值改变
```
    const [y, setY] = useState(get())
    function get() {
        return props.x;
    }
```

你或许也会偶尔想要避免重新创建 useRef() 的初始值。
举个例子，或许你想确保某些命令式的 class 实例只被创建一次：
```
function Image(props) {
  //  IntersectionObserver 在每次渲染都会被创建
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

useRef 不会 像 useState 那样接受一个特殊的函数重载。
相反，你可以编写你自己的函数来创建并将其设为惰性的：
```
function Image(props) {
  const ref = useRef(null);

  //  IntersectionObserver 只会被惰性创建一次
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // 当你需要时，调用 getObserver()
  // ...
}
```

forceUpdate的实现
```
const useUpdate = () => { 
  const [, setState] = useState(0);
  return () => setState(cnt => cnt + 1);
};
```
