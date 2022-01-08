const { response } = require('express');

const Hospital = require('../models/hospital');



const getHospitales = async(req, res) => {

    //const hospitales = await Hospital.find({}, 'nombre');
    const hospitales = await Hospital.find().populate('usuario', 'nombre email')

    res.json({
        ok: true,
        hospitales,
       uid: req.uid
    });

}


    const crearHospital = async(req, res) => {
        const uid = req.uid;
        const hospital = new Hospital ({
            usuario: uid,
            ...req.body} );
 
        try {
            

            const hospitalDB = await hospital.save();

            res.json({
                ok: true,
               hospital: hospitalDB
            });

        } catch (error) {
            console.log(error)
            res.status(5000).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }


    }

    const actualizarHospital = async(req, res) => {


        res.json({
            ok: true,
            msg: 'ActualizarHospital'
        });
    }

    const borrarHospital = async(req, res) => {


        res.json({
            ok: true,
            msg: 'borrarHospital'
        });
    }
    
    module.exports = {
        getHospitales,
        crearHospital,
        actualizarHospital,
        borrarHospital
    }