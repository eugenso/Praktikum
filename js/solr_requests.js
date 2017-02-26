/**
 * Created by Hauke on 2/23/2017.
 */



exports.testfunction = testFunction;
exports.solrQuery = solrQuery
//exports.logErgebnis = logErgebnis;
exports.Ergebnis = Ergebnis;

function testFunction(){
    console.log("Hallo Welt");
}
var Ergebnis = [];

function solrQuery(render){
// Require module
    var searchArray = ["Urteil","der"];
    var SearchResult = [];
    var SolrNode = require('solr-node');

// Create client
    var client = new SolrNode({
        host: '127.0.0.1',
        port: '8983',
        core: 'testcore',
        protocol: 'http'
    });
    var searchWordResponses = -1;
    for(var j = 0; j < searchArray.length; j++){

        var myStrQuery = "fl=*,termfreq(_text_,"+searchArray[j]+")&indent=on&q=*&rows=52000&wt=json";
        console.log("Query send");
        // Search documents using myStrQuery
        client.search(myStrQuery, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Response Follow");
            getResponse(result);
            //console.log('Response:', result.response);

        });
    }

        function getResponse(result){
            var Files = [];

            var responseHeader = result.responseHeader;
            if(responseHeader != undefined){
              // console.log(result.responseHeader.params.fl);

                var suchWort = returnStringBetween(responseHeader.params.fl,"_text_,",")");
               // console.log("Suchwort "+suchWort+":");

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
            if(SearchResult.length == searchArray.length){
                render(SearchResult);
            }

        }




}
function returnStringBetween (inputString, characterA, characterB){
    var outputString = inputString.split(characterA).pop().split(characterB).shift();
    return outputString;
}
