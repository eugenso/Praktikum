/**
 * Created by jonas on 28.02.2017.
 */
var express = require('express');
var router = express.Router();
var docSuche = require('../js/docSuche');
var dummieArray = [1,2,3];
/* GET users listing. */

router.get('/', function(req, res, next) {
    res.render('docSuche', { result: "" })
});

router.post('/', function(req, res, next) {
    metaDaten = req.body.suchfeld;
    console.log(req.body);
    docSuche.findDoc(req.body.suchfeld,showresult);

    function showresult(metaDaten){
        //console.log(metaDaten);
        res.render('docSuche', { result: metaDaten })
    }

});

module.exports = router;