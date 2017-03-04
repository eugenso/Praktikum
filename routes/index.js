var express = require('express');
var router = express.Router();

TestEvents ={};





var file_reader = require('../js/file_reader');
var alchemy_request = require('../js/alchemy_request');
var solar_posts = require('../js/solr_post');
var config = require('../js/config');

GLOBAL_api_key = config.GLOBAL_api_key;
GLOBAL_model_id = config.GLOBAL_model_id;

events = require('events');
if(config.runWatson){
    alchemy_request.AlchemyOutput();
}
solr_events = new events.EventEmitter();

timeBefore = new Date().getTime();


if(config.updateSolrSearchWordResults){

file_reader.readfile(callBackToIndex);


    function callBackToIndex(fileresult){
        var solar_requestNeu = require('../js/solrRequestNeu');
        solar_requestNeu.solrSearchWords(fileresult)
    }
}

router.get('/', function(req, res, next) {

    render();
    //console.log("Files = "+files);
    function render(){
        //console.log(Ergebnis);
        //console.log(Ergebnis[0].files);
        res.render('index', { result: "" });
    }



});

module.exports = router;


