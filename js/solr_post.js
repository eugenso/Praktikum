/**
 * Created by Andreas on 28.02.2017.
 */
exports.solrPost = solrPost;

var http = require("http");

var resultDataSet = {};

function solrPost(){


    actualLineNumber = 0;
    postData();

    function postData() {

        var post_data = '[{ "id" : "E:\\\\solr\\\\data\\\\1_bgs__74-17 (08.02.2017).txt",';
        //var post_data = '[{ "id" : "1234", ';
        post_data = post_data+'"tag_txt" : {"set":["bundesgericht", "landesgericht"]} ';
        post_data = post_data+'}]';

        var options = {
            hostname: 'localhost',
            port: 8983,
            path: '/solr/testcore/update?commit=true',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var request = http.request(options, function (antwort) {
            var resultString = "";
            antwort.setEncoding('utf8');
            antwort.on('data', console.log);
            antwort.on('end', console.log);
            antwort.on('error', console.error);

        })

        request.write(post_data);
        request.end();
    }

}

