/**
 * Created by Hauke on 2/23/2017.
 */

exports.solrQuery = solrQuery;
exports.queryByFiles = queryByFiles;
//exports.logErgebnis = logErgebnis;
exports.Ergebnis = Ergebnis;

var Ergebnis = [];

function queryByFiles(render,searchwordJSON){
    function CallbackFunction(searchresults) {
        console.log(searchresults);
    }
    var calls = 0;

    startQuery();
    function startQuery(){
        if(calls<searchwordJSON.length){
            solrQuery(searchwordJSON[calls].linearray,CallbackFunction);
            calls = calls +1;
            //console.log(searchArray);
        }

    }
}
function solrQuery(searchArray,Callback){
    console.log("Test");
    //console.log(searchwordJSON);
    var SearchResult = [];
    // Require module
    var SolrNode = require('solr-node');

// Create client
    var client = new SolrNode({
            host: '127.0.0.1',
            port: '8983',
            core: 'testcore',
            protocol: 'http'
    });
    var amountOfErrors = 0;


    startQuery(SearchResult);
    var queryRuns = 0;
    function startQuery(SearchResult){

        var myStrQuery = 'fl=*,termfreq(_text_,"'+searchArray[queryRuns]+'")&indent=on&q=*&rows=52000&wt=json';

        client.search(myStrQuery, function (err, result, startQuery) {

            if (err) {
                console.log("Error="+err +myStrQuery);
                amountOfErrors++;
                return;
            }
            getResponse(result,startQuery);

        });
        if(queryRuns==searchArray.length){
            Callback(SearchResult);
        }
    }

    //asynchrone function get called when answer from http reader is received
        function getResponse(result,Callback){
            var Files = [];

            var responseHeader = result.responseHeader;

            if(responseHeader != undefined){
              //console.log(result.responseHeader.params.fl);

                var suchWort = returnStringBetween(responseHeader.params.fl,"_text_,",")");
                 //console.log("Suchwort "+suchWort+":");

                for(var i = 0; i < result.response.docs.length; i++){
                    var FileResult = {};
                    FileResult.filename ="";
                    FileResult.amount = 0;
                  //console.log(result.response.docs[i]);
                    var actualDocs = result.response.docs[i];
                    FileResult.amount = actualDocs["termfreq(_text_,"+suchWort+")"];
                    //console.log("Amount", FileResult.amount);

                    FileResult.filename = returnStringBetween(actualDocs.resourcename[0],"data\\",".txt");
                    //console.log("Filename "+FileResult.filename);

                    Files.push(FileResult);
                }

                //console.log(Files);
                //console.log(suchWort);
                var Response = {}
                Response.files = Files;
                Response.searchString = suchWort;
               // console.log(Response);
                SearchResult.push(Response);
                //console.log(SearchResult);
            }

            startQuery(SearchResult);

        }




}
function returnStringBetween (inputString, characterA, characterB){
    var outputString = inputString.split(characterA).pop().split(characterB).shift();
    return outputString;
}
