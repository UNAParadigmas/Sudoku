var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('index.html');
});

//exportarlo para accederlo desde otros archivos
module.exports = router;