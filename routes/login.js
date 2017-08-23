var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:0150@ds141242.mlab.com:41242/sudoku_paradigmas', ['usuario']);

//login usuario
router.get('/login/:usuario', function(req, res, next){
    db.usuario.find({'user': req.params.usuario},function(err, usuario){
        if(err){
            handleError(res, err.message, "Failed to get contacts.");
        }
        res.status(200).json(usuario);
        //res.json(usuario);
    });
});

//registro usuario
router.post('/login', function(req, res, next){
    var usuario = req.body;
    if(!usuario.user){
        res.status(400);
        res.json({
            "error":"falta el usuario"
        });
    }
    else{
        db.usuario.save(usuario, function(err, usuario){
            if(err){
                re.send(err);
            } 
            res.json(usuario);
        });
    }
});

//exportarlo para accederlo desde otros archivos
module.exports = router;