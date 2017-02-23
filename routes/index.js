var express = require('express');
var router = express.Router();
GLOBAL_api_key = 'f2bebbda9a39f53c8a9f92b232ee3238f32b164c';
var solar_requests = require('../js/solr_requests');

solar_requests.testfunction();


timeBefore = new Date().getTime();

function APICallTest1() {
    var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

    var alchemy_language = new AlchemyLanguageV1({
        api_key: GLOBAL_api_key
    });

    var params = {
        text: 'IBM Watson won the Jeopardy television show hosted by Alex Trebek'
    };

    alchemy_language.sentiment(params, function (err, response) {
        if (err)
            console.log('error:', err);
        else
            console.log(JSON.stringify(response, null, 2));
    });
}

function APICallTest2(){
    var watson = require('watson-developer-cloud');
    var alchemy_language = watson.alchemy_language({
        api_key: GLOBAL_api_key
    });

    var parameters = {
        extract: 'entities,keywords',
        sentiment: 1,
        maxRetrieve: 1,
        url: 'https://wordpress.org/plugins/about/readme.txt',
        //model_id: '8a152367-cea7-4745-a27a-c70d336d9a50'
    };

    alchemy_language.combined(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else
            console.log(JSON.stringify(response, null, 2));
    });
}
//APICallTest1();
//APICallTest2();


//Load Tests from URL and Split the Data
    function LoadTextFromUrl() {
        var http = require('http');

        // only 3 demo texts right now
        for(i = 1; i<4;i++){
            var options = {
                host: 'myown-it.de',
                path: '/sptr/test_urteil_'+i+'.txt'
            };
            var request = http.request(options, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    SplitData(data);

                });
            });
            request.on('error', function (e) {
                console.log(e.message);
            });
            request.end();
        }
    }

    function SplitData(data){
        var timeAfter = new Date().getTime();
        var timeNeededtoDownload = timeAfter-timeBefore;
        timeBefore = timeAfter;

        console.log(timeNeededtoDownload+"ms needed to download text");

        //create an array of all words or signs (everything divided by a SPACE)
        var res = data.split(" ");
        var anzahlGerichte = 0;
        for(i = 0; i <res.length; i++){

            //check if the actual word contains Gericht to Upper case to ignore if the first letter is large or not
            if(res[i].toUpperCase().includes("gericht".toUpperCase())){
                anzahlGerichte += 1;
            }
        }
        console.log(anzahlGerichte+"mal gericht");

        timeAfter = new Date().getTime();
        timeNeeded = timeAfter-timeBefore;
        console.log(timeNeeded+"ms needed to split")
    }

//LoadTextFromUrl();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
