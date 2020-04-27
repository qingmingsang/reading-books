React hook 底层是基于链表（Array）实现，每次组件被 render 的时候都会顺序执行所有的 hooks，因为底层是链表，每一个 hook 的 next 是指向下一个 hook 的，所以要求开发者不能在不同 hooks 调用中使用判断条件，因为 if 会导致顺序不正确，从而导致报错。



