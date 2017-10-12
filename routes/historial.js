var express = require('express');
var router = express.Router();

const Historial = require("../model/historial");



/**
 * registros de juegos terminados para mostrar graficos de estadisticas
 */
router.post('/historial', (req, res, next) => {
    let data = req.body;
    console.log("Guardando nuevo historial");

    let newHistorial = new Historial({
        usuario: data._id,
        tiempo: data.partida.tiempo,
        dificultad: data.partida.dificultad
    })

    newHistorial.save((err, historial) => {
        if (err) {
            console.log(err.message);
            res.status(500).send(err);
        }
        else {
            console.log("historial guardado: ", historial);
            res.status(200).json(historial);
        }
    });

});
router.get('/historial/:id', (req, res) => {
    console.log("Cargando registros del jugador");
    Historial.find({ usuario: req.params.id }, null, { limit: 10, sort: {id:-1} }, (err, historiales) => {
        if (err) {
            console.log("error: ", err.message);
            res.status(500).send(err);
        }
        else {
            console.log("historiales encontrados: ", historiales);
            res.status(200).json(historiales);
        }
    });
});


module.exports = router;