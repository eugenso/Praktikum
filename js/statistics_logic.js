/**
 * Created by Andreas on 02.03.2017.
 */
exports.readfile = readfile;

var gerichte = require('../routes/gerichte.js');
var res = undefined;
var townNameArray =[];
var result = [];

function readfile(ressource) {
    //console.log(txtname);
    result = [];
    townNameArray =[];
    //console.log(result);
    res = ressource;
    var LineByLineReader = require('line-by-line'),
        lr = new LineByLineReader("./Suchlisten/LandgerichtStaedte.txt",{ encoding: 'utf8', skipEmptyLines: true});

    lr.on('error', function (err) {
        // 'err' contains error object
        console.log(err);
    });

    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        townNameArray.push(line)
    });

    lr.on('end', function () {
        // All lines are read, file is closed now.
        //console.log(townNameArray);
        startCreateIngQuerys();
    });

var createdQuerys = -1;
var town ={};
var activeTownName = "";
function startCreateIngQuerys(){
    createdQuerys++;
    //console.log(createdQuerys);
    //console.log(townNameArray.length)
    if(createdQuerys < townNameArray.length){
        activeTownName = townNameArray[createdQuerys];
        town = {};
        town.name = activeTownName;
        town.amount = [];
        startRequests("",startCreateIngQuerys);
    }
    else{
        //console.log(result);
        gerichte.start_rendering(res,result);

    }
}

var http = require("http");


var queryNumber = 0;

function startRequests(resultString,startCreateIngQuerys){
    //console.log("runs into start requests");

    if(resultString != ""){
        //console.log("result reached");
        //console.log("Anzahl gefunden",resultString.response.numFound);
        //console.log("resultstring is not empty", resultString);
        town.amount.push(resultString.response.numFound);
        //console.log(town.amount);
        //console.log(queryNumber);
        if(queryNumber == 3){
            queryNumber = -1;
            result.push(town);
            startCreateIngQuerys();
        }
    }
    if(queryNumber == 0){
        //console.log("query 0");
        //console.log(activeTownName);
        var query_string = encodeURIComponent('Landgericht_txt:"'+activeTownName+'"');
        requestNumResult(query_string,startRequests,startCreateIngQuerys);

    }
    if(queryNumber == 1){
        //console.log("query 1");
        var query_string = encodeURIComponent('Landgericht_txt:"'+activeTownName+'" AND  revnichterfolgreich_txt:* NOT reverfolgreich_txt:* ');
        requestNumResult(query_string,startRequests,startCreateIngQuerys);
    }
    if(queryNumber == 2){
        //console.log("query 2");
        var query_string = encodeURIComponent('Landgericht_txt:"'+activeTownName+'" AND  reverfolgreich_txt:* NOT revnichterfolgreich_txt:* ');
        requestNumResult(query_string,startRequests,startCreateIngQuerys);
    }
    queryNumber++;
}

function requestNumResult(query_string,startRequests,startCreateIngQuerys) {

    var options = {
        hostname: 'localhost',
        port: 8983,
        //path: '/solr/testcore/select?fl=' + encodeURIComponent('*,termfreq(_text_,"'+searchWord+'")') + '&indent=on&q=*:*&wt=json&rows=52000',
        path: '/solr/testcore/select?&q='+query_string+'&indent=on&wt=json&rows=52000',
        //path: '/solr/testcore/select?indent=on&q='+encodeURIComponent('LandgerichtStaedte_txt:* && Entscheidungsart_txt:Urteil')+'&wt=json',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    //console.log(options.path);
    http.get(options, function (antwort) {
        var resultString = "";
        antwort.setEncoding('utf8')
        antwort.on('data', function (data) {
            resultString = resultString + data;
        });
        antwort.on('end', function () {
            //console.log(resultString);
            resultString = JSON.parse(resultString);
            //console.log(resultString);
            startRequests(resultString,startCreateIngQuerys);
        });
        antwort.on('error', function(err){
            console.log("Here was an Error Message:"+err);
        });
    })
}
}
