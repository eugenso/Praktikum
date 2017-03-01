/**
 * Created by hauke on 28.02.2017.
 */
exports.solrSearchWords = solrSearchWords;

var http = require("http");
var resultDataSet = {};
var solar_posts = require('../js/solr_post');

function solrSearchWords(searchCategorys){

    var actualLineNumber = 0;
    var actualSearchCatergoryNumber = 0;
    var firstResponse = true;
    responseCounter();
    var Documents = {};

    function startToReadNextCategorie(){
        if(searchCategorys.length == actualSearchCatergoryNumber){
            console.log("finished");
            var objectParameters = Object.getOwnPropertyNames(Documents);
            for(var i = 0; i<objectParameters.length; i++){
                console.log(Documents[objectParameters[i]]);
               solar_posts.solrPost(Documents[objectParameters[i]]);
            }
            //console.log(Documents);
        }
        else{
            responseCounter();
        }

    }
    function responseCounter(){

        if(searchCategorys[actualSearchCatergoryNumber].linearray.length == actualLineNumber){
            //console.log("finished Categorie:"+searchCategorys[actualSearchCatergoryNumber].txtname);
            actualLineNumber= 0;
            actualSearchCatergoryNumber++;
            startToReadNextCategorie();
        }
        else{
            requestData(searchCategorys[actualSearchCatergoryNumber].linearray[actualLineNumber]);
            actualLineNumber++;
        }
    }

    function requestData(searchWord) {

        var options = {
            hostname: 'localhost',
            port: 8983,
            //path: '/solr/testcore/select?fl=' + encodeURIComponent('*,termfreq(_text_,"'+searchWord+'")') + '&indent=on&q=*:*&wt=json&rows=52000',
            path: '/solr/testcore/select?&q=_text_:'+ encodeURIComponent('"'+searchWord+'"') + '&indent=on&wt=json&rows=52000',
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
                createWortListe(JSON.parse(resultString));
                //console.log(resultString);
            });
            antwort.on('error', function(err){
                console.log("Here was an Error Message:"+err);
            });
        })
    }
    function createWortListe(results){

        createFileList(results);

        responseCounter();
    }
    function createFileList(results){
        //iterate trought all files
       for(var i = 0; i < results.response.docs.length; i++){

           var id = returnStringBetween(results.response.docs[i].id,'data\\','.txt');

            //console.log(results);
           var searchWort = returnStringBetween(results.responseHeader.params.q,'_text_:"','"');
           //console.log(searchWort);

           var CategorieName = searchCategorys[actualSearchCatergoryNumber].txtname;

           if(Documents[id] == undefined){
               Documents[id] = {};
           }
           if(Documents[id][CategorieName] == undefined){
               Documents[id][CategorieName] = [];
           }
           Documents[id].Dateiname = id;
           Documents[id][searchCategorys[actualSearchCatergoryNumber].txtname].push(searchWort);
     }
        if(firstResponse){
            firstResponse = false;
           //console.log("Documents"+Documents);
        }
    }

}
function returnStringBetween (inputString, characterA, characterB){
        var outputString = inputString.split(characterA).pop().split(characterB).shift();
        return outputString;
}