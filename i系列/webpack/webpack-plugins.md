# Plugin
一、Plugin 是什么，有什么用
是 webpack 用于在编译过程中利用钩子进行各种自定义输出的函数；
本质上就是一个 node 模块，通过写一个类来使用编译暴漏出来的钩子实现编译过程的可控；
由此我们就可以在开发模式下，可以通过监听编译过程的各个钩子事件来完成如释出模版，对 js、css、html 进行压缩、去重等各类操作，结束后释出对应文件等等你可以想到的任何操作

二、先说点细节，再说怎么写一个自定义 plugin
webpack 的插件简单来说就是在函数中通过调用 webpack 执行的钩子来完成自动化的过程，在函数中我们通过监听 compiler 钩子，并在回调中执行我们需要做的事情，最后调用回调中的第二个参数 callback 使 webpack 继续构建，否则将在此处停止编译，整个过程都是在 webpack 的整个编译过程中利用其暴漏出的钩子进行的

## compiler
webpack 的 Compiler 模块是主引擎，它通过 webpack CLI 或 webpack API 或 webpack 配置文件传递的所有选项，创建出一个 compilation 实例。同时它是tabpabled（一个库）的一个扩展类（extend）。

## compilation
Compilation 实例继承于 compiler。例如，compiler.compilation 是对所有 require 图(graph)中对象的字面上的编译。这个对象可以访问所有的模块和它们的依赖（大部分是循环依赖）。在编译阶段，模块被加载，封闭，优化，分块，哈希和重建等等。这将是任何编译操作中，重要的生命周期。

compiler.hooks.compilation中的compilation就是对应的webpack编译过程中的一个钩子函数

这里的tap就是给这个钩子函数中注册事件，钩子函数中都是会有各种task（任务），通过tap(name,task)就传入了对应的任务名和任务具体方法。同步的钩子函数使用tap,异步的可以使用tap tapAsync tapPromise。


## loader与plugins的区别：
loader在加载文件时调用。plugins在打包时调用。


仿照 htmlWebpackPlugin 进行模版输出，实例化插件时传入模版地址，释出文件名，需解析参数变量即可；
解析过程中会解析 `{{ key }}` 中的 param，将 `{{ key }} => 实例化对象中 params[key]`// webpack 配置

```
     // webpack 配置
      var EmitTemplatePlugin = require('./emit-template-plugin')
      plugins: [
        new EmitTemplate({
          template: './src/template/template.html',
          filename: path.resolve(__dirname, './index-emit-template.html'),
          params: {
            title: '测试啊',
            name: 'YOLO'
          }
        })
      ]
```

```
      // emit-template-plugin.js
      const fs = require('fs')

      function EmitTemplate (options) {
        this.templateDir = options.template
        this.targetDir = options.filename
        this.params = options.params
      }

      EmitTemplate.prototype.apply = function (compiler) {
        var self = this
        compiler.plugin('emit', function (compilation, callback) {
          fs.readFile(self.templateDir, (err, data) => {
            if (err) throw err
            // 匹配参数替换 html 模版中变量
            var reg = new RegExp(`{{\\s*(${Object.keys(self.params).join('|')})\\s*}}`, 'g')
            var html = data.toString().replace(reg, function (str, key, index) {
              return self.params[key]
            })

            fs.writeFile(self.targetDir, html, function () {
              console.log('模版写入成功')
              callback()
            })
          })
        })
      }

      module.exports = EmitTemplate
```

```
      // 模版 template.html
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>{{ title }}</title>
        </head>
        <body>
          <div class="">
            {{ name }}
          </div>
        </body>
      </html>

      // 解析后的释出文件 index-emit-template.html
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>测试啊</title>
        </head>
        <body>
          <div class="">
            YOLO
          </div>
        </body>
      </html>
```

```
上面的写法是 webpack2 或 webpack3 调用钩子的方法，在 4 中已变为
1
    compilation.hooks.compile.tap([compiler hooks event], (compilation, callback) => {
      ...
    })
```


生成一个目录项目目录的文件夹
```
class FileListPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        compiler.hooks.emit.tap('fileListPlugin', (compilation) => {
            let assets = compilation.assets
            let content = 'In this build:\r\n'
            Object.entries(assets).forEach(([fileName, fileSize]) => {
                content += `--${fileName} —— ${Math.ceil(fileSize.size() / 1024)}kb\r\n`
            })
            console.log('====content====', content)
            assets[this.options.filename] = {
                source() {
                    return content
                },
                size() {
                    return content.length
                }
            }
        })
    }
}
module.exports = FileListPlugin

```

```
const FileListPlugin = require('./plugins/fileListPlugin.js')
plugins:[
    new FileListPlugin({
            filename: 'filelist.md'
    }),
]
```

写一个生成版权信息的copyright文件的插件
```
class CopyRightWebpackPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        compiler.hooks.compile.tap('webpackCompiler', () => {
            console.log('compiler')
        })
        compiler.hooks.emit.tapAsync('CopyRightWebpackPlugin', (compilation, cb) => {
            compilation.assets[this.options.filename] = {
                source() {
                    return 'copyRight by heibao'
                },
                size() {
                    return 25
                }
            }
            cb()
        })
    }
}
module.exports = CopyRightWebpackPlugin
```

webpack 的源码compiler钩子函数是借助tapable库实现的

去除文件中 `/.../` 的注释
```
module.exports = class MinifyAnnotationPlugin {
  constructor(options) {
    this.options = options;
    this.externalModules = {};
  }
  apply(compiler) {
    var reg = /\/(\*)+.*(\*)+\//g; // 注释正则
    compiler.hooks.emit.tap("MinifyAnnotation", compilation => { // 注册emit事件
      // compilation对应所有编译的文件
      Object.keys(compilation.assets).forEach(filename => { 
        let content = compilation.assets[filename].source();
        content = content.replace(reg, ""); // 替换掉注释
        // 返回新的内容
        compilation.assets[filename] = {
          source() {
            return content;
          },
          size() {
            return content.length;
          }
        };
      });
    });
  }
};
```

```
const CopyRightWebpackPlugin = require('./plugins/copyright-webpack-plugin');
module.exports = {
　　plugins: [
　　　　/**
　　　　* 所以知道为什么插件要一个new，因为是一个类，用的时候需要new一下。
　　　　* new这个插件的时候，就使用了这个插件
　　　　*/
　　　　new CopyRightWebpackPlugin()
　　],
}
```
```
class CopyrightWebpackPlugin {
　　/**
　　* compiler是webpack的一个实例，这个实例存储了webpack各种信息，所有打包信息
　　* https://webpack.js.org/api/compiler-hooks
　　* 官网里面介绍了compiler里面有个hooks这样的概念
　　* hooks是钩子的意思，里面定义了时刻值
　　*/
　　apply(compiler) {
　　/**
　　* 用到了hooks，emit这个时刻，在输出资源之前，这里官网告诉我们是一个异步函数
　　* compilation是这一次的打包信息，所以跟compiler是不一样的
　　* tapAsync接受两个参数，第一个是名字，
　　*/
　　compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin',(compilation, cb)=>{
　　　　debugger;
　　　　compilation.assets['copyright.txt'] = {
　　　　　　source: function(){
　　　　　　　　return 'copyright by q'
　　　　　　},
　　　　　　size: function() {
　　　　　　　　return 15
　　　　　　}
　　　　};
　　　　// 最后一定要调用cb
　　　　cb();
　　})
　　/**
　　* 同步的时刻跟异步的时刻写代码的方式不一样
　　* 同步的时刻，后面只要一个参数就可以了
　　*/
　　compiler.hooks.compile.tap('CopyrightWebpackPlugin',(compilation) => {
　　　　console.log('compiler');
　　})
　　}
}
module.exports = CopyrightWebpackPlugin;
```

怎么知道compilation有assert这样的东西，这里有个debugger。
```
"scripts": {
　　"debug": "node --inspect --inspect-brk node_modules/webpack/bin/webpack.js",
　　"build": "webpack"
},
```
运行debug，就可以对插件进行调试，能够可视化对看见compilation下所有的信息。debug跟build是同样的一个东西，只不过debug可以在里面传入参数，比如--inspect表示打开调试


