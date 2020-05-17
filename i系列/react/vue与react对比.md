# 核心思想
vue
vue的整体思想仍然是拥抱经典的html(结构)+css(表现)+js(行为)的形式，vue鼓励开发者使用template模板，并提供指令供开发者使用(v-if、v-show、v-for等等)，因此在开发vue应用的时候会有一种在写经典web应用（结构、表现、行为分离）的感觉。
另一方面，在针对组件数据上，vue2.0通过Object.defineProperty对数据做到了更细致的监听，精准实现组件级别的更新。

react
react整体上是函数式的思想，组件使用jsx语法，all in js，将html与css全都融入javaScript，jsx语法相对来说更加灵活。
当组件调用setState或props变化的时候，组件内部render会重新渲染，子组件也会随之重新渲染，可以通过shouldComponentUpdate或者PureComponent可以避免不必要的重新渲染。

