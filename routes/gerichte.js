/**
 * Created by jonas on 28.02.2017.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('gerichte', { result: dummieArray });
});

var dummieArray = [1,2,3,3,4]

module.exports = router;
