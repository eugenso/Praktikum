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
var Ergebnis = {};

function solrQuery(render){
// Require module
    var searchword = "Urteil"
    var SolrNode = require('solr-node');

// Create client
    var client = new SolrNode({
        host: '127.0.0.1',
        port: '8983',
        core: 'Paul',
        protocol: 'http'
    });

    var myStrQuery = 'fl=*,termfreq(_text_,'+searchword+')&indent=on&q=*&wt=json';

// Search documents using myStrQuery


    client.search(myStrQuery, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        getResponse(result);
        //console.log('Response:', result.response);

    });

    function getResponse(result){
        console.log("gesuchtes Wort: "+searchword);
        Ergebnis.file = [];
        for(i = 0; i < result.response.docs.length; i++){


            Ergebnis.file[i] = {};

            Ergebnis.file[i].filename = result.response.docs[i].stream_name[0];
            Ergebnis.file[i].amountOfWord = result.response.docs[i]["termfreq(_text_,"+searchword+")"];

            /*console.log(result.response.docs[i].stream_name[0]);
            console.log(result.response.docs[i]["termfreq(_text_,"+searchword+")"]);

            console.log("Document Name: "+result.response.docs[i].stream_name[0]+ " Anzahl von "+searchword+": "+ result.response.docs[i]["termfreq(_text_,"+searchword+")"]);
            */
        }


        render(Ergebnis)
    }



}
