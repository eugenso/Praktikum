/**
 * Created by hauke on 05.03.2017.
 */
/**
 * Created by Hauke on 3/2/2017.
 */
/**
 * Created by Hauke on 3/2/2017.
 */
exports.pieQuery = pieQuery;
var http = require("http");
var config = require('../js/config');
var count_results = 0;
var numberResults =[];
var searchStringsLength = 0;


function pieQuery(searchStrings,callback){
    numberResults = [];
    console.log(numberResults);
    searchStringsLength = searchStrings.length;
    var count_results = 0;
    for(var i = 0; i<searchStrings.length; i++){
        var actual_SearchString = searchStrings[i];
        requestData(actual_SearchString,callback);
    }
}
function requestData(actual_SearchString,callback) {

    console.log(actual_SearchString);

    var options = {
        hostname: 'solr',
        port: 8983,
        //path: '/solr/testcore/select?fl=' + encodeURIComponent('*,termfreq(_text_,"'+searchWord+'")') + '&indent=on&q=*:*&wt=json&rows=52000',
        path: '/solr/testcore/select?&q='+ encodeURIComponent(actual_SearchString) + '&indent=on&wt=json&rows=52000',
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
            gotResult(JSON.parse(resultString),callback);
            //console.log(resultString);
        });
        antwort.on('error', function(err){
            console.log("Here was an Error Message:"+err);
        });
    });
}

function gotResult(resultString,callback){
   // console.log(resultString)
    var pieresult = {};
    pieresult.search_string = resultString.responseHeader.params.q;
    pieresult.amount = resultString.response.numFound;
    console.log("pieresult",pieresult);
    numberResults.push(pieresult);
    console.log("numberResults",numberResults);
    count_results = count_results+1;
    console.log("searchStringsLength",searchStringsLength);
    if(count_results == searchStringsLength){
        console.log(count_results);
        count_results = 0;
        callback(numberResults);

    }
}
