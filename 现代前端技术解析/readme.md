#1　Web前端技术基础
##1.1　现代Web前端技术发展概述
前端项目代码越来越多，结构越来越复杂，如何实现项目的管理将直接决定后期的维护成本。所以我们必须考虑用模块化和组件化的思路来管理.
所谓的模块化和组件化是指采用代码管理中分治的思想，将复杂的代码结构拆分成多个独立、简单、解耦合的结构或文件分开管理，使项目结构更加清晰。

在页面内容较多、较复杂的情况下，为了让用户尽可能快速看到内容，我们可以通过异步的方式来实现，即将一部分内容先展示给用户，然后根据用户的操作，异步加载用户需要的其他内容，避免用户长时间等待。

怎样保证页面下载时消耗的流量尽可能小呢？
这可能就需要考虑图片的优化处理了，如使用更高压缩比webp格式的图片，在图片质量不降低的情况下，可以大幅度减小图片的网络流量消耗，提高图片加载速度。

对于重复打开的页面，合理地利用文件缓存就能让浏览器不再向服务器请求重复的内容，这样可以大幅度提高网页资源的加载速度，而且幸运的是，浏览器默认可以支持文件缓存，对于一段时间内浏览器的重复请求，服务器可能会返回HTTP的304状态码或者不发送请求，让浏览器直接从本地读取内容。

前端应用开发模式演变
@1

##1.2　浏览器应用基础
从我们打开浏览器输入一个网址到页面展示网页内容的这段时间内，浏览器和服务端都发生了什么事情？
1.　在接收到用户输入的网址后，浏览器会开启一个线程来处理这个请求，对用户输入的URL地址进行分析判断，如果是HTTP协议就按照HTTP方式来处理。
2.　调用浏览器引擎中的对应方法，比如WebView中的loadUrl方法，分析并加载这个URL地址。
3.　通过DNS解析获取该网站地址对应的IP地址，查询完成后连同浏览器的Cookie、userAgent等信息向网站目的IP发出GET请求。
4.　进行HTTP协议会话，浏览器客户端向Web服务器发送报文。
5.　进入网站后台上的Web服务器处理请求，如Apache、Tomcat、Node.js等服务器。
6.　进入部署好的后端应用，如PHP、Java、JavaScript、Python等后端程序，找到对应的请求处理逻辑，这期间可能会读取服务器缓存或查询数据库等。
7.　服务器处理请求并返回响应报文，此时如果浏览器访问过该页面，缓存上有对应资源，会与服务器最后修改记录对比，一致则返回304，否则返回200和对应的内容。
8.　浏览器开始下载HTML文档（响应报头状态码为200时）或者从本地缓存读取文件内容（浏览器缓存有效或响应报头状态码为304时）。
9.　浏览器根据下载接收到的HTML文件解析结构建立DOM（DocumentObjectModel，文档对象模型）文档树，并根据HTML中的标记请求下载指定的MIME类型文件（如CSS、JavaScript脚本等），同时设置缓存等内容。
10.　页面开始解析渲染DOM，CSS根据规则解析并结合DOM文档树进行网页内容布局和绘制渲染，JavaScript根据DOM　API操作DOM，并读取浏览器缓存、执行事件绑定等，页面整个展示过程完成。

通常我们认为浏览器主要由七部分组成：用户界面、网络、JavaScript引擎、渲染引擎、UI后端、JavaScript解释器和持久化数据存储。
@2
用户界面:
用户界面包括浏览器中可见的地址输入框、浏览器前进返回按钮、打开书签、打开历史记录等用户可操作的功能选项。
浏览器引擎:
浏览器引擎可以在用户界面和渲染引擎之间传送指令或在客户端本地缓存中读写数据等，是浏览器中各个部分之间相互通信的核心。
渲染引擎:
浏览器渲染引擎的功能是解析DOM文档和CSS规则并将内容排版到浏览器中显示有样式的界面，也有人称之为排版引擎，我们常说的浏览器内核主要指的就是渲染引擎。
网络:
网络功能模块则是浏览器开启网络线程发送请求或下载资源文件的模块，例如DOM树解析过程中请求静态资源首先是通过浏览器中的网络模块发起的，UI后端则用于绘制基本的浏览器窗口内控件，比如组合选择框、按钮、输入框等。
JavaScript引擎:
JavaScript解释器则是浏览器解释和执行JavaScript脚本的部分，例如V8引擎。
UI后端:
浏览器数据持久化存储则涉及cookie、localStorage等一些客户端存储技术，可以通过浏览器引擎提供的API进行调用。


目前，用户使用的主流浏览器内核有4类：
Trident内核:
例如Internet　Explorer、360浏览器、搜狗浏览器等；
Gecko内核:
Netscape6及以上版本，还有Firefox、SeaMonkey等；
Presto内核:
主要是Opera7及以上还在使用（Opera内核原来为Presto，现使用的是Blink内核）；
Webkit内核:
主要是Safari、Chrome浏览器在使用的内核，也是特性上表现较好的浏览器内核。
另外，Blink内核其实是WebKit的一个分支，添加了一些优化新特性，例如跨进程的iframe，将DOM移入JavaScript中来提高JavaScript对DOM的访问速度等，目前较多的移动端应用内嵌的浏览器内核也渐渐开始采用Blink。


渲染引擎的主要工作流程:
渲染引擎在浏览器中主要用于解析HTML文档和CSS文档，然后将CSS规则应用到HTML标签元素上，并将HTML渲染到浏览器窗口中以显示具体的DOM内容。
@3

解析HTML构建DOM树时渲染引擎会先将HTML元素标签解析成由多个DOM元素对象节点组成的且具有节点父子关系的DOM树结构，然后根据DOM树结构的每个节点顺序提取计算使用的CSS规则并重新计算DOM树结构的样式数据，生成一个带样式描述的DOM渲染树对象。
DOM渲染树生成结束后，进入渲染树的布局阶段，即根据每个渲染树节点在页面中的大小和位置，将节点固定到页面的对应位置上，这个阶段主要是元素的布局属性（例如position、float、margin等属性）生效，即在浏览器中绘制页面上元素节点的位置。
接下来就是绘制阶段，将渲染树节点的背景、颜色、文本等样式信息应用到每个节点上，这个阶段主要是元素的内部显示样式（例如color、background、text-shadow等属性）生效，最终完成整个DOM在页面上的绘制显示。

这里要关注的是渲染树的布局阶段和绘制阶段。
页面生成后，如果页面元素位置发生变化，就要从布局阶段开始重新渲染，也就是页面重排，所以页面重排一定会进行后续重绘；
如果页面元素只是显示样式改变而布局不变，那么页面内容改变将从绘制阶段开始，也称为页面重绘。重排通常会导致页面元素几何大小位置发生变化且伴随着重新渲染的巨大代价，因此我们要尽可能避免页面的重排，并减少页面元素的重绘。


@4
Webkit内核渲染DOM流程

@5
Gecko内核渲染DOM流程

Webkit内核解析后的渲染对象被称为渲染树（RenderTree），而Gecko内核解析后的渲染对象则称为Frame树（FrameTree）。

@6
DOM结构解析示意图

HTML文档解析过程是将HTML文本字符串逐行解析生成具有父子关系的DOM节点树对象的过程。

查看元素的原始类型
```
let　element=document.createElement('div');
let　type=Object.prototype.toString.call(element).slice(8,-1);//"HTMLDivElement"
```

@7

CSS解析和HTML解析类似，首先也要通过词法解析生成CSS分析树，而且也使用特定的CSS文本语法来实现，不同的是，HTML是使用类似XML结构的语法解析方式来完成分析的。

一个节点上多条不同的样式规则是通过权重的方式来计算的。关于CSS规则的权重计算，一般认为是
`!important>内联样式规则（权重1000）>id选择器（权重100）>类选择器（权重10）>元素选择器（权重1）`
在渲染树生成阶段，当多个CSSRule对应到同一个元素节点中时，这种权重计算方式的作用就体现出来了，一般只有权重最高的样式规则才会生效。

###1.2.3　浏览器数据持久化存储技术
@8
一般数据持久化存储主要是针对浏览器的，所以我们统称为浏览器缓存（BrowserCaching），浏览器缓存是浏览器端用于在本地保存数据并进行快速读取以避免重复资源请求的传输机制的统称。
有效的缓存可以避免重复的网络资源请求并让浏览器快速地响应用户操作，提高页面内容的加载速度。

####　HTTP文件缓存
浏览器HTTP文件缓存判断机制的流程图。
@9

1．浏览器会先查询Cache-Control（这里用Expires判断也是可以的，但是Expires一般设置的是绝对过期时间，Cache-Control设置的是相对过期时间）来判断内容是否过期，如果未过期，则直接读取浏览器端缓存文件，不发送HTTP请求，否则进入下一步。
2．在浏览器端判断上次文件返回头中是否含有Etag信息，有则连同If-None-Match一起向服务器发送请求，服务端判断Etag未修改则返回状态304，修改则返回200，否则进入下一步。
3．在浏览器端判断上次文件返回头中是否含有Last-Modified信息，有则连同If-Modified-Since一起向服务器发送请求，服务端判断Last-Modified是否失效，失效则返回200，未失效则返回304。
4．如果Etag和Last-Modified都不存在，直接向服务器请求内容。

HTTP缓存可以在文件缓存生效的情况下让浏览器从本地读取文件，不仅加快了页面资源加载，同时节省网络流量，所以在Web站点配置中要尽可能利用缓存来优化请求过程。
在HTML中，我们可以添加`<meta>`中的Expires或Cache-Control来设置，需要注意的是，一般这里Cache-Control设置max-age的时间单位是秒，如果同时设置了Expires和Cache-Control，则只有Cache-Control的设置生效。
```
<meta　http-equiv="Expires"　content="Mon,20Jul201623:00:00GMT"/>
<meta　http-equiv="Cache-Control"　content="max-age=7200"/>
```
当然服务端也需要进行对应设置，Node.js服务器可以使用中间件来这样设置静态资源文件的缓存时间，例如我们可以结合KoaWeb框架和koa-static中间件如下设置实现。
```
const　static=require('koa-static');
const　app=koa();
app.use(static('./pages',{
　maxage:7200
}));
```

####　localStorage
localStorage只支持简单数据类型的读取，为了方便localStorage读取对象等格式的内容，通常需要进行一层安全封装再引入使用。

```
let　rkey=/^[0-9A-Za-z_@-]*$/;
let　store;

//转换对象
function　init(){
　if(typeof　store==='undefined'){
　　store=window['localStorage'];
　}
　return　true;
}

//判断localStorage的key值是否合法
function　isValidKey(key){
　if(typeof　key!=='string'){
　　return　false;
　}
　return　rkey.test(key);
}

exports={
　//设置localStorage单条记录
　set(key,value){
　　let　success=false;
　　if(isValidKey(key)&&init()){
　　　try{
　　　　value+='';
　　　　store.setItem(key,value);
　　　　success=true;
　　　}catch(e){}
　　}
　　return　success;
　},
　//读取localStorage单条记录
　get(key){
　　if(isValidKey(key)&&init()){
　　　try{
　　　　return　store.getItem(key);
　　　}catch(e){}
　　}
　　return　null;
　},
　//移除localStorage单条记录
　remove(key){
　　if(isValidKey(key)&&init()){
　　　try{
　　　　store.removeItem(key);
　　　　return　true;
　　　}catch(e){}
　　}
　　return　false;
　},
　//清除localStorage所有记录
　clear(){
　　if(init()){
　　try{
　　for(let　key　in　store){
　　　　　store.removeItem(key);
　　　　}
　　　　return　true;
　　　}catch(e){}
　　}
　　return　false;
　}
};
module.exports=exports;
```
尽管单个域名下localStorage的大小是有限制的，但是可以用iframe的方式使用多个域名来突破单个页面下localStorage存储数据的最大限制。
另外使用浏览器多个标签页打开同个域名页面时，localStorage内容一般是共享的。

####　sessionStorage
sessionStorage和localStorage的功能类似，但是sessionStorage在浏览器关闭时会自动清空。sessionStorage的API和localStorage完全相同。由于不能进行客户端的持久化数据存储，实际项目中sessionStorage的使用场景相对较少。

####　Cookie
Cookie（或Cookies），指网站为了辨别用户身份或Session跟踪而储存在用户浏览器端的数据。Cookie信息一般会通过HTTP请求发送到服务器端。
一条Cookie记录主要由键、值、域、过期时间和大小组成，一般用于保存用户的网站认证信息。
浏览器中Cookie的最大长度和单个域名支持的Cookie个数由浏览器的不同来决定。
在InternetExplorer7以上版本、Firefox等浏览器中，支持的Cookie记录最多是50条，Chrome、Safari浏览器上则没有限制，Opera浏览器上最多支持30条，而且我们通常认为Cookie的最大长度限制为4KB（4095字节到4097字节）。

@11















