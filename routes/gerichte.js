/**
 * Created by jonas on 28.02.2017.
 */
var express = require('express');
var router = express.Router();
var statistic_logic = require('../js/statistics_logic');

exports.start_rendering = start_rendering;

/* GET users listing. */
router.get('/', function(req, res, next) {
    statistic_logic.readfile(res);

});

function start_rendering(res,result){
    //console.log(result);
    res.render('gerichte', { result: result });
}
var dummieArray = [1,2,3,3,4];

module.exports = router;
