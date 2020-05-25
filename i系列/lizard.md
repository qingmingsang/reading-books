h5的回退不会保留url参数

生命周期: 
完整刷新: create->show->appear(app里才有)
APP里不刷新的回退只会触发appear,不会触发show
非APP里不刷新的回退只会触发show

isInApp是在app里,不管是h5直连还是包
isInHybrid只是在包里

所谓el型插件,应该尽量减少那些特殊模板的el型插件,特别是模板和逻辑混在一起的,复用性很差

页面重刷会触发onCreate，重载viewport
页面跳转切换不一定会触发onCreate，重载viewport

自定义的字段应为_$xx
Lizard.instance.curView  
     
5389

onCreate 里可以获取到viewportTmpl里的dom
arttemplate模板传参有坑  {{@xx}}  会先被JSON.parse()


在string模板里再继续用引号只能用单引号，
单引号只能在string模板利用。
"vstype=\'sm\'"


在html模板里要这么写，html模板里只能用双引号
style="<%print("background-image:url("+vnd.img+");")%>"  ?
print("vstype=\"sm cw\" brd=\"around\"")
用变量的方式应该是比较万能的
<%styleTemp="style=background-color:"+tgv.bgclr+"; "%>
<p class="ochbook-rule-icon" flex="row center" <%=styleTemp%>>

<%styleTemp=("style=background:"+currentAct.bgclr+";color:"+currentAct.ftclr+"; ");%>
<div class="ochlist-vendor-act__tag" flex="row" <%=styleTemp%>>


在html模板里不支持这种写法
style="<%print('background-image:url('+vnd.img+');')%>"

 style="background:<%=value.tag.color%>"
 style="background:<%=value.tag.color%>;"
 
 在html模板里
不支持这种
style="print("background:"+value.tag.color+";")"
不支持这种
style="print("background:"+value.tag.color+"")"
不支持这种
<%if(style.bgclr){print('background-color:'+style.bgclr+';')}%>

print里带'很容出问题

"''" '""' 也不好使

支持这种
<%print("style=background:"+value.tag.color)%>

总之就是很傻逼，如果ide给你标红了，肯定是你错了，虽然不知道为啥错了

似乎支持这种
class='j_och_list_item och-list-item <%=_activeGrpid[grpid]?"active":""%>'
<%=checked?"hl=ft":""%>
style="<%=k==0?"":"display:none"%>"
 <%=obj.noBorder?"":"brd=row"%>> 但是只能写在最后

 在html模板里
 data-type="<%=oper.key%>"
 一般还需要引号包着
 
 
 可以进到包里，不能退到包里？

 
 ctrip://  hybrid地址跳转一律带(蓝)头
 
 
 index页的input应该拆分成每一块
 
 因为lizard模板容易出错也不容易阅读,尽量将代码逻辑写在js里.
 
 
 插件回调数据要带pageview
 插件回退隐藏可能需要注意执行顺序
 
 所谓el插件因为其样式和dom结构容易变更,应该能提供替换模板的选项,
 大部分单纯的el插件都没特别大的意义
 
 
 					CarUIModal.prototype.show.call(this);

					this.UIListScroll._end = function(e) {
						UIScroll.prototype._end.call(this.UIListScroll, e);
						//手势滚动后停止的回调
						this[pttype + "X"] = this.x;
					}.bind(this);
					
					
					
<div class="j_reg_fill_weixin ochreg-input-button <%=(contact.tel||contact.otel)?'is-active':''%>">


this.UI.Page.MyRegFlight  类似这种变量,全局共享