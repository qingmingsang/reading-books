
# 1. 了解Web及网络基础
## 1.1　使用 HTTP 协议访问 Web
Web 使用一种名为 HTTP（HyperText Transfer Protocol，超文本传输协议）的协议作为规范，完成从客户端到服务器端等一系列运作流
程。

## 1.2　HTTP 的诞生
### 1.2.1　为知识共享而规划 Web
3 项 WWW 构建技术，分别是：
- 把 SGML（Standard Generalized Markup Language，标准通用标记语言）作为页面的文本标记语言的 HTML（HyperText Markup Language，超文本标记语言）；
- 作为文档传递协议的 HTTP ；
- 指定文档所在地址的 URL（Uniform Resource Locator，统一资源定位符）。

### 1.2.2　Web 成长时代

### 1.2.3　驻足不前的 HTTP
HTTP/1.1 是目前主流的HTTP协议版本.

## 1.3　网络基础 TCP/IP
### 1.3.1　TCP/IP 协议族
HTTP属于TCP/IP协议族的一个子集.

TCP/IP是互联网相关的各类协议族的总和.?

### 1.3.2　TCP/IP 的分层管理
数据包是网络传输的最小数据单位.

TCP/IP分层:
- 应用层:决定了向用户提供应用服务时通信的活动.预存了如FTP（File Transfer Protocol，文件传输协议）,DNS（Domain Name System，域名系统）服务,HTTP,IP.
- 传输层:提供处于网络连接中两台计算机之间的数据传输.TCP（Transmission Control Protocol，传输控制协议）和 UDP（User Data Protocol，用户数据报协议）在此.
- 网络层(网络互连层):处理网络上流动的数据包.规定通过怎样的路径(传输线路)到达对方计算机,并把数据包传送给对方.
- 数据链路层(链路层 或 网络接口层):用来处理连接网络的硬件部分.

### 1.3.3　TCP/IP 通信传输流
利用TCP/IP进行网络通信时,会通过分层顺序与对方进行通信.
发送端从应用层往下走,接收端从应用层往上走.
@1

用 HTTP 举例来说明，首先作为发送端的客户端在应用层（HTTP 协议）发出一个想看某个 Web 页面的 HTTP 请求。
接着，为了传输方便，在传输层（TCP 协议）把从应用层处收到的数据（HTTP 请求报文）进行分割，并在各个报文上打上标记序号及端口号后转发给网络层。
在网络层（IP 协议），增加作为通信目的地的 MAC 地址后转发给链路层。
接收端的服务器在链路层接收到数据，按序往上层发送，一直到应用层。当传输到应用层，才能算真正接收到由客户端发送过来的 HTTP请求。
@2

发送端在层与层之间传输数据时，每经过一层时必定会被打上一个该层所属的首部信息。反之，接收端在层与层传输数据时，每经过一层时会把对应的首部消去。
这种把数据信息包装起来的做法称为封装（encapsulate）。

## 1.4　与 HTTP 关系密切的协议 : IP、TCP 和DNS
### 1.4.1　负责传输的 IP 协议
IP（Internet Protocol）(网际协议)和IP地址不是一个东西.
IP协议把各种数据包传送给对方.
而要保证确实传送到对方那里，则需要满足各类条件。
其中两个重要的条件是 IP 地址和 MAC地址（Media Access Control Address）。
IP地址指明节点被分配到的地址.
MAC地址是指网卡所属固定地址.
IP地址可以和MAC地址进行配对.

IP间的通信依赖MAC地址.
在网络上，通信的双方在同一局域网（LAN）内的情况是很少的，通常是经过多台计算机和网络设备中转才能连接到对方。
而在进行中转时，会利用下一站中转设备的 MAC地址来搜索下一个中转目标。
这时，会采用 ARP 协议（Address Resolution Protocol）。
ARP 是一种用以解析地址的协议，根据通信方的 IP 地址就可以反查出对应的 MAC 地址。

在到达通信目标前的中转过程中，那些计算机和路由器等网络设备只能获悉很粗略的传输路线。
这种机制称为路由选择（routing）.
@3

### 1.4.2　确保可靠性的 TCP 协议
字节流服务（Byte Stream Service）是指，为了方便传输，将大块数据分割成以报文段（segment）为单位的数据包进行管理。
TCP 协议为了更容易传送大数据才把数据分割，而且 TCP 协议能够确认数据最终是否送达到对方。

为了准确无误地将数据送达目标处，TCP 协议(主要)采用了三次握手（three-way handshaking）策略.
用 TCP 协议把数据包送出去后，TCP不会对传送后的情况置之不理，它一定会向对方确认是否成功送达。
握手过程中使用了 TCP 的标志（flag） —— SYN（synchronize） 和ACK（acknowledgement）。

发送端首先发送一个带 SYN 标志的数据包给对方。
接收端收到后，回传一个带有 SYN/ACK 标志的数据包以示传达确认信息。
最后，发送端再回传一个带 ACK 标志的数据包，代表“握手”结束。
若在握手过程中某个阶段莫名中断，TCP 协议会再次以相同的顺序发送相同的数据包。
@4

## 1.5　负责域名解析的 DNS 服务
DNS（Domain Name System）服务是和 HTTP 协议一样位于应用层的
协议。
DNS 协议提供通过域名查找 IP 地址，或逆向从 IP 地址反查域名的服务。
@5

## 1.6　各种协议与 HTTP 协议的关系
@6

## 1.7　URI 和 URL
URL（Uniform Resource Locator，统一资源定位符）。
URL 正是使用 Web 浏览器等访问 Web 页面时需要输入的网页地址。

### 1.7.1　统一资源标识符
URI( Uniform Resource Identifier )。
RFC2396 分别对这 3 个单词进行了如下定义:
- Uniform : 规定统一的格式可方便处理多种不同类型的资源，而不用根据上下文环境来识别资源指定的访问方式。
- Resource : 资源的定义是“可标识的任何东西”。
- Identifier : 表示可标识的对象。也称为标识符。

URI 就是由某个协议方案表示的资源的定位标识符。
协议方案是指访问资源所使用的协议类型名称。
采用 HTTP 协议时，协议方案就是 http。
URI 用字符串标识某一互联网资源，而 URL 表示资源的地点（互联网上所处的位置）。可见 URL 是 URI 的子集。

除此之外，还有 ftp、mailto、telnet、file 等。
```
ftp://ftp.is.co.za/rfc/rfc1808.txt
http://www.ietf.org/rfc/rfc2396.txt
ldap://[2001:db8::7]/c=GB?objectClass?one
mailto:John.Doe@example.com
news:comp.infosystems.www.servers.unix
tel:+1-816-555-1212
telnet://192.0.2.16:80/
urn:oasis:names:specification:docbook:dtd:xml:4.1.2
```

### 1.7.2　URI 格式
表示指定的 URI，要使用涵盖全部必要信息的绝对 URI、绝对 URL 以及相对 URL。

绝对 URI :
@7
协议方案名:
使用 `http:` 或 `https:` 等协议方案名获取访问资源时要指定协议类型。不区分字母大小写，最后附一个冒号`:`。
也可使用 data: 或 javascript: 这类指定数据或脚本程序的方案名。

登录信息（认证）:
指定用户名和密码作为从服务器端获取资源时必要的登录信息（身份认证）。(可选)。

服务器地址:
使用绝对 URI 必须指定待访问的服务器地址。地址可以是类似`hackr.jp` 这种 DNS 可解析的名称，或是 `192.168.1.1` 这类 IPv4 地址名，还可以是 `[0:0:0:0:0:0:0:1]` 这样用方括号括起来的 IPv6 地址名。

服务器端口号:
指定服务器连接的网络端口号。(可选). 若用户省略则自动使用默认端口号(80)。

带层次的文件路径:
指定服务器上的文件路径来定位特指的资源。与 UNIX 系统的文件目录结构相似。

查询字符串:
针对已指定的文件路径内的资源，可以使用查询字符串传入任意参数。(可选)。

片段标识符:
使用片段标识符通常可标记出已获取资源中的子资源（文档内的某个位置）。(可选)。


# 2. 简单的 HTTP 协议
## 2.1　HTTP 协议用于客户端和服务器端之间的通信
HTTP 协议用于客户端和服务器之间的通信。
请求访问文本或图像等资源的一端称为客户端，而提供资源响应的一端称为服务器端。

## 2.2　通过请求和响应的交换达成通信
请求报文的构成:
@8
请求报文是由请求方法(method)、请求 URI (request-URI)、协议版本、可选的请求首部字段和内容实体构成的。
起始行开头的POST表示请求访问服务器的类型，称为方法（method）。
随后的字符串 `/form/entry` 指明了请求访问的资源对象，也叫做请求 URI（request-URI）。
最后的 `HTTP/1.1`，即 HTTP 的版本号，用来提示客户端使用的 HTTP 协议功能。

响应报文的构成:
@9
在起始行开头的 `HTTP/1.1` 表示服务器对应的 HTTP 版本。
紧挨着的 200 OK 表示请求的处理结果的状态码（status code）和原因短语（reason-phrase）。
下一行显示了创建响应的日期时间，是首部字段（header field）内的一个属性。
接着以一空行分隔，之后的内容称为资源实体的主体（entitybody）。

## 2.3　HTTP 是不保存状态的协议
HTTP 是一种不保存状态，即无状态（stateless）协议。
使用 HTTP 协议，每当有新的请求发送时，就会有对应的新响应产
生。协议本身并不保留之前一切的请求或响应报文的信息。
这是为了更快地处理大量事务，确保协议的可伸缩性，而特意把 HTTP 协议设计成如此简单的。

HTTP/1.1 虽然是无状态协议，但为了实现期望的保持状态功能，于是引入了 Cookie 技术。

## 2.4　请求 URI 定位资源
HTTP 协议使用 URI 定位互联网上的资源。
@10

## 2.5　告知服务器意图的 HTTP 方法


