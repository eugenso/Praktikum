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
    var searchArray = ["Urteil"];

    var SolrNode = require('solr-node');

// Create client
    var client = new SolrNode({
        host: '127.0.0.1',
        port: '8983',
        core: 'Paul',
        protocol: 'http'
    });
    var searchWordResponses = -1;
    for(var j = 0; j < searchArray.length; j++){

        var myStrQuery = "fl=*,termfreq(_text_,Urteil)&indent=on&q=*&wt=json";
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
            WortErgebnis = {};
            WortErgebnis.file = [];
            console.log(result);

            for(var i = 0; i < result.response.docs.length; i++){

                WortErgebnis.file[i] = {};
                WortErgebnis.file[i].filename = result.response.docs[i].stream_name[0];
              //  WortErgebnis.file[i].amountOfWord = result.response.docs[i]["termfreq(_text_,"+searchword+")"];

                /*console.log(result.response.docs[i].stream_name[0]);
                console.log(result.response.docs[i]["termfreq(_text_,"+searchword+")"]);

                console.log("Document Name: "+result.response.docs[i].stream_name[0]+ " Anzahl von "+searchword+": "+ result.response.docs[i]["termfreq(_text_,"+searchword+")"]);
                */
             }
            /*
            Ergebnis.push(WortErgebnis);
            searchWordResponses = searchWordResponses +1;

            if(searchArray.length ==  searchWordResponses){
                render(Ergebnis);
                console.log(Ergebnis);
            }
            */
        }




}
