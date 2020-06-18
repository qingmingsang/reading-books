# 安全HTTP头
Strict-Transport-Security 强制实施与服务器的安全（HTTP over SSL / TLS）连接

X-Frame-Options 提供点击劫持保护

X-XSS-Protection 支持在最新的Web浏览器中内置的跨站点脚本（XSS）过滤器

X-Content-Type-Options 可防止浏览器从声明的内容类型中嗅探响应

Content-Security-Policy(CSP) 可防止各种攻击，包括跨站点脚本和其他跨站点注入

# 请求频率限制

# Cookie标志
secure - 此属性告诉浏览器仅在通过HTTPS发送请求时才发送cookie。

HttpOnly - 此属性用于帮助防止跨站点脚本等攻击，因为它不允许通过JavaScript访问cookie。

# XSS防护
HttpOnly 防止劫取 Cookie
输入检查(XSS Filter),始终转义/清理用户输入。
输出检查

避免内联事件.
避免使用拼接html.

指定字符集为 utf-8,防止utf-7 xss攻击
`<meta charset="utf-8">`

对待跳转的 URL 参数做白名单或者某种规则过滤

CSP
X-XSS-Protection

# CSRF防护
验证码
同源检测(Referer 与 Origin Header)

添加 csrf token 验证:
可以在渲染页面时加入一个随机产生的 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。
服务器存储的用法一般不用,一般用加密token的方式.

双重cookie验证
其实就相当于上面的加密token,只是存在了cookie里.

cookie设置`Samesize=Strict`

X-Frame-Options


# SQL注入
防御这类攻击的最简单方法是使用参数化查询或预处理语句。

类似XSS也需要对输入进行过滤/清理

# OS命令注入
要防御这种攻击，请确保始终过滤/清理用户输入。

# 安全传输
HTTPS
HSTS

# 帐户锁定
帐户锁定是一种减轻暴力猜测攻击的技术。在实践中，这意味着在少量不成功的登录尝试之后，系统禁止在给定时间段内进行登录尝试（最初可能是几分钟，然后它可以指数增加）。

可以使用上面提到的频率限制来保护的应用程序免受这类攻击。

# 错误代码不对外展示

# NPM安全检查
Node Security project有一个工具[nsp](https://github.com/nodesecurity/nsp)，可以检查使用过的模块是否存在已知漏洞。

[Snyk](https://snyk.io/)类似于Node Security Project，但其目的是提供一种工具，不仅可以检测，还可以修复代码库中与安全相关的问题。

# 令牌(Tokens)

# 签名(Signatures)
对cookie和tokens进行签名

# 反爬

# 控制台警告信息


https://segmentfault.com/a/1190000014839133
https://www.cxymsg.com/guide/security.html
https://tech.meituan.com/2018/09/27/fe-security.html
https://tech.meituan.com/2018/10/11/fe-security-csrf.html

