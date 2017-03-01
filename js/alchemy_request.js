/**
 * Created by BrOtis on 28.02.2017.
 */

var moment = require('moment');
moment().format();

exports.AlchemyOutput = AlchemyOutput;

function AlchemyOutput() {

    var watson = require('watson-developer-cloud');
    var alchemy_language = watson.alchemy_language({
        api_key: GLOBAL_api_key
    });

    var parameters = {
        extract: 'entities, keywords',
        sentiment: 1,
        maxRetrieve: 1,
        url: 'http://my-own-it.de/test_urteile/17776_clean.txt',
        model_id: 'rb:a267d1b0-0fb2-490a-8a30-8c11277be192'
    };

    alchemy_language.combined(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else
            var jsonFile = JSON.stringify(response, null, 2)
        outputcleaner(response);
    });

     //outputcleaner - get max date
    function outputcleaner(response) {
        var datei = {};
        var type = {};
        var entitie = {};
        var dateiname = {};
        var wort = {};
        var dates = [];
        var normlist = [];
        var richterliste = [];

        dateiname = returnStringBetween(response.url, "/", ".txt");
        console.log(dateiname);

        for (var i = 0; i < response.entities.length; i++) {

            if (response.entities[i].type == "Datum") {
                var date = moment(response.entities[i].text, "DD-MM-YYYY");
                dates.push(date);
            }
            else if (response.entities[i].type == "Norm"){
                var normen = response.entities[i].text;
                normlist.push(normen);
            }
            else if (response.entities[i].type == "Richter"){
                var richter = response.entities[i].text;
                richterliste.push(richter);
            }
            else {
                entitie.typename = response.entities[i].type;
                entitie.count = response.entities[i].count;
                entitie.wort = response.entities[i].text;
                console.log(response.entities[i].type + " " + response.entities[i].text + " " + response.entities[i].count);
            }

        }
        var highestDate = dates[0];
        for( var i = 1; i<dates.length; i++){
            if(dates[i] > highestDate){
                highestDate = dates[i];
            }
        }
        console.log("highestDate",highestDate.format('YYYY MM DD'));
        console.log("Normliste",normlist);
        console.log("Richterliste",richterliste);
    }

    function returnStringBetween(inputString, characterA, characterB) {
        var outputString = inputString.split(characterA).pop().split(characterB).shift();
        return outputString;
    }

}