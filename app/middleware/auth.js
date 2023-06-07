const config = require('../../config');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const playerModel = require('../player/models');

module.exports = {
    isLoginAdmin: (req, res, next) => {
        if(req.session.user === null || req.session.user === undefined){
            req.flash('alertMsg', 'Session telah habis, silahkan login kembali')
            req.flash('alertStatus', 'danger')
            res.redirect('/')
        }else {
            next()
        }
    },

    isLoginPlayer: (req, res, next) => {
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

            const data = jwt.verify(token, config.jwtKey);

            const playerData = playerModel.findOne({_id: data.player._id});

            if(!playerData){
                throw new Error()
            }

            req.player = playerData;
            req.token = token;
            next()


        } catch (err) {
            res.status(401).json({
                error: "You are not authorized"
            })
        }
    }
}