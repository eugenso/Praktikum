/**
 * Created by BrOtis on 28.02.2017.
 */

var moment = require('moment');
var solar_posts = require('../js/solr_post');
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
        url: '',
        model_id: GLOBAL_model_id
    };

    //ToDo Watson json.datei speichern --> darauf outputcleaner anwenden --> weiter an solr

    adressListe2.forEach(function (arrayitem)
    {
        parameters.url = arrayitem;

    alchemy_language.combined(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else
            var jsonFile = JSON.stringify(response, null, 2)
        outputcleaner(response);
    });
})
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
        var  Dateiname = returnStringBetween(response.url, "/", ".txt");
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
            }

            docobj.Dateiname = Dateiname;
            docobj.Highestdate = HighestDate.format('YYYY MM DD');
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

        }
        //console.log("highestDate",highestDate.format('YYYY MM DD'));
        //console.log("Normliste",normlist);
        //console.log("Richterliste",richterliste);
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

var adressListe2 = ['http://my-own-it.de/test_urteile/17776_clean.txt',
    'http://my-own-it.de/test_urteile/18181_clean.txt',
    'http://my-own-it.de/test_urteile/17917_clean.txt',
    'http://my-own-it.de/test_urteile/17927_clean.txt',
    'http://my-own-it.de/test_urteile/18057_clean.txt'];

var adressListe = ['http://my-own-it.de/test_urteile/17776_clean.txt',
    'http://my-own-it.de/test_urteile/17907_clean.txt',
    'http://my-own-it.de/test_urteile/17917_clean.txt',
    'http://my-own-it.de/test_urteile/17927_clean.txt',
    'http://my-own-it.de/test_urteile/18057_clean.txt',
    'http://my-own-it.de/test_urteile/18181_clean.txt',
    'http://my-own-it.de/test_urteile/18211_clean.txt',
    'http://my-own-it.de/test_urteile/18220_clean.txt',
    'http://my-own-it.de/test_urteile/18443_clean.txt',
    'http://my-own-it.de/test_urteile/18530_clean.txt',
    'http://my-own-it.de/test_urteile/18531_clean.txt',
    'http://my-own-it.de/test_urteile/18622_clean.txt',
    'http://my-own-it.de/test_urteile/18647_clean.txt',
    'http://my-own-it.de/test_urteile/18654_clean.txt',
    'http://my-own-it.de/test_urteile/18772_clean.txt',
    'http://my-own-it.de/test_urteile/18841_clean.txt',
    'http://my-own-it.de/test_urteile/18859_clean.txt',
    'http://my-own-it.de/test_urteile/18936_clean.txt',
    'http://my-own-it.de/test_urteile/19159_clean.txt',
    'http://my-own-it.de/test_urteile/19364_clean.txt',
    'http://my-own-it.de/test_urteile/19506_clean.txt',
    'http://my-own-it.de/test_urteile/19525_clean.txt',
    'http://my-own-it.de/test_urteile/19981_clean.txt',
    'http://my-own-it.de/test_urteile/20078_clean.txt',
    'http://my-own-it.de/test_urteile/20259_clean.txt',
    'http://my-own-it.de/test_urteile/20535_clean.txt',
    'http://my-own-it.de/test_urteile/20639_clean.txt',
    'http://my-own-it.de/test_urteile/20655_clean.txt',
    'http://my-own-it.de/test_urteile/20662_clean.txt',
    'http://my-own-it.de/test_urteile/20859_clean.txt',
    'http://my-own-it.de/test_urteile/20864_clean.txt',
    'http://my-own-it.de/test_urteile/21044_clean.txt',
    'http://my-own-it.de/test_urteile/21051_clean.txt',
    'http://my-own-it.de/test_urteile/21348_clean.txt',
    'http://my-own-it.de/test_urteile/21385_clean.txt',
    'http://my-own-it.de/test_urteile/21425_clean.txt',
    'http://my-own-it.de/test_urteile/21516_clean.txt',
    'http://my-own-it.de/test_urteile/21577_clean.txt',
    'http://my-own-it.de/test_urteile/21816_clean.txt',
    'http://my-own-it.de/test_urteile/21841_clean.txt',
    'http://my-own-it.de/test_urteile/21855_clean.txt',
    'http://my-own-it.de/test_urteile/21919_clean.txt',
    'http://my-own-it.de/test_urteile/21935_clean.txt',
    'http://my-own-it.de/test_urteile/21969_clean.txt',
    'http://my-own-it.de/test_urteile/22488_clean.txt',
    'http://my-own-it.de/test_urteile/22497_clean.txt',
    'http://my-own-it.de/test_urteile/22577_clean.txt',
    'http://my-own-it.de/test_urteile/22919_clean.txt',
    'http://my-own-it.de/test_urteile/23089_clean.txt',
    'http://my-own-it.de/test_urteile/23115_clean.txt',
    'http://my-own-it.de/test_urteile/23387_clean.txt',
    'http://my-own-it.de/test_urteile/23408_clean.txt',
    'http://my-own-it.de/test_urteile/23466_clean.txt',
    'http://my-own-it.de/test_urteile/23468_clean.txt',
    'http://my-own-it.de/test_urteile/23603_clean.txt',
    'http://my-own-it.de/test_urteile/23637_clean.txt',
    'http://my-own-it.de/test_urteile/23686_clean.txt',
    'http://my-own-it.de/test_urteile/24175_clean.txt',
    'http://my-own-it.de/test_urteile/24279_clean.txt',
    'http://my-own-it.de/test_urteile/24661_clean.txt',
    'http://my-own-it.de/test_urteile/24747_clean.txt',
    'http://my-own-it.de/test_urteile/24849_clean.txt',
    'http://my-own-it.de/test_urteile/25258_clean.txt',
    'http://my-own-it.de/test_urteile/25306_clean.txt',
    'http://my-own-it.de/test_urteile/25468_clean.txt',
    'http://my-own-it.de/test_urteile/25655_clean.txt',
    'http://my-own-it.de/test_urteile/25772_clean.txt',
    'http://my-own-it.de/test_urteile/25861_clean.txt',
    'http://my-own-it.de/test_urteile/26204_clean.txt',
    'http://my-own-it.de/test_urteile/26220_clean.txt',
    'http://my-own-it.de/test_urteile/26371_clean.txt',
    'http://my-own-it.de/test_urteile/26444_clean.txt',
    'http://my-own-it.de/test_urteile/26606_clean.txt',
    'http://my-own-it.de/test_urteile/26728_clean.txt',
    'http://my-own-it.de/test_urteile/26760_clean.txt',
    'http://my-own-it.de/test_urteile/26878_clean.txt',
    'http://my-own-it.de/test_urteile/26950_clean.txt',
    'http://my-own-it.de/test_urteile/27211_clean.txt',
    'http://my-own-it.de/test_urteile/27613_clean.txt',
    'http://my-own-it.de/test_urteile/27914_clean.txt',
    'http://my-own-it.de/test_urteile/28320_clean.txt',
    'http://my-own-it.de/test_urteile/28387_clean.txt',
    'http://my-own-it.de/test_urteile/28484_clean.txt',
    'http://my-own-it.de/test_urteile/28499_clean.txt',
    'http://my-own-it.de/test_urteile/28768_clean.txt',
    'http://my-own-it.de/test_urteile/28807_clean.txt',
    'http://my-own-it.de/test_urteile/29064_clean.txt',
    'http://my-own-it.de/test_urteile/29160_clean.txt',
    'http://my-own-it.de/test_urteile/29167_clean.txt',
    'http://my-own-it.de/test_urteile/29175_clean.txt',
    'http://my-own-it.de/test_urteile/29306_clean.txt',
    'http://my-own-it.de/test_urteile/29374_clean.txt',
    'http://my-own-it.de/test_urteile/29381_clean.txt',
    'http://my-own-it.de/test_urteile/29426_clean.txt',
    'http://my-own-it.de/test_urteile/29432_clean.txt',
    'http://my-own-it.de/test_urteile/29555_clean.txt',
    'http://my-own-it.de/test_urteile/29588_clean.txt',
    'http://my-own-it.de/test_urteile/29711_clean.txt',
    'http://my-own-it.de/test_urteile/29721_clean.txt',
    'http://my-own-it.de/test_urteile/29813_clean.txt',
    'http://my-own-it.de/test_urteile/29881_clean.txt',
    'http://my-own-it.de/test_urteile/29888_clean.txt',
    'http://my-own-it.de/test_urteile/29889_clean.txt',
    'http://my-own-it.de/test_urteile/29964_clean.txt',
    'http://my-own-it.de/test_urteile/30164_clean.txt',
    'http://my-own-it.de/test_urteile/30181_clean.txt',
    'http://my-own-it.de/test_urteile/30250_clean.txt',
    'http://my-own-it.de/test_urteile/30402_clean.txt',
    'http://my-own-it.de/test_urteile/30514_clean.txt',
    'http://my-own-it.de/test_urteile/30533_clean.txt',
    'http://my-own-it.de/test_urteile/30658_clean.txt',
    'http://my-own-it.de/test_urteile/30893_clean.txt',
    'http://my-own-it.de/test_urteile/30941_clean.txt',
    'http://my-own-it.de/test_urteile/30958_clean.txt',
    'http://my-own-it.de/test_urteile/31522_clean.txt',
    'http://my-own-it.de/test_urteile/31613_clean.txt',
    'http://my-own-it.de/test_urteile/31644_clean.txt',
    'http://my-own-it.de/test_urteile/31661_clean.txt',
    'http://my-own-it.de/test_urteile/31822_clean.txt',
    'http://my-own-it.de/test_urteile/31870_clean.txt',
    'http://my-own-it.de/test_urteile/31900_clean.txt',
    'http://my-own-it.de/test_urteile/31922_clean.txt',
    'http://my-own-it.de/test_urteile/31964_clean.txt',
    'http://my-own-it.de/test_urteile/31989_clean.txt',
    'http://my-own-it.de/test_urteile/32048_clean.txt',
    'http://my-own-it.de/test_urteile/32049_clean.txt',
    'http://my-own-it.de/test_urteile/32176_clean.txt',
    'http://my-own-it.de/test_urteile/32448_clean.txt',
    'http://my-own-it.de/test_urteile/32452_clean.txt',
    'http://my-own-it.de/test_urteile/32496_clean.txt',
    'http://my-own-it.de/test_urteile/32547_clean.txt',
    'http://my-own-it.de/test_urteile/32667_clean.txt',
    'http://my-own-it.de/test_urteile/32743_clean.txt',
    'http://my-own-it.de/test_urteile/32826_clean.txt',
    'http://my-own-it.de/test_urteile/33041_clean.txt',
    'http://my-own-it.de/test_urteile/33391_clean.txt',
    'http://my-own-it.de/test_urteile/33450_clean.txt',
    'http://my-own-it.de/test_urteile/33479_clean.txt',
    'http://my-own-it.de/test_urteile/33775_clean.txt',
    'http://my-own-it.de/test_urteile/33802_clean.txt',
    'http://my-own-it.de/test_urteile/33809_clean.txt',
    'http://my-own-it.de/test_urteile/33880_clean.txt',
    'http://my-own-it.de/test_urteile/33934_clean.txt',
    'http://my-own-it.de/test_urteile/33950_clean.txt',
    'http://my-own-it.de/test_urteile/34095_clean.txt',
    'http://my-own-it.de/test_urteile/34197_clean.txt',
    'http://my-own-it.de/test_urteile/34400_clean.txt',
    'http://my-own-it.de/test_urteile/34583_clean.txt',
    'http://my-own-it.de/test_urteile/34711_clean.txt',
    'http://my-own-it.de/test_urteile/34825_clean.txt',
    'http://my-own-it.de/test_urteile/34865_clean.txt',
    'http://my-own-it.de/test_urteile/35036_clean.txt',
    'http://my-own-it.de/test_urteile/35155_clean.txt',
    'http://my-own-it.de/test_urteile/35591_clean.txt',
    'http://my-own-it.de/test_urteile/35643_clean.txt',
    'http://my-own-it.de/test_urteile/35813_clean.txt',
    'http://my-own-it.de/test_urteile/35973_clean.txt',
    'http://my-own-it.de/test_urteile/36339_clean.txt',
    'http://my-own-it.de/test_urteile/36442_clean.txt',
    'http://my-own-it.de/test_urteile/36444_clean.txt',
    'http://my-own-it.de/test_urteile/36776_clean.txt',
    'http://my-own-it.de/test_urteile/36814_clean.txt',
    'http://my-own-it.de/test_urteile/37033_clean.txt',
    'http://my-own-it.de/test_urteile/37065_clean.txt',
    'http://my-own-it.de/test_urteile/37233_clean.txt',
    'http://my-own-it.de/test_urteile/37289_clean.txt',
    'http://my-own-it.de/test_urteile/37308_clean.txt',
    'http://my-own-it.de/test_urteile/37552_clean.txt',
    'http://my-own-it.de/test_urteile/37742_clean.txt',
    'http://my-own-it.de/test_urteile/37866_clean.txt',
    'http://my-own-it.de/test_urteile/37950_clean.txt',
    'http://my-own-it.de/test_urteile/38001_clean.txt',
    'http://my-own-it.de/test_urteile/38003_clean.txt',
    'http://my-own-it.de/test_urteile/38011_clean.txt',
    'http://my-own-it.de/test_urteile/38296_clean.txt',
    'http://my-own-it.de/test_urteile/38308_clean.txt',
    'http://my-own-it.de/test_urteile/38430_clean.txt',
    'http://my-own-it.de/test_urteile/38470_clean.txt',
    'http://my-own-it.de/test_urteile/38547_clean.txt',
    'http://my-own-it.de/test_urteile/38735_clean.txt',
    'http://my-own-it.de/test_urteile/38821_clean.txt',
    'http://my-own-it.de/test_urteile/38915_clean.txt',
    'http://my-own-it.de/test_urteile/38975_clean.txt',
    'http://my-own-it.de/test_urteile/39000_clean.txt',
    'http://my-own-it.de/test_urteile/39208_clean.txt',
    'http://my-own-it.de/test_urteile/39250_clean.txt',
    'http://my-own-it.de/test_urteile/39309_clean.txt',
    'http://my-own-it.de/test_urteile/39471_clean.txt',
    'http://my-own-it.de/test_urteile/39536_clean.txt',
    'http://my-own-it.de/test_urteile/39590_clean.txt',
    'http://my-own-it.de/test_urteile/39840_clean.txt',
    'http://my-own-it.de/test_urteile/39996_clean.txt',
    'http://my-own-it.de/test_urteile/40058_clean.txt',
    'http://my-own-it.de/test_urteile/40298_clean.txt',
    'http://my-own-it.de/test_urteile/40363_clean.txt',
    'http://my-own-it.de/test_urteile/40525_clean.txt',
    'http://my-own-it.de/test_urteile/40569_clean.txt',
    'http://my-own-it.de/test_urteile/40613_clean.txt',
    'http://my-own-it.de/test_urteile/40651_clean.txt',
    'http://my-own-it.de/test_urteile/40686_clean.txt',
    'http://my-own-it.de/test_urteile/40862_clean.txt',
    'http://my-own-it.de/test_urteile/40881_clean.txt',
    'http://my-own-it.de/test_urteile/40905_clean.txt',
    'http://my-own-it.de/test_urteile/41083_clean.txt',
    'http://my-own-it.de/test_urteile/41149_clean.txt',
    'http://my-own-it.de/test_urteile/41495_clean.txt',
    'http://my-own-it.de/test_urteile/41523_clean.txt',
    'http://my-own-it.de/test_urteile/41707_clean.txt',
    'http://my-own-it.de/test_urteile/41847_clean.txt',
    'http://my-own-it.de/test_urteile/42105_clean.txt',
    'http://my-own-it.de/test_urteile/42151_clean.txt',
    'http://my-own-it.de/test_urteile/42388_clean.txt',
    'http://my-own-it.de/test_urteile/42491_clean.txt',
    'http://my-own-it.de/test_urteile/42520_clean.txt',
    'http://my-own-it.de/test_urteile/42532_clean.txt',
    'http://my-own-it.de/test_urteile/42549_clean.txt',
    'http://my-own-it.de/test_urteile/42625_clean.txt',
    'http://my-own-it.de/test_urteile/42729_clean.txt',
    'http://my-own-it.de/test_urteile/43057_clean.txt',
    'http://my-own-it.de/test_urteile/43083_clean.txt',
    'http://my-own-it.de/test_urteile/43147_clean.txt',
    'http://my-own-it.de/test_urteile/43260_clean.txt',
    'http://my-own-it.de/test_urteile/43586_clean.txt',
    'http://my-own-it.de/test_urteile/43719_clean.txt',
    'http://my-own-it.de/test_urteile/43843_clean.txt',
    'http://my-own-it.de/test_urteile/43909_clean.txt',
    'http://my-own-it.de/test_urteile/43970_clean.txt',
    'http://my-own-it.de/test_urteile/44173_clean.txt',
    'http://my-own-it.de/test_urteile/44218_clean.txt',
    'http://my-own-it.de/test_urteile/44386_clean.txt',
    'http://my-own-it.de/test_urteile/44454_clean.txt',
    'http://my-own-it.de/test_urteile/44480_clean.txt',
    'http://my-own-it.de/test_urteile/44864_clean.txt',
    'http://my-own-it.de/test_urteile/45004_clean.txt',
    'http://my-own-it.de/test_urteile/45040_clean.txt',
    'http://my-own-it.de/test_urteile/45428_clean.txt',
    'http://my-own-it.de/test_urteile/45432_clean.txt',
    'http://my-own-it.de/test_urteile/45488_clean.txt',
    'http://my-own-it.de/test_urteile/45872_clean.txt',
    'http://my-own-it.de/test_urteile/45995_clean.txt',
    'http://my-own-it.de/test_urteile/46090_clean.txt',
    'http://my-own-it.de/test_urteile/46405_clean.txt',
    'http://my-own-it.de/test_urteile/46415_clean.txt',
    'http://my-own-it.de/test_urteile/46560_clean.txt',
    'http://my-own-it.de/test_urteile/46592_clean.txt',
    'http://my-own-it.de/test_urteile/46781_clean.txt',
    'http://my-own-it.de/test_urteile/47116_clean.txt',
    'http://my-own-it.de/test_urteile/47182_clean.txt',
    'http://my-own-it.de/test_urteile/47348_clean.txt',
    'http://my-own-it.de/test_urteile/47366_clean.txt',
    'http://my-own-it.de/test_urteile/47449_clean.txt',
    'http://my-own-it.de/test_urteile/47542_clean.txt',
    'http://my-own-it.de/test_urteile/47618_clean.txt',
    'http://my-own-it.de/test_urteile/47774_clean.txt',
    'http://my-own-it.de/test_urteile/47951_clean.txt',
    'http://my-own-it.de/test_urteile/48027_clean.txt',
    'http://my-own-it.de/test_urteile/48101_clean.txt',
    'http://my-own-it.de/test_urteile/48339_clean.txt',
    'http://my-own-it.de/test_urteile/48347_clean.txt',
    'http://my-own-it.de/test_urteile/48380_clean.txt',
    'http://my-own-it.de/test_urteile/48415_clean.txt',
    'http://my-own-it.de/test_urteile/48521_clean.txt',
    'http://my-own-it.de/test_urteile/48526_clean.txt',
    'http://my-own-it.de/test_urteile/48681_clean.txt',
    'http://my-own-it.de/test_urteile/48705_clean.txt',
    'http://my-own-it.de/test_urteile/48785_clean.txt',
    'http://my-own-it.de/test_urteile/48845_clean.txt',
    'http://my-own-it.de/test_urteile/48932_clean.txt',
    'http://my-own-it.de/test_urteile/49038_clean.txt',
    'http://my-own-it.de/test_urteile/49050_clean.txt',
    'http://my-own-it.de/test_urteile/49069_clean.txt',
    'http://my-own-it.de/test_urteile/49533_clean.txt',
    'http://my-own-it.de/test_urteile/49634_clean.txt',
    'http://my-own-it.de/test_urteile/49677_clean.txt',
    'http://my-own-it.de/test_urteile/49758_clean.txt',
    'http://my-own-it.de/test_urteile/49790_clean.txt',
    'http://my-own-it.de/test_urteile/49874_clean.txt',
    'http://my-own-it.de/test_urteile/50000_clean.txt',
    'http://my-own-it.de/test_urteile/50140_clean.txt',
    'http://my-own-it.de/test_urteile/50201_clean.txt',
    'http://my-own-it.de/test_urteile/50322_clean.txt',
    'http://my-own-it.de/test_urteile/50361_clean.txt',
    'http://my-own-it.de/test_urteile/50452_clean.txt',
    'http://my-own-it.de/test_urteile/50545_clean.txt',
    'http://my-own-it.de/test_urteile/50619_clean.txt',
    'http://my-own-it.de/test_urteile/50863_clean.txt',
    'http://my-own-it.de/test_urteile/50983_clean.txt',
    'http://my-own-it.de/test_urteile/51014_clean.txt',
    'http://my-own-it.de/test_urteile/51017_clean.txt',
    'http://my-own-it.de/test_urteile/51018_clean.txt',
    'http://my-own-it.de/test_urteile/51063_clean.txt',
    'http://my-own-it.de/test_urteile/51083_clean.txt',
    'http://my-own-it.de/test_urteile/51136_clean.txt',
    'http://my-own-it.de/test_urteile/51308_clean.txt',
    'http://my-own-it.de/test_urteile/51470_clean.txt',
    'http://my-own-it.de/test_urteile/51539_clean.txt',
    'http://my-own-it.de/test_urteile/51726_clean.txt',
    'http://my-own-it.de/test_urteile/51846_clean.txt',
    'http://my-own-it.de/test_urteile/51847_clean.txt',
    'http://my-own-it.de/test_urteile/52119_clean.txt',
    'http://my-own-it.de/test_urteile/52452_clean.txt',
    'http://my-own-it.de/test_urteile/52517_clean.txt',
    'http://my-own-it.de/test_urteile/52580_clean.txt',
    'http://my-own-it.de/test_urteile/52744_clean.txt',
    'http://my-own-it.de/test_urteile/52879_clean.txt',
    'http://my-own-it.de/test_urteile/52894_clean.txt',
    'http://my-own-it.de/test_urteile/53103_clean.txt',
    'http://my-own-it.de/test_urteile/53209_clean.txt',
    'http://my-own-it.de/test_urteile/53252_clean.txt',
    'http://my-own-it.de/test_urteile/53304_clean.txt',
    'http://my-own-it.de/test_urteile/53306_clean.txt',
    'http://my-own-it.de/test_urteile/53668_clean.txt',
    'http://my-own-it.de/test_urteile/53761_clean.txt',
    'http://my-own-it.de/test_urteile/53928_clean.txt',
    'http://my-own-it.de/test_urteile/53942_clean.txt',
    'http://my-own-it.de/test_urteile/54132_clean.txt',
    'http://my-own-it.de/test_urteile/54268_clean.txt',
    'http://my-own-it.de/test_urteile/54272_clean.txt',
    'http://my-own-it.de/test_urteile/54362_clean.txt',
    'http://my-own-it.de/test_urteile/54741_clean.txt',
    'http://my-own-it.de/test_urteile/54794_clean.txt',
    'http://my-own-it.de/test_urteile/54817_clean.txt',
    'http://my-own-it.de/test_urteile/55197_clean.txt',
    'http://my-own-it.de/test_urteile/55577_clean.txt',
    'http://my-own-it.de/test_urteile/55663_clean.txt',
    'http://my-own-it.de/test_urteile/55683_clean.txt',
    'http://my-own-it.de/test_urteile/55694_clean.txt',
    'http://my-own-it.de/test_urteile/55709_clean.txt',
    'http://my-own-it.de/test_urteile/55834_clean.txt',
    'http://my-own-it.de/test_urteile/55943_clean.txt',
    'http://my-own-it.de/test_urteile/55969_clean.txt',
    'http://my-own-it.de/test_urteile/56145_clean.txt',
    'http://my-own-it.de/test_urteile/56166_clean.txt',
    'http://my-own-it.de/test_urteile/56185_clean.txt',
    'http://my-own-it.de/test_urteile/56224_clean.txt',
    'http://my-own-it.de/test_urteile/56273_clean.txt',
    'http://my-own-it.de/test_urteile/56284_clean.txt',
    'http://my-own-it.de/test_urteile/56586_clean.txt',
    'http://my-own-it.de/test_urteile/56641_clean.txt',
    'http://my-own-it.de/test_urteile/56766_clean.txt',
    'http://my-own-it.de/test_urteile/57181_clean.txt',
    'http://my-own-it.de/test_urteile/57242_clean.txt',
    'http://my-own-it.de/test_urteile/57386_clean.txt',
    'http://my-own-it.de/test_urteile/57604_clean.txt',
    'http://my-own-it.de/test_urteile/57660_clean.txt',
    'http://my-own-it.de/test_urteile/57767_clean.txt',
    'http://my-own-it.de/test_urteile/57950_clean.txt',
    'http://my-own-it.de/test_urteile/58109_clean.txt',
    'http://my-own-it.de/test_urteile/58133_clean.txt',
    'http://my-own-it.de/test_urteile/58161_clean.txt',
    'http://my-own-it.de/test_urteile/58176_clean.txt',
    'http://my-own-it.de/test_urteile/58210_clean.txt',
    'http://my-own-it.de/test_urteile/58454_clean.txt',
    'http://my-own-it.de/test_urteile/58575_clean.txt',
    'http://my-own-it.de/test_urteile/58591_clean.txt',
    'http://my-own-it.de/test_urteile/58736_clean.txt',
    'http://my-own-it.de/test_urteile/58743_clean.txt',
    'http://my-own-it.de/test_urteile/58814_clean.txt',
    'http://my-own-it.de/test_urteile/58975_clean.txt',
    'http://my-own-it.de/test_urteile/59043_clean.txt',
    'http://my-own-it.de/test_urteile/59322_clean.txt',
    'http://my-own-it.de/test_urteile/59342_clean.txt',
    'http://my-own-it.de/test_urteile/59345_clean.txt',
    'http://my-own-it.de/test_urteile/59404_clean.txt',
    'http://my-own-it.de/test_urteile/59584_clean.txt',
    'http://my-own-it.de/test_urteile/59795_clean.txt',
    'http://my-own-it.de/test_urteile/60204_clean.txt',
    'http://my-own-it.de/test_urteile/60435_clean.txt',
    'http://my-own-it.de/test_urteile/60456_clean.txt',
    'http://my-own-it.de/test_urteile/60585_clean.txt',
    'http://my-own-it.de/test_urteile/60631_clean.txt',
    'http://my-own-it.de/test_urteile/60840_clean.txt',
    'http://my-own-it.de/test_urteile/60976_clean.txt',
    'http://my-own-it.de/test_urteile/61116_clean.txt',
    'http://my-own-it.de/test_urteile/61150_clean.txt',
    'http://my-own-it.de/test_urteile/61348_clean.txt',
    'http://my-own-it.de/test_urteile/61511_clean.txt',
    'http://my-own-it.de/test_urteile/61514_clean.txt',
    'http://my-own-it.de/test_urteile/62213_clean.txt',
    'http://my-own-it.de/test_urteile/62493_clean.txt',
    'http://my-own-it.de/test_urteile/62595_clean.txt',
    'http://my-own-it.de/test_urteile/62686_clean.txt',
    'http://my-own-it.de/test_urteile/62879_clean.txt',
    'http://my-own-it.de/test_urteile/62954_clean.txt',
    'http://my-own-it.de/test_urteile/63302_clean.txt',
    'http://my-own-it.de/test_urteile/63326_clean.txt',
    'http://my-own-it.de/test_urteile/63481_clean.txt',
    'http://my-own-it.de/test_urteile/63485_clean.txt',
    'http://my-own-it.de/test_urteile/63489_clean.txt',
    'http://my-own-it.de/test_urteile/64064_clean.txt',
    'http://my-own-it.de/test_urteile/64494_clean.txt',
    'http://my-own-it.de/test_urteile/64505_clean.txt',
    'http://my-own-it.de/test_urteile/64596_clean.txt',
    'http://my-own-it.de/test_urteile/64731_clean.txt',
    'http://my-own-it.de/test_urteile/64748_clean.txt',
    'http://my-own-it.de/test_urteile/64905_clean.txt',
    'http://my-own-it.de/test_urteile/65648_clean.txt',
    'http://my-own-it.de/test_urteile/65773_clean.txt',
    'http://my-own-it.de/test_urteile/65793_clean.txt',
    'http://my-own-it.de/test_urteile/65841_clean.txt',
    'http://my-own-it.de/test_urteile/66045_clean.txt',
    'http://my-own-it.de/test_urteile/66258_clean.txt',
    'http://my-own-it.de/test_urteile/66763_clean.txt',
    'http://my-own-it.de/test_urteile/66809_clean.txt',
    'http://my-own-it.de/test_urteile/66937_clean.txt',
    'http://my-own-it.de/test_urteile/66940_clean.txt',
    'http://my-own-it.de/test_urteile/67058_clean.txt',
    'http://my-own-it.de/test_urteile/67080_clean.txt',
    'http://my-own-it.de/test_urteile/67120_clean.txt',
    'http://my-own-it.de/test_urteile/67369_clean.txt',
    'http://my-own-it.de/test_urteile/67648_clean.txt',
    'http://my-own-it.de/test_urteile/67717_clean.txt',
    'http://my-own-it.de/test_urteile/67743_clean.txt',
    'http://my-own-it.de/test_urteile/67751_clean.txt',
    'http://my-own-it.de/test_urteile/68090_clean.txt',
    'http://my-own-it.de/test_urteile/68234_clean.txt',
    'http://my-own-it.de/test_urteile/68507_clean.txt',
    'http://my-own-it.de/test_urteile/68563_clean.txt',
    'http://my-own-it.de/test_urteile/68572_clean.txt',
    'http://my-own-it.de/test_urteile/68598_clean.txt',
    'http://my-own-it.de/test_urteile/68615_clean.txt',
    'http://my-own-it.de/test_urteile/69003_clean.txt',
    'http://my-own-it.de/test_urteile/69136_clean.txt',
    'http://my-own-it.de/test_urteile/69197_clean.txt',
    'http://my-own-it.de/test_urteile/69243_clean.txt',
    'http://my-own-it.de/test_urteile/69259_clean.txt',
    'http://my-own-it.de/test_urteile/69545_clean.txt',
    'http://my-own-it.de/test_urteile/69728_clean.txt',
    'http://my-own-it.de/test_urteile/69863_clean.txt',
    'http://my-own-it.de/test_urteile/69987_clean.txt',
    'http://my-own-it.de/test_urteile/70168_clean.txt',
    'http://my-own-it.de/test_urteile/70214_clean.txt',
    'http://my-own-it.de/test_urteile/70431_clean.txt',
    'http://my-own-it.de/test_urteile/70464_clean.txt',
    'http://my-own-it.de/test_urteile/70468_clean.txt',
    'http://my-own-it.de/test_urteile/70495_clean.txt',
    'http://my-own-it.de/test_urteile/70632_clean.txt',
    'http://my-own-it.de/test_urteile/70829_clean.txt',
    'http://my-own-it.de/test_urteile/70999_clean.txt',
    'http://my-own-it.de/test_urteile/71028_clean.txt',
    'http://my-own-it.de/test_urteile/71103_clean.txt',
    'http://my-own-it.de/test_urteile/71129_clean.txt',
    'http://my-own-it.de/test_urteile/71141_clean.txt',
    'http://my-own-it.de/test_urteile/71206_clean.txt',
    'http://my-own-it.de/test_urteile/71235_clean.txt',
    'http://my-own-it.de/test_urteile/71260_clean.txt',
    'http://my-own-it.de/test_urteile/71305_clean.txt',
    'http://my-own-it.de/test_urteile/71509_clean.txt',
    'http://my-own-it.de/test_urteile/71512_clean.txt',
    'http://my-own-it.de/test_urteile/71625_clean.txt',
    'http://my-own-it.de/test_urteile/71696_clean.txt',
    'http://my-own-it.de/test_urteile/71850_clean.txt',
    'http://my-own-it.de/test_urteile/71925_clean.txt',
    'http://my-own-it.de/test_urteile/72035_clean.txt',
    'http://my-own-it.de/test_urteile/72634_clean.txt',
    'http://my-own-it.de/test_urteile/72814_clean.txt',
    'http://my-own-it.de/test_urteile/72836_clean.txt',
    'http://my-own-it.de/test_urteile/72991_clean.txt',
    'http://my-own-it.de/test_urteile/73058_clean.txt',
    'http://my-own-it.de/test_urteile/73076_clean.txt',
    'http://my-own-it.de/test_urteile/73203_clean.txt',
    'http://my-own-it.de/test_urteile/73412_clean.txt',
    'http://my-own-it.de/test_urteile/73791_clean.txt',
    'http://my-own-it.de/test_urteile/74074_clean.txt',
    'http://my-own-it.de/test_urteile/74239_clean.txt',
    'http://my-own-it.de/test_urteile/74306_clean.txt',
    'http://my-own-it.de/test_urteile/74504_clean.txt',
    'http://my-own-it.de/test_urteile/74522_clean.txt',
    'http://my-own-it.de/test_urteile/74575_clean.txt',
    'http://my-own-it.de/test_urteile/74661_clean.txt',
    'http://my-own-it.de/test_urteile/74726_clean.txt',
    'http://my-own-it.de/test_urteile/74783_clean.txt'];


