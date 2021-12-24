const { response } = require('express');
const bcrypt = require('bcryptjs');
const { use } = require('express/lib/router');
const Usuario = require('../models/usuario');
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google, password');

    res.json({
        ok: true,
       usuarios,
       uid: req.uid
    });

}

const crearUsuarios = async(req, res = response) => {

    const {email, password, nombre} = req.body;
    //Código movido para optimizar
    // const errores = validationResult ( req);

    // if  ( !errores.isEmpty() ){

    //     return res.status(400).json ({
    //         ok: false,
    //         errors: errores.mapped()
    //     })
    // }

//Validación
    try {
       
        const existeEmail = await Usuario.findOne({ email});

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El emial ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        //Guardar el usuario
        await usuario.save();

            //Generar un token
            const token = await generarJWT(usuario.id );


        res.json({
        ok: true,
        usuario,
        token
        
    });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.... revisar logs '
        })

    }

       

}

const actualizarUsuario = async ( req, res = response) => {
     // TODO: Validar token y comprobar si el usuario es correcto
    const uid = req.params.id;
   

    try {
        

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

       //Actualizaciones
       //const campos = req.body;
       const {password, google, ...campos} = req.body;

       //delete campos.password;
       //delete campos.google;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true});

       res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar'
        })
    }

}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        await Usuario.findByIdAndDelete(uid);
        
        res.json({
            ok: true,
            msg: 'Usuario Eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }

}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}