# 金钱格式化
```
//零宽度正预测先行断言
'99999999'.replace(/(\d{1,3})(?=(\d{3})+$)/g, '$&,');//"99,999,999"

//零宽非单词边界,零宽度负预测先行断言,零宽度正预测先行断言
'99999999'.replace(/\B(?=(\d{3})+(?!\d))/g, ',');//"99,999,999"
```

# 首尾去空格
`\s`匹配一个空白符，包括空格、制表符、换页符、换行符和其他 Unicode 空格
```
'   12 34 5 6   '.replace(/^\s+|\s+$/g, '');
```
现在可以直接用`String.prototype.trim()`

# 相邻字符去重
`\1`代表一个反向引用（back reference），指向正则表达式中第 1 个括号（从左开始数）中匹配的子字符串。
```
'aaabbbcdfgghhjjkkk'.replace(/([A-Za-z]{1})(\1)+/g, '$1');
```

# 单词首字母大写
`\w`代表`[A-Za-z0-9_]`
```
' hi man good  luck '.replace(/\w+/g, function(word) { 
    return word.substr(0,1).toUpperCase() + word.substr(1);
});//" Hi Man Good  Luck "
```

# 中划线与驼峰的互相转换
```
function camelize(str) {
    return String(str).replace(/-[^-]/g, (match) => {
        return match.charAt(1).toUpperCase()
    })
}
```

```
function hyphenate(str) {
    return String(str).replace(/[A-Z]/g, function (match) {
        return '-' + match.toLowerCase();
    })
}
```
