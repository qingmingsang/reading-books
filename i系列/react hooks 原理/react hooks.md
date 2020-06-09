useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API。

默认情况下，React 会在每次渲染后调用副作用函数 —— 包括第一次渲染的时候。

Hook 是一种复用状态逻辑的方式，它不复用 state 本身。事实上 Hook 的每次调用都有一个完全独立的 state —— 因此你可以在单个组件中多次调用同一个自定义 Hook。

 effect 的清除阶段在每次重新渲染时都会执行，而不是只在卸载组件的时候执行一次。

 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循依赖数组的工作方式。

 如果你传入了一个空数组（[]），effect 内部的 props 和 state 就会一直拥有其初始值。

## useLayoutEffect
其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

尽可能使用标准的 useEffect 以避免阻塞视觉更新。

useLayoutEffect 相比 useEffect，通过同步执行状态更新可解决一些特性场景下的页面闪烁问题。
useEffect 可以满足百分之99的场景，而且 useLayoutEffect 会阻塞渲染，请谨慎使用。

Hook的主要优化手段是useMemo和useCallback，前者用于缓存结果，后者用于缓存函数

几乎所有组件内的函数都要使用useCallback包裹，并且都要尽可能补全它的依赖项。因为函数组件都是“快照式”的，没有this的概念，所以无法实现class中this.mounted.
如果我们需要一个“穿越时空”的全组件可共享的状态，那就需要用到useRef。

对于一些简单的 JS 运算来说，我们不需要使用 useMemo 来「记住」它的返回值。

虽然在 React 中 useRef 和 useMemo 的实现有一点差别，但是当 useMemo 的依赖数组为空数组时，它和 useRef 的开销可以说相差无几。useRef 甚至可以直接用 useMemo 来实现，就像下面这样：
```
const useRef = (v) => {
  return useMemo(() => ({current: v}), []);
};
```

### 一、应该使用 useMemo 的场景

1.保持引用相等
- 对于组件内部用到的 object、array、函数等，如果用在了其他 Hook 的依赖数组中，或者作为 props 传递给了下游组件，应该使用 useMemo。
- 自定义 Hook 中暴露出来的 object、array、函数等，都应该使用 useMemo 。以确保当值相同时，引用不发生变化。
- 使用 Context 时，如果 Provider 的 value 中定义的值（第一层）发生了变化，即便用了 Pure Component 或者 React.memo，仍然会导致子组件 re-render。这种情况下，仍然建议使用 useMemo 保持引用的一致性。

2.成本很高的计算
比如 cloneDeep 一个很大并且层级很深的数据

### 二、无需使用 useMemo 的场景

- 如果返回的值是原始值： string, boolean, null, undefined, number, symbol（不包括动态声明的 Symbol），一般不需要使用 useMemo。
- 仅在组件内部用到的 object、array、函数等（没有作为 props 传递给子组件），且没有用到其他 Hook 的依赖数组中，一般不需要使用 useMemo。


在使用 useMemo 或者 useCallback 时，可以借助 ref 或者 setState callback，确保返回的函数只创建一次。也就是说，函数不会根据依赖数组的变化而二次创建。

```
const App: React.FC<{ title: string }> = ({ title }) => {
  return React.useMemo(() => <div>{title}</div>, [title]);
};

App.defaultProps = {
  title: 'Function Component'
}
```

- 用 React.FC 申明 Function Component 组件类型与定义 Props 参数类型。
- 用 React.useMemo 优化渲染性能。
- 用 App.defaultProps 定义 Props 的默认值。


useRef 尽量少用，大量 Mutable 的数据会影响代码的可维护性。但对于不需重复初始化的对象推荐使用 useRef 存储

Function Component 每次渲染都会重新执行，常量推荐放到函数外层避免性能问题，函数推荐使用 useCallback 申明。

使用 useCurrentValue 对引用总是变化的 props 进行包装：
```
function useCurrentValue<T>(value: T): React.RefObject<T> {
  const ref = React.useRef(null);
  ref.current = value;
  return ref;
}

const App: React.FC = ({ onChange }) => {
  const onChangeCurrent = useCurrentValue(onChange)
};
```
onChangeCurrent 的引用保持不变，但每次都会指向最新的 props.onChange，从而可以规避这个问题。


```
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // 将 text 写入到 ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // 从 ref 中读取 text
    alert(currentText);
  }, [textRef]); // handleSubmit 只会依赖 textRef 的变化。不会在 text 改变时更新

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```
首先，因为在函数式组件里没有了 this 来存放一些实例的变量，所以 React 建议使用 useRef 来存放一些会发生变化的值，useRef 并不再单单是为了 DOM 的 ref 准备的，同时也会用来存放组件实例的属性。在 updateText 完成对 text 的更新后，再在 useLayoutEffect (等效于 didMount 和 didUpdate) 里写入 textRef.current 中。这样，在 handleSubmit 里取出的 textRef 中存放的值就永远是新值了。


