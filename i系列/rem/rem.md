rem 是 css 的长度单位，它是相对于 `<html>` 元素的 font-size 的相对值。假设 html `{ font-size: 20px; }`，那么 1rem 就等于 20px。

# 根据 layout viewport 来设置 rem
可以根据 layout viewport 的大小，来设置`<html>` 元素的 font-size 的值。
```
function () {
  const setRem = () => document.documentElement.style.fontSize = document.documentElement.clientWidth / 10
  window.addEventListener('DOMContentLoaded', setRem, false)
  window.addEventListener('orientationchange', setRem, false)
} ()
```
上面的脚本根据手机浏览器的 layout viewport 来设置 `<html>` 元素的 font-size 。 因此在任何手机上，1rem 都是 1/10 layout viewport。
由于我们一般都会加上 `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"> `标签，所以 layout viewport 和 visual viewport 是相等的，都代表手机屏幕能够显示的 css 像素，因此在任何手机上，1rem 都是 1/10 手机屏幕的宽度，10rem 都是占满手机屏幕的宽度。

当网页需要在移动端显示的时候，我们给元素设置 css 尺寸的时候，都要使用 rem，不要使用 px，因为使用 px 的元素在不同的手机上显示效果差别太大。
举个例子，某个元素的 width 为 320px，那么该元素在 iphone5 上满屏显示，在 iphone6 上则不会满屏显示，右侧会留有 55px 的空白。如果某个元素的 width 为 10rem，则无论在 iphone5 还是 iphone6 上，都是满屏显示。

如果给我们一个适配 iphone6 的网页设计稿，该设计稿的尺寸应该为 750 物理像素，因为 iphone6 的设备物理分辨率为 750。iphone6 的 devicePixelRatio (以下简称 dpr) 为 2，也就是用 2 个物理像素来显示 1 个设备独立像素。在不缩放网页的情况下，1 个 css 像素由 1 个设备独立像素来渲染，也就是由 2 个物理像素渲染。因此 750 物理像素转换为 css 像素应该是 375px。
如果我们在适配 iphone6 的设计稿上测量某个元素的尺寸为 64 物理像素，那么该元素的 css 像素应该是 32px。根据上面脚本的设置，iphone6 上 1rem 相当于 37.5px，所以 32px 就相当于 `(32 / 37.5)`rem。为了避免每次计算元素的 rem 尺寸都需要用 css 像素除以 `37.5`，我们可以写成 sass 的函数 (该 sass 函数只适用于设计稿是 iphone6 的情况)。
```
@function px2rem($px) {
  @return $px / 37.5 + rem;
}
```
假设我们的网页设计稿的尺寸为 750 像素，那么该设计稿就是针对 iphone6 的设计稿。在设计稿上测量某个元素为 100 像素，则只需要指定 `width: px2rem(50)`。之所以参数是 50 不是 100，是因为 100 是物理像素，iphone6 上 100 物理像素就相当于 50px。如果觉得麻烦，可以将 iphone6 的设计稿缩放成 375 像素，这样再在设计稿上测量出某个元素为 50 像素，就是 50px，不需要除以 2 了。

# 根据 devicePixelRatio 来设置 rem
根据 layout viewport 的大小来设置 rem，可以保证只要使用 rem 设置元素的尺寸，同一个元素在不同的手机上所占屏幕的百分比都是相同的，这就相当于元素采用百分比来布局。在大屏幕的手机上，该元素所占的物理尺寸就大，在小屏幕的手机上，该元素所占的物理尺寸就小。但是有些情况下，我们希望某个元素在不同手机上，所占的物理尺寸都差不多，而不考虑该元素所占屏幕的百分比是多少 (比如我们设置字体大小，希望字体在不同设备上的物理尺寸都差不多)。这种情况下，根据 layout viewport 来设置 rem 就不适合了。

我们可以采用一种新的方案来代替 根据 layout viewport 来设置 rem 的方案，那就是 根据设备的 devicePixelRatio(物理像素分辨率与CSS像素分辨率之比) 来设置 rem `1rem = 50px * dpr`。
dpr 为 1 的设备上，1rem = 50px，dpr 为 2 的设备上，1rem = 100px。同时还会根据 devicePixelRatio 设置 `<meta name="viewport">` 标签的 initial-scale 的值 `initial-scale = 1 / dpr`。dpr 为 1 的设备上，`initial-scale = 1`，dpr 为 2 的设备上，`initial-scale = 0.5`。这样可以保证，在不同的设备上，相同 rem 的元素所占的物理尺寸差不多。

我们通过在 `<head>` 标签内加上下面的压缩的 js 代码，可以实现根据 devicePixelRatio 来设置 rem。另外我们不要自己定义 `<meta name="viewport">` 标签，因为下面的代码会自动定义该标签，并且根据 devicePixelRatio 来设置 initial-scale 的属性值。

```
'use strict';

/**
 * @param {Boolean} [normal = false] - 默认开启页面压缩以使页面高清;  
 * @param {Number} [baseFontSize = 100] - 基础fontSize, 默认100px;
 * @param {Number} [fontscale = 1] - 有的业务希望能放大一定比例的字体;
 */
const win = window;
export default win.flex = (normal, baseFontSize, fontscale) => {
  const _baseFontSize = baseFontSize || 100;
  const _fontscale = fontscale || 1;

  const doc = win.document;
  const ua = navigator.userAgent;
  const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
  const UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
  const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
  const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
  let dpr = win.devicePixelRatio || 1;
  if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
    // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
    dpr = 1;
  }
  const scale = normal ? 1 : 1 / dpr;

  let metaEl = doc.querySelector('meta[name="viewport"]');
  if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    doc.head.appendChild(metaEl);
  }
  metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`);
  doc.documentElement.style.fontSize = normal ? '50px' : `${_baseFontSize / 2 * dpr * _fontscale}px`;
};
```
根据 devicePixelRatio 来设置 rem，在 iphone6 上，dpr = 2，1rem = 100px，initial-scale=0.5，layout viewport = 750px，因此如果在适配 iphone6 的 750 像素的设计稿上测量一个元素的尺寸为 100 像素，则可以直接转换为 1rem，测量某个元素为 12px，则转换为 0.12rem，这样我们可以很方便的将测量的像素转换为 rem。



