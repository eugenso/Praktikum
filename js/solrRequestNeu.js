/**
 * Created by hauke on 28.02.2017.
 */
exports.solrSearchWords = solrSearchWords;


function solrSearchWords(searchCategorys){
    var http = require("http");
    var options = {
        hostname: 'localhost',
        port: 8983,
        path: '/solr/testcore/select?fl='+encodeURIComponent('*,termfreq(_text_,"Amtsgericht Bersenbrück")')+'&indent=on&q=*:*&wt=json',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    http.get(options, function (response) {
        response.setEncoding('utf8')
        response.on('data', console.log)
        response.on('error', console.error)
    })
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
function returnStringBetween (inputString, characterA, characterB){
    var outputString = inputString.split(characterA).pop().split(characterB).shift();
    return outputString;
}