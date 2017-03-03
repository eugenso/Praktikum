/**
 * Created by Andreas on 02.03.2017.
 */
exports.requestdocs = requestdocs;
var http = require("http");

function requestdocs(searchWord) {
   console.log("Ishere");
    var options = {
        hostname: 'localhost',
        port: 8983,
        //path: '/solr/testcore/select?fl=' + encodeURIComponent('*,termfreq(_text_,"'+searchWord+'")') + '&indent=on&q=*:*&wt=json&rows=52000',
        path: '/solr/testcore/select?&q=_text_:'+ encodeURIComponent('"'+searchWord+'"') + '&indent=on&wt=json&rows=52000',
        //path: '/solr/testcore/select?indent=on&q='+encodeURIComponent('LandgerichtStaedte_txt:* && Entscheidungsart_txt:Urteil')+'&wt=json',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    console.log(options.path);
    http.get(options, function (antwort) {
        var resultString = "";
        antwort.setEncoding('utf8')
        antwort.on('data', function (data) {
            resultString = resultString + data;
        });
        antwort.on('end', function () {
            console.log(resultString);
            //JSON.parse(resultString);
        });
        antwort.on('error', function(err){
            console.log("Here was an Error Message:"+err);
        });
    })


    /*function searchinsolrfields(){
    };
    */

}