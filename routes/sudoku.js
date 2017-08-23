var express = require('express');
var router = express.Router();

router.get('/sudoku', function(req, res, next){
    res.send('sudoku page');
});

//exportarlo para accederlo desde otros archivos
module.exports = router;