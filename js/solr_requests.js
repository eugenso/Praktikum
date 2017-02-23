/**
 * Created by Hauke on 2/23/2017.
 */

exports.testfunction = testFunction;
exports.solrQuery = solrQuery;


function testFunction(){
    console.log("Hallo Welt");
}

function solrQuery(){
// Require module
    var SolrNode = require('solr-node');

// Create client
    var client = new SolrNode({
        host: '127.0.0.1',
        port: '8983',
        core: 'Paul',
        protocol: 'http'
    });

    var myStrQuery = 'fl=*,termfreq(_text_,Bund)&indent=on&q=*&wt=json';

// Search documents using myStrQuery
    client.search(myStrQuery, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Response:', result.response);
    });


}