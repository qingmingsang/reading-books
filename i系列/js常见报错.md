# TypeError
## Uncaught TypeError: Cannot read property
## TypeError: ‘undefined’ is not an object (evaluating
## TypeError: null is not an object (evaluating
```
foo && foo.bar

(foo||{}).bar
```

# (unknown): Script error
基于安全考虑，浏览器有意隐藏其他域JS文件抛出的具体错误信息，这样可以避免敏感信息无意中被恶意脚本捕获。也就是说，浏览器只允许同域名的脚本捕获具体的错误信息。这本质其是浏览器跨域错误。

比如，当网站执行了托管在第三方CDN的js文件，而这个js脚本如果有错误，就会报Script error，而不是那些有用的信息。

解决方法：
第一步：加跨域HTTP响应头
```
Access-Control-Allow-Origin: * // 或者是指定网站www.example.com
```
第二步: 添加 crossorigin=”anonymous”属性
```
<script src="http://another-domain.com/app.js " crossorigin="anonymous"></script>
```
这相当于告诉浏览器去请求这个script文件的时候使用匿名的方式获取，意味着请求脚本时没有潜在的用户身份信息(如cookies、HTTP 证书等)发送到服务端。

这里需要注意：在设置 `crossorigin=”anonymous”`属性之前一定要保证http的响应头已经设置了`Access-Control-Allow-Origin:*` 即允许跨域。否则，在火狐浏览器下，这个script 标签就不会被执行。
