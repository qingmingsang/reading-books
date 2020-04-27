

默认浏览器为了安全，遵循“同源策略”，不允许 Ajax 跨域访问资源，而为了允许这种操作，服务器端和客户端都要遵循一些约定。

`Access-Control-Allow-Credentials`设置为true
`Access-Control-Allow-Origin`设置为需要跨域的源地址，不能为*

服务器端需设置以下响应头：
```
Access-Control-Allow-Origin: <origin> | * // 授权的访问源
Access-Control-Max-Age: <delta-seconds> // 预检授权的有效期，单位：秒
Access-Control-Allow-Credentials: true | false // 是否允许携带 Cookie
Access-Control-Allow-Methods: <method>[, <method>]* // 允许的请求动词
Access-Control-Allow-Headers: <field-name>[, <field-name>]* // 额外允许携带的请求头
Access-Control-Expose-Headers: <field-name>[, <field-name>]* // 额外允许访问的响应头
```


如果想让服务端重定向携带cookie，需要设置domain，path，secure


