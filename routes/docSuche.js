/**
 * Created by jonas on 28.02.2017.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('gerichte', { result: dummieArray });
});

module.exports = router;