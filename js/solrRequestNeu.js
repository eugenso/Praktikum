/**
 * Created by hauke on 28.02.2017.
 */
exports.solrSearchWords = solrSearchWords;

var http = require("http");

var resultDataSet = {};

function solrSearchWords(searchCategorys){


    actualLineNumber = 0;
    responseCounter();


    function responseCounter(){

        if(searchCategorys[0].linearray.length == actualLineNumber){
            console.log("finished");
        }
        else{
            //console.log("Wort: " + searchCategorys[0].linearray[actualLineNumber]);
            requestData(searchCategorys[0].linearray[actualLineNumber]);
            actualLineNumber++;
        }
    }

    function requestData(searchWord) {

        var options = {
            hostname: 'localhost',
            port: 8983,
            path: '/solr/testcore/select?fl=' + encodeURIComponent('*,termfreq(_text_,"'+searchWord+'")') + '&indent=on&q=*:*&wt=json&rows=52000',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        http.get(options, function (antwort) {
            var resultString = "";
            antwort.setEncoding('utf8')
            antwort.on('data', function (data) {
                resultString = resultString + data;
            });
            antwort.on('end', function () {
                createWortListe(JSON.parse(resultString));
                //console.log(resultString);
            });
            antwort.on('error', console.error);
        })
    }
    function createWortListe(results){
        var Wort = {};
        //console.log(results);
        var searchString = returnStringBetween(results.responseHeader.params.fl,',termfreq(_text_,"','")');
        Wort.wortString = searchString;
        Wort.files = createFileList(results).files;
        Wort.amount = createFileList(results).amount;
        console.log(Wort);

        responseCounter();
    }
    function createFileList(results){

       //console.log(results.response);
       var files = [];
       var amountSum = 0;
       for(var i = 0; i < results.response.docs.length; i++){
            var file = {};
            file.id = results.response.docs[i].id;
            var flString = returnStringBetween(results.responseHeader.params.fl,',termfreq(_text_,"','")');
            file.amount = results.response.docs[i]['termfreq(_text_,"'+flString+'")'];
            files.push(file);
            amountSum = amountSum + file.amount;
       }
       return { files:files, amount:amountSum};
    }

}
function returnStringBetween (inputString, characterA, characterB){
    var outputString = inputString.split(characterA).pop().split(characterB).shift();
    return outputString;
}
/*
var SolrNode = require('solr-node');


var client = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'testcore',
    protocol: 'http'

});

function solrSearchWords(searchCategorys){
    var countResponses = 0;
    var results = [];
    for(var i = 0; i < searchCategorys[0].linearray.length; i++){

        console.log(searchCategorys[0].linearray[i]);
        var objQuery = client.query().fl('*,termfreq(_text_,"'+searchCategorys[0].linearray[i]+'")').q('*').rows("52000");

        var myStrQuery = 'fl=*,termfreq(_text_,'+searchCategorys[0].linearray[i]+')&indent=on&q=*&rows=52000&wt=json';

        client.search(objQuery, handelResponse);
        console.log(encodeURIComponent('*,termfreq(_text_,"Amtsgericht%20Bersenbrück")') );
    }


    function handelResponse(err, result){

        if (err) {
            console.log("Error="+err.toString());

            return;
        }
        countResponses ++;
        results.push(result);


            console.log(result.responseHeader.params.fl);

        console.log(countResponses);
        console.log("searchWords Länge"+searchCategorys[0].linearray.length);

    }

}
*/
