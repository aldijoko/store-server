const nominalModel = require('./models');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMsg = req.flash('alertMsg')
            const alertStatus = req.flash('alertStatus')

            const alert = { msg: alertMsg, status: alertStatus }
            const nominalData = await nominalModel.find()

            res.render('admin/nominal/view_nominal', {
                nominalData,
                alert,
                name: req.session.user.name,
                title: 'Store GG - Nominal Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/nominal/create', {
                name: req.session.user.name,
                title: 'Store GG - Add Nominal Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { coinName, coinQuantity, price } = req.body;
            let result = await nominalModel({ coinName, coinQuantity, price })
            await result.save()

            req.flash('alertMsg', 'Success Add nominal')
            req.flash('alertStatus', 'success')

            res.redirect('/nominal')
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const nominalData = await nominalModel.findOne({ _id: id })
            res.render('admin/nominal/edit', {
                nominalData,
                name: req.session.user.name,
                title: 'Store GG - Edit Nominal Page'
            })
        } catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    actionEdit: async (req, res) => {
        try{
            const { id } = req.params;
            const { coinName, coinQuantity, price } = req.body;
            await nominalModel.findOneAndUpdate({ _id: id }, { coinName, coinQuantity, price })

            req.flash('alertMsg', 'Success edit nominal')
            req.flash('alertStatus', 'success')

            res.redirect('/nominal')

        } catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            await nominalModel.findOneAndRemove({ _id: id })

            req.flash('alertMsg', 'Success Delete nominal')
            req.flash('alertStatus', 'success')

            res.redirect('/nominal')
        }
        catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    }
}