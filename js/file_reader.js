/**
 * Created by Andreas on 27.02.2017.
 */
exports.readfile = readAllfiles;

searchCategoriesAndWords =  [];

//searchFiles = ["Oberlandesgerichte", "Oberverwaltungsgerichte","Arbeitsgerichte","Finanzgerichte"];
searchFiles =[];
function readAllfiles(callBackToIndex) {
    var callBackToIndex = callBackToIndex;
    const testFolder = './Suchlisten/';
    const fs = require('fs');
    //function reads all files in a folder
    fs.readdir(testFolder, function(err, files) {
        searchFiles = files;
        startReading(callBackToIndex);
    });
    function startReading(callBackToIndex){
        //console.log(searchFiles);
        for(var i = 0; i<searchFiles.length; i++){
            //console.log(searchFiles[i]);
            readfile(searchFiles[i].replace(".txt",""),callBackAfterAllIsRead);
        }
        var docAmount = searchFiles.length;
        //Callback after all Files are read
        function callBackAfterAllIsRead(result){
            //console.log(result);
            callBackToIndex(result);
        }
    }
}

function readfile(txtname,callBackAfterAllIsRead) {
    //console.log(txtname);
    var LineByLineReader = require('line-by-line'),
        lr = new LineByLineReader("./Suchlisten/"+txtname+".txt",{ encoding: 'utf8', skipEmptyLines: true});
    var linearray =[];
    lr.on('error', function (err) {
        // 'err' contains error object
        console.log(err);
    });

    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        linearray.push(line)
    });

    lr.on('end', function () {
        // All lines are read, file is closed now.
        //console.log(linearray);
        saveResults(linearray,txtname,callBackAfterAllIsRead);
    });
}

function saveResults(linearray,txtname,callBackAfterAllIsRead){

    var searchfile = {};
    searchfile.txtname = txtname;
    searchfile.linearray = linearray;
    searchCategoriesAndWords.push(searchfile);

    if(searchCategoriesAndWords.length == searchFiles.length){
        callBackAfterAllIsRead(searchCategoriesAndWords);
    }
}


