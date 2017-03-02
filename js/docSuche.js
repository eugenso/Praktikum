/**
 * Created by Hauke on 3/2/2017.
 */
exports.findDoc = findDoc;
var http = require("http");

function findDoc(searchWord,callback){
    requestData(searchWord,callback);
}

function requestData(searchWord,callback) {
    var options = {
        hostname: 'localhost',
        port: 8983,
        //path: '/solr/testcore/select?fl=' + encodeURIComponent('*,termfreq(_text_,"'+searchWord+'")') + '&indent=on&q=*:*&wt=json&rows=52000',
        path: '/solr/testcore/select?&q=_text_:'+ encodeURIComponent(searchWord) + '&indent=on&wt=json&rows=52000',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    if(searchWord == "﻿Verurteilung zur"){
        console.log(options.path);
    }
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