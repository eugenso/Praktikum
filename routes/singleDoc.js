/**
 * Created by Hauke on 3/2/2017.
 */
/**
 * Created by jonas on 28.02.2017.
 */
var express = require('express');
var router = express.Router();
var findSingleDoc = require('../js/findSingleDoc');
/* GET users listing. */

router.get('/', function(req, res, next) {
    res.render('singleDoc', { result: "" })
});

router.post('/', function(req, res, next) {
    //metaDaten = req.body.docid;
    console.log(req.body);


    findSingleDoc.findDoc(req.body.docid,showresult);

    function showresult(metaDaten){
        console.log(metaDaten);
        /*metaDaten = JSON.parse(metaDaten);
        resultDaten = splitSearchResult(metaDaten);
        res.render('singleDoc', { result: resultDaten });*/
    }

});
function splitSearchResult(metaDaten){
    //console.log("split search Result");
    var result = {};


    if(metaDaten == undefined){
        console.log("not searched yet");
        result.message = "not searched yet";
    }
    else if(metaDaten.error != undefined ){
        metaDaten.error = "Error search field empty?";
        console.log("error occured (z.B. no Search Field content) ");
        result.message = "Fehler, ist das Suchfeld leer? ";
    }
    else if(metaDaten.response.numFound == 0){
        console.log("no result found");
        result.message = "Es wurden keine Ergebnisse gefunden";
    }
    else{
        console.log("is here trying");
        result.message = "nix";
        result.searchword = metaDaten.responseHeader.params.q.replace("_text_:"," ");
        result.docs = [];

        for(var i = 0; i <metaDaten.response.docs.length; i++){
            var foundDocument = {};
            foundDocument.id = metaDaten.response.docs[i].id;
            foundDocument.name = returnStringBetween(metaDaten.response.docs[i].id,"data\\",".txt");
            result.docs.push(foundDocument);
        }
    }
    return result;
}
function returnStringBetween (inputString, characterA, characterB){
    var outputString = inputString.split(characterA).pop().split(characterB).shift();
    return outputString;
}

module.exports = router;