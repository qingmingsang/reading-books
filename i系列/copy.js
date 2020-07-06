var fs = require('fs'),
    path = require('path'),
    out = process.stdout;

var filePath = '/Users/Movies/Game.of.Thrones.S04E07.1080p.HDTV.x264-BATV.mkv';

var readStream = fs.createReadStream(filePath);
var writeStream = fs.createWriteStream('file.mkv');

var stat = fs.statSync(filePath);

var totalSize = stat.size;
var passedLength = 0;
var lastSize = 0;
var startTime = Date.now();

readStream.on('data', function (chunk) {

    passedLength += chunk.length;

    if (writeStream.write(chunk) === false) {
        readStream.pause();
    }
});

readStream.on('end', function () {
    writeStream.end();
});

writeStream.on('drain', function () {
    readStream.resume();
});
//或者使用更直接的pipe
// pipe自动调用了data,end等事件
//fs.createReadStream('/path/to/source').pipe(fs.createWriteStream('/path/to/dest'));

setTimeout(function show() {
    var percent = Math.ceil((passedLength / totalSize) * 100);
    var size = Math.ceil(passedLength / 1000000);
    var diff = size - lastSize;
    lastSize = size;
    out.clearLine();
    out.cursorTo(0);
    out.write('已完成' + size + 'MB, ' + percent + '%, 速度：' + diff * 2 + 'MB/s');
    if (passedLength < totalSize) {
        setTimeout(show, 500);
    } else {
        var endTime = Date.now();
        console.log();
        console.log('共用时：' + (endTime - startTime) / 1000 + '秒。');
    }
}, 500);
