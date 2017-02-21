var express = require('express');
var router = express.Router();
GLOBAL_api_key = 'f2bebbda9a39f53c8a9f92b232ee3238f32b164c';

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
    })

    var parameters = {
        extract: 'entities,keywords,relations',
        sentiment: 1,
        maxRetrieve: 1,
        url: 'https://wordpress.org/plugins/about/readme.txt'
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

amountofCalls = 0;
function LoadTextFromUrl() {
    var http = require('http');

    var options = {
        host: 'stackoverflow.com',
        path: '/questions/6287297/reading-content-from-url-with-node-js'
    }
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

function SplitData(data){
    //console.log(data);
    amountofCalls += 1;
   // console.log(amountofCalls);
    var res = data.split(" ");
    console.log(JSON.stringify(res, null, 2));
}
LoadTextFromUrl();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
