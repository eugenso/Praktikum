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
        metaDaten = JSON.parse(metaDaten);
        resultDaten = splitSearchResult(metaDaten);
        console.log(resultDaten.docs);
        res.render('singleDoc', { result: resultDaten });
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
        result.documentname = returnStringBetween(metaDaten.responseHeader.params.q,"data\\\\",".txt");
        result.docs = [];


        var foundDocument = {};
        foundDocument = metaDaten.response.docs[0];
        result.docs.push(foundDocument);
    }
    return result;
}
function returnStringBetween (inputString, characterA, characterB){
    var outputString = inputString.split(characterA).pop().split(characterB).shift();
    return outputString;
}

module.exports = router;