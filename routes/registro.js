var express = require('express');
var router = express.Router();

const Usuario = require("../model/usuario");



//registro usuario
//ejemplo ARC= http://localhost:8080/api/registro
//{"nombre" : "Juan","usuario" : "vite0150","pass" : "123"}
router.post('/registro', function (req, res, next) {
    let data = req.body;
    console.log("registro de usuario, nombre: ",data.nombre);
    

    let newuser= new Usuario({
        nombre: data.nombre,
        usuario: data.user,
        pass: data.pass
    });

    

    newuser.save((err, usuario) => {
        if (err){
            console.log(err);
            res.send(err);
        }
        else {
            console.log("usuario creado: ",usuario);
            res.status(200).json(usuario);
        }
    });
});


//exportarlo para accederlo desde otros archivos
module.exports = router;