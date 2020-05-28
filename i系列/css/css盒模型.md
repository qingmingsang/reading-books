HTML文档中的每个元素都被描绘成矩形盒子，这些矩形盒子通过一个模型来描述其占用空间，这个模型称为盒模型。
盒模型通过四个边界来描述：margin（外边距），border（边框），padding（内边距），content（内容区域）。

内容区域content area 是包含元素真实内容的区域。它通常包含背景、颜色或者图片等，位于内容边界的内部，它的大小为内容宽度 或 content-box宽及内容高度或content-box高。

内边距区域padding area 延伸到包围padding的边框。如果内容区域content area设置了背景、颜色或者图片，这些样式将会延伸到padding上。它位于内边距边界内部, 它的大小为 padding-box 宽与 padding-box 高。

边框区域border area 是包含边框的区域，扩展了内边距区域。它位于边框边界内部，大小为 border-box 宽和 border-box 高。由 border-width 及简写属性 border控制。

外边距区域margin area用空白区域扩展边框区域，以分开相邻的元素。它的大小为 margin-box 的高宽。