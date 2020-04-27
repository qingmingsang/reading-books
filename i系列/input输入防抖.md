通过compositionstart & compositionend做的中文输入处理
```
<input
ref="input"
@compositionstart="handleComposition"
@compositionupdate="handleComposition"
@compositionend="handleComposition"
>
```
compositionstart 事件触发于一段文字的输入之前（类似于 keydown 事件，但是该事件仅在若干可见字符的输入之前，而这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）
每打一个拼音字母，触发compositionupdate，最后将输入好的中文填入input中时触发compositionend,
触发compositionstart时，文本框会填入 “虚拟文本”（待确认文本），同时触发input事件.
填入实际内容后（已确认文本）,触发compositionend,所以这里如果不想触发input事件的话就得设置一个bool变量来控制。