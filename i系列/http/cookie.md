参数	描述
name	必需。规定 cookie 的名称。
value	必需。规定 cookie 的值。
expire	可选。规定 cookie 的有效期。
path	可选。规定 cookie 的服务器路径。
domain	可选。规定 cookie 的域名。
secure	可选。规定是否通过安全的 HTTPS 连接来传输 cookie。


cookie是浏览器的一种本地存储方式，一般用来帮助客户端和服务端通信的，常用来进行身份校验，结合服务端的session使用。

场景如下（简述）：
```
在登陆页面，用户登陆了

此时，服务端会生成一个session，session中有对于用户的信息（如用户名、密码等）

然后会有一个sessionid（相当于是服务端的这个session对应的key）

然后服务端在登录页面中写入cookie，值就是:jsessionid=xxx

然后浏览器本地就有这个cookie了，以后访问同域名下的页面时，自动带上cookie，自动检验，在有效时间内无需二次登陆。
上述就是cookie的常用场景简述（当然了，实际情况下得考虑更多因素）
```

一般来说，cookie是不允许存放敏感信息的（千万不要明文存储用户名、密码），因为非常不安全，如果一定要强行存储，首先，一定要在cookie中设置httponly（这样就无法通过js操作了），另外可以考虑rsa等非对称加密（因为实际上，浏览器本地也是容易被攻克的，并不安全）

另外，由于在同域名的资源请求时，浏览器会默认带上本地的cookie，针对这种情况，在某些场景下是需要优化的。

譬如以下场景：
```
客户端在域名A下有cookie（这个可以是登陆时由服务端写入的）

然后在域名A下有一个页面，页面中有很多依赖的静态资源（都是域名A的，譬如有20个静态资源）

此时就有一个问题，页面加载，请求这些静态资源时，浏览器会默认带上cookie

也就是说，这20个静态资源的http请求，每一个都得带上cookie，而实际上静态资源并不需要cookie验证

此时就造成了较为严重的浪费，而且也降低了访问速度（因为内容更多了）
```

当然了，针对这种场景，是有优化方案的（多域名拆分）。具体做法就是：
- 将静态资源分组，分别放到不同的域名下（如static.base.com）
- 而page.base.com（页面所在域名）下请求时，是不会带上static.base.com域名的cookie的，所以就避免了浪费

说到了多域名拆分，这里再提一个问题，那就是：
- 在移动端，如果请求的域名数过多，会降低请求速度（因为域名整套解析流程是很耗费时间的，而且移动端一般带宽都比不上pc）
- 此时就需要用到一种优化方案：dns-prefetch（让浏览器空闲时提前解析dns域名，不过也请合理使用，勿滥用）


## name
必选参数，这个是cookie的变量名，
可以通过$_COOKIE['user']调用变量名为user的cookie.

## value
可选参数，这个cookie变量的值,
比如说setcookie(“user”,”php”),我们通过调用$_COOKIE['user']可以得到php值;

## expire
可选参数，这个是用来设置cookie变量保存的时间，注意是我们设置的的UNIX时间戳减去当前的UNIX时间戳才是cookie变量保存的时间。（UNIX时间戳：是从1970年1月1日（UTC/GMT的午夜）开始所经过的秒数)，
一般我们可以通过time()函数获取当前的UNIX时间戳，再加上我们要保存的时间（单位为秒）比如说，setcookie(“user”,”php”,time()+3600),这样我们就可以保存user这个cookie变量的时间为3600秒。另外我们可以通过设置的时间戳小于当前的时间戳来删除cookie变量，比如说setcookie(“user”,”php”,time()-1)这样我们就删除了user这个cookie变量了。

## path
cookie的有效范围，这个参数是下一个参数domain基础上的有效范围，如果path设置为”/”，那就是在整个domain都有效，
比如setcookie(“user”,”php”,time()+3600,”/”),这样我们domain下的任何目录，任何文件都可以通过$_COOKIE['user']来调用这个cookie变量的值。如果path设置为”/test”,那么只在domain下的/test目录及子目录才有效，比如domain下有两个目录:test1,test2,我们设置为setcookie(“user”,”php,time()+3600,”/test1″)，那么只有test1目录下才能通过$_COOKIE['user']调用user这个cookie变量的值，test2目录下获取不到。

## domain
cookie有效的域名，
如果domain,设置为googlephp.cn，那么在googlephp.cn下的所有子域都有效。假设googlephp.cn有两个子域，php.googlephp.cn，css.googlephp.cn，我们设置为setcookie(“user”,”php”,time()+3600,”/”,”php.googlephp.cn”),那么只有在php.googlephp.cn这个子域下才能获取user这个cookie变量的值.再举一个例子：setcookie(“user”,”php”,time()+3600,”/test”,”php.googlephp.cn”),那么只有在php.googlephp.cn这个子域下的test目录下才能获取user这个cookie变量的值.

## secure
值cookie是否仅通过安全的https,值为0或1，如果值为1，则cookie只能在https连接上有效，默认值为0，表示cookei在http和https连接上都有效。

