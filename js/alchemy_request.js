/**
 * Created by BrOtis on 28.02.2017.
 */
var fs = require('fs');
var moment = require('moment');
var solar_posts = require('../js/solr_post');
moment().format();


exports.AlchemyOutput = AlchemyOutput;

function AlchemyOutput() {


    //var watson = require('watson-developer-cloud');
    //var alchemy_language = watson.alchemy_language({
    //    api_key: GLOBAL_api_key
    //});

    var parameters = {
        extract: 'entities',
        sentiment: 1,
        maxRetrieve: 1,
        url: '',
        model_id: GLOBAL_model_id
    };

    //ToDo Watson json.datei speichern --> darauf outputcleaner anwenden --> weiter an solr
    var adressListe = [];

    fs.readdirSync("/home/app/data/json/").forEach(file => {
      adressListe.push(file);
      //console.log(file);
    });

    var callcount = 0;
    callWatson();
    console.log(callcount);
    function callWatson() {
        console.log(adressListe.length, callcount);
        while (callcount < adressListe.length) {
            parameters.url = adressListe[callcount];
            //console.log(parameters.url);
            var response = JSON.parse(fs.readFileSync("/home/app/data/json/"+adressListe[callcount], 'utf8'));
            response.url= adressListe[callcount];
            outputcleaner(response);
            //alchemy_language.combined(parameters, function (err, response) {
            //   if (err)
            //        console.log('error:', err);
            //    else
            //        var jsonFile = JSON.stringify(response, null, 2);
            //    console.log(response);
            //    outputcleaner(response,callWatson);
            // });
        callcount++;
        }
        
    }
/*
    adressListe.forEach(function (arrayitem)
    {
        parameters.url = arrayitem;
        console.log(parameters.url);
    alchemy_language.combined(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else
            var jsonFile = JSON.stringify(response, null, 2)
        console.log(response);
        outputcleaner(response);
    });
    });*/

     //outputcleaner - get max date
    function outputcleaner(response) {

        var docobj = {};
        var  Dates = [];
        var  Normlist = [];
        var  Richterliste = [];
        var  BGHAktenzeichenliste = [];
        var  Aktenzeichenliste = [];
        var  Entscheidungsart = [];
        var  Nicht_Erfolgreiche_Revision = [];
        var  Erfolgreiche_Revision =[];
        var  ECLI = [];
        var  Geldliste = [];
        var  Verweisliste = [];
        var  Gerichtliste = [];
        var  Dateiname = returnStringBetween(response.url, "/data/", ".txt");
        console.log(Dateiname);


        for (var i = 0; i < response.entities.length; i++) {

            if (response.entities[i].type == "Datum") {
                var date = moment(response.entities[i].text, "DD-MM-YYYY");
                Dates.push(date);
            }
            else if (response.entities[i].type == "Norm"){
                var normen = response.entities[i].text;
                Normlist.push(normen);
            }
            else if (response.entities[i].type == "Richter"){
                var richter = response.entities[i].text;
                Richterliste.push(richter);
            }
            else if (response.entities[i].type == "BGHAktenzeichen"){
                var bgh = response.entities[i].text;
                BGHAktenzeichenliste.push(bgh);
            }
            else if (response.entities[i].type == "Aktenzeichen"){
                var akz = response.entities[i].text;
                Aktenzeichenliste.push(akz);
            }
            else if (response.entities[i].type == "Entscheidungsart"){
                var ent = response.entities[i].text;
                Entscheidungsart.push(ent);
            }
            else if (response.entities[i].type == "Nicht_Erfolgreiche_Revision"){
                var ner = response.entities[i].text;
                Nicht_Erfolgreiche_Revision.push(ner);
            }
            else if (response.entities[i].type == "Erfolgreiche_Revision"){
                var erv = response.entities[i].text;
                Erfolgreiche_Revision.push(erv);
            }
            else if (response.entities[i].type == "ECLI"){
                var ecu = response.entities[i].text;
                ECLI.push(ecu);
                console.log(ecu);
            }
            else if (response.entities[i].type == "Geld"){
                var money = response.entities[i].text;
                Geldliste.push(money);
            }
            else if (response.entities[i].type == "Verweis"){
                var verwalt = response.entities[i].text;
                Verweisliste.push(verwalt);
            }
            else if (response.entities[i].type == "Gericht")
            {
                var ger = response.entities[i].text;
                Gerichtliste.push(ger);
            }
        }

        var HighestDate = Dates[0];
        for( var i = 1; i<Dates.length; i++){
            if(Dates[i] > HighestDate){
                HighestDate = Dates[i];
                docobj.Highestdate = HighestDate.format('YYYY MM DD');
    
            }
        }

            docobj.Dateiname = Dateiname;
            
            docobj.Normlist = Normlist;
            docobj.Richterliste = Richterliste;
            docobj.BGHAktenzeichenliste = BGHAktenzeichenliste;
            docobj.Aktenzeichenliste = Aktenzeichenliste;
            docobj.Entscheidungsart = Entscheidungsart;
            docobj.Nicht_Erfolgreiche_Revision = Nicht_Erfolgreiche_Revision;
            docobj.Erfolgreiche_Revision = Erfolgreiche_Revision;
            docobj.ECLI = ECLI;
            docobj.Geldliste = Geldliste;
            docobj.Verweisliste = Verweisliste;
            docobj.Gerichtliste = Gerichtliste;

        //console.log("highestDate",highestDate.format('YYYY MM DD'));
        //console.log("Normliste",normlist);
        //console.log("Richterliste",richterliste);
        //callWatson();
        console.log(docobj);
        solar_posts.solrPostDataFromWatson(docobj);

    }

    function returnStringBetween(inputString, characterA, characterB) {
        var outputString = inputString.split(characterA).pop().split(characterB).shift();
        return outputString;
    }

}


function counter()
{
    adressListe.forEach(function (arrayitem)
    {
        console.log(arrayitem);
    })
}

var adressListe2 = ['http://my-own-it.de/test_urteile/17927_clean.txt',
'http://my-own-it.de/test_urteile/18057_clean.txt',
    'http://my-own-it.de/test_urteile/18181_clean.txt',
    'http://my-own-it.de/test_urteile/18211_clean.txt',
    'http://my-own-it.de/test_urteile/18220_clean.txt'];


