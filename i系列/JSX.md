1. jsx语法糖的html结构是通过babel将结构解析转换为React.createElement函数调用。
2. React.createElement做的事情就是生成react的ast树
3. 渲染，render函数主要做了两件事，一件是将ast树转换为fiber 结构。填入许多调度、更新、diff相关数据，并转换ast树为dom树，一件是挂载。
4. ast树转换为dom树，先是为我们准备好fiber版本的节点关系结构，然后从下往上的渲染一个一个的元素，最后将所有的节点添加到最外面的那一层dom上面，并赋值给最外层的fiber.stateNode,fiber.stateNode即将插入页面的dom元素。

https://segmentfault.com/a/1190000013870949?utm_source=tag-newest
https://www.tangshuang.net/4810.html
https://www.jianshu.com/p/d571b2b5479f


```
define(function(require) {

    var React = require('react');
    var paramRegex  = /__(\d)+/;
    var parser      = new DOMParser();
    var errorDoc    = parser.parseFromString('INVALID', 'text/xml');
    var errorNs     = errorDoc.getElementsByTagName("parsererror")[0].namespaceURI;
    // turns the array of string parts into a DOM
    // throws if the result is an invalid XML document.
    function quasiToDom(parts) {
    
        // turn ["<div class='", "'>Hi</div>"] 
        // into "<div class='__0'>Hi</div>"
        var xmlstr = parts.reduce((xmlstr, part, i) => {
            xmlstr += part;
            if (i != parts.length - 1) { // the last part has no ending param
                xmlstr += `__${i}`;
            }
            return xmlstr;
        }, "");
       // parse into DOM, check for a parse error
       // browser's DOMParser is neat, but error handling is awful
       var doc      = parser.parseFromString(xmlstr, 'text/xml');
       var errors   = doc.getElementsByTagNameNS(errorNs, 'parsererror');
       var error    = '';
       if (errors.length > 0) {
           error = errors[0].textContent.split('\n')[0];
           throw `invalid jsx: ${error}\n${xmlstr}`; 
       }
       return doc;
    }
    // turn a document into a tree of react components
    // replaces tags, attribute values and text nodes that look like the param
    // placeholder we add above, with the values from the parameters array.
    function domToReact(node, params) {
        var match;
        
        // text node, comment, etc
        if (node.nodeValue) { 
            var value = node.nodeValue.trim();
            if (value.length === 0) {
                return undefined;
            }
            match = value.match(paramRegex);
            return match ? params[parseInt(match[1])] : value;
        }
        // node to get react for
        // if the node name is a placeholder, assume the param is a component class
        var reactNode;
        match = node.localName.match(paramRegex)
        reactNode = match ? params[parseInt(match[1])] : React.DOM[node.localName];
            
        // if we don't have a component, give a better error message
        if (reactNode === undefined) {
            throw `Unknown React component: ${node.localName}, bailing.`;
        }
        // attributes of the node
        var reactAttrs = {};
        for (var i = node.attributes.length - 1; i >= 0; i--) {
            var attr = node.attributes[i];
            reactAttrs[attr.name] = attr.value;
            match = attr.value.match(paramRegex); 
            if (match) {
                reactAttrs[attr.name] = params[parseInt(match[1])];
            }
        }
        // recursively turn children into react components
        var reactChildren = [];
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            var reactChild = domToReact(child, params);
            if (reactChild) {
                reactChildren.push(reactChild);
            }
        }
        return reactNode(reactAttrs, reactChildren);
    }
    return function jsx(parts, ...params) {
        var doc     = quasiToDom(parts);
        var react   = domToReact(doc.firstChild, params);
        return react;
    }
});
```