const transactionModel = require('./models');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMsg = req.flash('alertMsg')
            const alertStatus = req.flash('alertStatus')

            const alert = { msg: alertMsg, status: alertStatus }
            const transactionData = await transactionModel.find().populate('player')

            res.render('admin/transaction/view_transaction', {
                transactionData,
                alert,
                name: req.session.user.name,
                title: 'Store GG - Jenis Pembayaran Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/transaction')
        }
    },
    actionStatus: async (req, res) => {
        try {
            const {id} = req.params
            const {status} = req.query

            await transactionModel.findByIdAndUpdate({_id: id}, {status})
            req.flash('alertMsg', "Berhasil mengubah status pembayaran")
            req.flash('alertStatus', 'success')
            res.redirect('/transaction')
        } catch (error) {
            req.flash('alertMsg', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/transaction')
        }
    }
}