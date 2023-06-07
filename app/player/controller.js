const playerModel = require('./models');
const voucherModel = require('../voucher/models');
const nominalModel = require('../nominal/models');
const categoryModel = require('../category/models');
const paymentModel = require('../payment/models');
const bankModel = require('../bank/models');
const transactionModel = require('../transaction/models');

module.exports = {
    landingPage: async (req, res) => {
        try {
            const voucherData = await voucherModel.find().select('_id name status category thumbnail').populate('category');

            res.status(200).json({data: voucherData})
        } catch (error) {
            res.status(500).json({message: error.message || "Something went wrong while fetching data"})
        }
    },
    detailPage: async (req, res) => {
        try {
            const { id } = req.params;
            const voucherData = await voucherModel.findOne({_id: id})
            .populate('category')
            .populate('nominals')
            .populate('user', '_id name phoneNumber');

            if(!voucherData){
                return res.status(404).json({message: "Data not found"})
            }
            res.status(200).json({data: voucherData})
        } catch (error) {
            res.status(500).json({message: error.message || "Something went wrong while fetching data"})
        }
    },
    categoryPage: async (req, res) => {
        try {
            const categoryData = await categoryModel.find();
            res.status(200).json({data: categoryData})
        } catch (error) {
            res.status(500).json({message: error.message || "Something went wrong while fetching data"})
        }
    },
    checkoutPage: async (req, res) => {
        try {
            const { accountUser, name, nominalId, voucherId, paymentId, bankId } = req.body;

            const res_voucher = await voucherModel.findOne({_id: voucherId})
            .select('_id name category thumbnail user')
            .populate('category')
            .populate('user');
            if(!res_voucher){
                return res.status(404).json({message: "Data voucher not found"})
            }

            const res_nominal = await nominalModel.findOne({_id: nominalId})
            if(!res_nominal){
                return res.status(404).json({message: "Data nominal not found"})
            }

            const res_payment = await paymentModel.findOne({_id: paymentId})
            if(!res_payment){
                return res.status(404).json({message: "Data payment not found"})
            }

            const res_bank = await bankModel.findOne({_id: bankId})
            if(!res_bank){
                return res.status(404).json({message: "Data bank not found"})
            }

            let tax = (10/100) * res_nominal._doc.price;
            let value = res_nominal._doc.price - tax;

            const payload = {
                historyVoucherTopup: {
                    gameName: res_voucher._doc.name,
                    category: res_voucher._doc.category ? res_voucher._doc.category.name : '',
                    thumbnail: res_voucher._doc.thumbnail,
                    coinName: res_nominal._doc.coinName,
                    coinQuantity: res_nominal._doc.coinQuantity,
                    price: res_nominal._doc.price,
                },
                historyPayment: {
                    name: res_bank._doc.name,
                    type: res_payment._doc.type,
                    bankName: res_bank._doc.bankName,
                    noRekening: res_bank._doc.noRekening,
                },
                name: name,
                accountUser: accountUser,
                tax: tax,
                value: value,
                player: req.player._id,
                historyUser: {
                    name: res_voucher._doc.user?.name,
                    phoneNumber: res_voucher._doc.user?.phoneNumber,
                },
                category: res_voucher._doc.category?._id,
                user: res_voucher._doc.user?._id,
            }

            const transactionData = new transactionModel(payload);

            await transactionData.save();


            res.status(200).json({data: transactionData})

        } catch (error) {
            res.status(500).json({message: error.message || "Something went wrong while fetching data"})
        }
    },
    historyPage: async (req, res) => {
        try {
            const {status = ''} = req.query
            
            let criteria = {}

            if(status.length){
                criteria = {
                    ...criteria,
                    status: {$regex: `${status}`, $options: 'i'}
                }
            }

            if(req.player._id){
                criteria = {
                    ...criteria,
                    player: req.player._id
                }
            }

            const history = await transactionModel.find(criteria)

            let totalValue = await transactionModel.aggregate([
                {$match: criteria},
                {
                    $group: {_id: null, value: {$sum: '$value'}}
                }
            ])

            res.status(200).json({
                data: history,
                total:  totalValue.length ? totalValue[0].value : 0
            })

        } catch (error) {
            res.status(500).json({message: error.message || "Something went wrong while fetching data"})
        }
    },
    historyDetailPage: async (req, res) => {
        try {
            const { id } = req.params;

            const history = await transactionModel.findOne({_id: id})

            if(!history){
                return res.status(404).json({message: "Data History not found"})
            }

            res.status(200).json({data: history})

        } catch (error) {
            res.status(500).json({message: error.message || "Something went wrong while fetching data"})
        }
    },
    dashboardPage: async (req, res) => {
        try {
            const count = await transactionModel.aggregate([
                { $match: {
                        player: req.player._id
                    } },
                {
                    $group: {
                        _id: '$category',
                        value: {$sum: '$value'}
                    }
                }
            ])

            const categoryData = await categoryModel.find({});

            categoryData.forEach((e) => {
                count.forEach(data => {
                    if(data._id.toString() === e._id.toString()){
                        data.name = e.name
                    }
                });
            })

            const history = await transactionModel.find({player: req.player._id}).populate('category').sort({updatedAt: -1})


            res.status(200).json({data: history, count: count})
        } catch (error) {
            res.status(500).json({message: error.message || "Something went wrong while fetching data"})
        }
    },

    profilePage: async (req, res) => {
        try {
            const playerData = {
                id: req.player._id,
                name: req.player.name,
                email: req.player.email,
                username: req.player.username,
                phoneNumber: req.player.phoneNumber,
                avatar: req.player.avatar,
            }
            res.status(200).json({ data: playerData })
            
        } catch (error) {
            res.status(500).json({message: error.message || "Something went wrong while fetching data"})
        }
    },
    
    editProfilePage: async (req, res, next) => {
        try {
            const { name = "", phoneNumber = ""} = req.body;

            const payload = {}

            if(name.length){
                payload.name = name
            }
            if(phoneNumber.length){
                payload.phoneNumber = phoneNumber
            }

            console.log(req)
            if(req.file){
                let tmp_path = req.file.path;
                let originalPath = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originalPath;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on('end', async () => {
                        let playerData = await playerModel.findOne({ _id: req.player._id })

                        let currentImage = `${config.rootPath}/public/uploads/${playerData.avatar}`

                        if(fs.existsSync(currentImage)){
                            fs.unlinkSync(currentImage)
                        }

                        playerData = await playerModel.findOneAndUpdate({ _id: req.player._id }, { ...playload, avatar: filename  }, {new: true, runsValidators: true})
                        console.log(playerData)
                        res.status(201).json({
                            data: {
                                id: playerData.id,
                                name: playerData.name,
                                phoneNumber: playerData.phoneNumber,
                                avatar: playerData.avatar
                            }
                        })
                })
                src.on('err', async () => {
                    next()
                })



                
            } else {
                const playerData = await playerModel.findOneAndUpdate({
                    _id: req.player._id
                }, payload, {new: true, runsValidators: true})
                console.log(playerData)
                res.status(201).json({
                    data: {
                        id: playerData.id,
                        name: playerData.name,
                        phoneNumber: playerData.phoneNumber,
                        avatar: playerData.avatar
                    }
                })
            }
        } catch (error) {
            if(error && error.name === "ValidationError"){
                res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                })
            }
        }
    }
}