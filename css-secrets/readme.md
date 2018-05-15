# css揭秘
[作者全部demo](http://play.csssecrets.io/)

# 0. 前前言
## js相关的简单封装
```
function $(expr, con) {
	return typeof expr === 'string'? (con || document).querySelector(expr) : expr;
}

function $$(expr, con) {
	return Array.prototype.slice.call((con || document).querySelectorAll(expr));
}

function xhr(o) {
	var xhr = new XMLHttpRequest(o.src);
	
	xhr.open("GET", o.src);
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status < 400) {
				try {
					o.onsuccess.call(xhr);
				}
				catch (e) {
					o.onerror.call(xhr);
					console.error(e);
				}
			}
			else {
				o.onerror.call(xhr);
			}
		}
	};
	
	xhr.send();
}
```
 
 ## 兼容性处理
 1. css前缀
 2. css @supports 检测
 3. Modernizr等库
 4. js检测

```
      var root = document.documentElement;//<html>

      //检测某属性是否支持
      if ('textShadow' in root.style) {
        root.classList.add('textshadow');
      } else {
        root.classList.add('no-textshadow');
      }

      function testProperty(property) {
        var root = document.documentElement;
        if (property in root.style) {
          root.classList.add(property.toLowerCase());
          return true;
        }
        root.classList.add('no-' + property.toLowerCase());
        return false;
      }

      //检测某属性值是否支持
      var dummy = document.createElement('p');
      dummy.style.backgroundImage = 'linear-gradient(red,tan)';

      if (dummy.style.backgroundImage) {
        root.classList.add('lineargradients');
      } else {
        root.classList.add('no-lineargradients');
      }

      function testValue(id, value, property) {
        var dummy = document.createElement('p');
        dummy.style[property] = value;
        if (dummy.style[property]) {
          root.classList.add(id);
          return true;
        }
        root.classList.add('no-' + id);
        return false;
      }
```

# 1. 引言
>代码可维护性的最大要素是尽量减少改动时要编辑的地方.

>当某些值相互依赖时,应该把它们的相互关系用代码表达出来.

如font-size里的em与rem的使用.

>代码易维护和代码量少不可兼得

如
```
border-width:10px 10px 10px 0;

//可改为
border-width:10px;
border-left-width:0;
```

currentColor可用于继承父颜色(ie9)
inherit可用于继承父属性

>相信你的眼睛而不是数字,视觉上的错觉在任何形式的视觉设计中都普遍存在,需要有针对性的进行调整.

`background-size:cover`实现背景图片铺满容器.
`background:url(tr.png) no-repeat top right / 2em 2em` /前面是background-position,/后面是background-size

css变量(future)
```
ul{--accent-color:purple}
ol{--accent-color:rebeccapurple}
li{background:var(--accent-color)}
```

# 2. 背景与边框
## 透明border
通过background-clip实现透明border (ie9).

## 多重border
可使用box-shadow,outline实现多重border.

box-shadow是层层叠加的,第一层(最顶层)位于最顶层,以此类推.

## 背景定位
background-position可以指定偏移量.
`background-position: right 20px bottom 10px;`

@1
每个元素身上都存在3个矩形框,border box(边框的外沿框),padding box(内边距的外沿框),content box(内容区的外沿框),background-origin默认是以padding box为边界的.
`background-origin: content-box;`

calc() ie9支持,但在ie9里不能在background-position里使用.

## 边框内圆角
目前outline是不跟随元素的border-radius的,但是box-shadow跟随.

## 条纹背景
gradient(ie10)

如果渐变的区间没有过渡范围,则会直接进行转变.

background-size可控制background-image:linear-gradient()的尺寸.
同理background-position可控制位置.

可利用background-image:repeating-linear-gradient()快速生成重复的条纹背景.

## 复杂背景图案

[作者的CSS3 Patterns Gallery](http://lea.verou.me/css3patterns/)

波点图mixins
```
@mixin polka($size,$dot,$base,$accent){
	background: $base;
	background-image: radial-gradient($accent $dot, transparent 0),
										radial-gradient($accent $dot, transparent 0);
	background-size: $size $size;
	background-position: 0 0, $size/2 $size/2;
}

@include polka(30px,30%,#655,tan);


background: #655;
background-image: radial-gradient(tan 20%, transparent 0),
                  radial-gradient(tan 20%, transparent 0);
background-size: 30px 30px;
background-position: 0 0, 15px 15px;
```

在这种非常长的css里可以考虑使用\进行换行.

如果图案过于复杂,可能直接用图或者svg会更简单性能还更好.

## 伪随机背景
>蝉原则:通过质数来增加随机真实性

`2 3 5 7 11 13 17 19 23 29`

## 连续的图像边框
可利用 background-clip(ie9) 或 border-image(ie11,应该说大部分都不太支持) 实现

# 3. 形状

## 自适应的椭圆
border-radius可以单独指定水平和垂直半径.
`border-radius:100px/75px`

## 平行四边形
利用transform:skew (ie9+)

## 菱形图片
利用transform或clip-path(future)

## 切角效果
可利用border,linear-gradient,border-image,clip-path,corner-shape(futrue)

## 梯形标签页
利用transform:perspective (ie10+不完全支持)

## 简单的饼图
半圆旋转,到50%时变色.
animation-delay可以是负值,加上animation-play-state: paused可以控制动画不同状态以实现不同表现.
基本上来说,css不好实现的图形,都可以通过svg实现.

# 4. 视觉效果
















