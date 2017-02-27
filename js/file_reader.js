/**
 * Created by Andreas on 27.02.2017.
 */
exports.readfile = readfile;

function readfile() {
    var LineByLineReader = require('line-by-line'),
        lr = new LineByLineReader('./Suchlisten/Oberlandesgerichte.txt');

    lr.on('error', function (err) {
        // 'err' contains error object
    });

    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        console.log(line);
    });

    lr.on('end', function () {
        // All lines are read, file is closed now.
    });

}