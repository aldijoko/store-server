const voucherModel = require('./models');
const categoryModel = require('../category/models');
const nominalModel = require('../nominal/models');
const path = require('path');
const fs = require('fs');
const config = require('../../config');


module.exports = {
    index: async (req, res) => {
        try {
            const alertMsg = req.flash('alertMsg')
            const alertStatus = req.flash('alertStatus')

            const alert = { msg: alertMsg, status: alertStatus }
            const voucherData = await voucherModel.find()
            .populate('category')
            .populate('nominals')

            res.render('admin/voucher/view_voucher', {
                voucherData,
                alert,
                name: req.session.user.name,
                title: 'Store GG - Voucher Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    viewCreate: async (req, res) => {
        try {
            const categoryData = await categoryModel.find()
            const nominalData = await nominalModel.find()
            res.render('admin/voucher/create', {
                categoryData,
                nominalData,
                name: req.session.user.name,
                title: 'Store GG - Add Voucher Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name, category, nominals } = req.body;
            if(req.file) {
                let tmp_path = req.file.path;
                let originalPath = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originalPath;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on('end', async () => {
                    try {
                        const voucher = new voucherModel({ name, category, nominals, thumbnail: filename })
                        await voucher.save()
                        req.flash('alertMsg', 'Success Add voucher')
                        req.flash('alertStatus', 'success')
                        res.redirect('/voucher')
                    } catch (error) {
                        req.flash('alertMsg', error.message)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })
            } else {
                const voucher = new voucherModel({ name, category, nominals })
                await voucher.save()
                req.flash('alertMsg', 'Success Add voucher')
                req.flash('alertStatus', 'success')
                res.redirect('/voucher')
            }   
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const categoryData = await categoryModel.find()
            const nominalData = await nominalModel.find()
            const voucherData = await voucherModel.findOne({ _id: id })
            .populate('category')
            .populate('nominals')


            res.render('admin/voucher/edit', {
                categoryData,
                nominalData,
                voucherData,
                name: req.session.user.name,
                title: 'Store GG - Edit Voucher Page'
            })
        } catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionEdit: async (req, res) => {
        try{
            const { id } = req.params;
            const { name, category, nominals } = req.body;
            if(req.file) {
                let tmp_path = req.file.path;
                let originalPath = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originalPath;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on('end', async () => {
                    try {
                        const voucherData = await voucherModel.findOne({ _id: id })

                        let currentImage = `${config.rootPath}/public/uploads/${voucherData.thumbnail}`

                        if(fs.existsSync(currentImage)){
                            fs.unlinkSync(currentImage)
                        }

                        await voucherModel.findOneAndUpdate({ _id: id }, { name, category, nominals, thumbnail: filename  })

                        req.flash('alertMsg', 'Success Update voucher')
                        req.flash('alertStatus', 'success')
                        res.redirect('/voucher')
                    } catch (error) {
                        req.flash('alertMsg', 'error.message')
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })
            } else {
                await voucherModel.findOneAndUpdate({ _id: id }, { name, category, nominals})
                req.flash('alertMsg', 'Success Update voucher')
                req.flash('alertStatus', 'success')
                res.redirect('/voucher')
            }  

        } catch(err){
            req.flash('alertMsg', 'err.message')
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const voucherData = await voucherModel.findOneAndRemove({ _id: id })

            let currentImage = `${config.rootPath}/public/uploads/${voucherData.thumbnail}`

            if(fs.existsSync(currentImage)){
                fs.unlinkSync(currentImage)
            }

            req.flash('alertMsg', 'Success Delete voucher')
            req.flash('alertStatus', 'success')

            res.redirect('/voucher')
        }
        catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            let voucherData = await voucherModel.findOne({ _id: id })

            let status = voucherData.status === 'active' ? 'inactive' : 'active'

            voucher = await voucherModel.findOneAndUpdate({
                _id: id
            }, {status})

            req.flash('alertMsg', 'Success Update Status voucher')
            req.flash('alertStatus', 'success')

            res.redirect('/voucher')
        } catch (error) {
            
        }
    }
}