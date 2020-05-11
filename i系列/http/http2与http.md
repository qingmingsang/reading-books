
# Http2和Http1.X的区别

（1）HTTP2使用的是二进制传送，HTTP1.X是文本（字符串）传送。
二进制传送的单位是帧和流。帧组成了流，同时流还有流ID标示

（2）HTTP2支持多路复用
因为有流ID，所以通过同一个http请求实现多个http请求传输变成了可能，可以通过流ID来标示究竟是哪个流从而定位到是哪个http请求

（3）HTTP2头部压缩
HTTP2通过gzip和compress压缩头部然后再发送，同时客户端和服务器端同时维护一张头信息表，所有字段都记录在这张表中，这样后面每次传输只需要传输表里面的索引Id就行，通过索引ID查询表头的值

（4）HTTP2支持服务器推送
HTTP2支持在未经客户端许可的情况下，主动向客户端推送内容


https://www.cnblogs.com/kaishirenshi/p/12575847.html
https://www.cnblogs.com/Java3y/p/9392349.html