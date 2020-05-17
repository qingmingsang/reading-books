生成ES module可以更好地进行tree shaking

```
//.babelrc.js
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false, // 关闭模块转换
      },
    ],
    '@babel/typescript',
    '@babel/react',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: true, // 使用esm形式的helper
      },
    ],
  ],
};
```

在 package.json 中增加sideEffects属性，配合ES module达到tree shaking效果（将样式依赖文件标注为side effects，避免被误删除）。
```
// ...
"sideEffects": [
  "dist/*",
  "esm/**/style/*",
  "lib/**/style/*",
  "*.less"
],
// ...
```

业务开发中，将@babel/preset-env的useBuiltIns选项值设置为 usage，同时把node_modules从babel-loader中exclude掉的同学可能想要这个特性：["useBuiltIns: usage" for node_modules without transpiling #9419](https://github.com/babel/babel/issues/9419)，在未支持该issue提到的内容之前，还是乖乖地将useBuiltIns设置为entry，或者不要把node_modules从babel-loader中exclude。


https://juejin.im/post/5ebcf12df265da7bc55df460
