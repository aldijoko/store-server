const playerModel = require('../player/models');

const path = require('path');
const fs = require('fs');
const config = require('../../config');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    signup: async (req, res, next) => {
        try {
            const payload = req.body;
            if(req.file){
                let tmp_path = req.file.path;
                let originalPath = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originalPath;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on('end', async () => {
                    try {
                        const playerData = new playerModel({ ...payload, avatar: filename })
                        await playerData.save()

                        delete playerData._doc.password;
                        res.status(201).json({data: playerData})
                        
                    } catch (error) {
                        if(error && error.name === "ValidationError"){
                            return res.status(422).json({
                                error: 1,
                                message: error.message,
                                fields: error.errors
                            })
                        }
                        next(error)
                    }
                })
            }else {
                let playerData = new playerModel(payload);
                await playerData.save();

                delete playerData._doc.password;
                res.status(201).json({data: playerData})
            }

            
        } catch (error) {
            if(error && error.name === "ValidationError"){
                return res.status(422).json({
                    error: 1,
                    message: error.message,
                    fields: error.errors
                })
            }
            next(error)
        }
    },

    signin: (req, res, next) => {
        const { email, password } = req.body;
        // const playerData = playerModel.findOne({ email : email })

        playerModel.findOne({ email : email }).then((player) => {
            console.log(player)
            if(player){
                const checkPassword = bycrypt.compareSync(password, player.password);
                if(checkPassword){
                    const token = jwt.sign({
                        player: {
                            id: player.id,
                            name: player.name,
                            email: player.email,
                            username: player.username,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar,  
                        }
                    }, config.jwtKey);

                    res.status(200).json({
                        data: {token}
                    })
                }else {
                    res.status(403).json({
                        message: "Wrong email or password"
                    })
                }
            }else{
                res.status(403).json({
                    message: "Email or Password not found"
                })
            }
        }).catch((err) => {
            res.status(500).json({
                message: err.message || "Something went wrong while fetching data"
            })
            next()
        })
        
    }
}