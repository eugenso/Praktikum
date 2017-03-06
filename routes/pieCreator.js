/**
 * Created by hauke on 05.03.2017.
 */
var express = require('express');
var router = express.Router();
var pieQuery = require('../js/pieQuery');


router.get('/', function(req, res, next) {
        res.render('pieCreator', { result: "" });
});
router.post('/', function(req, res, next) {
    console.log(req.body);
    pieQuery.pieQuery(req.body.suchfeld,showresult);
    function showresult(resultWerte){
        console.log(resultWerte);
        res.render('pieCreator', { result: resultWerte });
    }

});
module.exports = router;


