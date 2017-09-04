var express = require('express');
var router = express.Router();

const Usuario = require("../model/usuario");

//login usuario
//ejemplo ACR= http://localhost:8080/api/login/vite0150/123
router.get('/login/:usuario/:pass', function (req, res, next) {

    console.log("Login, find one")
    console.log("Data recibida: ", req.params.usuario +  req.params.pass)
    Usuario.findOne({
        usuario: req.params.usuario,
        pass: req.params.pass
    }, (err, usuario) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(usuario);
    });
});

//registro usuario
//ejemplo ACR= http://localhost:8080/api/login
//{"nombre" : "Juan","usuario" : "vite0150","pass" : "123"}
router.post('/login', function (req, res, next) {

    let data = req.body;

    let newuser= new Usuario({
        nombre: data.nombre,
        usuario: data.usuario,
        pass: data.pass
    });

    console.log("new user: ",newuser);

    newuser.save((err, usuario) => {
        if (err)
            res.send(err);
        else {
            res.status(200).json(usuario);
        }
    });
});

//exportarlo para accederlo desde otros archivos
module.exports = router;