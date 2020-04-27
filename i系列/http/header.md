服务器端的响应中，如果没有返回`Access-Control-Allow-Credentials: true`的响应头，那么浏览器将不会把响应结果传递给发出请求的脚本程序，以保证信息的安全。
给一个带有withCredentials的请求发送响应的时候,服务器端必须指定允许请求的域名,不能使用'*'.如果响应头是这样的:`Access-Control-Allow-Origin: *` ,则响应会失败。

允许的来源
`header("Access-Control-Allow-Origin: xxx.com")`; 

OPTIONS通过后，保存的时间，如果不超过这个时间，是不会再次发起OPTIONS请求的。
`header("Access-Control-Max-Age: 86400");`

另外如果是OPTIONS头的话，需要返回200（通过验证）
`header("Access-Control-Allow-Headers: Content-Type")`;

允许的请求方式
`header("Access-Control-Allow-Methods: OPTIONS, GET, PUT, POST, DELETE")`;

目前让`Access-Control-Allow-Origin`设置`multiple cross-domains`
除了设置为 `* ` 和用正则匹配，似乎没有更好的方式。

目前使用nginx反向代理可以避免设置这些header的琐碎问题。

