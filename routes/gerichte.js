/**
 * Created by jonas on 28.02.2017.
 */
var express = require('express');
var router = express.Router();
var statistic_logic = require('../js/statistics_logic');

exports.start_rendering = start_rendering;

global_result = [];
/* GET users listing. */
router.get('/', function(req, res, next) {
    global_result = [];
    statistic_logic.readfile(res);

});

function start_rendering(res,result){
    global_result = result;
    //console.log(result);
    res.render('gerichte', { result: result });
}

module.exports = router;
