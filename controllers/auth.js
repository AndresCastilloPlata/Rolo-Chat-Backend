const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const usuario = require('../models/usuario');


const crearUsuario = async (req, res = response) => {

    const { email } = req.body;
    try {
        const existeEmail = await Usuario.find({ email });
        if (existeEmail > 0){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(usuario.password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    } 
}


const login = async (req, res = respones) => {
    const { email, password} = req.body;
    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no se encuentra registrado'
            });
        }
        // Verificar password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }
}


const renewToken = async (req, res = response) => {
    const uid = req.uid;
    // Generar nuevo JWT
    const token = await generarJWT(uid);
    // Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);
 
    res.json({
        ok: true,
        usuario,
        token
    })

    




}

module.exports = {
    crearUsuario,
    login,
    renewToken
}