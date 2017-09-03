var express = require('express');
var router = express.Router();

const Usuario = require("../model/usuario");

//login usuario
router.get('/login/:usuario', function(req, res, next){

    Usuario.find((err, usuario) => {
        if(err){
            res.status(500).send(err);
        }
        res.status(200).json(usuario);
    });

    /*db.usuario.find({'user': req.params.usuario},function(err, usuario){
        if(err){
            handleError(res, err.message, "Failed to get contacts.");
        }
        res.status(200).json(usuario);
        //res.json(usuario);
    });*/


});

//registro usuario
router.post('/login', function(req, res, next){

    var data = req.body;

    Usuario.create({
        nombre : data.nombre,
        usuario : data.usuario,
        pass : data.pass
    }, (err, usuario) => {
        if(err)
            res.send(err);
        else{
            res.json(usuario);
        }
    });


    /*var usuario = req.body;
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
    }*/
});

//exportarlo para accederlo desde otros archivos
module.exports = router;