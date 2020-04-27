文件使用相关
https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications

# FormData
```
<form enctype="multipart/form-data" method="post" name="fileinfo">
  <label>Your email address:</label>
  <input type="email" autocomplete="on" autofocus name="userid" placeholder="email" required size="32" maxlength="64" /><br />
  <label>Custom file label:</label>
  <input type="text" name="filelabel" size="12" maxlength="32" /><br />
  <label>File to stash:</label>
  <input type="file" name="file" required />
  <input type="submit" value="Stash the file!" />
</form>
<div></div>


var form = document.forms.namedItem("fileinfo");
form.addEventListener('submit', function(ev) {

  var oOutput = document.querySelector("div"),
      oData = new FormData(form);

  oData.append("CustomField", "This is some extra data");

  var oReq = new XMLHttpRequest();
  oReq.open("POST", "stash.php", true);
  oReq.onload = function(oEvent) {
    if (oReq.status == 200) {
      oOutput.innerHTML = "Uploaded!";
    } else {
      oOutput.innerHTML = "Error " + oReq.status + " occurred when trying to upload your file.<br \/>";
    }
  };

  oReq.send(oData);
  ev.preventDefault();
}, false);
```

# File
```
<!DOCTYPE HTML>
<html>
<head>
</head>
<body>
// multiple属性可以让用户能选择多个文件

<input id="myfiles" multiple type="file">

</body>

<script>

var pullfiles=function(){ 
    // 获取到input元素
    var fileInput = document.querySelector("#myfiles");
    var files = fileInput.files;
    // 获取到所选文件数量 
    var fl=files.length;
    var i=0;

    while ( i < fl) {
        var file = files[i];
        alert(file.name);
        i++;
    }    
}   
// 设置change事件处理函数
document.querySelector("#myfiles").onchange=pullfiles; 
</script>
</html>
```

# FileReader
```
<input type="file" onchange="previewFile()"><br>
<img src="" height="200" alt="Image preview...">

//JavaScript
function previewFile() {
  var preview = document.querySelector('img');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}
```