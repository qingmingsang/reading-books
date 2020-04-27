https://juejin.im/post/5c99a75af265da60ef635898#heading-3


React Hooks简单原理：只是数组

不要在循环，条件判断，函数嵌套中使用hooks
只能在函数组件中使用hooks

```
function RenderFunctionComponent() {
  const [firstName, setFirstName] = useState("Rudi");
  const [lastName, setLastName] = useState("Yardley");

  return (
    <Button onClick={() => setFirstName("Fred")}>Fred</Button>
  );
}
```

1、初始化

初始化的时候，会创建两个数组: state和setters，把光标的位置设为0.
@1

2、第一次渲染
调用useState时，第一次渲染，会将一个set函数放入setters数组中，并且把初始state放入到state数组中.
@2

3、后续渲染
每一次重新渲染，光标都会重新设为0，然后从对应的数组中读取状态和set函数
@3

4 事件处理
每次调用set函数时，set函数将会修改state数组中对应的状态值，这种对应的关系是通过cursor光标来确定的
@4


## "简陋"的hooks：
```
let state = [];
let setters = [];
let firstRun = true;
let cursor = 0;

function createSetter(cursor) {
  return function setterWithCursor(newVal) {
    state[cursor] = newVal;
  };
}

// This is the pseudocode for the useState helper
export function useState(initVal) {
  if (firstRun) {
    state.push(initVal);
    setters.push(createSetter(cursor));
    firstRun = false;
  }

  const setter = setters[cursor];
  const value = state[cursor];

  cursor++;
  return [value, setter];
}

// Our component code that uses hooks
function RenderFunctionComponent() {
  const [firstName, setFirstName] = useState("Rudi"); // cursor: 0
  const [lastName, setLastName] = useState("Yardley"); // cursor: 1

  return (
    <div>
      <Button onClick={() => setFirstName("Richard")}>Richard</Button>
      <Button onClick={() => setFirstName("Fred")}>Fred</Button>
    </div>
  );
}

// This is sort of simulating Reacts rendering cycle
function MyComponent() {
  cursor = 0; // resetting the cursor
  return <RenderFunctionComponent />; // render
}

console.log(state); // Pre-render: []
MyComponent();
console.log(state); // First-render: ['Rudi', 'Yardley']
MyComponent();
console.log(state); // Subsequent-render: ['Rudi', 'Yardley']

// click the 'Fred' button

console.log(state); // After-click: ['Fred', 'Yardley']
```

看完简单的原理，解释一下为什么不能在循环，条件判断，嵌套函数中使用hooks：
```
let firstRender = true;

function RenderFunctionComponent() {
  let initName;
  
  if(firstRender){
    [initName] = useState("Rudi");
    firstRender = false;
  }
  const [firstName, setFirstName] = useState(initName);
  const [lastName, setLastName] = useState("Yardley");

  return (
    <Button onClick={() => setFirstName("Fred")}>Fred</Button>
  );
}
```
这段代码在条件渲染中使用hooks，第一次渲染时，内部的两个数组映射关系如下：
@5

我们可以看到firstName和setFirstName、lastName和setLastName有正确的对应关系，但是第二次渲染时：
@6
firstName的值是initName，lastName的值是fistName，这种映射的关系就混乱了，所以这就是不要在循环，条件判断，嵌套函数中使用hooks的原因。


## 简陋useState
```
var _state; // 把 state 存储在外面

function useState(initialValue) {
  _state = _state | initialValue; // 如果没有 _state，说明是第一次执行，把 initialValue 复制给它
  function setState(newState) {
    _state = newState;
    render();
  }
  return [_state, setState];
}
```

## 简陋useEffect
```
let _deps; // _deps 记录 useEffect 上一次的 依赖

function useEffect(callback, depArray) {
  const hasNoDeps = !depArray; // 如果 dependencies 不存在
  const hasChangedDeps = _deps
    ? !depArray.every((el, i) => el === _deps[i]) // 两次的 dependencies 是否完全相等
    : true;
  /* 如果 dependencies 不存在，或者 dependencies 有变化*/
  if (hasNoDeps || hasChangedDeps) {
    callback();
    _deps = depArray;
  }
}
```

## Not Magic, just Arrays
到现在为止，我们已经实现了可以工作的 useState 和 useEffect。但是有一个很大的问题：它俩都只能使用一次，因为只有一个 _state 和 一个 _deps。比如
```
const [count, setCount] = useState(0);
const [username, setUsername] = useState('fan');
```
count 和 username 永远是相等的，因为他们共用了一个 _state，并没有地方能分别存储两个值。我们需要可以存储多个 _state 和 _deps。

代码关键在于：
1. 初次渲染的时候，按照 useState，useEffect 的顺序，把 state，deps 等按顺序塞到 memoizedState 数组中。
2. 更新的时候，按照顺序，从 memoizedState 中把上次记录的值拿出来。

```
let memoizedState = []; // hooks 存放在这个数组
let cursor = 0; // 当前 memoizedState 下标

function useState(initialValue) {
  memoizedState[cursor] = memoizedState[cursor] || initialValue;
  const currentCursor = cursor;
  function setState(newState) {
    memoizedState[currentCursor] = newState;
    render();
  }
  return [memoizedState[cursor++], setState]; // 返回当前 state，并把 cursor 加 1
}

function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = memoizedState[cursor];
  const hasChangedDeps = deps
    ? !depArray.every((el, i) => el === deps[i])
    : true;
  if (hasNoDeps || hasChangedDeps) {
    callback();
    memoizedState[cursor] = depArray;
  }
  cursor++;
}
```

## QA
Q：为什么只能在函数最外层调用 Hook？为什么不要在循环、条件判断或者子函数中调用。
A：memoizedState 数组是按 hook定义的顺序来放置数据的，如果 hook 顺序变化，memoizedState 并不会感知到。

Q：自定义的 Hook 是如何影响使用它的函数组件的？
A：共享同一个 memoizedState，共享同一个顺序。

Q：“Capture Value” 特性是如何产生的？
A：每一次 ReRender 的时候，都是重新去执行函数组件了，对于之前已经执行过的函数组件，并不会做任何操作。

## 真正的 React 实现
React 中是通过类似单链表的形式来代替数组的。通过 next 按顺序串联所有的 hook。
```
type Hooks = {
  memoizedState: any, // 指向当前渲染节点 Fiber
  baseState: any, // 初始化 initialState， 已经每次 dispatch 之后 newState
  baseUpdate: Update<any> | null,// 当前需要更新的 Update ，每次更新完之后，会赋值上一个 update，方便 react 在渲染错误的边缘，数据回溯
  queue: UpdateQueue<any> | null,// UpdateQueue 通过
  next: Hook | null, // link 到下一个 hooks，通过 next 串联每一 hooks
}

type Effect = {
  tag: HookEffectTag, // effectTag 标记当前 hook 作用在 life-cycles 的哪一个阶段
  create: () => mixed, // 初始化 callback
  destroy: (() => mixed) | null, // 卸载 callback
  deps: Array<mixed> | null,
  next: Effect, // 同上 
};
```

memoizedState，cursor 是存在哪里的？如何和每个函数组件一一对应的？

我们知道，react 会生成一棵组件树（或Fiber 单链表），树中每个节点对应了一个组件，hooks 的数据就作为组件的一个信息，存储在这些节点上，伴随组件一起出生，一起死亡。





# hooks的实现
```
const hooks = (function() {
  const HOOKS = [];
  let currentIndex = 0;
  const Tick = {
      render: null,
      queue: [],
      push: function(task) {
          this.queue.push(task);
      },
      nextTick: function(update) {
          this.push(update);
          Promise.resolve(() => {
              if (this.queue.length) { // 一次循环后，全部出栈，确保单次事件循环不会重复渲染
                  this.queue.forEach(f => f()); // 依次执行队列中所有任务
                  currentIndex = 0; // 重置计数
                  this.queue = []; // 清空队列
                  this.render && this.render(); // 更新dom
              }
          }).then(f => f());
      }
  };

  function useState(initialState) {
      HOOKS[currentIndex] = HOOKS[currentIndex] || (typeof initialState === 'function' ? initialState() : initialState);
      const memoryCurrentIndex = currentIndex; // currentIndex 是全局可变的，需要保存本次的
      const setState = p => {
            let newState = p;
            if (typeof p === 'function') {
                newState = p(HOOKS[memoryCurrentIndex]);
            }
            if (newState === HOOKS[memoryCurrentIndex]) return;
            Tick.nextTick(() => {
                HOOKS[memoryCurrentIndex] = newState;
            });
      };
      return [HOOKS[currentIndex++], setState];
  }
  function useEffect(fn, deps) {
      const hook = HOOKS[currentIndex];
      const _deps = hook && hook._deps;
      const hasChange = _deps ? !deps.every((v, i) => _deps[i] === v) : true;
      const memoryCurrentIndex = currentIndex; // currentIndex 是全局可变的
      if (hasChange) {
          const _effect = hook && hook._effect;
          setTimeout(() => {
              typeof _effect === 'function' && _effect(); // 每次先判断一下有没有上一次的副作用需要卸载
              const ef = fn();
              HOOKS[memoryCurrentIndex] = {...HOOKS[memoryCurrentIndex], _effect: ef}; // 更新effects
          })
      }
      HOOKS[currentIndex++] = {_deps: deps, _effect: null};
  }
  function useReducer(reducer, initialState) {
      const [state, setState] = useState(initialState);
      const update = (state, action) => {
          const result = reducer(state, action);
          setState(result);
      }
      const dispatch = update.bind(null, state);
      return [state, dispatch];
  }
  function useMemo(fn, deps) {
      const hook = HOOKS[currentIndex];
      const _deps = hook && hook._deps;
      const hasChange = _deps ? !deps.every((v, i) => _deps[i] === v) : true;
      const memo = hasChange ? fn() : hook.memo;
      HOOKS[currentIndex++] = {_deps: deps, memo};
      return memo;
  }
  function useCallback(fn, deps) {
      return useMemo(() => fn, deps);
  }
  return {
    Tick, useState, useEffect, useReducer, useMemo, useCallback
  }
})();
```
