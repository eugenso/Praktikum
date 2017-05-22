/**
 * Created by Andreas on 28.02.2017.
 */
exports.solrPost = solrPost;
exports.solrPostDataFromWatson = solrPostDataFromWatson;
var config = require('../js/config');
var http = require("http");

var resultDataSet = {};
function solrPostDataFromWatson(docobj){
    console.log(docobj);
    solrPost(docobj);
    //console.log(idPrePath);
}

function solrPost(docobj){
    var idPrePath = config.solrDataPath+docobj.Dateiname+".txt";
    actualLineNumber = 0;
    postData();

    function postData() {

        var post_data = '[{ "id" : "'+idPrePath+'",';
        //var post_data = '[{ "id" : "1234", ';

        var objectParameters = Object.getOwnPropertyNames(docobj);
        for(var i = 0; i<objectParameters.length-1; i++){
            post_data = post_data+'"'+objectParameters[i]+'_txt" : {"set":'+JSON.stringify(docobj[objectParameters[i]])+'}, ';
        }
        post_data = post_data+'"'+objectParameters[objectParameters.length-1]+'_txt" : {"set":'+JSON.stringify(docobj[objectParameters[objectParameters.length-1]])+'} ';

        //console.log(objectParameters[objectParameters.length-1]+'_txt" : {"set":'+JSON.stringify(docobj[objectParameters[objectParameters.length-1]]))
        post_data = post_data+'}]';
        //console.log(post_data);
        var options = {
            hostname: 'solr',
            port: 8983,
            path: '/solr/testcore/update?commit=true',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var request = http.request(options, function (antwort) {
            var resultString = "";
            antwort.setEncoding('utf8');
            antwort.on('data', console.log);
            antwort.on('end', console.log);
            antwort.on('error', console.error);

        })

        request.write(post_data);
        request.end();
    }

}

