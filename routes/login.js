var express = require('express');
var router = express.Router();

const Usuario = require("../model/usuario");

//login usuario
//ejemplo ARC= http://localhost:8080/api/login/vite0150/123
router.get('/login/:usuario/:pass', function (req, res, next) {

    console.log("Login, data recibida: ", req.params.usuario +  req.params.pass)
    Usuario.findOne({
        usuario: req.params.usuario,
        pass: req.params.pass
    }, (err, usuario) => {
        if (err) {
            res.status(500).send(err);
        }
        console.log("Usuario encontrado: ", usuario);
        res.status(200).json(usuario);
    });
});



//exportarlo para accederlo desde otros archivos
module.exports = router;