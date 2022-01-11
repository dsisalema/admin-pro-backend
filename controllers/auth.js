const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if ( !usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no válida'
            });

        }
        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        //Generar un token
        const token = await generarJWT(usuarioDB.id );

        res.json({
            ok: true,
            token

        })

    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'

        })
    }

}


const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {
        
        const { name, email, picture } = await googleVerify(googleToken);

        //validar si existe el usuario con ese correo
        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if ( !usuarioDB) {
            //Sino existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@mail',
                img: picture,
                google: true

            });
        } else{
            //Existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            //usuario.password = '@@@';

        }
        //Guardar en base de datos
        await usuario.save();
        //Generar un token
        const token = await generarJWT(usuario.id );

        res.status(500).json({
            ok: true,
            token
        });

    } catch (error) {
        
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
    
        });

    }


}

const renewToken = async (req, res = response ) => {
    const uid = req.uid;
    //Generar un token
    const token = await generarJWT( uid );
        
    res.json({
        ok: true,
        token

    });


}

module.exports = {
    login,
    googleSignIn,
    renewToken
}