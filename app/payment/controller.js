const paymentModel = require('./models');
const bankModel = require('../bank/models');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMsg = req.flash('alertMsg')
            const alertStatus = req.flash('alertStatus')

            const alert = { msg: alertMsg, status: alertStatus }
            const paymentData = await paymentModel.find().populate('banks')

            res.render('admin/payment/view_payment', {
                paymentData,
                alert,
                name: req.session.user.name,
                title: 'Store GG - Jenis Pembayaran Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    viewCreate: async (req, res) => {
        try {
            const bankData = await bankModel.find()
            res.render('admin/payment/create', {
                bankData,
                name: req.session.user.name,
                title: 'Store GG - Add Payment Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { banks, type } = req.body;
            let result = await paymentModel({ banks, type })
            await result.save()

            req.flash('alertMsg', 'Success Add Jenis Pembayaran')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            const paymentData = await paymentModel.findOne({ _id: id }).populate('banks')
            const bankData = await bankModel.find()
            res.render('admin/payment/edit', {
                paymentData,
                bankData,
                name: req.session.user.name,
                title: 'Store GG - Edit Payment Page'
            })
        } catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    actionEdit: async (req, res) => {
        try{
            const { id } = req.params;
            const { banks, type } = req.body;
            await paymentModel.findOneAndUpdate({ _id: id }, { banks, type })

            req.flash('alertMsg', 'Success edit Jenis Pembayaran')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')

        } catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            await paymentModel.findOneAndRemove({ _id: id })

            req.flash('alertMsg', 'Success Delete Jenis Pembayaran')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        }
        catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    }
}