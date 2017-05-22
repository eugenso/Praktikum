/**
 * Created by Hauke on 3/2/2017.
 */
exports.findDoc = findDoc;
var http = require("http");

function findDoc(searchWord,callback,searchModus){
    requestData(searchWord,callback,searchModus);
}

function requestData(searchWord,callback,searchModus) {
    var options = {
        hostname: 'solr',
        port: 8983,
        //path: '/solr/testcore/select?fl=' + encodeURIComponent('*,termfreq(_text_,"'+searchWord+'")') + '&indent=on&q=*:*&wt=json&rows=52000',
        path: '/solr/testcore/select?&q='+ encodeURIComponent(searchWord) + '&indent=on&wt=json&rows=52000',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    if(searchModus == "_ID_"){
        options.path = '/solr/testcore/select?&q=id:*'+ encodeURIComponent(searchWord) + '*&indent=on&wt=json&rows=52000';
    }
    if(searchModus == "_text_"){
        options.path = '/solr/testcore/select?&q=_text_:"'+ encodeURIComponent(searchWord) + '"&indent=on&wt=json&rows=52000';
    }
    if(searchModus == "AllFields"){
        options.path = '/solr/testcore/select?&q="'+ encodeURIComponent(searchWord) + '"&indent=on&wt=json&rows=52000';
    }

    //_text_:

        console.log(options.path);

    http.get(options, function (antwort) {
        var resultString = "";
        antwort.setEncoding('utf8')
        antwort.on('data', function (data) {
            resultString = resultString + data;
        });
        antwort.on('end', function () {
            callback(resultString);
            //console.log(resultString);
        });
        antwort.on('error', function(err){
            console.log("Here was an Error Message:"+err);
        });
    })
}
