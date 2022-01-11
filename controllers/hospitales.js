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

        const id = req.params.id;
        const uid = req.uid;

        try {
            
            const hospital = await Hospital.findById (id);

            if ( !hospital ) {
                return res.status(404).json({
                    ok: fatruelse,
                    msg: 'Hospital no encontrado por id',
                })
            }

            const cambiosHospital = {
               ...req.body,
               usuario: uid

            }

            const hospitalActualizado = await Hospital.findByIdAndUpdate ( id, cambiosHospital, { new: true});


            res.json({
                ok: true,
                hospitalActualizado
            });

        } catch (error) {
            res.status(5000).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }

    
    }

    const borrarHospital = async(req, res) => {

        const id = req.params.id;

        try {
            
            const hospital = await Hospital.findById (id);

            if ( !hospital ) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Hospital no encontrado por id',
                })
            }

            await Hospital.findByIdAndDelete ( id );

            res.json({
                ok: true,
                msg: 'Hospital Eliminado'
            });

        } catch (error) {
            res.status(5000).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }


    }
    
    module.exports = {
        getHospitales,
        crearHospital,
        actualizarHospital,
        borrarHospital
    }