var express = require('express');
var router = express.Router();

const Usuario = require("../model/usuario");

//login usuario
//ejemplo ARC= http://localhost:8080/api/login/vite0150/123
router.post('/login', function (req, res, next) {

    let data = req.body;
    console.log("Login, data recibida: ", data.user +  data.pass)
    

    Usuario.findOne({
        usuario: data.user,
        pass: data.pass
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