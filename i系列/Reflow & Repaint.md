解析页面流程
1. 解析HTML，构建DOM树
2. 解析CSS，生成CSS规则树
3. 合并DOM树和CSS规则，生成render树
4. 布局render树（Layout/reflow），负责各元素尺寸、位置的计算
5. 绘制render树（paint），绘制页面像素信息
6. 浏览器会将各层的信息发送给GPU，GPU会将各层合成（composite），显示在屏幕上

Layout，也称为Reflow，即回流。一般意味着元素的内容、结构、位置或尺寸发生了变化，需要重新计算样式和渲染树
Repaint，即重绘。意味着元素发生的改变只是影响了元素的一些外观之类的时候（例如，背景色，边框颜色，文字颜色等），此时只需要应用新样式绘制这个元素就可以了

回流的成本开销要高于重绘，而且一个节点的回流往往回导致子节点以及同级节点的回流， 所以优化方案中一般都包括，尽量避免回流。

什么会引起回流？
1. 页面渲染初始化
2. DOM结构改变，比如删除了某个节点
3. render树变化，比如减少了padding
4. 窗口resize
5. 改变字体大小
6. 最复杂的一种：获取某些属性，引发回流，
    - 很多浏览器会对回流做优化，会等到数量足够时做一次批处理回流，
    但是除了render树的直接变化，当获取一些属性时，浏览器为了获得正确的值也会触发回流，这样使得浏览器优化无效，包括
        - （1）offset(Top/Left/Width/Height)
        -  (2) scroll(Top/Left/Width/Height)
        -  (3) cilent(Top/Left/Width/Height)
        -  (4) width,height
        -  (5) 调用了getComputedStyle()或者IE的currentStyle

回流一定伴随着重绘，重绘却可以单独出现
所以一般会有一些优化方案，如：
- 减少逐项更改样式，最好一次性更改style，或者将样式定义为class并一次性更新
- 避免循环操作dom，创建一个documentFragment或div，在它上面应用所有DOM操作，最后再把它添加到window.document
- 避免多次读取offset等属性。无法避免则将它们缓存到变量
- 将复杂的元素fixed 或 absolute定位，使得它脱离文档流，否则回流代价会很高
- table 布局可能会因为很小的一个小改动会造成整个 table 的重新布局。

# 简单层与复合层
上述中的渲染中止步于绘制，但实际上绘制这一步也没有这么简单，它可以结合复合层和简单层的概念来讲。

这里不展开，进简单介绍下：

可以认为默认只有一个复合图层，所有的DOM节点都是在这个复合图层下的

如果开启了硬件加速功能，可以将某个节点变成复合图层

复合图层之间的绘制互不干扰，由GPU直接控制

而简单图层中，就算是absolute等布局，变化时不影响整体的回流，但是由于在同一个图层中，仍然是会影响绘制的，因此做动画时性能仍然很低。而复合层是独立的，所以一般做动画推荐使用硬件加速


