
# 常用公式、概念、函数
## 三角函数

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161214185138104-691002152.png)


普通坐标与canvas坐标是不同的

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161214185908698-2005551068.png)



![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161214185926276-331569877.png)




### 常用三角函数

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161214190041042-603232822.png)



![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161214190049964-2062110404.png)



在canvas中采用的是弧度制。
` θ * Math.PI/180`是将角度转成弧度，比如：`30° = 30 * π /180 = π / 6`。 
`Math.asin(x/R) `（弧度值）乘上`180/Math.PI`是将弧度转成角度。


Math.atan()可以直接通过两个直角边得到角度值，但是会得到两个相同的角度值


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161214190201386-412094328.png)



使用Math.atan2(dy, dx)可以弥补该问题


## 函数波形

sin函数波形


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161214190112058-313861822.jpg)



```
//sin函数在[0, 2π]之间的值，非连续的情况下，可以这样估算：

for(var angle=0; angle<Math.PI*2; angle+=0.1){
    console.log(Math.sin(angle)); //打印出角度对应的sin值
}
```


## 圆


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161215133651308-308417675.png)

```
0.5π为90°
1π 为 180°
2π为360°
```



### 椭圆
正圆半径在x轴和y轴上的距离是相同的，都是Radius ，而椭圆则是不同的,我们用a, b 表示。


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161215133710417-900594458.png)



## 两点之间距离

```
假设有两个点, a(x1, y1), b(x2, y2)
dx = x2 - x1;
dy = y2 - y1;
distance = Math.sqrt(dx*dx + dy*dy); //勾股定理
```


## 弧度
弧度是角的度量单位。(rad)
定义：弧长等于半径的弧，其所对的圆心角为1弧度。

```
一周的弧度数为2πr/r=2π，360°角=2π弧度，
1弧度约为57.3°，即57°17'44.806''，
1°为π/180弧度，近似值为0.01745弧度，
周角为2π弧度，
平角（即180°角）为π弧度，
直角为π/2弧度。
```

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161215141145729-51928727.png)



## 斜率
已知倾斜角a,斜率`k=tan a`
已知两个点`(x1,y1),(x2,y2)`,
斜率`k=(y2-y1)/(x2-x1)`
斜率相同则两点在同一直线上

## 对称点
求点`A（m,n)`关于点`P(a,b)`的对称点`B(x,y)`
```
(m+x)/2=a ,x=2a-m
(n+y)/2=b ,y=2b-n	
```


## 贝塞尔曲线
![](http://images2017.cnblogs.com/blog/771172/201712/771172-20171225111656100-431520701.png)

## 标量与矢量
+ 标量：有大小而没有方向的物理量（速率，体积，温度）
+ 矢量：有大小也有方向的物理量（速度，动量，力）


## 生成随机数

```

// 返回一个介于min和max之间的随机数
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

// 返回一个介于min和max之间的整型随机数
function getRandomInt1(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

```




# 速度

速度是表征物体运动快慢的物理量


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161215145623073-1683205256.png)



同时在一个物体的x轴和y轴上定义速度，
那么物体的运动方向是这两个速度方向的和方向，
即满足矢量的叠加，大小满足勾股定理。


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161215145633698-1541259434.png)



以每秒5的速度，30度角方向运动。
那么合速度是5，方向是30度。
把它分解到坐标轴上就是vy = 2.5,vx = 4.33。


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161215145643229-1743030968.png)


## 加速度

加速度是描述物体速度变化快慢的物理量

在Δt的时间内，速度增加了Δv，那么加速度用公式就可以表示为 a= Δv / Δt


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161215154131339-1693076587.png)

## 公式
```
//任意方向速度
vx = speed * Math.cos(angle);
vy = speed * Math.sin(angle);

//任意方向加速度
ax = force * Math.cos(angle);
ay = force * Math.xin(angle);

//改变速度
vx += ax;
vx += ay;

//改变位置
object.x += vx;
object.y += vy;
```

# 边界与摩擦力
## 设置边界


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161216114101386-1187275962.png)



```

var left = 0,
    top = 0,
    right = canvas.width,
    bottom = canvas.height;
	
if(ball.x > right){
    // do something
}else if(ball.x < left){
    //do something
}

if(ball.y > bottom){
    //do something
}else if(ball.y < top){
    //do something
}

```


## 边界环绕


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161216114114745-397224128.png)



当物体从一个边界消失，会从对立的边界出现。



## 边界反弹
```
var bounce = -1;
 if(ball.x + ball.radius > canvas.width){
        ball.x = canvas.width - ball.radius;
        vx *= bounce;
 }else if(ball.x - ball.radius < 0){
        ball.x = ball.radius;
        vx *= bounce;
 }
 if(ball.y + ball.radius > canvas.height){
       ball.y = canvas.height - ball.radius;
       vy *= bounce;
 }else if(ball.y - ball.radius < 0){
       ball.y = ball.radius;
       vy *= bounce;
 }
```


## 摩擦力

摩擦力的作用是减小物体的运动速度，
只需要定义一个变量f(代表摩擦力)，
让速度在每一帧都减去它，直至为零

```
if(speed > f){
   speed -= f;
}else{
    speed = 0;
}
```

## 公式
```
// 移除一个超过边界的物体
if(object.x - object.width/2 > right || 
    object.x + object.width/2 < left ||
    object.y - object.height/2 > bottom ||
    object.y + object.height/2 < top){
    //移除物体代码
}

// 重现一个超出边界的物体
if(object.x - object.width/2 > right || 
    object.x + object.width/2 < left ||
    object.y - object.height/2 > bottom ||
    object.y + object.height/2 < top){
    //重新设置对象的位置和速度
}

// 边界环绕
if(object.x - object.width/2 > right){
    object.x = left - object.width/2;
}else if(object.x + object.width/2 < left){
    object.x = object.width/2 + right；
}
if(object.y - object.height/2 > bottom){
    object.y = top - object.height/2;
}else if(object.y + object.height/2 < top){
    object.y = object.height/2 + bottom；
}

// 摩擦力(常用)
speed = Math.sqrt(vx*vx + vy*vy);
angle = Math.atan2(vy, vx);
if(speed > f){
    speed -= f;
}else{
    speed = 0;
}
vx = Math.cos(angle)*speed;
vy = Math.sin(angle)*speed;

// 摩擦力(少用)
vx *= f;
vy *= f;
```


# 移动物体
## 外接矩形判别法


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161216160335917-1218489282.png)



```
1.mouse.x > rect.x
2.mouse.x < rect.x + rect.width
3.mouse.y > rect.y
4.mouse.y < rect.y + rect.height
```

## 外接圆判别法


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161216160344745-547540946.png)



```
//鼠标距球心的距离
dx = mouse.x - ball.x;
dy = mouse.y - ball.y;
dist = Math.sqrt(dx*dx + dy*dy)
if(dist < ball.radius){
   //碰上了
}
```

#多边形和不规则图形

分离轴定理(SAT)和最小平移向量(MTV) (黑人问号脸)


## 物体的抛扔

```
oldPosition + velocity = newPosition
```
一般是上一个requestAnimationFrame时间的坐标，大概十几毫秒


## 公式
```
//得到球体坐标
Ball.prototype.getBounds = function(){
    return {
        x: this.x - this.radius,
        y: this.y - this.radius,
        width: this.radius*2,
        height: this.radius*2
    };
}

//捕获物体
utils.containsPoint = function(rect, x, y){
    return !(x<rect.x || x>rect.x + rect.width ||
             y<rect.y || y>rect.y + rect.height);
}

//物体的移动拖拽
canvas.addEventListener("mousedown", function(event){
    if(utils.containsPoint(ball.getBounds(), mouse.x, mouse.y)){
        ...
        canvas.addEventListener('mouseup', onMouseUp ,false);
        canvas.addEventListener('mousemove', onMouseMove, false);
    }
}, false);


//物体的抛扔
vx = ball.x - oldX;
vy = ball.y - oldY
```


# 缓动、弹性
## 缓动动画(easing)
缓动动画中，距离的百分比作用于速度，物体距离目标位置越远，运动的速度就越大，
随着物体距离目标位置越来越近，速度逐渐降低为零，停止在目标位置。


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161221142329557-165453796.png)



easing就是我们设定的缓动参数，每一帧都乘以距离，随着距离的不断减小，速度也就不断减小。

```
object.x += (targetX - object.x) * easing;
object.y += (targetY - object.y) * easing;
```


## 弹性动画(spring)
弹性动画中，距离的百分比作用于加速度，同样是距离目标位置越远，
加速度越大，随着距离越来越近，加速度最终为零。

```
vx += (targetX - object.x) * spring;
vy += (targetY - object.y) * spring;

object.x += (vx*=f);
object.y += (vy*=f);
```


# 碰撞检测的方法

判断物体与物体之间是否有重叠，这里使用物体的外接矩形边界来确定。

判断物体与物体之间的距离，当距离小于某个值时，满足碰撞条件，物体产生碰撞效果。

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170042995-378034224.png)


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170055557-1723756155.png)


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170106370-948726073.png)







## 光线投射法

画一条与物体速度向量相重合的线，
然后再从待检测物体出发，绘制第二条线，根据两条线的交点位置来判定是否发生碰撞。


![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170125386-313423544.png)


`#1`是与小球速度向量相重合的线，
`#2`线是从待测物体触发绘制的第二条线。
在小球的飞行过程中，程序不断地擦出并重回从小球到1，2号交点处的连线。

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170140761-2034135816.png)

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170150354-1016399410.png)

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170159745-773107989.png)

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170207370-511362262.png)




小球落入桶中的条件：
1号线与2号线的交点在同口的左边沿与右边沿之间。
小球位于2号线下方。


斜截式
```
y = kx + b

k表示斜率， 
b表示与y轴的截距，也就是直线与y轴交点的纵坐标。

```
寻找两条直线的交点，
就是寻找同时满足两条直线方程的点，
我们假设这个点为`(X0, Y0)`,
两条直线方程分别为 `y = (k1)X + b1, y = (k2)X + b2`。

交点就是同时满足的点，那么就有：

```
(k1)X0 + b1 = (k2)X0 + b2
X0(k1 - k2) = b2 - b1
 
X0 = (b2 - b1)/(k1 - k2)
Y0 = (k1b2 - k2b1)/(k1 - k2)
```	 
该方法也有弊端，当小球做水平运动或是垂直运动时，
其斜率为0或是无穷，这时用该方法就不适用了。

```

catchBall = {
    intersectionPoint: {x:0, y:0},
    
    isBallInBucket: function () {
        if(lastBallPosition.left === ball.left ||
           lastBallPosition.top === ball.top){
            return;
        }
        
        //(x1, y1) = Last ball position
        //(x2, y2) = Current ball position
        //(x3, y3) = Bucket left
        //(x4, y4) = Bucket right
        
        var x1 = lastBallPosition.left,
            y1 = lastBallPosition.top,
            x2 = ball.left,
            y2 = ball.top,
            x3 = bucket_left + bucket_width/4,
            y3 = bucket_top,
            x4 = bucket_left + bucket_width,
            y4 = y3;
        
        //(x1, y1)到(x2, y2)的斜率
        var k1 = (ball.top - lastBallPosition.top)/(ball.left - lastBallPosition.left);
        
        //(x3, y3)到(x4, y4)的斜率
        var k2 = (y4 - y3) / (x4 - x3);
        
        //截距b1
        var b1 = y1 - k1*x1;
        
        //截距b2
        var b2 = y3 - k2*x3;
        
        this.intersectionPoint.x = (b2 - b1) / (k1 - k2);
        this.intersectionPoint.y = k1 * this.intersectionPoint.x + b1;
        
        return intersectionPoint.x > x3 &&
               intersectionPoint.x < x4 &&
               ball.top + ball.height > y3 &&
               ball.left + ball.width < x4;
        
    }
}

```


## 分离轴定理(SAT)

分离轴定理只适用于凸多边形，也就是所有内角均小于180度的多边形。
比如矩形，三角形等。
而如果有一个内角大于180度，就如吃豆人的形状，就不适合使用该定理。

把受测的两个物体置于一睹墙前面，然后用光线照射它们，
根据阴影部分是否香蕉来判断二者有没有相撞。

碰到了

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170226011-544806962.png)



没碰到

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161223170237323-4928346.png)



# 坐标旋转

做圆周运动

```
vr = 0.1
angle = 0
radius = 100
centerX = 0
centerY = 0
   
   object.x = centerX + Math.sin(angle)*radius
   object.y = centerY + Math.cos(angle)*radius
   angle += vr
```


只知道中心点(center point)和物体的位置

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161228143306898-1913565951.png)



```
var dx = objext.x - center.x,
	dy = object.y - center.y,
    angle = Math.atan2(dy, dx),
    radius = Math.sqrt(dx*dx + dy*dy);
	
```


只有物体的x,y坐标，和每一帧物体旋转的角度。

```
newX = x * cos(rotation) - y * sin(rotation);
newY = y * cos(rotation) + x * sin(rotation);
```

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161228143314632-293734964.png)



推导过程一：
```
//物体的原始位置，距离中心点的距离radius
x = radius * cos(angle);
y = radius * sin(angle);

newX = radius * cos(angle + rotation);
newY = raidus * sin(angle + rotation);
```

推导过程二：
```
//已知公式
cos(a + b) = cos(a) * cos(b) - sin(a) * sin(b);
sin(a + b) = sin(a) * cos(b) + cos(a) * sin(b);
```

推导过程三：

```
//所以可以化简成这种形式
newX = radius * cos(angle) * cos(rotation) - raidus * sin(angle) * sin(rotation);
newY = raidus * sin(angle) * cos(rotation) + raidus * cos(angle) * sin(rotation);
```

推导过程四：
```
//又因为 x = radius*cos(angle); y = radius*sin(angle); 将其代入得

newX = x * cos(rotation) - y * sin(rotation);
newY = y * cos(rotation) + x * sin(rotation);
```



如果设置了一个中心点，有物体的x,y坐标，和每一帧物体旋转的角度

```
newX = (x - centerX) * cos(rotation) - (y - centerY) * sin(rotation);
newY = (y - centerY) * cos(rotation) + (x - centerX) * sin(rotation);
```

# 角度反弹

假设有个斜平面，物体以一定的速度朝着斜面运动，如何取得反弹速度。

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161229170944820-1386173831.png)



所要做的所有事情就是把整个系统包括物体，包括平面全部旋转的平面，
做完反弹处理后，再旋转回去。
这就意味着，需要旋转斜面，旋转物体的坐标，并且还要旋转物体的速度。

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161229170951492-1718258970.png)



反弹后的速度

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161229170958054-1731467681.png)



把整个系统旋转回去，也就是还原整个系统到初始位置

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161229171005382-1742375020.png)



完整过程

![](http://images2015.cnblogs.com/blog/771172/201612/771172-20161229171012351-1736177758.png)


```

newX = x*cos - y*sin;
newY = y*cos + x*sin;

//旋转回去
newX = x*cos + y*sin;
newY = y*cos - x*sin;

```


# 桌球运动
## 动量

动量（Momentum）又称线性动量（Linear Momentum）。
在经典力学中，
动量（是指国际单位制中的单位为kg·m/s ，量纲MLT⁻¹）表示为物体的质量和速度的乘积，
是与物体的质量和速度相关的物理量，指的是运动物体的作用效果。
动量也是矢量，它的方向与速度的方向相同。

```
动量（p）, 质量（m）, 速度（v）

表达式： p = m * v

动量即物体质量与速度的乘积。

```


## 动量守恒

如果一个系统不受外力或所受外力的矢量和为零，
那么这个系统的总动量保持不变，这个结论叫做动量守恒定律。
简单点来说就是，物体1与物体2如果发生碰撞，
那么他们碰撞前的动量大小之和与碰撞后的动量大小之和是以不变的。

假设，物体1的质量为m1, 运动速度为v1, 碰撞后的速度v1F。
物体2的质量为m2, 运动速度为v2, 碰撞后的速度v2F。 
那么，他们满足
```
m1 * v1 + m2 * v2 = m1 * v1F + m2 * v2F
```


## 能量守恒

物体以一定的速度运动，那么它的能量为多少:
```
E = 0.5 * m * v^2
```


两物体如果发生碰撞，那么前后的能量保持不变，与动量守恒类似:
```
(0.5 * m1 * v1^2) + (0.5 * m2 * v2^2) = (0.5 * m1 * v1F^2) + (0.5 * m2 * v2F^2)
```


```
公式1： m1 * v1 + m2 * v2 = m1 * v1F + m2 * v2F
公式2： (0.5 * m1 * v1^2) + (0.5 * m2 * v2^2) = (0.5 * m1 * v1F^2) + (0.5 * m2 * v2F^2)

解得，碰撞后的速度为：
v1F = ((m1 - m2)*v1 + 2*m2*v2) / (m1+m2)
v2F = ((m2 - m1)*v2 + 2*m1*v1) / (m1+m2)
```


基于公式在实例中的使用：
```
var vx0Final = ((ball0.mass - ball1.mass)*ball0.vx + 2 * ball1.mass * ball1.vx)/(ball0.mass +ball1.mass);
var vx1Final = ((ball1.mass - ball0.mass)*ball1.vx + 2 * ball0.mass * ball0.vx)/(ball0.mass +ball1.mass);

根据
初始速度1 + 初始速度2 = 碰撞后速度1 + 碰撞后速度2

优化：
var vxTotal = ball0.vx - ball1.vx;         //速度方向相反所以相减
var vx0Final = ((ball0.mass - ball1.mass) * ball0.vx + 2 * ball1.mass * ball1.vx)/(ball0.mass + ball1.mass);      //只计算其中的一个速度
var vx1Final = vxTotal + vx0Final;        //另一个速度
```

一维碰撞运动
![](http://images2015.cnblogs.com/blog/771172/201702/771172-20170203154221995-1893879145.png)



二维碰撞运动
![](http://images2015.cnblogs.com/blog/771172/201702/771172-20170203154229401-2073660392.png)


# 万有引力
任意两个质点有通过连心线方向上的力相互吸引。
该引力大小与它们质量的乘积成正比与它们距离的平方成反比，
与两物体的化学组成和其间介质种类无关。

两个物体之间存在一种引力：
```

force = G * m1 * m2 / distance^2

m1 和m2是物体的质量，
distance是物体间的距离，
G是引力常数，是个非常小的值6.674*10^-11。
在动画中可以忽略这个值。
最后，表达式就变为:

force = m1 * m2 / distance^2

```

```
function gravitate(partA, partB){
     var dx = partB.x - partA.x;
     var dy = partB.y - partA.y;
     var distQ = dx*dx + dy*dy;
     var dist = Math.sqrt(distQ);
     var F = (partA.mass * partB.mass)/distQ;
               
     var ax = F * dx/dist;//作用力作用于加速度
     var ay = F * dy/dist;
               
     partA.vx += ax/partA.mass; //加速度作用于速度
     partA.vy += ay/partA.mass;
     partB.vx -= ax/partB.mass;
     partB.vy -= ay/partB.mass;
 }
```

# 3d

使用webGL来创建3D程序
```
3D坐标系
网格、多边形与顶点
材质、纹理与光源
变换与矩阵
相机、透视、视口与投影
着色器
```


使用CSS3来创建3D效果
```
    CSS变换：作用于整个元素的3D操作（平移，旋转，缩放）
    CSS过度：随着时间作用于CSS属性的简单变化，如补间
    CSS动画：关键帧，随时间作用于CSS属性的复杂效果
```

webGL和CSS3都是使用GPU来实现3D实时渲染，叫硬件渲染。

软件渲染也就是使用canvas API来渲染 3D 的效果。


webGL渲染过程：
![](http://images2015.cnblogs.com/blog/771172/201702/771172-20170203181407058-436938637.png)




## 3D坐标系统
![](http://images2015.cnblogs.com/blog/771172/201702/771172-20170203181412667-1610630727.png)




## perspective(透视、景深)

perspective的作用是确定物体是靠近我们，还是远离我们

在2维的平面，我们想要让物体感觉向我们走来，就放大它，同理远离的效果就是让它变小。
![](http://images2015.cnblogs.com/blog/771172/201702/771172-20170203181418620-632688390.png)




当物体远离直至消失的过程中，要想模拟三维的消失效果，必须让物体的x坐标，y坐标向消失点移动。
这个消失点可以理解为汽车向远方驶去，最终它会逐渐变成黑点消失在地平线上，这个黑点就是消失点。
![](http://images2015.cnblogs.com/blog/771172/201702/771172-20170203181424276-848435898.png)




人眼代表观察点，蓝色的球体代表屏幕中的物体，
人眼距离屏幕的距离为fl,
物体与屏幕之间有一段距离z值（这个值在成像的时候并不存在，反映到物体大小的变化上）
![](http://images2015.cnblogs.com/blog/771172/201702/771172-20170203181429448-350259526.png)




物体的大小与这两者之间的距离满足下面的关系：
```
scale = fl / (fl + z) = 1 / （1 + z/fl）

fl的值就如css3中设定的perspective值。 
从公式可以得出：scale的值一般情况下范围为（0，1.0），
这个值之后会用在缩放物体的比例与靠近消失点的比例。
当z轴无限大的时候（也就是朝着z轴的正向持续运动），scale的值就会趋近于0。
当z的距离趋近于（-fl）的时候，scale的值就会变得很大，就像是戳进我们的眼里。
```


假设fl=200,这时物体的z坐标等于0，那么由公式可得scale=1.0,那么物体的大小不变，物体的位置不变。
如果z=200,那么scale=0.5。物体的大小变为原来的1/2，同时我们要让它现在的坐标乘以缩放比例scale,得到新的位置。
如果原来的为（200，300），那么新坐标就为（100，150）。
具体效果如下图：
![](http://images2015.cnblogs.com/blog/771172/201702/771172-20170203181436058-1294089141.png)