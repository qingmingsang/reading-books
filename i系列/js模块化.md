https://www.cnblogs.com/diligenceday/p/4504160.html

# Module模式
在模块化规范形成之前，JS开发者使用Module设计模式来解决JS全局作用域的污染问题。Module模式最初被定义为一种在传统软件工程中为类提供私有和公有封装的方法。在JavaScript中，Module模式使用匿名函数自调用 (闭包)来封装，通过自定义暴露行为来区分私有成员和公有成员。
```
let myModule = (function (window) {
    let moduleName = 'module'  // private
    // public
    function setModuleName(name) {
      moduleName = name
    }
    // public
    function getModuleName() {
      return moduleName
    }
    return { setModuleName, getModuleName }  // 暴露行为
  })(window)
```

# CommonJS原理
```
let fs = require('fs');
let path = require('path');
let b = req('./a.js');
// req即使CommonJS中的require方法
function req(mod) {
    let filename = path.join(__dirname, mod);
    let content = fs.readFileSync(filename, 'utf8');
    /**
       * 最后一个参数是函数的内容体,相当于以下函数
       *function fn(exports, module, require, __dirname, __filename) {
       *  module.exports = '这是另外一个文件导出的内容'
       *  return module.exports
       *}
    */
    let fn = new Function('exports', 'require', 'module', '__filename', '__dirname', content + '\n return module.exports;');
    let module = {
        exports: {}
    };
 
    return fn(module.exports, req, module, __filename, __dirname);
}
```

# AMD的原理
```
let factories = {};
/**
 * 实现AMD的define方法
 * @param moduleName 模块的名字
 * @param dependencies 依赖
 * @param factory 工厂函数
*/
function define(modName, dependencies, factory) {
    factory.dependencies = dependencies;
    factories[modName] = factory;
}
/**
 * 实现AMD的require方法
 * @param mods 引入的模块
 * @param callback 回调函数
 */
function require(modNames, callback) {
    let loadedModNames = modNames.map(function (modName) {
        let factory = factories[modName];
        let dependencies = factory.dependencies;
        let exports;
        require(dependencies, function (...dependencyMods) {
            exports = factory.apply(null, dependencyMods);
        });
        return exports;
    })
    callback.apply(null, loadedModNames);
}
```

## AMD实现
```
(function() {
    定义一个局部的difine;
    var define;
    //我偷偷加了个全局变量，好调试啊;
    window.modules = {
    };
    //通过一个名字获取绝对路径比如传"xx.js"会变成"http://www.mm.com/"+ baseUrl + "xx.html";
    var getUrl = function(src) {};
    //动态加载js的模块;
    var loadScript = function(src) {};
    //获取根路径的方法, 一般来说我们可以通过config.baseUrl配置这个路径;
    var getBasePath = function() {};
    //获取当前正在加载的script标签DOM节点;
    var getCurrentNode = function() {};
    //获取当前script标签的绝对src地址;
    var getCurrentPath = function() {};
    //加载define或者require中的依赖, 封装了loadScript方法;
    var loadDpt = function(module) {};
    //这个是主要模块, 完成了加载依赖, 检测依赖等比较重要的逻辑
    var checkDps = function() {};
    定义了define这个方法
    define = function(deps, fn, name) {};
    window.define = define;
    //require是封装了define的方法, 就是多传了一个参数而已;
    window.require = function() {
        //如果是require的话那么模块的名字就是一个不重复的名字，避免和define重名;
        window.define.apply([], Array.prototype.slice.call(arguments).concat( "module|"+setTimeout(function() {},0) ));
    };
});
```




```
(function (){
    const reg = /[= ]want[ ]?\([ ]?"[a-zA-Z/.0-9]+"[ ]?\)/g;
    const pathReg = /^.*\([ ]?"([a-zA-Z/.0-9]+)"[ ]?\)$/;
    const scriptContext=wantConfig&&wantConfig.scriptContext?wantConfig.scriptContext:'/app/'
    const scriptLeftWrapper="(function(){ return function(want){ "
    const scriptRightWrapper=" }})()"

    moduleInstances={}
    moduleFunctions={}
    moduleScripts={}

    function want(moduleName){
        var module=moduleInstances[moduleName];
        return module?module:initModule(moduleName)
    }
    function initModule(moduleName){
        var module=new moduleFunctions[moduleName](want)
        moduleInstances[moduleName]=module
        return module
    }
    function  parseWant(script){
        var wantList=script.match(reg)
        if(wantList){
            wantScriptFetchTasks= wantList.map(item => pathReg.exec(item)[1])
        .filter(item=>moduleScripts[item]==null)
        .map(item=>getScript(item));
            return Promise.all(wantScriptFetchTasks);
        }else{
            return Promise.resolve();
        }
    }
    function wrapScript(script,moduleName){
        if(wantConfig&&wantConfig.debug){
            document.writeln("load:"+moduleName)
            document.writeln("<br>")
            document.writeln(script)
            document.writeln("<br><br>")
        }
        var script=scriptLeftWrapper+script+scriptRightWrapper
        moduleScripts[moduleName]=script;
        moduleFunctions[moduleName]=eval(script)
    }
    function getScript(moduleName){
        var realLink=scriptContext+moduleName+'.js'
        return fetch(realLink).then((function(res){
            return res.text()
        })).then(function(res){
            wrapScript(res,moduleName);
            return parseWant(res)
        })
    }
    function initMain(){
        getScript("index").then(function(){
            if(wantConfig&&wantConfig.debug){
                document.writeln("<br>")
                document.writeln("init entry module:")
                document.writeln("<br>")
                document.writeln("<br>")
            }
            initModule("index")
        })
    }
    initMain()
})()
```