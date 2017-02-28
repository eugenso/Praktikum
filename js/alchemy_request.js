/**
 * Created by BrOtis on 28.02.2017.
 */


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
        url: 'http://my-own-it.de/test_urteile/3_str__49-16a%20(20.9.2016).txt',
        model_id: 'rb:a267d1b0-0fb2-490a-8a30-8c11277be192'
    };

    alchemy_language.combined(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else
            var jsonFile = JSON.stringify(response, null, 2)
        logToConsole(response);
    });


    function logToConsole(response) {
        var datei = {};
        var alledateien = [];
        var type = {};
        var wort = {};

        for (var i = 0; i < response.entities.length; i++)
        {
            /*type.typename = response.entities[i].type;
            type.count = response.entities[i].count;*/

            console.log(response.entities[i].type+" "+response.entities[i].text+" "+response.entities[i].count);
        }
    }

}