const bankModel = require('./models');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMsg = req.flash('alertMsg')
            const alertStatus = req.flash('alertStatus')

            const alert = { msg: alertMsg, status: alertStatus }
            const bankData = await bankModel.find()

            res.render('admin/bank/view_bank', {
                bankData,
                alert,
                name: req.session.user.name,
                title: 'Store GG - Bank Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/bank/create', {
                name: req.session.user.name,
                title: 'Store GG - Add Bank Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name, nameBank, noRekening } = req.body;
            let result = await bankModel({ name, nameBank, noRekening })
            await result.save()

            req.flash('alertMsg', 'Success Add Bank')
            req.flash('alertStatus', 'success')

            res.redirect('/bank')
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const bankData = await bankModel.findOne({ _id: id })
            res.render('admin/bank/edit', {
                bankData,
                name: req.session.user.name,
                title: 'Store GG - Edit Bank Page'
            })
        } catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    actionEdit: async (req, res) => {
        try{
            const { id } = req.params;
            const { name, nameBank, noRekening } = req.body;
            await bankModel.findOneAndUpdate({ _id: id }, { name, nameBank, noRekening })

            req.flash('alertMsg', 'Success edit Bank Data')
            req.flash('alertStatus', 'success')

            res.redirect('/bank')

        } catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            await bankModel.findOneAndRemove({ _id: id })

            req.flash('alertMsg', 'Success Delete Bank')
            req.flash('alertStatus', 'success')

            res.redirect('/bank')
        }
        catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    }
}