
A 网站让用户跳转到 GitHub。
GitHub 要求用户登录，然后询问"A 网站要求获得 xx 权限，你是否同意？"
用户同意，GitHub 就会重定向回 A 网站，同时发回一个授权码。
A 网站使用授权码，向 GitHub 请求令牌。
GitHub 返回令牌.
A 网站使用令牌，向 GitHub 请求用户数据。

## 应用登记
一个应用要求 OAuth 授权，必须先到对方网站登记，让对方知道是谁在请求。
所以，你要先去 GitHub 登记一下。当然，我已经登记过了，你使用我的登记信息也可以，但为了完整走一遍流程，还是建议大家自己登记。这是免费的。
提交表单以后，GitHub 应该会返回客户端 ID（client ID）和客户端密钥（client secret），这就是应用的身份识别码。

## 浏览器跳转 GitHub
这个 URL 指向 GitHub 的 OAuth 授权网址，带有两个参数：client_id告诉 GitHub 谁在请求，redirect_uri是稍后跳转回来的网址。
用户点击到了 GitHub，GitHub 会要求用户登录，确保是本人在操作。

## 授权码
登录后，GitHub 询问用户，该应用正在请求数据，你是否同意授权。
用户同意授权， GitHub 就会跳转到redirect_uri指定的跳转网址，并且带上授权码，跳转回来的 URL 就是下面的样子。
后端收到这个请求以后，就拿到了授权码（code参数）。

## 令牌
后端使用这个授权码，向 GitHub 请求令牌。
上面代码中，GitHub 的令牌接口`https://github.com/login/oauth/access_token`
需要提供三个参数。
```
client_id：客户端的 ID
client_secret：客户端的密钥
code：授权码
```
作为回应，GitHub 会返回一段 JSON 数据，里面包含了令牌accessToken。


## API 数据
有了令牌以后，就可以向 API 请求数据了。
```
const result = await axios({
  method: 'get',
  url: `https://api.github.com/user`,
  headers: {
    accept: 'application/json',
    Authorization: `token ${accessToken}`
  }
});
```
上面代码中，GitHub API 的地址是`https://api.github.com/user`，请求的时候必须在 HTTP 头信息里面带上令牌Authorization: token 361507da。



当前的OAuth2.0有三种认证方式：
## （1）授权码模式
（A）用户访问客户端，用户被客户端重定向到认证服务器
（B）用户决定是否授权
（C）用户授权后客户端会获得一个授权码
（D）客户端使用授权码与一个重定向的uri再次请求认证服务器
（E）认证服务器给客户端一个access token和refresh token

这样，客户端就可以凭借接入token去资源服务器获取资源，然后根据重定向uri回到指定页面

## （2）简化模式
（A）客户端将用户重定向到认证服务器
（B）用户决定是否授权
（C）用户授权，则认证服务器重定向客户端一开始指定的uri，并带上一个hash值的token
（D）客户端请求资源服务器，并不带上一步的hash值token?
（E）资源服务返回一个网页代码可以提取hash值的原token?
（F）浏览器提取token?
（G）把token发给客户端

## （3）密码模式
用户向客户端提供自己的用户名和密码。客户端使用这些信息，向"服务商提供商"索要授权。
在这种模式中，用户必须把自己的密码给客户端，但是客户端不得储存密码。通常只有用户对客户端十分信任才会使用。
（A）用户提供用户名和密码
（B）客户端将其发给认证服务器认证
（C）认证服务器认证通过后向客户端分发token













