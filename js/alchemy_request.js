/**
 * Created by BrOtis on 28.02.2017.
 */


exports.AlchemyOutput = AlchemyOutput;

function AlchemyOutput()
{

    var watson = require('watson-developer-cloud');
    var alchemy_language = watson.alchemy_language({
        api_key: GLOBAL_api_key
    });

    var parameters = {
        extract: 'entities, keywords',
        sentiment: 1,
        maxRetrieve: 1,
        url: 'https://wordpress.org/plugins/about/readme.txt',
        model_id: 'rb:a267d1b0-0fb2-490a-8a30-8c11277be192'
    };
    function logToConsole(response){
        console.log(response);
    }
    alchemy_language.combined(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else
            var jsonFile = JSON.stringify(response, null, 2)
        logToConsole(response);

    });


}